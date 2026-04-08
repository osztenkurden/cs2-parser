import fs from 'fs';
import { type CDemoFileHeader, EDemoCommands } from '../ts-proto/demo.js';
import { decoders } from './descriptors/decoders.js';
import { BitBuffer } from './ubitreader.js';
import { GameEvents } from './descriptors/gameEventEmitter.js';
import { CMsgPlayerInfo } from '../ts-proto/networkbasetypes.js';
import { type Readable } from 'stream';
import { EntityMode, type EmitQueue, type OutputEvents } from './entities/types.js';
import type { Decoder } from './entities/constructorFields.js';
import { ParseSession, type ParseSettings } from './entities/parseSession.js';
import { Player } from '../helpers/player.js';
import snappy from 'snappy';
import { Team } from '../helpers/team.js';
import { GameRules } from '../helpers/gameRules.js';
import type { TypedEntity, EntityProperties, KnownClassName, ICCSPlayerController } from '../generated/entityTypes.js';
import { isEntityClass } from '../generated/entityTypes.js';
import EventEmitter from 'events';
import { PlayerPawn } from '../helpers/playerPawn.js';
import { SVC_Messages } from '../ts-proto/netmessages.js';
import { messages } from './descriptors/index.js';

export class DemoReader extends EventEmitter<{
	[K in keyof OutputEvents]: OutputEvents[K] extends never ? [] : [OutputEvents[K]];
}> {
	_parseStartTime = 0n;
	header: CDemoFileHeader | null = null;
	private _hasEnded = false;
	private _stream: Readable | null = null;

	entities: TypedEntity[];
	private _directWriteMode = false;
	private tickInterval = NaN;
	currentTick = -1;

	private _playerInfoMap: Record<number, CMsgPlayerInfo> = {};

	gameEvents = new GameEvents();

	get currentTime(): number {
		return this.currentTick * this.tickInterval;
	}
	/** All players from the userinfo string table. Available even with EntityMode.NONE. */
	get players(): CMsgPlayerInfo[] {
		return Object.values(this._playerInfoMap);
	}

	/** Player info map keyed by userid & 0xFF. */
	get playerInfoMap(): Record<number, CMsgPlayerInfo> {
		return this._playerInfoMap;
	}

	/** Get a Player helper by controller entity ID. Requires EntityMode.ALL. */
	getPlayer(entityId: number): Player | null {
		const e = this.entities[entityId];
		if (e && e.className === 'CCSPlayerController') {
			return new Player(this, entityId);
		}
		return null;
	}

	getPawn(entityId: number): PlayerPawn | null {
		const e = this.entities[entityId];
		if (e && e.className === 'CCSPlayerPawn') {
			return new PlayerPawn(this, entityId);
		}
		return null;
	}

	/** All player controller entities as Player helpers. Requires EntityMode.ALL. */
	get playerControllers(): Player[] {
		const result: Player[] = [];
		for (let i = 0; i < this.entities.length; i++) {
			const e = this.entities[i];
			if (e && e.className === 'CCSPlayerController') {
				result.push(new Player(this, i));
			}
		}
		return result;
	}

	/**
	 * Get a Player helper for a given CMsgPlayerInfo (e.g. an element from `parser.players`).
	 * Matches by steamid against CCSPlayerController.m_steamID. Requires EntityMode.ALL.
	 *
	 * Returns null if:
	 *   - info is null/undefined or has no steamid
	 *   - info is a bot (steamid === '0') — bots share steamid '0' and cannot be uniquely matched
	 *   - the player has not yet been assigned a controller entity
	 *   - the player has disconnected and the controller has been removed
	 */
	getPlayerByInfo(info: CMsgPlayerInfo | null | undefined): Player | null {
		if (!info || info.steamid === undefined) return null;
		const target = String(info.steamid);
		if (target === '0') return null; // bots share steamid '0' — ambiguous
		for (let i = 0; i < this.entities.length; i++) {
			const e = this.entities[i];
			if (!e || e.className !== 'CCSPlayerController') continue;
			const raw = (e.properties as Partial<ICCSPlayerController>)['CCSPlayerController.m_steamID'];
			if (raw !== undefined && String(raw) === target) {
				return new Player(this, i);
			}
		}
		return null;
	}

	/** All team entities as Team helper objects */
	get teams(): Team[] {
		const result: Team[] = [];
		for (let i = 0; i < this.entities.length; i++) {
			const e = this.entities[i];
			if (e && e.className === 'CCSTeam') {
				result.push(new Team(this, i));
			}
		}
		return result;
	}

	private _gameRulesEntityId: number | null = null;

	/** Game rules helper (or null if not yet created) */
	get gameRules(): GameRules | null {
		if (this._gameRulesEntityId !== null) {
			const e = this.entities[this._gameRulesEntityId];
			if (e) return new GameRules(this, this._gameRulesEntityId);
			this._gameRulesEntityId = null;
		}
		return null;
	}

	/** Get a typed entity by index and class name. Returns typed properties or undefined. */
	getEntity<T extends KnownClassName>(entityId: number, className: T): EntityProperties<T> | undefined {
		const e = this.entities[entityId];
		if (isEntityClass(e, className)) {
			return e.properties as EntityProperties<T>;
		}
		return undefined;
	}

	/** Find all entities of a specific class, with typed properties */
	findEntities<T extends KnownClassName>(className: T): { entityId: number; properties: EntityProperties<T> }[] {
		const result: { entityId: number; properties: EntityProperties<T> }[] = [];
		for (let i = 0; i < this.entities.length; i++) {
			const e = this.entities[i];
			if (isEntityClass(e, className)) {
				result.push({ entityId: i, properties: e.properties as EntityProperties<T> });
			}
		}
		return result;
	}

	/** Re-exported type guard for narrowing entities */
	static isEntityClass = isEntityClass;

	constructor() {
		super();
		this.entities = [];
		this.gameEvents.listen(this);
		this.on('end', () => {
			this._hasEnded = true;
			this.emit(
				'debug',
				`[${this.currentTick}] Parsed demo in ${(process.hrtime.bigint() - this._parseStartTime) / 10n ** 6n}ms`
			);
		});

		this.on('tickstart', tick => {
			this.currentTick = tick;
		});
		this.on('createstringtable', table => {
			if (!table) return;

			for (const player of table.players) {
				this._playerInfoMap[player.userid! & 255] = player;
			}
		});
		this.on('updatestringtable', update => {
			if (!update) return;
			for (const player of update.players) {
				if (player.userid === undefined) continue;
				this._playerInfoMap[player.userid & 255] = player;
			}
		});

		this.on('entitycreated', ([entityId, classId, entityType, className]) => {
			if (className === 'CCSGameRulesProxy') this._gameRulesEntityId = entityId;
			if (this._directWriteMode) return;
			this.entities[entityId] = {
				classId,
				entityType,
				className,
				properties: {}
			};
		});

		this.on('entityupdated', info => {
			if (this._directWriteMode) return;
			if (!this.entities[info.entityId]) return;
			//@ts-expect-error We know what we doin son
			this.entities[info.entityId]!.properties[this.propIdToName[info.propId]!] = info.value;
		});

		this.on('entitydeleted', entityId => {
			if (entityId === this._gameRulesEntityId) this._gameRulesEntityId = null;
			if (this._directWriteMode) return;
			this.entities[entityId] = undefined as any;
		});
		this.once('header', header => {
			this.header = header;
		});
		this.once('serverinfo', serverInfo => {
			if (serverInfo.tick_interval !== undefined) {
				this.tickInterval = serverInfo.tick_interval;
			}
		});
	}

	static parseServerInfo = (filePath: string) => {
		const bufferSize = 4096 * 4;

		const fd = fs.openSync(filePath, 'r');
		try {
			const buffer = Buffer.alloc(bufferSize);

			fs.readSync(fd, buffer, 0, bufferSize, 16);

			const byteBuffer = new BitBuffer(buffer);

			const EDemoCommandTypeBase = byteBuffer.ReadUVarInt32();
			const type = EDemoCommandTypeBase & ~EDemoCommands.DEM_IsCompressed;

			if (type !== EDemoCommands.DEM_FileHeader) return null;

			let tick = byteBuffer.ReadUVarInt32(); // TICK

			const size = byteBuffer.ReadUVarInt32();

			byteBuffer.skipBytesBetter(size);
			const _frameBuffer = Buffer.alloc(20 * 1024);
			while (tick === 0xffffffff && byteBuffer.RemainingBytes > 0) {
				const EDemoCommandTypeBase = byteBuffer.ReadUVarInt32();
				const type = EDemoCommandTypeBase & ~EDemoCommands.DEM_IsCompressed;
				tick = byteBuffer.ReadUVarInt32(); // TICK
				const size = byteBuffer.ReadUVarInt32();

				const decoder = decoders[type as keyof typeof decoders];
				if (
					!decoder ||
					!(decoder.type === EDemoCommands.DEM_Packet || decoder.type === EDemoCommands.DEM_SignonPacket)
				) {
					byteBuffer.skipBytesBetter(size);
					continue;
				}

				const frameBuffer = byteBuffer.readBytesToSlice(_frameBuffer, size);

				const isCompressed = (EDemoCommandTypeBase & EDemoCommands.DEM_IsCompressed) !== 0;
				const bytes = isCompressed ? (snappy.uncompressSync(frameBuffer) as Buffer) : frameBuffer;

				const data = decoder.decode(bytes);
				if (!data.data) continue;
				const reader = new BitBuffer(data.data!);
				while (reader.RemainingBits > 8) {
					const cmd = reader.readUbitVar();
					const size = reader.ReadUVarInt32();
					if (cmd !== SVC_Messages.svc_ServerInfo) {
						reader.skipBytesBetter(size);
						continue;
					}
					const serverInfo = Buffer.alloc(size);
					const slice = reader.readBytesToSlice(serverInfo, size);
					return messages[SVC_Messages.svc_ServerInfo].class.decode(slice);
				}
			}
			return null;
		} finally {
			fs.closeSync(fd);
		}
	};

	static parseHeader = (filePath: string) => {
		const bufferSize = 4096;

		const fd = fs.openSync(filePath, 'r');
		try {
			const buffer = Buffer.alloc(bufferSize);

			fs.readSync(fd, buffer, 0, bufferSize, 16);

			const byteBuffer = new BitBuffer(buffer);

			const EDemoCommandTypeBase = byteBuffer.ReadUVarInt32();
			const type = EDemoCommandTypeBase & ~EDemoCommands.DEM_IsCompressed;

			if (type !== EDemoCommands.DEM_FileHeader) return null;

			byteBuffer.ReadUVarInt32(); // TICK
			const size = byteBuffer.ReadUVarInt32();
			const headerBuffer = Buffer.alloc(size);
			byteBuffer.readBytes(headerBuffer);
			const data = decoders[EDemoCommands.DEM_FileHeader].decode(headerBuffer);
			return data;
		} finally {
			fs.closeSync(fd);
		}
	};

	propIdToName: Record<number, string> = {};
	propIdToDecoder: Record<number, Decoder> = {};

	private _emitQueue: EmitQueue = queue => {
		if (this._hasEnded) return;
		for (const element of queue) {
			if (this._hasEnded) return;
			this.emit(element[0], element[1] as any);
		}
		queue.length = 0;
	};

	/** Non-blocking parse from a pre-loaded Buffer. */
	private async _parseBuffer(buffer: Buffer, opts: { entities?: EntityMode } & ParseSettings = {}) {
		const entityMode = opts.entities ?? EntityMode.NONE;
		this._directWriteMode = true;
		this.gameEvents.entityMode = entityMode;
		await new ParseSession(buffer, entityMode, this._emitQueue, this, opts).runAsync();
		this._directWriteMode = false;
		this._hasEnded = true;
	}

	/** Non-blocking parse from a file path using chunked reads (low memory). */
	private async _parseFile(filePath: string, opts: { entities?: EntityMode } & ParseSettings = {}) {
		const entityMode = opts.entities ?? EntityMode.NONE;
		this._directWriteMode = true;
		this.gameEvents.entityMode = entityMode;
		await ParseSession.fromFile(filePath, entityMode, this._emitQueue, this, opts).runAsync();
		this._directWriteMode = false;
		this._hasEnded = true;
	}

	/** Core streaming parse from a Readable. */
	private _parseStream(stream: Readable, opts: { entities?: EntityMode } & ParseSettings = {}): Promise<void> {
		const entityMode = opts.entities ?? EntityMode.NONE;
		this._stream = stream;
		this._directWriteMode = true;
		this.gameEvents.entityMode = entityMode;

		const { promise, resolve } = Promise.withResolvers<void>();

		let session: ParseSession | null = null;
		let finished = false;
		let pendingChunks: Buffer[] = [];

		const finish = () => {
			finished = true;
			stream.off('data', onData);
			stream.off('error', onError);
			stream.off('end', onEnd);
			this._directWriteMode = false;
			this._hasEnded = true;
		};

		const tryInit = () => {
			const totalPending = pendingChunks.reduce((s, c) => s + c.length, 0);
			if (totalPending < 16) return false;

			session = new ParseSession(Buffer.concat(pendingChunks), entityMode, this._emitQueue, this, opts);
			pendingChunks = [];
			return true;
		};

		const onData = (chunk: Buffer) => {
			if (finished) return;

			if (!session) {
				pendingChunks.push(chunk);
				if (!tryInit()) return;
			} else {
				session.pushChunk(chunk);
			}

			try {
				const more = session!.processFrames();
				if (!more) {
					session!.flush();
					finish();
					resolve();
				}
			} catch (e) {
				finish();
				const error = e instanceof Error ? e : new Error(`Exception during parsing: ${e}`);
				this.emit('end', { error, incomplete: false });
				resolve();
			}
		};

		const onError = (err: Error) => {
			if (finished) return;
			finish();
			this.emit('end', { error: err, incomplete: true });
			resolve();
		};

		const onEnd = () => {
			if (finished) return;
			if (session) {
				try {
					session.processFrames();
				} catch {}
			}
			finish();
			this.emit('end', { incomplete: true });
			resolve();
		};

		stream.on('data', onData);
		stream.on('error', onError);
		stream.on('end', onEnd);

		return promise;
	}

	/**
	 * Parse a CS2 demo file.
	 *
	 * Accepts a file path, a Buffer, or a Readable stream.
	 * File paths stream by default (non-blocking, low memory). Pass `stream: false` to load into memory instead.
	 *
	 * @param opts.entities - Entity parsing mode:
	 *   - `EntityMode.NONE` (default) — skip entity parsing entirely (fastest)
	 *   - `EntityMode.ALL` — parse and track all entities
	 *   - `EntityMode.ONLY_GAME_RULES` — parse entities but only store game rules (enables synthetic round_start/round_end events)
	 *
	 * @example
	 * // File path (streams by default — non-blocking, low memory)
	 * await parser.parseDemo('demo.dem', { entities: EntityMode.ALL });
	 *
	 * // File path with chunked reads (non-blocking, low memory)
	 * await parser.parseDemo('demo.dem', { entities: EntityMode.ALL, stream: false });
	 *
	 * // Readable stream
	 * await parser.parseDemo(createReadStream('demo.dem'), { entities: EntityMode.ALL });
	 *
	 * // Pre-loaded buffer (non-blocking)
	 * await parser.parseDemo(buffer, { entities: EntityMode.ALL });
	 */
	parseDemo(source: Readable, opts?: { entities?: EntityMode } & ParseSettings): Promise<void>;
	parseDemo(source: string, opts: { entities?: EntityMode; stream: false } & ParseSettings): Promise<void>;
	parseDemo(source: string, opts?: { entities?: EntityMode; stream?: true } & ParseSettings): Promise<void>;
	parseDemo(source: Buffer, opts?: { entities?: EntityMode } & ParseSettings): Promise<void>;
	parseDemo(
		source: string | Buffer | Readable,
		opts: { entities?: EntityMode; stream?: boolean } = {}
	): Promise<void> {
		if (this._hasEnded) throw 'Demo has already been parsed';
		this._parseStartTime = process.hrtime.bigint();

		if (typeof source === 'string') {
			if (opts.stream === false) {
				return this._parseFile(source, opts);
			}
			return this._parseStream(fs.createReadStream(source), opts);
		}

		if (Buffer.isBuffer(source)) {
			return this._parseBuffer(source, opts);
		}

		return this._parseStream(source, opts);
	}

	public cancel() {
		if (this._hasEnded) throw 'Demo has already been parsed';

		this._hasEnded = true;
		this._stream?.destroy(new Error('Stream canceled'));
		this._stream = null;
		this.emit('cancel');
		this.emit('end', { incomplete: true });
	}
}
