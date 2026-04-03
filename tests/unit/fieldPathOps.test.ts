import { describe, test, expect } from 'bun:test';
import { doOp, popSpecial, type FieldPath } from '../../src/parser/entities/fieldPathOps.js';
import { BitBuffer } from '../../src/parser/ubitreader.js';

function makeFieldPath(path: number[] = [0, 0, 0, 0, 0, 0, 0], last = 0): FieldPath {
	return {
		path: path as [number, number, number, number, number, number, number],
		last
	};
}

function makeBitBuffer(...bytes: number[]): BitBuffer {
	// Pad to at least 4 bytes for BitBuffer constructor (needs to FetchNext)
	while (bytes.length < 4) bytes.push(0);
	return new BitBuffer(new Uint8Array(bytes));
}

describe('popSpecial', () => {
	test('pops n levels', () => {
		const fp = makeFieldPath([1, 2, 3, 4, 0, 0, 0], 3);
		popSpecial(fp, 2);
		expect(fp.last).toBe(1);
		expect(fp.path[2]).toBe(0);
		expect(fp.path[3]).toBe(0);
	});

	test('pops to root', () => {
		const fp = makeFieldPath([5, 10, 15, 0, 0, 0, 0], 2);
		popSpecial(fp, 2);
		expect(fp.last).toBe(0);
		expect(fp.path[1]).toBe(0);
		expect(fp.path[2]).toBe(0);
	});
});

describe('doOp - Plus operations', () => {
	test('opcode 0: plusOne', () => {
		const fp = makeFieldPath([5, 0, 0, 0, 0, 0, 0], 0);
		const br = makeBitBuffer();
		doOp(0, br, fp);
		expect(fp.path[0]).toBe(6);
	});

	test('opcode 1: plusTwo', () => {
		const fp = makeFieldPath([5, 0, 0, 0, 0, 0, 0], 0);
		const br = makeBitBuffer();
		doOp(1, br, fp);
		expect(fp.path[0]).toBe(7);
	});

	test('opcode 2: plusThree', () => {
		const fp = makeFieldPath([5, 0, 0, 0, 0, 0, 0], 0);
		const br = makeBitBuffer();
		doOp(2, br, fp);
		expect(fp.path[0]).toBe(8);
	});

	test('opcode 3: plusFour', () => {
		const fp = makeFieldPath([5, 0, 0, 0, 0, 0, 0], 0);
		const br = makeBitBuffer();
		doOp(3, br, fp);
		expect(fp.path[0]).toBe(9);
	});
});

describe('doOp - Push operations', () => {
	test('opcode 5: pushOneLeftDeltaZeroRightZero', () => {
		const fp = makeFieldPath([3, 0, 0, 0, 0, 0, 0], 0);
		const br = makeBitBuffer();
		doOp(5, br, fp);
		// Should push: last += 1, path[last] = 0
		expect(fp.last).toBe(1);
		expect(fp.path[0]).toBe(3); // unchanged
		expect(fp.path[1]).toBe(0);
	});

	test('opcode 7: pushOneLeftDeltaOneRightZero', () => {
		const fp = makeFieldPath([3, 0, 0, 0, 0, 0, 0], 0);
		const br = makeBitBuffer();
		doOp(7, br, fp);
		// path[last] += 1, then push
		expect(fp.path[0]).toBe(4);
		expect(fp.last).toBe(1);
		expect(fp.path[1]).toBe(0);
	});
});

describe('doOp - Pop operations', () => {
	test('opcode 27: popOnePlusOne', () => {
		const fp = makeFieldPath([5, 10, 0, 0, 0, 0, 0], 1);
		const br = makeBitBuffer();
		doOp(27, br, fp);
		// Pop 1 level, then path[last] += 1
		expect(fp.last).toBe(0);
		expect(fp.path[0]).toBe(6);
	});

	test('opcode 29: popAllButOnePlusOne', () => {
		const fp = makeFieldPath([5, 10, 15, 0, 0, 0, 0], 2);
		const br = makeBitBuffer();
		doOp(29, br, fp);
		// Pop all but one (pop 2 levels), then path[0] += 1
		expect(fp.last).toBe(0);
		expect(fp.path[0]).toBe(6);
	});
});

describe('doOp - NonTopological operations', () => {
	test('opcode 37: nonTopoPenultimatePlusOne', () => {
		const fp = makeFieldPath([5, 10, 15, 0, 0, 0, 0], 2);
		const br = makeBitBuffer();
		doOp(37, br, fp);
		// path[last-1] += 1
		expect(fp.path[1]).toBe(11);
		expect(fp.path[2]).toBe(15); // unchanged
	});
});

describe('doOp - End marker', () => {
	test('opcode 39: returns undefined (end)', () => {
		const fp = makeFieldPath();
		const br = makeBitBuffer();
		const result = doOp(39, br, fp);
		expect(result).toBeUndefined();
	});
});

describe('doOp - Invalid opcode', () => {
	test('throws on unknown opcode', () => {
		const fp = makeFieldPath();
		const br = makeBitBuffer();
		expect(() => doOp(40, br, fp)).toThrow();
	});
});
