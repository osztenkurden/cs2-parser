const bitMask = new Uint32Array(33);
for (let i = 1; i < bitMask.length - 1; ++i) {
  bitMask[i] = (1 << i) - 1;
}
bitMask[32] = 0xffffffff;
export class BitBuffer {
  private static readonly BitMask: Uint32Array = bitMask;
  private _bitsAvail: number = 0;
  private _buf: number = 0;
  private _pointer: Uint8Array;
  private _byteOffset: number = 0;

  constructor(pointer: Uint8Array) {
    this._pointer = pointer;
    this.FetchNext();
  }

  public readString() {
    const s = [];

    while(true){
      const c = this.ReadByte();
      if(c === 0) break;

      s.push(String.fromCharCode(c));
    }

    return s.join('');
  }

  public get RemainingBytes(): number {
    return (
      this._pointer.length - this._byteOffset + Math.floor(this._bitsAvail / 8)
    );
  }

  private FetchNext() {
    this._bitsAvail =
      this._pointer.length - this._byteOffset >= 4
        ? 32
        : (this._pointer.length - this._byteOffset) * 8;
    this.UpdateBuffer();
  }

  public ReadUBits(numBits: number): number {
    if (this._bitsAvail >= numBits) {
      const ret = this._buf & BitBuffer.BitMask[numBits]!;
      this._bitsAvail -= numBits;
      if (this._bitsAvail !== 0) {
        this._buf >>>= numBits;
      } else {
        this.FetchNext();
      }
      return ret;
    } else {
      let ret = this._buf;
      numBits -= this._bitsAvail;

      this.UpdateBuffer();

      ret |= (this._buf & BitBuffer.BitMask[numBits]!) << this._bitsAvail;
      this._bitsAvail = 32 - numBits;
      this._buf >>>= numBits;

      return ret;
    }
  }
  public readBoolean() {
    return this.ReadUBits(1) !== 0;
  }

  public ReadByte(): number {
    return this.ReadUBits(8) & 0xff;
  }

  private UpdateBuffer() {
    if (this._pointer.length - this._byteOffset < 4) {
      let buf = new Uint8Array(4);
      for (let i = 0; i < 4; ++i) {
        buf[i] =
          i < this._pointer.length - this._byteOffset
            ? this._pointer[this._byteOffset + i]!
            : 0;
      }
      this._buf = new DataView(buf.buffer).getUint32(0, true);
      this._byteOffset = this._pointer.length;
    } else {
      this._buf = new DataView(
        this._pointer.buffer,
        this._pointer.byteOffset + this._byteOffset,
        4
      ).getUint32(0, true);
      this._byteOffset += 4;
    }
  }

  readBytes = (outputBuffer: Buffer) => {
    for (let i = 0; i < outputBuffer.length; i++) {
      outputBuffer[i] = this.ReadByte();
    }
  };

  skipBytes = (bytes: number) => {
    for (let i = 0; i < bytes; i++) {
      this.ReadByte();
    }
  }

  public readUbitVar = () => {
    let ret = this.ReadUBits(6);
    switch (ret & (16 | 32)) {
      case 16:
        ret = (ret & 15) | (this.ReadUBits(4) << 4);
        break;
      case 32:
        ret = (ret & 15) | (this.ReadUBits(8) << 4);
        break;
      case 48:
        ret = (ret & 15) | (this.ReadUBits(32 - 4) << 4);
        break;
    }
    return ret;
  };
  public ReadUVarInt32(): number {
    let result = 0;
    let shift = 0;
    let byteRead: number;

    do {
      byteRead = this.ReadByte();
      result |= (byteRead & 0x7f) << shift;
      shift += 7;
    } while ((byteRead & 0x80) !== 0);

    return result;
  }
}
