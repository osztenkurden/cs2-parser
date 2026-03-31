const bitMask = new Uint32Array(32);
for (let i = 1; i < 32; ++i) {
	bitMask[i] = (1 << i) - 1;
}
// Internal 33-element mask for hot-path use (avoids branches for 0 and 32)
const MASK = new Uint32Array(33);
for (let i = 1; i < 32; ++i) {
	MASK[i] = (1 << i) - 1;
}
MASK[32] = 0xffffffff;
export class BitBuffer {
	private static readonly BitMask = bitMask;
	public _bitsAvail = 0;
	public _buf = 0;
	private _pointer: Uint8Array;
	_byteOffset = 0;
	_sumReadBits = 0;
	private _uintbuffer: Buffer;
	private _bufArray: Uint8Array;
	private _bufArrayView: DataView;
	private _pointerView: DataView;

	constructor(pointer: Uint8Array) {
		this._pointer = pointer;
		this._pointerView = new DataView(this._pointer.buffer);
		this._uintbuffer = Buffer.alloc(8);
		this._bufArray = new Uint8Array(4);
		this._bufArrayView = new DataView(this._bufArray.buffer);
		this.FetchNext();
	}

	setTo(newPointer: Uint8Array) {
		this._pointer = newPointer;
		this._pointerView = new DataView(newPointer.buffer);
		this._buf = 0;
		this._bitsAvail = 0;
		this._byteOffset = 0;
		this._sumReadBits = 0;

		this.FetchNext();
		return this;
	}

	public readString() {
		const s = [];

		while (true) {
			const c = this.ReadByte();
			if (c === 0) break;

			s.push(String.fromCharCode(c));
		}

		return s.join('');
	}

	public get RemainingBytes() {
		return this._pointer.length - this._byteOffset + Math.floor(this._bitsAvail / 8);
	}

	public get RemainingBits() {
		return (this._pointer.length - this._byteOffset) * 8 + this._bitsAvail;
	}

	private FetchNext() {
		this._bitsAvail =
			this._pointer.length - this._byteOffset >= 4 ? 32 : (this._pointer.length - this._byteOffset) * 8;
		this.UpdateBuffer();
	}
	public PeekUBitsWithLog(numBits: number): number {
		if (this._bitsAvail >= numBits) {
			return (this._buf & MASK[numBits]!) >>> 0;
		} else {
			let ret = this._buf;
			const remainingBits = numBits - this._bitsAvail;

			// SIMULATING UPDATE BUFFER, WITHOUT REALLY MODIFYING THE READER
			let selfBuf = 0;
			const bytesToRead = Math.min(this._pointer.length - this._byteOffset, 4);

			for (let i = 0; i < bytesToRead; i++) {
				selfBuf |= this._pointer[this._byteOffset + i]! << (i * 8);
			}

			ret |= (selfBuf & MASK[remainingBits]!) << this._bitsAvail;

			return ret >>> 0;
		}
	}
	public ReadUBits(numBits: number) {
		this._sumReadBits += numBits;
		if (this._bitsAvail >= numBits) {
			const ret = numBits === 32 ? this._buf >>> 0 : this._buf & BitBuffer.BitMask[numBits]!;
			this._bitsAvail -= numBits;
			if (this._bitsAvail !== 0) {
				this._buf >>>= numBits;
			} else {
				this.FetchNext();
			}
			return ret >>> 0;
		}
		return this._readUBitsSlow(numBits);
	}
	private _readUBitsSlow(numBits: number) {
		let ret = this._buf;
		const savedBitsAvail = this._bitsAvail;
		numBits -= this._bitsAvail;

		const remainingBytes = this._pointer.length - this._byteOffset;
		const nextChunkBits = Math.min(remainingBytes, 4) * 8;

		this.UpdateBuffer();

		ret |= (this._buf & MASK[numBits]!) << savedBitsAvail;
		this._bitsAvail = nextChunkBits - numBits;
		this._buf >>>= numBits;

		return ret >>> 0;
	}
	public readBoolean() {
		this._sumReadBits++;
		if (this._bitsAvail <= 0) this.FetchNext();
		const ret = this._buf & 1;
		this._bitsAvail--;
		if (this._bitsAvail !== 0) {
			this._buf >>>= 1;
		} else {
			this.FetchNext();
		}
		return ret !== 0;
	}

	public ReadByte() {
		return this.ReadUBits(8);
	}

	private UpdateBuffer() {
		if (this._pointer.length - this._byteOffset < 4) {
			for (let i = 0; i < 4; ++i) {
				this._bufArray[i] =
					i < this._pointer.length - this._byteOffset ? this._pointer[this._byteOffset + i]! : 0;
			}
			this._buf = this._bufArrayView.getUint32(0, true);
			this._byteOffset = this._pointer.length;
		} else {
			this._buf = this._pointerView.getUint32(this._pointer.byteOffset + this._byteOffset, true);
			this._byteOffset += 4;
		}
	}

	readBytes = (outputBuffer: Buffer | Uint8Array<ArrayBuffer>) => {
		this._readBytesInto(outputBuffer, outputBuffer.length);
	};

	readBytesToSlice = (outputBuffer: Uint8Array, size: number) => {
		this._readBytesInto(outputBuffer, size);
		return outputBuffer.subarray(0, size);
	};

	private _readBytesInto(out: Uint8Array, size: number) {
		let written = 0;

		// Phase 1: drain whole bytes from current bit buffer
		while (this._bitsAvail >= 8 && written < size) {
			out[written++] = this._buf & 0xff;
			this._buf >>>= 8;
			this._bitsAvail -= 8;
		}

		if (written >= size) {
			this._sumReadBits += size * 8;
			if (this._bitsAvail === 0) this.FetchNext();
			return;
		}

		if (this._bitsAvail === 0) {
			// Phase 2a: byte-aligned — direct memcpy from source
			const direct = Math.min(size - written, this._pointer.length - this._byteOffset);
			if (direct > 0) {
				out.set(this._pointer.subarray(this._byteOffset, this._byteOffset + direct), written);
				written += direct;
				this._byteOffset += direct;
			}
			this._sumReadBits += size * 8;
			this.FetchNext();
		} else {
			// Phase 2b: non-byte-aligned — shift-copy loop
			// Each output byte = carry_low_bits | (src_byte << shift)
			const shift = this._bitsAvail; // 1-7 bits in carry
			const invShift = 8 - shift;
			let carry = this._buf; // low 'shift' bits are valid
			const bytesNeeded = size - written;
			const available = this._pointer.length - this._byteOffset;
			const count = Math.min(bytesNeeded, available);

			for (let i = 0; i < count; i++) {
				const src = this._pointer[this._byteOffset + i]!;
				out[written + i] = (carry | (src << shift)) & 0xff;
				carry = src >>> invShift;
			}

			written += count;
			this._byteOffset += count;
			this._buf = carry;
			// _bitsAvail stays the same (shift bits in carry)
			this._sumReadBits += size * 8;
		}
	}

	skipBytesBetter = (bytes: number) => {
		const bitsToSkip = bytes * 8;
		this._sumReadBits += bitsToSkip;

		if (bitsToSkip <= this._bitsAvail) {
			// Skip entirely within current buffer
			this._bitsAvail -= bitsToSkip;
			if (this._bitsAvail !== 0) {
				this._buf >>>= bitsToSkip;
			} else {
				this.FetchNext();
			}
			return;
		}

		// Compute new absolute bit position and jump
		const currentBitPos = this._byteOffset * 8 - this._bitsAvail;
		const newBitPos = currentBitPos + bitsToSkip;
		const alignedByteOffset = (newBitPos >>> 5) << 2; // floor(newBitPos/32)*4
		const bitsIntoChunk = newBitPos & 31;

		this._byteOffset = alignedByteOffset;
		this.FetchNext();

		if (bitsIntoChunk > 0) {
			this._bitsAvail -= bitsIntoChunk;
			this._buf >>>= bitsIntoChunk;
		}
	};

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
				ret = ((ret & 15) | ((this.ReadUBits(32 - 4) << 4) >>> 0)) >>> 0;
				break;
		}
		return ret >>> 0;
	};
	public ReadUVarInt32() {
		let result = 0;
		let count = 0;
		let byteRead: number;

		do {
			if (count >= 5) {
				return result >>> 0;
			}
			byteRead = this.ReadByte();
			result |= (byteRead & 0x7f) << (7 * count);
			count++;
		} while ((byteRead & 0x80) !== 0);

		return result >>> 0;
	}
	readUbitVarFp() {
		if (this.readBoolean()) return this.ReadUBits(2);
		if (this.readBoolean()) return this.ReadUBits(4);
		if (this.readBoolean()) return this.ReadUBits(10);
		if (this.readBoolean()) return this.ReadUBits(17);
		return this.ReadUBits(31);
	}
	readVarInt32() {
		const val = this.ReadUVarInt32();
		const x = val | 0; // Convert to 32-bit signed integer (equivalent to truncate + bitcast)
		let mut = x >> 1;

		if ((x & 1) !== 0) {
			mut = ~mut;
		}

		return mut;
	}
	readUVarInt64() {
		let result = 0n; // Use BigInt for 64-bit precision
		let count = 0;
		let b = 0;
		let s = 0n;
		while (true) {
			b = this.ReadUBits(8);

			if (b < 0x80) {
				if (count > 9 || (count === 9 && b > 1)) {
					throw new Error('MALFORMED U64');
				}
				return result | (BigInt(b) << s);
			}

			result |= BigInt(b & 127) << s;
			count = count + 1;

			if ((b & 0x80) === 0) {
				break;
			}

			s = s + 7n;
		}

		return result;
	}
	decudeUint64() {
		const bytes = this._uintbuffer;
		this.readBytes(bytes);
		return bytes.readBigUInt64LE(0);
	}
	decode_noscale() {
		return this.ReadUBits(32);
	}
	decodeVectorNoScale() {
		const val = [this.decode_noscale(), this.decode_noscale(), this.decode_noscale()];
		return val;
	}
	decodeQangleAll3() {
		return [this.decode_noscale(), this.decode_noscale(), this.decode_noscale()];
	}

	readAngle(n: number) {
		return this.decode_noscale() / (1 << n);
	}

	decodeQanglePitchYaw() {
		return [this.readAngle(32), this.readAngle(32), this.readAngle(32)];
	}

	decodeFloatCoord() {
		return this.readBitCoord();
	}

	decodeVectorFloatCoord() {
		return [this.decodeFloatCoord(), this.decodeFloatCoord(), this.decodeFloatCoord()];
	}

	readBitCoord() {
		let intVal = 0;
		let fracVal = 0;

		const int2 = this.readBoolean();
		const f2 = this.readBoolean();

		if (!int2 && !f2) {
			return 0;
		}

		const sign = this.readBoolean();

		if (int2) {
			intVal = this.ReadUBits(14) + 1;
		}

		if (f2) {
			fracVal = this.ReadUBits(5);
		}

		const resol = 1 / 32;
		const result = Math.fround(intVal + fracVal * resol);

		if (sign) return -result;
		return result;
	}

	readBitCoordPres() {
		return (this.ReadUBits(20) * 360) / (1 << 20) - 180;
	}

	decodeAmmo() {
		const ammo = this.ReadUVarInt32();
		if (ammo > 0) return ammo - 1;
		return ammo;
	}

	decodeNormal() {
		const isNegative = this.readBoolean();
		const length = this.ReadUBits(11);

		const result = length * (1 / 2048 - 1);
		if (isNegative) return -result;
		return result;
	}

	decodeNormalVec() {
		const v = [0, 0, 0];
		const hasX = this.readBoolean();
		const hasY = this.readBoolean();
		if (hasX) v[0] = this.decodeNormal();
		if (hasY) v[1] = this.decodeNormal();

		const neg_z = this.readBoolean();

		const prod_sum = v[0]! ** 2 + v[1]! ** 2;
		if (prod_sum < 1) {
			v[2] = Math.sqrt(1 - prod_sum);
		} else {
			v[2] = 0;
		}

		if (neg_z) {
			v[2] = -v[2];
		}
		return v;
	}

	decodeQangleVariant() {
		const hasX = this.readBoolean();
		const hasY = this.readBoolean();
		const hasZ = this.readBoolean();
		const result = [0, 0, 0];

		if (hasX) result[0] = this.readBitCoord();
		if (hasY) result[1] = this.readBitCoord();
		if (hasZ) result[2] = this.readBitCoord();

		return result;
	}

	decodeQangleVariantPres() {
		const hasX = this.readBoolean();
		const hasY = this.readBoolean();
		const hasZ = this.readBoolean();
		const result = [0, 0, 0];

		if (hasX) result[0] = this.readBitCoordPres();
		if (hasY) result[1] = this.readBitCoordPres();
		if (hasZ) result[2] = this.readBitCoordPres();

		return result;
	}
}
