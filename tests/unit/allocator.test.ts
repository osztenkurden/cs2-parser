import { describe, test, expect } from 'bun:test';
import { createAllocator } from '../../src/parser/entities/allocator.js';

describe('createAllocator', () => {
	test('allocates memory and returns a Uint8Array', () => {
		const allocator = createAllocator(1024);
		const view = allocator.alloc(64);
		expect(view).toBeInstanceOf(Uint8Array);
		expect(view.byteLength).toBe(64);
	});

	test('allocated memory is zero-filled', () => {
		const allocator = createAllocator(1024);
		const view = allocator.alloc(32);
		for (let i = 0; i < 32; i++) {
			expect(view[i]).toBe(0);
		}
	});

	test('stats reflect allocations', () => {
		const allocator = createAllocator(1024);
		const s0 = allocator.stats();
		expect(s0.totalBytes).toBe(1024);
		expect(s0.usedBytes).toBe(0);
		expect(s0.freeBytes).toBe(1024);

		allocator.alloc(100);
		const s1 = allocator.stats();
		expect(s1.usedBytes).toBe(100);
		expect(s1.freeBytes).toBe(924);
	});

	test('multiple allocations consume space', () => {
		const allocator = createAllocator(1024);
		allocator.alloc(100);
		allocator.alloc(200);
		allocator.alloc(300);
		const s = allocator.stats();
		expect(s.usedBytes).toBe(600);
		expect(s.freeBytes).toBe(424);
	});

	test('free returns memory', () => {
		const allocator = createAllocator(1024);
		const a = allocator.alloc(256);
		allocator.alloc(256);

		allocator.free(a);
		const s = allocator.stats();
		expect(s.usedBytes).toBe(256);
		expect(s.freeBytes).toBe(768);
	});

	test('coalesces adjacent free blocks', () => {
		const allocator = createAllocator(1024);
		const a = allocator.alloc(100);
		const b = allocator.alloc(100);
		const c = allocator.alloc(100);

		// Free b, then a -- should coalesce
		allocator.free(b);
		allocator.free(a);

		const s = allocator.stats();
		expect(s.usedBytes).toBe(100); // only c remains
		// Freeing a adjacent to free-b should coalesce into one block
		expect(s.blocks).toBeLessThanOrEqual(3); // free(200) + used(100) + free(624)
	});

	test('coalesces with next block when freeing', () => {
		const allocator = createAllocator(1024);
		const a = allocator.alloc(100);
		const b = allocator.alloc(100);

		allocator.free(b); // b becomes free, coalesces with remaining free space
		allocator.free(a); // a coalesces with (b + remaining)

		const s = allocator.stats();
		expect(s.usedBytes).toBe(0);
		expect(s.freeBytes).toBe(1024);
		expect(s.blocks).toBe(1); // fully coalesced back to single block
	});

	test('throws on alloc with size <= 0', () => {
		const allocator = createAllocator(1024);
		expect(() => allocator.alloc(0)).toThrow(RangeError);
		expect(() => allocator.alloc(-1)).toThrow(RangeError);
	});

	test('throws on out of memory', () => {
		const allocator = createAllocator(64);
		expect(() => allocator.alloc(128)).toThrow('Out of memory');
	});

	test('throws on double free', () => {
		const allocator = createAllocator(1024);
		const a = allocator.alloc(100);
		allocator.free(a);
		expect(() => allocator.free(a)).toThrow('Pointer not recognised or already freed');
	});

	test('can reuse freed memory', () => {
		const allocator = createAllocator(256);
		const a = allocator.alloc(200);
		allocator.free(a);
		// Should be able to allocate again after freeing
		const b = allocator.alloc(200);
		expect(b.byteLength).toBe(200);
	});

	test('uses default buffer size when none specified', () => {
		const allocator = createAllocator();
		const s = allocator.stats();
		expect(s.totalBytes).toBe(128 * 1024); // 128 KB default
	});
});
