import ByteBuffer from 'bytebuffer';
import snappy from 'snappy';
import { BitBuffer } from '../ubitreader.js';
import { decoders, type DecoderKeys, type Decoders } from '../descriptors/decoders.js';
import {
	CDemoSendTables,
	EDemoCommands,
	type CDemoFullPacket,
	type CDemoPacket
} from '../../ts-proto/demo.js';
import { EBaseGameEvents, type CMsgSource1LegacyGameEvent } from '../../ts-proto/gameevents.js';
import { CSVCMsg_PacketEntities, SVC_Messages } from '../../ts-proto/netmessages.js';
import { messages } from '../descriptors/index.js';
import { createStringTable } from '../stringtables.js';
import { EntityMode, type EmitQueue, type EventQueue, type emit } from './types.js';
import { parseClassInfo } from './classInfo.js';
import { EntityParser } from './entityParser.js';
import type { DemoReader } from '../index.js';
import { BinaryReaderEditable } from '../../binary-encoding/index.js';
import { createAllocator } from './allocator.js';

export class ParseSession {
	// Module-level singletons (shared across sessions)
	private static readonly PACKET_TEMP_BUFFER = new Uint8Array(new ArrayBuffer(2 ** 18));
	private static readonly entityAllocator = createAllocator();

	// Buffer state
	private bytebuffer: ByteBuffer;
	private chunks: Buffer[] = [];

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

	// Bound reference for EntityParser (avoids .bind() on every call)
	private readonly enqueueEvent: emit = (eventName, data) => {
		this.eventQueue.push([eventName, data] as any);
	};

	constructor(buffer: Buffer, entityMode: EntityMode, emitMainQueue: EmitQueue, parser?: DemoReader) {
		this.bytebuffer = ByteBuffer.wrap(buffer, true);
		this.bytebuffer.noAssert = true;
		this.bytebuffer.skip(16); // skip demo file header
		this.entityMode = entityMode;
		this.parser = parser ?? null;
		this.emitMainQueue = emitMainQueue;
	}

	// === Public API ===

	/** Run synchronous parse to completion. */
	runSync(): void {
		let forceBreak = false;
		this.parser?.on('cancel', () => {
			forceBreak = true;
		});
		let frameCount = 0;

		while (true) {
			if (forceBreak) break;
			try {
				if (++frameCount % 5000 === 0) {
					this.enqueueEvent('progress', this.bytebuffer.offset / this.bytebuffer.limit);
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

		this.flush();
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
		while (this.bytebuffer.remaining() > 0 || this.chunks.length > 0) {
			this.bytebuffer.mark();
			try {
				if (!this.readFrame()) return false; // DEM_Stop
			} catch (e) {
				if (e instanceof RangeError) {
					// Not enough data — reset to frame start and wait for more chunks
					this.bytebuffer.offset = Math.max(0, this.bytebuffer.markedOffset);
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
		const remaining = this.bytebuffer.remaining();
		if (remaining >= bytes) return true;

		let left = bytes - remaining;
		for (let i = 0; i < this.chunks.length && left > 0; ++i) left -= this.chunks[i]!.length;

		// We don't have enough bytes with what we have buffered up
		if (left > 0) return false;

		const mark = Math.max(0, this.bytebuffer.markedOffset);
		const newOffset = this.bytebuffer.offset - mark;

		// Coalesce: keep unread bytes from current position, append pending chunks
		this.bytebuffer.offset = mark;
		this.bytebuffer = ByteBuffer.wrap(
			Buffer.concat([new Uint8Array(this.bytebuffer.toBuffer()), ...this.chunks]),
			true
		);
		this.bytebuffer.noAssert = true;
		this.chunks = [];
		this.bytebuffer.offset = newOffset;

		return true;
	}

	private ensureRemaining(bytes: number): void {
		if (!this.tryEnsureRemaining(bytes)) {
			throw new RangeError(`Not enough data to continue parsing. ${bytes} bytes needed`);
		}
	}

	private decompressIfNeeded(size: number, isCompressed: boolean) {
		const bytes = this.bytebuffer.buffer.subarray(this.bytebuffer.offset, this.bytebuffer.offset + size);
		this.bytebuffer.offset += size;

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
		const commandBase = this.bytebuffer.readVarint32();
		let tick = this.bytebuffer.readVarint32();
		if (tick === 0xffffffff) {
			tick = -1;
		}

		if (this.currentTick !== tick) {
			if (this.currentTick !== -1) this.enqueueEvent('tickend', this.currentTick);
			this.currentTick = tick;
			this.enqueueEvent('tickstart', this.currentTick);
		}

		const size = this.bytebuffer.readVarint32();
		this.ensureRemaining(size);

		const commandType = commandBase & ~EDemoCommands.DEM_IsCompressed;
		if (commandType === EDemoCommands.DEM_Stop) {
			this.enqueueEvent('tickend', this.currentTick);
			this.enqueueEvent('end', { incomplete: false });
			return false;
		}

		const decoder = decoders[commandType as keyof typeof decoders];

		if (!decoder) {
			this.bytebuffer.skip(size);
			return true;
		}

		const isCompressed = (commandBase & EDemoCommands.DEM_IsCompressed) !== 0;
		this.handleFrame(decoder, size, isCompressed);
		return true;
	}

	private handleFrame(
		decoder: (typeof decoders)[keyof typeof decoders],
		size: number,
		isCompressed: boolean
	): void {
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
				this.bytebuffer.skip(size);
				break;
		}
		this.emitMainQueue(this.eventQueue, 0, false);
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
					this.enqueueEvent('svc_ServerInfo', serverInfo);
					break;
				}
				case EBaseGameEvents.GE_Source1LegacyGameEventList: {
					const msgContent = reader.readBytesToSlice(ParseSession.PACKET_TEMP_BUFFER, size);
					this.binaryR2.setTo(msgContent);
					const eventlist = command.class.decode(this.binaryR2);
					this.enqueueEvent('GE_Source1LegacyGameEventList', eventlist);
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
					this.enqueueEvent('svc_CreateStringTable', tableCreatedData || null);
					break;
				}
				case SVC_Messages.svc_UpdateStringTable: {
					reader.skipBytesBetter(size);
					break;
				}
				case SVC_Messages.svc_ClearAllStringTables:
					reader.skipBytesBetter(size);
					this.enqueueEvent('svc_ClearAllStringTables', null);
					break;
				default:
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
			this.enqueueEvent('GE_Source1LegacyGameEvent', event);
		}
	}

	private dumpState() {
		return {
			currentTick: this.currentTick,
			bytebufferOffset: this.bytebuffer.offset,
			bytebufferRemaining: this.bytebuffer.remaining()
		};
	}
}
