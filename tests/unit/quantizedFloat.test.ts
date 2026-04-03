import { describe, test, expect } from 'bun:test';
import { getQuantalizedFloat } from '../../src/parser/entities/quantizedFloat.js';

const QFF_ROUNDDOWN = 1 << 0;
const QFF_ROUNDUP = 1 << 1;
const QFF_ENCODE_ZERO = 1 << 2;
const QFF_ENCODE_INTEGERS = 1 << 3;

describe('getQuantalizedFloat', () => {
	test('returns no_scale for bitcount 0', () => {
		const qf = getQuantalizedFloat(0);
		expect(qf.no_scale).toBe(true);
		expect(qf.bit_count).toBe(32);
	});

	test('returns no_scale for bitcount >= 32', () => {
		const qf = getQuantalizedFloat(32);
		expect(qf.no_scale).toBe(true);
		expect(qf.bit_count).toBe(32);
	});

	test('basic float with no flags', () => {
		const qf = getQuantalizedFloat(8, 0, 0.0, 1.0);
		expect(qf.no_scale).toBe(false);
		expect(qf.bit_count).toBe(8);
		expect(qf.low).toBe(0.0);
		expect(qf.high).toBe(1.0);
		expect(qf.dec_mul).toBeCloseTo(1 / 255, 10);
		expect(qf.high_low_mul).toBeGreaterThan(0);
	});

	test('ROUNDDOWN adjusts high value', () => {
		const qf = getQuantalizedFloat(8, QFF_ROUNDDOWN, 0.0, 256.0);
		// With ROUNDDOWN, high should be reduced by range/steps
		expect(qf.high).toBeLessThan(256.0);
		expect(qf.offset).toBeGreaterThan(0);
	});

	test('ROUNDUP adjusts low value', () => {
		const qf = getQuantalizedFloat(8, QFF_ROUNDUP, 0.0, 256.0);
		// With ROUNDUP, low should be increased by range/steps
		expect(qf.low).toBeGreaterThan(0.0);
		expect(qf.offset).toBeGreaterThan(0);
	});

	test('ENCODE_INTEGERS may increase bit count', () => {
		const qf = getQuantalizedFloat(4, QFF_ENCODE_INTEGERS, 0.0, 100.0);
		// ENCODE_INTEGERS clears ROUNDUP, ROUNDDOWN, ENCODE_ZERO
		expect(qf.flags & QFF_ROUNDDOWN).toBe(0);
		expect(qf.flags & QFF_ROUNDUP).toBe(0);
		expect(qf.flags & QFF_ENCODE_ZERO).toBe(0);
		// bit_count should be >= original 4
		expect(qf.bit_count).toBeGreaterThanOrEqual(4);
	});

	test('ENCODE_ZERO flag validation with low=0', () => {
		// When low=0 and ENCODE_ZERO is set, it should be converted to ROUNDDOWN
		const qf = getQuantalizedFloat(8, QFF_ENCODE_ZERO, 0.0, 100.0);
		expect(qf.flags & QFF_ENCODE_ZERO).toBe(0);
	});

	test('ENCODE_ZERO flag validation with high=0', () => {
		// When high=0 and ENCODE_ZERO is set, it should be converted to ROUNDUP
		const qf = getQuantalizedFloat(8, QFF_ENCODE_ZERO, -100.0, 0.0);
		expect(qf.flags & QFF_ENCODE_ZERO).toBe(0);
	});

	test('ENCODE_ZERO cleared when range does not include zero', () => {
		const qf = getQuantalizedFloat(8, QFF_ENCODE_ZERO, 10.0, 100.0);
		expect(qf.flags & QFF_ENCODE_ZERO).toBe(0);
	});

	test('multipliers are positive for valid ranges', () => {
		const qf = getQuantalizedFloat(16, 0, -1000.0, 1000.0);
		expect(qf.high_low_mul).toBeGreaterThan(0);
		expect(qf.dec_mul).toBeGreaterThan(0);
	});

	test('dec_mul is 1/(steps-1)', () => {
		const qf = getQuantalizedFloat(10, 0, 0.0, 1.0);
		const steps = 1 << 10;
		expect(qf.dec_mul).toBeCloseTo(1 / (steps - 1), 10);
	});

	test('no flags provided defaults to 0', () => {
		const qf = getQuantalizedFloat(8, undefined, 0.0, 1.0);
		expect(qf.flags).toBe(0);
	});
});
