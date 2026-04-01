import fs from 'fs-extra';
import { EDemoCommands } from '../ts-proto/demo.js';
import { decoders } from './descriptors/decoders.js';
import { BitBuffer } from './ubitreader.js';
import { GameEvents } from './descriptors/gameEventEmitter.js';
import { type StringTableCreated } from './descriptors/index.js';
import { CMsgPlayerInfo } from '../ts-proto/networkbasetypes.js';
import { type Readable } from 'stream';
import { TypedEventEmitter } from './descriptors/typedEmitter.js';
import { EntityMode, type EmitQueue, type OutputEvents } from './entities/types.js';
import type { Decoder } from './entities/constructorFields.js';
import { ParseSession } from './entities/parseSession.js';
import { Player } from '../helpers/player.js';
import { Team } from '../helpers/team.js';
import { GameRules } from '../helpers/gameRules.js';
import type { TypedEntity, EntityProperties, KnownClassName } from '../generated/entityTypes.js';
import { isEntityClass } from '../generated/entityTypes.js';

export class DemoReader extends TypedEventEmitter<OutputEvents> {
	_parseStartTime = 0n;
	private _stringTables = [] as (StringTableCreated | null)[];
	private _hasEnded = false;
	private _stream: Readable | null = null;

	entities: TypedEntity[];
	private _directWriteMode = false;

	currentTick = -1;

	private _playerInfoMap: Record<number, CMsgPlayerInfo> = {};

	gameEvents = new GameEvents();

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

	/** Game rules helper (or null if not yet created) */
	get gameRules(): GameRules | null {
		for (let i = 0; i < this.entities.length; i++) {
			const e = this.entities[i];
			if (e && e.className === 'CCSGameRulesProxy') {
				return new GameRules(this, i);
			}
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
		this.on('svc_CreateStringTable', table => {
			if (!table) return this._stringTables.push(table);

			for (const player of table.players) {
				this._playerInfoMap[player.userid! & 255] = player;
			}

			this._stringTables.push(table.table);
		});

		this.on('entityCreated', ([entityId, classId, entityType, className]) => {
			if (this._directWriteMode) return;
			this.entities[entityId] = {
				classId,
				entityType,
				className,
				properties: {}
			};
		});

		this.on('entityUpdated', info => {
			if (this._directWriteMode) return;
			if (!this.entities[info.entityId]) return;
			//@ts-expect-error We know what we doin son
			this.entities[info.entityId]!.properties[this.propIdToName[info.propId]!] = info.value;
		});

		this.on('entityDeleted', entityId => {
			if (this._directWriteMode) return;
			this.entities[entityId] = undefined as any;
		});
	}

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
			this.emit(element[0], element[1]);
		}
		queue.length = 0;
	};

	/** Core sync parse from a Buffer. */
	private _parseSync(buffer: Buffer, opts: { entities?: EntityMode } = {}) {
		const entityMode = opts.entities ?? EntityMode.NONE;
		this._directWriteMode = true;
		this.gameEvents.entityMode = entityMode;
		new ParseSession(buffer, entityMode, this._emitQueue, this).runSync();
		this._directWriteMode = false;
		this._hasEnded = true;
	}

	/** Sync parse from a file path using chunked reads (low memory). */
	private _parseSyncFile(filePath: string, opts: { entities?: EntityMode } = {}) {
		const entityMode = opts.entities ?? EntityMode.NONE;
		this._directWriteMode = true;
		this.gameEvents.entityMode = entityMode;
		ParseSession.fromFile(filePath, entityMode, this._emitQueue, this).runSync();
		this._directWriteMode = false;
		this._hasEnded = true;
	}

	/** Core streaming parse from a Readable. */
	private _parseStream(stream: Readable, opts: { entities?: EntityMode } = {}): Promise<void> {
		const entityMode = opts.entities ?? EntityMode.NONE;
		this._stream = stream;
		this._directWriteMode = true;
		this.gameEvents.entityMode = entityMode;

		const { promise, resolve, reject } = Promise.withResolvers<void>();

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

			session = new ParseSession(Buffer.concat(pendingChunks), entityMode, this._emitQueue, this);
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
				reject(error);
			}
		};

		const onError = (err: Error) => {
			if (finished) return;
			finish();
			this.emit('end', { error: err, incomplete: true });
			reject(err);
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
	 * // File path sync (loads into memory, blocks event loop)
	 * parser.parseDemo('demo.dem', { entities: EntityMode.ALL, stream: false });
	 *
	 * // Readable stream
	 * await parser.parseDemo(createReadStream('demo.dem'), { entities: EntityMode.ALL });
	 *
	 * // Pre-loaded buffer
	 * parser.parseDemo(buffer, { entities: EntityMode.ALL });
	 */
	parseDemo(source: Readable, opts?: { entities?: EntityMode }): Promise<void>;
	parseDemo(source: string, opts: { entities?: EntityMode; stream: false }): void;
	parseDemo(source: string, opts?: { entities?: EntityMode; stream?: true }): Promise<void>;
	parseDemo(source: Buffer, opts?: { entities?: EntityMode }): void;
	parseDemo(
		source: string | Buffer | Readable,
		opts: { entities?: EntityMode; stream?: boolean } = {}
	): void | Promise<void> {
		if (this._hasEnded) throw 'Demo has already been parsed';
		this._parseStartTime = process.hrtime.bigint();

		if (typeof source === 'string') {
			if (opts.stream === false) {
				this._parseSyncFile(source, opts);
				return;
			}
			return this._parseStream(fs.createReadStream(source), opts);
		}

		if (Buffer.isBuffer(source)) {
			this._parseSync(source, opts);
			return;
		}

		return this._parseStream(source, opts);
	}

	public cancel() {
		if (this._hasEnded) throw 'Demo has already been parsed';

		this._hasEnded = true;
		this._stream?.destroy();
		this._stream = null;
		this.emit('cancel');
		this.emit('end', { incomplete: true });
	}
}
