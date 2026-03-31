const BUFFER_SIZE = 128 * 1024; // 128 KB

function createAllocator(bufferSize = BUFFER_SIZE) {
	const buffer = Buffer.alloc(bufferSize);

	// Each block: { offset, size, free }
	const blocks = [{ offset: 0, size: bufferSize, free: true }];

	function alloc(size: number) {
		if (size <= 0) throw new RangeError('size must be > 0');

		// First-fit search through free blocks
		const idx = blocks.findIndex(b => b.free && b.size >= size);
		if (idx === -1) throw new Error(`Out of memory: cannot allocate ${size} bytes`);

		const block = blocks[idx]!;

		// Split the block if there is leftover space
		if (block.size > size) {
			blocks.splice(idx + 1, 0, {
				offset: block.offset + size,
				size: block.size - size,
				free: true
			});
		}

		block.size = size;
		block.free = false;

		// Return a zero-filled view into the shared buffer
		const view = new Uint8Array(buffer.buffer, block.offset, size);
		view.fill(0);
		return view;
	}

	function free(view: Uint8Array) {
		if (!(view instanceof Uint8Array)) throw new TypeError('Expected a Uint8Array');

		const offset = view.byteOffset;
		const idx = blocks.findIndex(b => b.offset === offset && !b.free);
		if (idx === -1) throw new Error('Pointer not recognised or already freed');

		blocks[idx]!.free = true;

		// Coalesce with the next block if it is also free
		if (idx + 1 < blocks.length && blocks[idx + 1]!.free) {
			blocks[idx]!.size += blocks[idx + 1]!.size;
			blocks.splice(idx + 1, 1);
		}

		// Coalesce with the previous block if it is also free
		if (idx > 0 && blocks[idx - 1]!.free) {
			blocks[idx - 1]!.size += blocks[idx]!.size;
			blocks.splice(idx, 1);
		}
	}

	function stats() {
		const used = blocks.filter(b => !b.free).reduce((s, b) => s + b.size, 0);
		return {
			totalBytes: bufferSize,
			usedBytes: used,
			freeBytes: bufferSize - used,
			blocks: blocks.length
		};
	}

	return { alloc, free, stats };
}

export { createAllocator };
