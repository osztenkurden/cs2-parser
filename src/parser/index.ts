import fs from "fs/promises";
import snappy from "snappy";
import timers from "node:timers";
import ByteBuffer from "bytebuffer";
import {
  CDemoFullPacket,
  CDemoPacket,
  EDemoCommands,
} from "../ts-proto/demo";
import { type DecoderKeys, type Decoders, decoders } from "./decoders";
import { BitBuffer } from "./ubitreader";
import {
  CMsgSource1LegacyGameEvent,
  CMsgSource1LegacyGameEventList,
  CMsgSource1LegacyGameEventList_descriptorT,
  EBaseGameEvents,
} from "../ts-proto/gameevents";
import {
  CSVCMsgCreateStringTable,
  CSVCMsgUpdateStringTable,
  SVCMessages,
} from "../ts-proto/netmessages";
import { GameEvents, parseRawEventData } from "./gameEvents";
import { messages } from "./descriptors";
import { CMsgPlayerInfo } from "../ts-proto/networkbasetypes";
import { EventEmitter, type Readable } from "stream";

export class DemoReader extends EventEmitter {
  private _immediateTimerToken: ReturnType<typeof timers["setImmediate"]> | null = null;
  private _parseStartTime = process.hrtime.bigint();
  private _bytebuffer!: ByteBuffer;
  private _chunks: Buffer[] = [];
  private _stringTables = [] as ReturnType<
    typeof DemoReader.prototype.parseStringTable
  >[];
  private _eventDescriptors!: Record<
    number,
    CMsgSource1LegacyGameEventList_descriptorT
  >;
  private _hasEnded = false;
  private _stream: Readable | null = null;

  currentTick = 0;


  players: Record<number, CMsgPlayerInfo> = {};
  gameEvents = new GameEvents();



  private constructEventDescriptor = (data: CMsgSource1LegacyGameEventList) => {
    const descriptors = data.descriptors.reduce((acc, descriptor) => {
      if (descriptor.eventid) acc[descriptor.eventid] = descriptor;
      return acc;
    }, {} as Record<number, CMsgSource1LegacyGameEventList_descriptorT>);
    this._eventDescriptors = descriptors;
  };

  private parseGameEvent = (gameEvent: CMsgSource1LegacyGameEvent) => {
    const descriptor = this._eventDescriptors[gameEvent.eventid ?? -1];
    if (!descriptor?.name) return;
    
    if (!this.gameEvents.eventNames().includes(descriptor.name) && !this.eventNames().includes("gameEvent")) {
      return;
    }
    const gameEventData = {} as any;

    for (let i = 0; i < gameEvent.keys.length; i++) {
      const ge = gameEvent.keys[i]!;
      const desc = descriptor.keys[i]!;

      const value = parseRawEventData(ge);
      gameEventData[desc.name!] = value;
    }
    this.emit("gameEvent", descriptor.name, gameEventData);
    this.gameEvents.emit(descriptor.name, gameEventData);
  };
  private parseStringTable = (
    data: Buffer,
    name: string,
    numEntries: number,
    udf: boolean,
    userDataSize: number,
    flags: number,
    varintBitCount: boolean
  ) => {
    const bitreader = new BitBuffer(data);

    let idx = -1;
    let keys: string[] = [];
    const items: { idx: number; key: string; value: any }[] = [];
    for (let i = 0; i < numEntries; i++) {
      let key = "";
      let value: Buffer | null = null;
      if (bitreader.readBoolean()) {
        idx++;
      } else {
        idx += bitreader.readUbitVar() + 1;
      }

      if (bitreader.readBoolean()) {
        if (bitreader.readBoolean()) {
          let position = bitreader.ReadUBits(5);
          let length = bitreader.ReadUBits(5);

          if (position >= keys.length) {
            position = 0;

            key += bitreader.readString();
          } else {
            const someKey = keys[position];
            if (someKey) {
              if (length > someKey.length) {
                key += someKey + bitreader.readString();
              } else {
                key += someKey.substring(0, length) + bitreader.readString();
              }
            }
          }
        } else {
          key += bitreader.readString();
        }

        if (keys.length >= 32) {
          keys.shift();
        }

        keys.push(key);

        if (bitreader.readBoolean()) {
          let bits = 0;
          let isCompressed = false;

          if (udf) {
            bits = userDataSize;
          } else {
            if ((flags & 0x1) !== 0) {
              isCompressed = bitreader.readBoolean();
            }
            if (varintBitCount) {
              bits = bitreader.readUbitVar() * 8;
            } else {
              bits = bitreader.ReadUBits(17) * 8;
            }
          }

          value = Buffer.alloc(bits % 8 === 0 ? bits / 8 : 0);

          bitreader.readBytes(value);

          if (isCompressed && value?.length) {
            value = snappy.uncompressSync(value) as Buffer;
          }
        } else {
        }

        if (name === "userinfo" && value?.length) {
          const data = CMsgPlayerInfo.decode(value!);
          this.players[data.userid! & 0xff] = data;
        }

        if (name === "instancebaseline") {
        }

        items.push({ idx, key, value });
      }
    }

    return {
      data: items,
      name,
      user_data_size: userDataSize,
      userDataFixedSize: udf,
      flags,
      varintBitCount,
    };
  };

  private createStringTable = (
    createTableMessage: CSVCMsgCreateStringTable
  ) => {
    if (
      createTableMessage.name !== "instancebaseline" &&
      createTableMessage.name !== "userinfo"
    )
      return this._stringTables.push(undefined as any);
    const data = createTableMessage.dataCompressed
      ? (snappy.uncompressSync(
          Buffer.from(createTableMessage.stringData!)
        ) as Buffer)
      : Buffer.from(createTableMessage.stringData!);

    this._stringTables.push(
      this.parseStringTable(
        data,
        createTableMessage.name,
        createTableMessage.numEntries!,
        createTableMessage.userDataFixedSize!,
        createTableMessage.userDataSize!,
        createTableMessage.flags!,
        createTableMessage.usingVarintBitcounts!
      )
    );
  };

  private updateStringTable = (
    updateTableMessage: CSVCMsgUpdateStringTable
  ) => {
    const existing = this._stringTables[updateTableMessage.tableId!];

    if (!existing) {
     // console.log(updateTableMessage.tableId, this.stringTables.length);
      return;
    }
    /*const updated = this.parseStringTable(
      Buffer.from(updateTableMessage.stringData!),
      existing.name,
      updateTableMessage.numChangedEntries!,
      existing.userDataFixedSize,
      existing.user_data_size,
      existing.flags,
      existing.varintBitCount
    );
    //console.log("UPDATED TABLE")
    this._stringTables[updateTableMessage.tableId!] = updated;*/
  };

  private parsePacket = (packet: CDemoPacket) => {
    if (!packet.data) return;

    const data = new BitBuffer(packet.data);

    while (data.RemainingBytes > 8) {
      const cmd = data.readUbitVar();
      const size = data.ReadUVarInt32();

      const command = messages[cmd as keyof typeof messages];

      if (!command) {
        data.skipBytes(size);
        continue;
      }

      const msgContent = Buffer.alloc(size);
      data.readBytes(msgContent);
      switch (command.id) {
        case EBaseGameEvents.GE_Source1LegacyGameEventList:
          this.constructEventDescriptor(command.class.decode(msgContent));
          break;
        case EBaseGameEvents.GE_Source1LegacyGameEvent:
          this.parseGameEvent(command.class.decode(msgContent));
          break;
        case SVCMessages.svc_CreateStringTable:
          this.createStringTable(command.class.decode(msgContent));
          break;
        case SVCMessages.svc_UpdateStringTable:
          //console.log("REMAINING BTES", data.RemainingBytes, size);
          this.updateStringTable(command.class.decode(msgContent));
          break;
        case SVCMessages.svc_ClearAllStringTables:
          this._stringTables = [];
          break;
        default:
          break;
      }
    }
  };

  private parseFullPacket = (packet: CDemoFullPacket) => {
    if (!packet.packet?.data) return;

    this.parsePacket(packet.packet);
  };

  private readFrame = () => {
    this._ensureRemaining(6);
    const EDemoCommandTypeBase = this._bytebuffer.readVarint32();
    let tick = this._bytebuffer.readVarint32();
    if (tick === 0xffffffff) {
      tick = 0;
    }

    if(this.currentTick !== tick){
      this.emit("tickend", this.currentTick);
      this.currentTick = tick;
      this.emit("tickstart", this.currentTick);
    }

    const size = this._bytebuffer.readVarint32();
    this._ensureRemaining(size);

    const EDemoCommandType =
      EDemoCommandTypeBase & ~EDemoCommands.DEM_IsCompressed;

    if (EDemoCommandType === EDemoCommands.DEM_Stop) {
      this.cancel();
      this.emit("tickend", this.currentTick);
      this._emitEnd({ incomplete: false });
      return;
    }

    const decoder = decoders[EDemoCommandType as keyof typeof decoders];

    if (!decoder) {
      this._bytebuffer.skip(size);
      return;
    }
    const isCompressed =
      (EDemoCommandTypeBase & EDemoCommands.DEM_IsCompressed) !== 0;
    switch (decoder.type) {
      /*case EDemoCommands.DEM_StringTables:
        this.baseParse(
          decoder.decode,
          size,
          isCompressed,
          this.parseStringTables
        );
        break;*/
      case EDemoCommands.DEM_FileHeader:
        return this.baseParse(decoder.decode, size, isCompressed);
      case EDemoCommands.DEM_Packet:
      case EDemoCommands.DEM_SignonPacket:
        this.baseParse(decoder.decode, size, isCompressed, this.parsePacket);
        break;
      case EDemoCommands.DEM_FullPacket:
        this.baseParse(
          decoder.decode,
          size,
          isCompressed,
          this.parseFullPacket
        );
        break;
      default:
        this._bytebuffer.skip(size);
        break;
    }
  };

  private baseParse = <T extends Decoders[DecoderKeys]["decode"]>(
    decoder: T,
    size: number,
    isCompressed: boolean,
    parser?: (data: ReturnType<T>) => ReturnType<T> | void
  ) => {
    const bytes = this._bytebuffer.readBytes(size).toBuffer();
    const decompressedBytes = isCompressed
      ? (snappy.uncompressSync(bytes) as Buffer)
      : bytes;
    if(!parser) return decoder(decompressedBytes) as ReturnType<T>;
    return parser(decoder(decompressedBytes) as ReturnType<T>);
  };

  private _tryEnsureRemaining(bytes: number) {
    const remaining = this._bytebuffer.remaining();
    if (remaining >= bytes) return true;

    let left = bytes - remaining;
    for (let i = 0; i < this._chunks.length && left > 0; ++i)
      left -= this._chunks[i]!.length;

    // We don't have enough bytes with what we have buffered up
    if (left > 0) return false;

    const mark = Math.max(0, this._bytebuffer.markedOffset);
    const newOffset = this._bytebuffer.offset - mark;

    // Reset to the marked offset. We're never going to need the bytes preceding it
    this._bytebuffer.offset = mark;
    this._bytebuffer = ByteBuffer.wrap(
      Buffer.concat([
        new Uint8Array(this._bytebuffer.toBuffer()),
        ...this._chunks
      ]),
      true
    );
    this._chunks = [];

    // Advance to the point we'd already read up to
    this._bytebuffer.offset = newOffset;

    return true;
  }
  private _ensureRemaining(bytes: number) {
    if (!this._tryEnsureRemaining(bytes)) {
      throw new RangeError(
        `Not enough data to continue parsing. ${bytes} bytes needed`
      );
    }
  }

  parseStream = async (stream: Readable) => {
    this._stream = stream;
    const onChunk = (chunk: Buffer) => {
      if(this._bytebuffer === undefined){
        this._bytebuffer = ByteBuffer.wrap(chunk, 'utf-8');
        return;
      }
      this._chunks.push(chunk);
    }

    const onData = () => {

      try {
        while(this._bytebuffer.remaining() > 0 || this._chunks.length > 0){
          this._bytebuffer.mark();
          this.readFrame();
        }

      } catch(e) {
        if (e instanceof RangeError) {
          // Reset the byte buffer to the start of the last command
          this._bytebuffer.offset = Math.max(0, this._bytebuffer.markedOffset);
        } else {
          stream.off("data", onChunk);
          const error =
            e instanceof Error
              ? e
              : new Error(`Exception during parsing: ${e}`);
          this._emitEnd({ error, incomplete: false });
        }
      }
    }

    const readHeader = () => {
      if(!this._tryEnsureRemaining(4096)) return;

      stream.off("data", readHeader);
      this._bytebuffer.skip(16);
      const header = this.readFrame()!;

      this.emit("header", header);

      stream.on("data", onData);
    }

    stream.on("data", onChunk);
    stream.on("data", readHeader);

    stream.on("error", e => {
      stream.off("data", onChunk);
      this._emitEnd({ error: e, incomplete: false });
    });

    stream.on("end", () => {
      const fullyConsumed =
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        this._bytebuffer?.remaining() === 0 && this._chunks.length === 0;
      if (fullyConsumed) return;
    });
  }

  parseDemo = async (demo: string | Buffer) => {

    this._bytebuffer = ByteBuffer.wrap(
      (typeof demo === "string" ? await fs.readFile(demo) : demo).subarray(16),
      true
    );
    process.nextTick(this._parseRecurse);
  };

  private _emitEnd(e: any/*IDemoEndEvent*/) {
    if (this._hasEnded) return;

    if (e.error) {
      this.emit("error", e.error);
    }

    this.emit("end", e);
    this._hasEnded = true;
  }
  private _parseRecurse = () => {
    this._immediateTimerToken = timers.setImmediate(this._parseRecurse);
    this.readFrame();
    
    try {
      this.emit("progress", this._bytebuffer.offset / this._bytebuffer.limit);
      this.readFrame();
    } catch (e) {
      // Always cancel if we have an error - we've already scheduled the next tick
      this.cancel();

      
      // #11, #172: Some demos have been written incompletely.
      // Don't throw an error when we run out of bytes to read.
      if (
        e instanceof RangeError /*&&
        this.header.playbackTicks === 0 &&
        this.header.playbackTime === 0 &&
        this.header.playbackFrames === 0*/
      ) {
        this._emitEnd({ incomplete: true });
      } else {
        const error =
          e instanceof Error ? e : new Error(`Exception during parsing: ${e}`);
        this._emitEnd({ error, incomplete: false });
      }
    }
    
  };
  public cancel(): void {
    this._stream?.destroy();
    this._stream = null;
    if (this._immediateTimerToken) {
      timers.clearImmediate(this._immediateTimerToken);
      this._immediateTimerToken = null;
    }
    console.log("Parsed in", (process.hrtime.bigint() - this._parseStartTime)/1000000n +"ms");
  }
}
