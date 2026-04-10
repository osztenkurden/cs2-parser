import { describe, test, expect } from 'bun:test';
import { BitBuffer } from '../../src/parser/ubitreader.js';

function makeBuf(...bytes: number[]): BitBuffer {
	return new BitBuffer(new Uint8Array(bytes));
}

describe('BitBuffer', () => {
	describe('ReadUBits', () => {
		test('reads single bit', () => {
			// 0b00000001 = 1
			const bb = makeBuf(0x01);
			expect(bb.ReadUBits(1)).toBe(1);
			expect(bb.ReadUBits(1)).toBe(0);
		});

		test('reads 8 bits', () => {
			const bb = makeBuf(0xab);
			expect(bb.ReadUBits(8)).toBe(0xab);
		});

		test('reads 16 bits across byte boundary', () => {
			// Little-endian: 0x34, 0x12 -> 0x1234
			const bb = makeBuf(0x34, 0x12);
			expect(bb.ReadUBits(16)).toBe(0x1234);
		});

		test('reads 32 bits', () => {
			const bb = makeBuf(0x78, 0x56, 0x34, 0x12);
			expect(bb.ReadUBits(32)).toBe(0x12345678);
		});

		test('reads non-byte-aligned values', () => {
			// 0b10110100 = 0xb4
			const bb = makeBuf(0xb4);
			expect(bb.ReadUBits(3)).toBe(0b100); // lowest 3 bits
			expect(bb.ReadUBits(5)).toBe(0b10110); // next 5 bits
		});

		test('reads across 32-bit chunk boundary', () => {
			// 5 bytes = 40 bits, read 20 + 20
			const bb = makeBuf(0xff, 0xff, 0x0f, 0x00, 0x00);
			const first20 = bb.ReadUBits(20);
			expect(first20).toBe(0xfffff); // 20 bits of 1s
			const next20 = bb.ReadUBits(20);
			expect(next20).toBe(0);
		});
	});

	describe('readBoolean', () => {
		test('reads individual bits as booleans', () => {
			// 0b00000101 = 5: bits are 1, 0, 1, 0, 0, 0, 0, 0
			const bb = makeBuf(0x05);
			expect(bb.readBoolean()).toBe(true);
			expect(bb.readBoolean()).toBe(false);
			expect(bb.readBoolean()).toBe(true);
			expect(bb.readBoolean()).toBe(false);
		});
	});

	describe('ReadByte', () => {
		test('reads sequential bytes', () => {
			const bb = makeBuf(0x01, 0x02, 0x03);
			expect(bb.ReadByte()).toBe(0x01);
			expect(bb.ReadByte()).toBe(0x02);
			expect(bb.ReadByte()).toBe(0x03);
		});
	});

	describe('ReadUVarInt32', () => {
		test('reads single-byte varint', () => {
			// 0x05 -> value 5 (MSB not set)
			const bb = makeBuf(0x05);
			expect(bb.ReadUVarInt32()).toBe(5);
		});

		test('reads two-byte varint', () => {
			// 300 = 0b100101100
			// varint: 0b10101100 0b00000010 = 0xAC 0x02
			const bb = makeBuf(0xac, 0x02);
			expect(bb.ReadUVarInt32()).toBe(300);
		});

		test('reads max 5-byte varint', () => {
			// 0xFFFFFFFF encoded as varint
			// Each byte: 0xFF 0xFF 0xFF 0xFF 0x0F
			const bb = makeBuf(0xff, 0xff, 0xff, 0xff, 0x0f);
			expect(bb.ReadUVarInt32()).toBe(0xffffffff);
		});

		test('reads zero', () => {
			const bb = makeBuf(0x00);
			expect(bb.ReadUVarInt32()).toBe(0);
		});

		test('reads 128', () => {
			// 128 = 0x80 0x01
			const bb = makeBuf(0x80, 0x01);
			expect(bb.ReadUVarInt32()).toBe(128);
		});
	});

	describe('readVarInt32 (signed zigzag)', () => {
		test('reads positive values', () => {
			// zigzag: 1 -> encoded as 2 (varint 0x02)
			const bb = makeBuf(0x02);
			expect(bb.readVarInt32()).toBe(1);
		});

		test('reads negative values', () => {
			// zigzag: -1 -> encoded as 1 (varint 0x01)
			const bb = makeBuf(0x01);
			expect(bb.readVarInt32()).toBe(-1);
		});

		test('reads zero', () => {
			// zigzag: 0 -> encoded as 0
			const bb = makeBuf(0x00);
			expect(bb.readVarInt32()).toBe(0);
		});

		test('reads -2', () => {
			// zigzag: -2 -> encoded as 3 (varint 0x03)
			const bb = makeBuf(0x03);
			expect(bb.readVarInt32()).toBe(-2);
		});
	});

	describe('readString', () => {
		test('reads null-terminated string', () => {
			const bytes = [
				'H'.charCodeAt(0),
				'i'.charCodeAt(0),
				'!'.charCodeAt(0),
				0x00 // null terminator
			];
			const bb = makeBuf(...bytes);
			expect(bb.readString()).toBe('Hi!');
		});

		test('reads empty string', () => {
			const bb = makeBuf(0x00);
			expect(bb.readString()).toBe('');
		});

		test('reads UTF-8 4-byte sequences (emoji)', () => {
			const str = '_🆅🅸🅺_';
			const encoded = new TextEncoder().encode(str);
			const bb = makeBuf(...encoded, 0x00);
			expect(bb.readString()).toBe(str);
		});

		test('reads UTF-8 2-byte sequences (Latin accents)', () => {
			const str = 'café naïve';
			const encoded = new TextEncoder().encode(str);
			const bb = makeBuf(...encoded, 0x00);
			expect(bb.readString()).toBe(str);
		});

		test('reads UTF-8 3-byte sequences (Cyrillic)', () => {
			const str = 'Привет';
			const encoded = new TextEncoder().encode(str);
			const bb = makeBuf(...encoded, 0x00);
			expect(bb.readString()).toBe(str);
		});
	});

	describe('readBytes', () => {
		test('reads byte-aligned bytes', () => {
			const bb = makeBuf(0xaa, 0xbb, 0xcc, 0xdd);
			const out = Buffer.alloc(4);
			bb.readBytes(out);
			expect(out[0]).toBe(0xaa);
			expect(out[1]).toBe(0xbb);
			expect(out[2]).toBe(0xcc);
			expect(out[3]).toBe(0xdd);
		});

		test('reads non-byte-aligned bytes', () => {
			// Read 1 bit first, then read bytes
			const bb = makeBuf(0xff, 0x00, 0x00, 0x00, 0x00);
			bb.readBoolean(); // consume 1 bit
			const out = Buffer.alloc(2);
			bb.readBytes(out);
			// After reading bit 0 (=1), remaining bits shift:
			// 0xff >> 1 = 0x7f in first byte, then crosses boundary
			expect(out[0]).toBe(0x7f);
			expect(out[1]).toBe(0x00);
		});
	});

	describe('skipBytesBetter', () => {
		test('skips within current buffer', () => {
			const bb = makeBuf(0x01, 0x02, 0x03, 0x04, 0x05);
			bb.skipBytesBetter(2);
			expect(bb.ReadByte()).toBe(0x03);
		});

		test('skips across chunk boundary', () => {
			// 8 bytes total, skip first 5
			const bb = makeBuf(0x00, 0x00, 0x00, 0x00, 0x00, 0xaa, 0xbb, 0xcc);
			bb.skipBytesBetter(5);
			expect(bb.ReadByte()).toBe(0xaa);
		});
	});

	describe('readUbitVar', () => {
		test('reads small value (no high bits set)', () => {
			// Value 5: lowest 6 bits = 0b000101, bits 4&5 = 00 -> no extension
			const bb = makeBuf(0x05, 0x00, 0x00, 0x00);
			expect(bb.readUbitVar()).toBe(5);
		});
	});

	describe('readUbitVarFp', () => {
		test('reads 2-bit value when first boolean is true', () => {
			// First bit = 1 (true), then 2-bit value
			// 0b00000_11_1 = bits: 1(bool=true), 11(value=3)
			const bb = makeBuf(0b00000_111, 0x00, 0x00, 0x00);
			expect(bb.readUbitVarFp()).toBe(3);
		});
	});

	describe('readBitCoord', () => {
		test('reads zero (no int, no frac)', () => {
			// First 2 booleans = false, false
			const bb = makeBuf(0x00, 0x00, 0x00, 0x00);
			expect(bb.readBitCoord()).toBe(0);
		});
	});

	describe('decodeNormal', () => {
		test('reads positive normal', () => {
			// isNegative = false (bit 0 = 0), then 11 bits for length
			// 0b0_00000000001 packed into bytes (little-endian bits)
			// First bit: 0 (not negative)
			// Next 11 bits: value 1 -> 0b00000000001
			// Together: 0b00000000010 = 0x002
			const bb = makeBuf(0x02, 0x00, 0x00, 0x00);
			const result = bb.decodeNormal();
			// length=1, result = 1 * (1/2048 - 1) = 1/2048 - 1
			expect(result).toBeCloseTo(1 * (1 / 2048 - 1), 10);
		});

		test('reads negative normal', () => {
			// isNegative = true (bit 0 = 1), then 11 bits for length = 1
			// bits: 1 (negative), 10000000000 (length=1 in LE bit order)
			// byte 0: bit0=1, bits1-7=1000000 -> 0b00000011 = 0x03
			const bb = makeBuf(0x03, 0x00, 0x00, 0x00);
			const result = bb.decodeNormal();
			expect(result).toBeCloseTo(-(1 * (1 / 2048 - 1)), 10);
		});
	});

	describe('decodeNormalVec', () => {
		test('returns [0, 0, 1] when no X and no Y', () => {
			// hasX = false, hasY = false, neg_z = false
			const bb = makeBuf(0x00, 0x00, 0x00, 0x00);
			const v = bb.decodeNormalVec();
			expect(v[0]).toBe(0);
			expect(v[1]).toBe(0);
			expect(v[2]).toBeCloseTo(1.0, 10);
		});

		test('returns [0, 0, -1] when neg_z', () => {
			// hasX = false (0), hasY = false (0), neg_z = true (1)
			// Bits: 0, 0, 1 -> 0b100 = 0x04
			const bb = makeBuf(0x04, 0x00, 0x00, 0x00);
			const v = bb.decodeNormalVec();
			expect(v[0]).toBe(0);
			expect(v[1]).toBe(0);
			expect(v[2]).toBeCloseTo(-1.0, 10);
		});
	});

	describe('decodeQangleVariant', () => {
		test('returns [0, 0, 0] when no axes set', () => {
			const bb = makeBuf(0x00, 0x00, 0x00, 0x00);
			const result = bb.decodeQangleVariant();
			expect(result).toEqual([0, 0, 0]);
		});
	});

	describe('RemainingBytes / RemainingBits', () => {
		test('reports correct remaining after reads', () => {
			const bb = makeBuf(0x01, 0x02, 0x03, 0x04);
			expect(bb.RemainingBits).toBe(32);
			expect(bb.RemainingBytes).toBe(4);
			bb.ReadByte();
			expect(bb.RemainingBits).toBe(24);
			expect(bb.RemainingBytes).toBe(3);
		});
	});

	describe('readUVarInt64', () => {
		test('reads small 64-bit value', () => {
			const bb = makeBuf(0x05);
			expect(bb.readUVarInt64()).toBe(5n);
		});

		test('reads larger 64-bit value', () => {
			// 300 as varint: 0xAC 0x02
			const bb = makeBuf(0xac, 0x02);
			expect(bb.readUVarInt64()).toBe(300n);
		});
	});

	describe('setTo', () => {
		test('resets to new buffer', () => {
			const bb = makeBuf(0x01, 0x02);
			bb.ReadByte(); // read 1 byte
			bb.setTo(new Uint8Array([0xaa, 0xbb]));
			expect(bb.ReadByte()).toBe(0xaa);
			expect(bb.ReadByte()).toBe(0xbb);
		});
	});
});
