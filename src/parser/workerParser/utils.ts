import fs from 'fs-extra';
import ByteBuffer from 'bytebuffer';
import snappy from 'snappy';
import { BitBuffer } from '../ubitreader.js';
import { decoders, type DecoderKeys, type Decoders } from '../descriptors/decoders.js';
import {
	CDemoSendTables,
	EDemoCommands,
	eDemoCommandsToJSON,
	type CDemoFullPacket,
	type CDemoPacket
} from '../../ts-proto/demo.js';
import { EBaseGameEvents, type CMsgSource1LegacyGameEvent } from '../../ts-proto/gameevents.js';
import { CSVCMsg_PacketEntities, SVC_Messages } from '../../ts-proto/netmessages.js';
import { messages } from '../descriptors/index.js';
import { createStringTable } from '../stringtables.js';
import { EntityMode, type EmitQueue, type EventQueue, type emit } from './worker.js';
import { parseClassInfo } from './classInfo.js';
import { EntityParser } from './entityParser.js';
import type { DemoReader } from '../index.js';
import { BinaryReaderEditable } from '../../binary-encoding/index.js';
import { createAllocator } from './allocator.js';

export const qfMapper = {
	idx: 0,
	map: {} as Record<number, QuantalizedFloat>
};

export type QFMapper = typeof qfMapper;

export type QuantalizedFloat = {
	low: number;
	high: number;
	high_low_mul: number;
	dec_mul: number;
	offset: number;
	bit_count: number;
	flags: number;
	no_scale: boolean;
};

const QFF_ROUNDDOWN = 1 << 0;
const QFF_ROUNDUP = 1 << 1;
const QFF_ENCODE_ZERO = 1 << 2;
const QFF_ENCODE_INTEGERS = 1 << 3;

export const getQuantalizedFloat = (
	bitcount: number,
	flags?: number,
	low_value?: number,
	high_value?: number
): QuantalizedFloat => {
	const qf: QuantalizedFloat = {
		no_scale: false,
		bit_count: bitcount,
		dec_mul: 0.0,
		low: 0.0,
		high: 0.0,
		high_low_mul: 0.0,
		offset: 0.0,
		flags: 0
	};

	if (bitcount == 0 || bitcount >= 32) {
		qf.no_scale = true;
		qf.bit_count = 32;
		return qf;
	}

	qf.bit_count = bitcount;
	if (low_value !== undefined) {
		qf.low = low_value;
	}

	if (high_value !== undefined) {
		qf.high = high_value;
	}

	if (flags !== undefined) {
		qf.flags = flags;
		validateFlags(qf);
	}

	let steps = 1 << qf.bit_count;

	if ((qf.flags & QFF_ROUNDDOWN) != 0) {
		const range = qf.high - qf.low;
		qf.offset = range / steps;
		qf.high -= qf.offset;
	} else if ((qf.flags & QFF_ROUNDUP) != 0) {
		const range = qf.high - qf.low;
		qf.offset = range / steps;
		qf.low += qf.offset;
	}

	if ((qf.flags & QFF_ENCODE_INTEGERS) != 0) {
		let delta = qf.high - qf.low;
		if (delta < 1.0) {
			delta = 1.0;
		}
		const delta_log2 = Math.ceil(Math.log2(delta));
		const range_2 = 1 << delta_log2;
		let bit_count = qf.bit_count;

		while (1 << bit_count <= range_2) {
			bit_count += 1;
		}

		if (bit_count > qf.bit_count) {
			qf.bit_count = bit_count;
			steps = 1 << qf.bit_count;
		}

		qf.offset = range_2 / steps;
		qf.high = qf.low + (range_2 - qf.offset);
	}

	assignMultipliers(qf, steps);

	if ((qf.flags & QFF_ROUNDDOWN) != 0) {
		if (quantize(qf, qf.low) == qf.low) {
			qf.flags &= ~QFF_ROUNDDOWN;
		}
	}
	if ((qf.flags & QFF_ROUNDUP) != 0) {
		if (quantize(qf, qf.high) == qf.high) {
			qf.flags &= ~QFF_ROUNDUP;
		}
	}
	if ((qf.flags & QFF_ENCODE_ZERO) != 0) {
		if (quantize(qf, 0.0) == 0.0) {
			qf.flags &= ~QFF_ENCODE_ZERO;
		}
	}

	//const steps: u32 = 1 << qf.bit_count;
	// _ = steps;

	// TODO: THE REST IDC

	return qf;
};

// TODO: fixed duplicates
const assignMultipliers = (qf: QuantalizedFloat, steps: number) => {
	qf.high_low_mul = 0.0;
	const range = qf.high - qf.low;

	const high: number = qf.bit_count === 32 ? 0xfffffffe : (1 << qf.bit_count) - 1;

	let high_mul: number = Math.abs(range) <= 0.0 ? high : high / range;

	if (high_mul * range > high || high_mul * range > high) {
		const multipliers = [0.9999, 0.99, 0.9, 0.8, 0.7];
		for (const multiplier of multipliers) {
			high_mul = (high / range) * multiplier;
			if (high_mul * range > high || high_mul * range > high) {
				continue;
			}
			break;
		}
	}

	qf.high_low_mul = high_mul;
	qf.dec_mul = 1.0 / (steps - 1);
};
const quantize = (qf: QuantalizedFloat, val: number) => {
	if (val < qf.low) {
		return qf.low;
	}
	if (val > qf.high) {
		return qf.high;
	}
	const i = Math.floor((val - qf.low) * qf.high_low_mul);
	return qf.low + (qf.high - qf.low) * (i * qf.dec_mul);
};
const validateFlags = (qf: QuantalizedFloat) => {
	if (qf.flags === 0) {
		return;
	}

	if ((qf.low === 0.0 && (qf.flags & QFF_ROUNDDOWN) !== 0) || (qf.high === 0.0 && (qf.flags & QFF_ROUNDUP) !== 0)) {
		qf.flags &= ~QFF_ENCODE_ZERO;
	}

	if (qf.low === 0.0 && (qf.flags & QFF_ENCODE_ZERO) !== 0) {
		qf.flags |= QFF_ROUNDDOWN;
		qf.flags &= ~QFF_ENCODE_ZERO;
	}

	if (qf.high === 0.0 && (qf.flags & QFF_ENCODE_ZERO) !== 0) {
		qf.flags |= QFF_ROUNDUP;
		qf.flags &= ~QFF_ENCODE_ZERO;
	}

	if (qf.low > 0.0 || qf.high < 0.0) {
		qf.flags &= ~QFF_ENCODE_ZERO;
	}

	if ((qf.flags & QFF_ENCODE_INTEGERS) !== 0) {
		qf.flags &= ~(QFF_ROUNDUP | QFF_ROUNDDOWN | QFF_ENCODE_ZERO);
	}
};

export const decodeQfloat = (reader: BitBuffer, qfIndex: number) => {
	const qf = qfMapper.map[qfIndex];

	if (!qf) throw 'QF NOT FOUND';
	if ((qf.flags & QFF_ROUNDDOWN) !== 0 && reader.readBoolean()) {
		return qf.low;
	}

	if ((qf.flags & QFF_ROUNDUP) !== 0 && reader.readBoolean()) {
		return qf.high;
	}

	if ((qf.flags & QFF_ENCODE_ZERO) !== 0 && reader.readBoolean()) {
		return 0;
	}
	// TODO tu sie pewnie zepsuje
	const bits = reader.ReadUBits(qf.bit_count);

	return qf.low + (qf.high - qf.low) * bits * qf.dec_mul;
};

const b = new ArrayBuffer(2 ** 18);
const PACKET_TEMP_BUFFER = new Uint8Array(b); // Buffer.allocUnsafe(50_000);
// const c = new ArrayBuffer(2 ** 18);
// const PACKET_TEMP_BUFFER_2 = new Uint8Array(c); // Buffer.allocUnsafe(50_000);
const entity_allocator = createAllocator();

export type HelperContext = {
	entityParser: null | EntityParser;
	enqueueEvent: emit;
};

// export const isDebugTick = (tick: number) => false; // DEBUG_PROPS.ticks.some(t => t.tick === tick);

export const initBufferHelpers = (buffer: Buffer, helper: HelperContext, entities: EntityMode = EntityMode.NONE) => {
	let _bytebuffer = ByteBuffer.wrap(buffer, true);
	let _chunks: Buffer[] = [];

	const { enqueueEvent } = helper;
	const uncompressedSizes = [] as number[];

	const baselines = [] as Uint8Array[];
	const response = {
		tryEnsureRemaining,
		_ensureRemaining,
		baseParse,
		_bytebuffer,
		parseFullPacket,
		parsePacket,
		currentTick: -1,
		mainLoop,
		mainLoopAsync,
		pushChunk,
		readAvailableFrames,
		uncompressedSizes,
		lastPackerInfo: {
			type: '',
			size: -1,
			isCompressed: false,
			frameStartOffset: -1
		},
		amounts: {
			temporaryEntities: 0,
			entities: 0
		}
	};

	function tryEnsureRemaining(bytes: number) {
		const remaining = _bytebuffer.remaining();
		if (remaining >= bytes) return true;

		let left = bytes - remaining;
		for (let i = 0; i < _chunks.length && left > 0; ++i) left -= _chunks[i]!.length;

		// We don't have enough bytes with what we have buffered up
		if (left > 0) return false;

		const mark = Math.max(0, _bytebuffer.markedOffset);
		const newOffset = _bytebuffer.offset - mark;

		// Coalesce: keep unread bytes from current position, append pending chunks
		_bytebuffer.offset = mark;
		_bytebuffer = ByteBuffer.wrap(Buffer.concat([new Uint8Array(_bytebuffer.toBuffer()), ..._chunks]), true);
		_bytebuffer.noAssert = true;
		_chunks = [];
		_bytebuffer.offset = newOffset;
		response._bytebuffer = _bytebuffer;

		return true;
	}

	function pushChunk(chunk: Buffer) {
		_chunks.push(chunk);
	}

	function _ensureRemaining(bytes: number) {
		if (!tryEnsureRemaining(bytes)) {
			throw new RangeError(`Not enough data to continue parsing. ${bytes} bytes needed`);
		}
		return true;
	}
	// const SNAPPY_BUFFER = new Uint8Array(256 * 1024);
	function decompressIfNeeded(size: number, isCompressed: boolean /*, clone?: boolean*/) {
		const bytes = _bytebuffer.buffer.subarray(_bytebuffer.offset, _bytebuffer.offset + size);
		_bytebuffer.offset += size;

		if (isCompressed) {
			return snappy.uncompressSync(bytes) as Buffer;
			// const uncompressedSize = snappy.uncompressSync(bytes, { output: PACKET_TEMP_BUFFER_2 });
			// const output = PACKET_TEMP_BUFFER_2.subarray(0, uncompressedSize);
			// return output;
		}

		return bytes;
	}

	const binaryR = new BinaryReaderEditable(new Uint8Array(0));

	function baseParse<T extends Decoders[DecoderKeys]['decode']>(
		decoder: T,
		size: number,
		isCompressed: boolean,
		parser?: (data: ReturnType<T>) => ReturnType<T> | void
		//clone?: boolean
	) {
		const data = decompressIfNeeded(size, isCompressed /*, clone*/);
		binaryR.setTo(data);
		const decoded = decoder(binaryR);
		if (!parser) return decoded as ReturnType<T>;
		return parser(decoded as ReturnType<T>);
	}

	function parseFullPacket(packet: CDemoFullPacket) {
		if (!packet.packet?.data) return;

		parsePacket(packet.packet);
	}

	const cachedBitBuffer = new BitBuffer(new Uint8Array(0));
	const binaryR2 = new BinaryReaderEditable(new Uint8Array(0));

	function parsePacket(packet: CDemoPacket) {
		if (!packet.data) return; //throw 'sdf';

		const reader = cachedBitBuffer.setTo(packet.data);
		// if (isDebugTick(response.currentTick)) console.log('PACKET SIZE', packet.data.length);
		const gameEventQueue = [] as CMsgSource1LegacyGameEvent[];
		const packetEntitiesQueue = [] as CSVCMsg_PacketEntities[];
		const allocated = [] as Uint8Array[];
		// const b = new ArrayBuffer();
		while (reader.RemainingBits > 8) {
			const cmd = reader.readUbitVar();
			const size = reader.ReadUVarInt32();
			const command = messages[cmd as keyof typeof messages];

			// console.log(cmd);
			if (!command) {
				reader.skipBytesBetter(size);
				continue;
			}

			// if (isDebugTick(response.currentTick)) {
			// 	console.log('CURRENT CMD', command.name);
			// }
			switch (command.id) {
				case SVC_Messages.svc_PacketEntities: {
					if (entities === EntityMode.NONE) {
						reader.skipBytesBetter(size);
						continue;
					}
					const msgContent = entity_allocator.alloc(size); // Buffer.alloc(size);
					allocated.push(msgContent);
					reader.readBytes(msgContent);
					// binaryR2.setTo(msgContent);
					packetEntitiesQueue.push(CSVCMsg_PacketEntities.decode(msgContent));

					break;
				}
				case SVC_Messages.svc_ServerInfo: {
					const msgContent = reader.readBytesToSlice(PACKET_TEMP_BUFFER, size);
					const serverInfo = command.class.decode(msgContent);
					enqueueEvent('svc_ServerInfo', serverInfo);
					break;
				}
				case EBaseGameEvents.GE_Source1LegacyGameEventList: {
					// const PACKET_TEMP_BUFFER = Buffer.alloc(size);
					const msgContent = reader.readBytesToSlice(PACKET_TEMP_BUFFER, size);
					binaryR2.setTo(msgContent);
					const eventlist = command.class.decode(binaryR2);
					enqueueEvent('GE_Source1LegacyGameEventList', eventlist);
					break;
				}
				case EBaseGameEvents.GE_Source1LegacyGameEvent: {
					const msgContent = reader.readBytesToSlice(PACKET_TEMP_BUFFER, size);
					binaryR2.setTo(msgContent);
					gameEventQueue.push(command.class.decode(binaryR2));

					break;
				}
				case SVC_Messages.svc_CreateStringTable: {
					// TODO add actually reading baselines
					const msgContent = reader.readBytesToSlice(PACKET_TEMP_BUFFER, size);
					const tableCreatedData = createStringTable(command.class.decode(msgContent), baselines);

					enqueueEvent('svc_CreateStringTable', tableCreatedData || null);

					break;
				}
				case SVC_Messages.svc_UpdateStringTable: {
					reader.skipBytesBetter(size);
					// TODO mocno todo
					// const tableUpdatedData = updateStringTable(command.class.decode(msgContent), this._stringTables);

					// if(tableUpdatedData){
					//   for(const player of tableUpdatedData.players){
					//     this.players[player.userid! & 0xff] = player;
					//   }
					//   this._stringTables[tableUpdatedData.tableId] = tableUpdatedData.table;
					// }
					break;
				}
				// case SVC_Messages.svc_UserMessage:
				// 	const msgContent = reader.readBytesToSlice(PACKET_TEMP_BUFFER, size);
				// 	const userMessage = command.class.decode(msgContent);
				// 	enqueueEvent('svc_UserMessage', userMessage);
				// 	break;

				case SVC_Messages.svc_ClearAllStringTables:
					reader.skipBytesBetter(size);
					enqueueEvent('svc_ClearAllStringTables', null);
					break;
				default:
					reader.skipBytesBetter(size);
					break;
			}

			// Zweryfikowac czy nie lepiej zbundlować całości
		}
		for (const queueElement of packetEntitiesQueue) {
			helper.entityParser?.parseEntityPacket(queueElement, baselines);
		}
		for (const allocatedElement of allocated) {
			entity_allocator.free(allocatedElement);
		}
		// emitQueue(eventQueue);

		for (const event of gameEventQueue) {
			enqueueEvent('GE_Source1LegacyGameEvent', event);
		}
		return packet;
	}
	_bytebuffer.noAssert = true;

	function readFrame(packetHandler: PacketHandler): boolean {
		_ensureRemaining(6);
		const frameStartOffset = _bytebuffer.offset;
		response.lastPackerInfo.frameStartOffset = frameStartOffset;
		const EDemoCommandTypeBase = _bytebuffer.readVarint32();
		let tick = _bytebuffer.readVarint32();
		if (tick === 0xffffffff) {
			tick = -1;
		}

		if (response.currentTick !== tick) {
			if (response.currentTick !== -1) enqueueEvent('tickend', response.currentTick);
			response.currentTick = tick;

			enqueueEvent('tickstart', response.currentTick);
		}

		const size = _bytebuffer.readVarint32();
		_ensureRemaining(size);

		const EDemoCommandType = EDemoCommandTypeBase & ~EDemoCommands.DEM_IsCompressed;
		response.lastPackerInfo.isCompressed = (EDemoCommandTypeBase & EDemoCommands.DEM_IsCompressed) !== 0;
		response.lastPackerInfo.size = size;
		response.lastPackerInfo.type = eDemoCommandsToJSON(EDemoCommandType as EDemoCommands);
		if (EDemoCommandType === EDemoCommands.DEM_Stop) {
			enqueueEvent('tickend', response.currentTick);
			enqueueEvent('end', { incomplete: false });
			return false;
		}

		const decoder = decoders[EDemoCommandType as keyof typeof decoders];

		if (!decoder) {
			_bytebuffer.skip(size);
			return true;
		}

		const isCompressed = (EDemoCommandTypeBase & EDemoCommands.DEM_IsCompressed) !== 0;
		packetHandler(decoder, size, isCompressed);
		return true;
	}

	function dumpCurrentParserState() {
		return {
			currentTick: response.currentTick,
			bytebufferOffset: _bytebuffer.offset,
			bytebufferRemaining: _bytebuffer.remaining(),
			lastPackerInfo: response.lastPackerInfo
		};
	}

	/**
	 * Read as many frames as possible with available data.
	 * Returns false if DEM_Stop was reached (parsing complete), true if waiting for more data.
	 * On RangeError (not enough data), resets to the last good position and returns true.
	 */
	function readAvailableFrames(packetHandler: PacketHandler): boolean {
		while (_bytebuffer.remaining() > 0 || _chunks.length > 0) {
			_bytebuffer.mark();
			try {
				const frame = readFrame(packetHandler);
				if (frame === false) return false; // DEM_Stop
			} catch (e) {
				if (e instanceof RangeError) {
					// Not enough data — reset to frame start and wait for more chunks
					_bytebuffer.offset = Math.max(0, _bytebuffer.markedOffset);
					return true;
				}
				throw e;
			}
		}
		return true;
	}

	function mainLoop(packetHandler: PacketHandler, allowForEmptyBuffer: boolean, parser?: DemoReader) {
		let forceBreak = false;
		parser?.on('cancel', () => {
			forceBreak = true;
		});
		let frameCount = 0;
		while (true) {
			if (_bytebuffer.remaining() === 0 && allowForEmptyBuffer) break;
			if (forceBreak) break;
			try {
				if (++frameCount % 5000 === 0) {
					enqueueEvent('progress', _bytebuffer.offset / _bytebuffer.limit);
				}
				const frame = readFrame(packetHandler);
				if (frame === false) {
					break;
				}
			} catch (e) {
				if (e instanceof RangeError) {
					// console.trace(e);
					enqueueEvent('end', { incomplete: true });
				} else {
					const error = e instanceof Error ? e : new Error(`Exception during parsing: ${e}`);
					enqueueEvent('debug', JSON.stringify(dumpCurrentParserState()));
					enqueueEvent('error', { error: e } as any);
					enqueueEvent('end', { error, incomplete: false });
				}

				break;
			}
		}
	}

	async function mainLoopAsync(
		packetHandler: PacketHandler,
		allowForEmptyBuffer: boolean,
		parser?: DemoReader,
		yieldMs = 16
	) {
		let forceBreak = false;
		parser?.on('cancel', () => {
			forceBreak = true;
		});
		let frameCount = 0;
		let lastYieldTime = Date.now();

		while (true) {
			if (_bytebuffer.remaining() === 0 && allowForEmptyBuffer) break;
			if (forceBreak) break;
			try {
				if (++frameCount % 5000 === 0) {
					enqueueEvent('progress', _bytebuffer.offset / _bytebuffer.limit);
				}
				const frame = readFrame(packetHandler);
				if (frame === false) {
					break;
				}

				// Yield periodically to avoid blocking the event loop
				const now = Date.now();
				if (now - lastYieldTime >= yieldMs) {
					lastYieldTime = now;
					await new Promise<void>(resolve => setImmediate(resolve));
				}
			} catch (e) {
				if (e instanceof RangeError) {
					// console.trace(e);
					enqueueEvent('end', { incomplete: true });
				} else {
					const error = e instanceof Error ? e : new Error(`Exception during parsing: ${e}`);
					enqueueEvent('debug', JSON.stringify(dumpCurrentParserState()));
					enqueueEvent('error', { error: e } as any);
					enqueueEvent('end', { error, incomplete: false });
				}

				break;
			}
		}
	}

	return response;
};

export type PacketHandler = (
	decoder: (typeof decoders)[keyof typeof decoders],
	size: number,
	isCompressed: boolean
) => void;

export type WorkerInputData = {
	demo: string | Buffer /* | Readable*/;
	entities?: EntityMode;
	parser?: DemoReader;
};

/** Sets up shared parse state: event queue, packet handler, buffer helpers. */
export const initParse = (workerData: WorkerInputData, emitMainQueue: EmitQueue) => {
	const entityMode = workerData.entities ?? EntityMode.NONE;

	let cDemSendTables: null | CDemoSendTables = null;

	const eventQueue: EventQueue = [];
	const enqueueEvent: emit = (eventName, data) => {
		eventQueue.push([eventName, data] as any);
	};
	const helper: HelperContext = { entityParser: null, enqueueEvent };

	const buffer = typeof workerData.demo === 'string' ? fs.readFileSync(workerData.demo) : workerData.demo;
	const bufferHelper = initBufferHelpers(buffer, helper, entityMode);

	bufferHelper._bytebuffer.skip(16);

	const packetHandler: PacketHandler = (decoder, size, isCompressed) => {
		switch (decoder.type) {
			case EDemoCommands.DEM_SendTables:
				cDemSendTables = bufferHelper.baseParse(decoder.decode, size, isCompressed) ?? null;
				if (cDemSendTables?.data) {
					const dst = new ArrayBuffer(cDemSendTables.data.byteLength);
					const copy = new Uint8Array(dst);
					copy.set(new Uint8Array(cDemSendTables.data));
					cDemSendTables.data = copy;
				}
				break;
			case EDemoCommands.DEM_ClassInfo: {
				const data = bufferHelper.baseParse(decoder.decode, size, isCompressed);
				if (!data || !cDemSendTables) break;

				const classInfo = parseClassInfo(cDemSendTables, data);
				cDemSendTables = null;
				helper.entityParser = new EntityParser(classInfo, enqueueEvent);
				helper.entityParser.onlyGameRules = entityMode === EntityMode.ONLY_GAME_RULES;
				if (workerData.parser) {
					workerData.parser.propIdToName = classInfo.propIdToName;
					helper.entityParser.directEntities = workerData.parser.entities;
					helper.entityParser.directPropIdToName = classInfo.propIdToName;
				}
				break;
			}
			case EDemoCommands.DEM_FileHeader:
				bufferHelper.baseParse(decoder.decode, size, isCompressed, header => {
					enqueueEvent('header', header);
				});
				break;
			case EDemoCommands.DEM_Packet:
			case EDemoCommands.DEM_SignonPacket:
				bufferHelper.baseParse(
					decoders[EDemoCommands.DEM_Packet].decode,
					size,
					isCompressed,
					bufferHelper.parsePacket
				);
				break;
			case EDemoCommands.DEM_FullPacket:
				bufferHelper.baseParse(decoder.decode, size, isCompressed, bufferHelper.parseFullPacket);
				break;
			default:
				bufferHelper._bytebuffer.skip(size);
				break;
		}
		emitMainQueue(eventQueue, 0, false);
	};

	return { bufferHelper, packetHandler, eventQueue, emitMainQueue };
};

export const singleThreadParse = (workerData: WorkerInputData, emitMainQueue: EmitQueue) => {
	const { bufferHelper, packetHandler, eventQueue } = initParse(workerData, emitMainQueue);

	bufferHelper.mainLoop(packetHandler, false, workerData.parser);

	emitMainQueue(eventQueue, 0, false);
};

export const singleThreadParseAsync = async (workerData: WorkerInputData, emitMainQueue: EmitQueue) => {
	const { bufferHelper, packetHandler, eventQueue } = initParse(workerData, emitMainQueue);

	await bufferHelper.mainLoopAsync(packetHandler, false, workerData.parser);

	emitMainQueue(eventQueue, 0, false);
};
