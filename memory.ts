import { heapStats } from 'bun:jsc';
console.log(heapStats());
// Allocate 1MB buffer
const BUFFER_SIZE = 1024 * 1024 * 10; // 1MB
const buffer = new ArrayBuffer(BUFFER_SIZE);

// Array to store slices and prevent garbage collection
const slices: Uint8Array[] = [];

let currentSize = BUFFER_SIZE;
let intervalCount = 0;

console.log(`Initial buffer allocated: ${BUFFER_SIZE} bytes`);

// Create interval that runs every second
const interval = setInterval(() => {
	intervalCount++;

	// Create slice that is one byte less than previous
	if (currentSize > 0) {
		const slice = new Uint8Array(buffer, 0, currentSize);
		slices.push(slice);

		console.log(`Interval ${intervalCount}: Created slice of ${currentSize} bytes, total slices: ${slices.length}`);
		console.log('Heap size:', `${heapStats().heapSize} ${process.memoryUsage().heapUsed / 1024 ** 2}`);

		currentSize--;
	} else {
		console.log(`All bytes processed! Total slices created: ${slices.length}`);
		clearInterval(interval);

		// Optional: Show memory usage info
		console.log(`Final array contains ${slices.length} slices preventing GC`);
		console.log(`Smallest slice size: ${slices[slices.length - 1].length} bytes`);
		console.log(`Largest slice size: ${slices[0].length} bytes`);
	}
}, 1000); // Run every 1000ms (1 second)

// Optional: Add graceful shutdown
process.on('SIGINT', () => {
	console.log('\nShutting down...');
	clearInterval(interval);
	console.log(`Created ${slices.length} slices before shutdown`);
	process.exit(0);
});
