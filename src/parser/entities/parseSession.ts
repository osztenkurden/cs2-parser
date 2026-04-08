import fs from 'fs';
import snappy from 'snappy';
import { BitBuffer } from '../ubitreader.js';
import { decoders, type DecoderKeys, type Decoders } from '../descriptors/decoders.js';
import { CDemoSendTables, EDemoCommands, type CDemoFullPacket, type CDemoPacket } from '../../ts-proto/demo.js';
import { EBaseGameEvents, type CMsgSource1LegacyGameEvent } from '../../ts-proto/gameevents.js';
import { CSVCMsg_PacketEntities, SVC_Messages } from '../../ts-proto/netmessages.js';
import { messages } from '../descriptors/index.js';
import { createStringTable, updateStringTable, type StringTableObject } from '../stringtables.js';
import { EntityMode, type EmitQueue, type EventQueue, type OnDemandEvents, type emit } from './types.js';
import { parseClassInfo } from './classInfo.js';
import { EntityParser } from './entityParser.js';
import type { DemoReader } from '../index.js';
import { BinaryReaderEditable } from '../../binary-encoding/index.js';
import { createAllocator } from './allocator.js';
import { optionalSvcIds, type optionalSvcMessages } from '../descriptors/svc.js';

// This will allow to optionally parse any message defined in optionalSvcMessages, and will add autocomplete to all options defined there.
export type ParseSettings = {
	[K in keyof OnDemandEvents]?: boolean;
};

export class ParseSession {
	// Module-level singletons (shared across sessions)
	private static readonly PACKET_TEMP_BUFFER = new Uint8Array(new ArrayBuffer(2 ** 18));
	private static readonly entityAllocator = createAllocator();
	private static readonly READ_BUFFER_SIZE = 4 * 1024 * 1024; // 4 MB

	// Buffer state (replaces ByteBuffer for zero-overhead frame reading)
	private _frameBuf: Uint8Array;
	private _frameOffset = 0;
	private _frameLimit = 0;
	private _frameMarked = 0;
	private chunks: Buffer[] = [];

	// File-based reading state (set by fromFile)
	private fd: number | null = null;
	private readBuffer: Buffer | null = null;
	private fileOffset = 0;
	private fileSize = 0;

	// Parse state
	private entityParser: EntityParser | null = null;
	private sendTables: CDemoSendTables | null = null;
	private readonly baselines: Uint8Array[] = [];
	private currentTick = -1;
	private readonly eventQueue: EventQueue = [];

	// Reusable objects (avoid per-frame allocation)
	private readonly cachedBitBuffer = new BitBuffer(new Uint8Array(0));
	private readonly binaryR = new BinaryReaderEditable(new Uint8Array(0));
	private readonly binaryR2 = new BinaryReaderEditable(new Uint8Array(0));

	// Config (immutable after construction)
	private readonly entityMode: EntityMode;
	private readonly parser: DemoReader | null;
	private readonly emitMainQueue: EmitQueue;

	private readonly settings: ParseSettings | undefined;

	// Bound reference for EntityParser (avoids .bind() on every call)
	private readonly enqueueEvent: emit = (eventName, data) => {
		this.eventQueue.push([eventName, data] as any);
	};

	private _stringTables: (StringTableObject['table'] | null)[] = [];

	constructor(
		buffer: Buffer | Uint8Array,
		entityMode: EntityMode,
		emitMainQueue: EmitQueue,
		parser?: DemoReader,
		settings?: ParseSettings
	) {
		this._frameBuf = buffer;
		this._frameOffset = 16; // skip demo file header
		this._frameLimit = buffer.length;
		this.entityMode = entityMode;
		this.parser = parser ?? null;
		this.emitMainQueue = emitMainQueue;
		this.settings = settings;
	}

	/** Create a session that reads from a file in fixed-size chunks instead of loading the entire file into memory. */
	static fromFile(
		filePath: string,
		entityMode: EntityMode,
		emitMainQueue: EmitQueue,
		parser?: DemoReader,
		opts?: ParseSettings
	): ParseSession {
		const fd = fs.openSync(filePath, 'r');
		const fileSize = fs.fstatSync(fd).size;
		const readBuffer = Buffer.alloc(ParseSession.READ_BUFFER_SIZE);
		const initialRead = Math.min(readBuffer.length, fileSize);
		fs.readSync(fd, readBuffer, 0, initialRead, 0);

		const session = new ParseSession(readBuffer.subarray(0, initialRead), entityMode, emitMainQueue, parser, opts);
		session.fd = fd;
		session.readBuffer = readBuffer;
		session.fileOffset = initialRead;
		session.fileSize = fileSize;
		return session;
	}

	// --- Inline frame buffer helpers (replaces ByteBuffer) ---

	private _frameRemaining(): number {
		return this._frameLimit - this._frameOffset;
	}

	private _frameReadVarint32(): number {
		const buf = this._frameBuf;
		let offset = this._frameOffset;
		let result = 0;
		let shift = 0;
		let b: number;
		do {
			b = buf[offset++]!;
			result |= (b & 0x7f) << shift;
			shift += 7;
		} while ((b & 0x80) !== 0 && shift < 35);
		this._frameOffset = offset;
		return result;
	}

	private _frameSkip(n: number): void {
		this._frameOffset += n;
	}

	// === Public API ===

	/** Run synchronous parse to completion. */
	runSync(): void {
		try {
			this.runFrameLoop();
		} finally {
			this.closeFd();
		}
		this.flush();
	}

	/** Run non-blocking parse to completion, yielding to the event loop periodically. */
	async runAsync(): Promise<void> {
		let forceBreak = false;
		this.parser?.on('cancel', () => {
			forceBreak = true;
		});
		let frameCount = 0;
		let lastYieldTime = Date.now();

		try {
			while (true) {
				if (forceBreak) break;
				try {
					if (++frameCount % 5000 === 0) {
						this.enqueueEvent('progress', this.getProgress());
					}
					if (!this.readFrame()) break;

					const now = Date.now();
					if (now - lastYieldTime >= 16) {
						lastYieldTime = now;
						await new Promise<void>(resolve => setTimeout(resolve, 0));
					}
				} catch (e) {
					if (e instanceof RangeError) {
						this.enqueueEvent('end', { incomplete: true });
					} else {
						const error = e instanceof Error ? e : new Error(`Exception during parsing: ${e}`);
						this.enqueueEvent('debug', JSON.stringify(this.dumpState()));
						this.enqueueEvent('error', { error: e } as any);
						this.enqueueEvent('end', { error, incomplete: false });
					}
					break;
				}
			}
		} finally {
			this.closeFd();
		}
		this.flush();
	}

	private runFrameLoop(): void {
		let forceBreak = false;
		this.parser?.on('cancel', () => {
			forceBreak = true;
		});
		let frameCount = 0;

		while (true) {
			if (forceBreak) break;
			try {
				if (++frameCount % 5000 === 0) {
					this.enqueueEvent('progress', this.getProgress());
				}
				if (!this.readFrame()) break;
			} catch (e) {
				if (e instanceof RangeError) {
					this.enqueueEvent('end', { incomplete: true });
				} else {
					const error = e instanceof Error ? e : new Error(`Exception during parsing: ${e}`);
					this.enqueueEvent('debug', JSON.stringify(this.dumpState()));
					this.enqueueEvent('error', { error: e } as any);
					this.enqueueEvent('end', { error, incomplete: false });
				}
				break;
			}
		}
	}

	private getProgress(): number {
		return this.fd !== null ? this.fileOffset / this.fileSize : this._frameOffset / this._frameLimit;
	}

	private closeFd(): void {
		if (this.fd !== null) {
			fs.closeSync(this.fd);
			this.fd = null;
		}
	}

	/** Push a stream chunk for incremental parsing. */
	pushChunk(chunk: Buffer): void {
		this.chunks.push(chunk);
	}

	/**
	 * Process all available frames from buffered data.
	 * Returns false if DEM_Stop was reached (parsing complete), true if waiting for more data.
	 */
	processFrames(): boolean {
		while (this._frameRemaining() > 0 || this.chunks.length > 0) {
			this._frameMarked = this._frameOffset;
			try {
				if (!this.readFrame()) return false; // DEM_Stop
			} catch (e) {
				if (e instanceof RangeError) {
					// Not enough data — reset to frame start and wait for more chunks
					this._frameOffset = Math.max(0, this._frameMarked);
					return true;
				}
				throw e;
			}
		}
		return true;
	}

	/** Flush remaining events to the consumer. */
	flush(): void {
		this.emitMainQueue(this.eventQueue, 0, false);
	}

	// === Buffer management ===

	private tryEnsureRemaining(bytes: number): boolean {
		const remaining = this._frameLimit - this._frameOffset;
		if (remaining >= bytes) return true;

		// File-based path: compact and refill from fd
		if (this.fd !== null && this.fileOffset < this.fileSize) {
			return this.refillFromFile(bytes);
		}

		// Stream-based path: coalesce pending chunks
		let left = bytes - remaining;
		for (let i = 0; i < this.chunks.length && left > 0; ++i) left -= this.chunks[i]!.length;

		// We don't have enough bytes with what we have buffered up
		if (left > 0) return false;

		const mark = Math.max(0, this._frameMarked);
		const newOffset = this._frameOffset - mark;

		// Coalesce: keep unread bytes from current position, append pending chunks
		const unread = this._frameBuf.subarray(mark, this._frameLimit);
		const merged = Buffer.concat([unread, ...this.chunks]);
		this._frameBuf = merged;
		this._frameOffset = newOffset;
		this._frameLimit = merged.length;
		this.chunks = [];

		return true;
	}

	/** Compact unread bytes to the start of readBuffer and read more from the file. */
	private refillFromFile(needed: number): boolean {
		const buf = this.readBuffer!;
		const unread = this._frameLimit - this._frameOffset;

		// Copy unconsumed bytes to the start of the read buffer
		if (unread > 0) {
			buf.copyWithin(0, this._frameOffset, this._frameOffset + unread);
		}

		// Fill the rest from file
		const space = buf.length - unread;
		const toRead = Math.min(space, this.fileSize - this.fileOffset);
		if (toRead > 0) {
			fs.readSync(this.fd!, buf, unread, toRead, this.fileOffset);
			this.fileOffset += toRead;
		}

		const totalAvailable = unread + toRead;
		this._frameBuf = buf.subarray(0, totalAvailable);
		this._frameOffset = 0;
		this._frameLimit = totalAvailable;

		return totalAvailable >= needed;
	}

	private ensureRemaining(bytes: number): void {
		if (!this.tryEnsureRemaining(bytes)) {
			throw new RangeError(`Not enough data to continue parsing. ${bytes} bytes needed`);
		}
	}

	private decompressIfNeeded(size: number, isCompressed: boolean) {
		const bytes = this._frameBuf.subarray(this._frameOffset, this._frameOffset + size);
		this._frameOffset += size;

		if (isCompressed) {
			return snappy.uncompressSync(bytes) as Buffer;
		}

		return bytes;
	}

	private baseParse<T extends Decoders[DecoderKeys]['decode']>(
		decoder: T,
		size: number,
		isCompressed: boolean,
		handler?: (data: ReturnType<T>) => ReturnType<T> | void
	) {
		const data = this.decompressIfNeeded(size, isCompressed);
		this.binaryR.setTo(data);
		const decoded = decoder(this.binaryR);
		if (!handler) return decoded as ReturnType<T>;
		return handler(decoded as ReturnType<T>);
	}

	// === Frame-level parsing ===

	private readFrame(): boolean {
		this.ensureRemaining(6);
		const commandBase = this._frameReadVarint32();
		let tick = this._frameReadVarint32();
		if (tick === 0xffffffff) {
			tick = -1;
		}

		if (this.currentTick !== tick) {
			if (this.currentTick !== -1) this.enqueueEvent('tickend', this.currentTick);
			this.currentTick = tick;
			this.enqueueEvent('tickstart', this.currentTick);
		}

		const size = this._frameReadVarint32();
		this.ensureRemaining(size);

		const commandType = commandBase & ~EDemoCommands.DEM_IsCompressed;
		if (commandType === EDemoCommands.DEM_Stop) {
			this.enqueueEvent('tickend', this.currentTick);
			this.enqueueEvent('end', { incomplete: false });
			return false;
		}

		const decoder = decoders[commandType as keyof typeof decoders];

		if (!decoder) {
			this._frameSkip(size);
			return true;
		}

		const isCompressed = (commandBase & EDemoCommands.DEM_IsCompressed) !== 0;
		this.handleFrame(decoder, size, isCompressed);
		return true;
	}

	private handleFrame(decoder: (typeof decoders)[keyof typeof decoders], size: number, isCompressed: boolean): void {
		switch (decoder.type) {
			case EDemoCommands.DEM_SendTables:
				this.sendTables = this.baseParse(decoder.decode, size, isCompressed) ?? null;
				if (this.sendTables?.data) {
					const copy = new Uint8Array(new ArrayBuffer(this.sendTables.data.byteLength));
					copy.set(new Uint8Array(this.sendTables.data));
					this.sendTables.data = copy;
				}
				break;
			case EDemoCommands.DEM_ClassInfo: {
				const data = this.baseParse(decoder.decode, size, isCompressed);
				if (!data || !this.sendTables) break;

				const classInfo = parseClassInfo(this.sendTables, data);
				this.sendTables = null;
				this.entityParser = new EntityParser(classInfo, this.enqueueEvent);
				this.entityParser.onlyGameRules = this.entityMode === EntityMode.ONLY_GAME_RULES;
				if (this.parser) {
					this.parser.propIdToName = classInfo.propIdToName;
					this.parser.propIdToDecoder = classInfo.propIdToDecoder;
					this.entityParser.directEntities = this.parser.entities;
					this.entityParser.directPropIdToName = classInfo.propIdToName;
				}
				break;
			}
			case EDemoCommands.DEM_FileHeader:
				this.baseParse(decoder.decode, size, isCompressed, header => {
					this.enqueueEvent('header', header);
				});
				break;
			case EDemoCommands.DEM_Packet:
			case EDemoCommands.DEM_SignonPacket:
				this.baseParse(decoders[EDemoCommands.DEM_Packet].decode, size, isCompressed, packet => {
					this.parsePacket(packet);
				});
				break;
			case EDemoCommands.DEM_FullPacket:
				this.baseParse(decoder.decode, size, isCompressed, (fullPacket: CDemoFullPacket) => {
					if (fullPacket.packet?.data) this.parsePacket(fullPacket.packet);
				});
				break;
			default:
				this._frameSkip(size);
				break;
		}
		if (this.eventQueue.length > 0) this.emitMainQueue(this.eventQueue, 0, false);
	}

	private handleOptionalCommands<const K extends keyof typeof optionalSvcMessages>(
		commandId: K,
		decoder: (typeof optionalSvcMessages)[K],
		reader: BitBuffer,
		size: number
	) {
		const name = optionalSvcIds[commandId] as (typeof optionalSvcIds)[keyof typeof optionalSvcIds];
		if (!this.settings?.[name]) {
			reader.skipBytesBetter(size);
			return;
		}
		this.enqueueEvent(name, decoder.decode(reader.readBytesToSlice(ParseSession.PACKET_TEMP_BUFFER, size)));
	}

	// === Packet-level parsing ===

	private parsePacket(packet: CDemoPacket): void {
		if (!packet.data) return;

		const reader = this.cachedBitBuffer.setTo(packet.data);
		const gameEventQueue = [] as CMsgSource1LegacyGameEvent[];
		const packetEntitiesQueue = [] as CSVCMsg_PacketEntities[];
		const allocated = [] as Uint8Array[];

		while (reader.RemainingBits > 8) {
			const cmd = reader.readUbitVar();
			const size = reader.ReadUVarInt32();
			const command = messages[cmd as keyof typeof messages];

			if (!command) {
				reader.skipBytesBetter(size);
				continue;
			}

			switch (command.id) {
				case SVC_Messages.svc_PacketEntities: {
					if (this.entityMode === EntityMode.NONE) {
						reader.skipBytesBetter(size);
						continue;
					}
					const msgContent = ParseSession.entityAllocator.alloc(size);
					allocated.push(msgContent);
					reader.readBytes(msgContent);
					packetEntitiesQueue.push(CSVCMsg_PacketEntities.decode(msgContent));
					break;
				}
				case SVC_Messages.svc_ServerInfo: {
					const msgContent = reader.readBytesToSlice(ParseSession.PACKET_TEMP_BUFFER, size);
					const serverInfo = command.class.decode(msgContent);
					this.enqueueEvent('serverinfo', serverInfo);
					break;
				}
				case EBaseGameEvents.GE_Source1LegacyGameEventList: {
					const msgContent = reader.readBytesToSlice(ParseSession.PACKET_TEMP_BUFFER, size);
					this.binaryR2.setTo(msgContent);
					const eventlist = command.class.decode(this.binaryR2);
					this.enqueueEvent('gameeventlist', eventlist);
					break;
				}
				case EBaseGameEvents.GE_Source1LegacyGameEvent: {
					const msgContent = reader.readBytesToSlice(ParseSession.PACKET_TEMP_BUFFER, size);
					this.binaryR2.setTo(msgContent);
					gameEventQueue.push(command.class.decode(this.binaryR2));
					break;
				}
				case SVC_Messages.svc_CreateStringTable: {
					const msgContent = reader.readBytesToSlice(ParseSession.PACKET_TEMP_BUFFER, size);
					const tableCreatedData = createStringTable(command.class.decode(msgContent), this.baselines);
					this._stringTables.push(tableCreatedData?.table ?? null);
					this.enqueueEvent('createstringtable', tableCreatedData || null);
					break;
				}
				case SVC_Messages.svc_UpdateStringTable: {
					const msgContent = reader.readBytesToSlice(ParseSession.PACKET_TEMP_BUFFER, size);
					const updateMsg = command.class.decode(msgContent);
					if ('table_id' in updateMsg) {
						const tableCData = updateStringTable(updateMsg, this._stringTables, this.baselines);
						if (tableCData) {
							this._stringTables.push(tableCData.table);
							this.enqueueEvent('updatestringtable', tableCData);
						}
					}
					break;
				}
				case SVC_Messages.svc_ClearAllStringTables:
					reader.skipBytesBetter(size);
					this.enqueueEvent('clearallstringtables');
					break;
				default:
					if (command.id in optionalSvcIds) {
						this.handleOptionalCommands(command.id, command.class, reader, size);
						break;
					}
					reader.skipBytesBetter(size);
					break;
			}
		}

		for (const queueElement of packetEntitiesQueue) {
			this.entityParser?.parseEntityPacket(queueElement, this.baselines);
		}
		for (const allocatedElement of allocated) {
			ParseSession.entityAllocator.free(allocatedElement);
		}
		for (const event of gameEventQueue) {
			this.enqueueEvent('gameevent', event);
		}
	}

	private dumpState() {
		return {
			currentTick: this.currentTick,
			bytebufferOffset: this._frameOffset,
			bytebufferRemaining: this._frameLimit - this._frameOffset
		};
	}
}
