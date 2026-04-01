import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { DemoReader, EntityMode } from '../src/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUTPUT = path.join(ROOT, 'benchmark.md');
const demoPath = process.argv[2] ?? 'E:/Repositories/demofile-net-main/demos/14140.dem';

type Result = {
	label: string;
	time: string;
	ms: number;
	rss: string;
	heap: string;
	blocking: string;
	entities: number;
	tick: number;
};

const stat = fs.statSync(demoPath);
const sizeBytes = stat.size;
const sizeMB = (sizeBytes / 1024 / 1024).toFixed(0);

function mbPerSec(result: Result): string {
	return ((sizeBytes / 1024 / 1024) / (result.ms / 1000)).toFixed(1) + ' MB/s';
}

function collect(p: DemoReader, ms: number): Omit<Result, 'label' | 'blocking'> {
	const mem = process.memoryUsage();
	return {
		time: (ms / 1000).toFixed(1) + 's',
		ms,
		rss: (mem.rss / 1024 / 1024).toFixed(0) + 'MB',
		heap: (mem.heapUsed / 1024 / 1024).toFixed(0) + 'MB',
		entities: p.entities.filter(Boolean).length,
		tick: p.currentTick
	};
}

async function runBenchmark(
	label: string,
	blocking: boolean,
	fn: (p: DemoReader) => void | Promise<void>
): Promise<Result> {
	// Brief pause to let GC settle between runs
	global.gc?.();
	await new Promise(resolve => setTimeout(resolve, 200));

	const p = new DemoReader();
	const start = performance.now();
	await fn(p);
	const ms = performance.now() - start;
	return { label, blocking: blocking ? 'yes' : 'no', ...collect(p, ms) };
}

console.log(`Benchmarking: ${path.basename(demoPath)} (${sizeMB} MB)\n`);

// --- Entity Mode Comparison (streaming, default behavior) ---
console.log('=== Entity Mode Comparison (stream) ===');

const modeResults: Result[] = [];

for (const [label, entityMode] of [
	['`EntityMode.NONE`', undefined],
	['`EntityMode.ONLY_GAME_RULES`', EntityMode.ONLY_GAME_RULES],
	['`EntityMode.ALL`', EntityMode.ALL]
] as const) {
	process.stdout.write(`  ${label}...`);
	const r = await runBenchmark(label, false, async p => {
		await p.parseDemo(demoPath, entityMode !== undefined ? { entities: entityMode } : undefined);
	});
	modeResults.push(r);
	console.log(` ${mbPerSec(r)} | ${r.time} | ${r.rss} RSS | ${r.heap} heap | ${r.entities} entities`);
}

// --- Parse Method Comparison (all with EntityMode.ALL) ---
console.log('\n=== Parse Method Comparison (EntityMode.ALL) ===');

const methodBenchmarks: { label: string; blocking: boolean; fn: (p: DemoReader) => void | Promise<void> }[] = [
	{
		label: '`parseDemo(path)`',
		blocking: false,
		fn: async p => { await p.parseDemo(demoPath, { entities: EntityMode.ALL }); }
	},
	{
		label: '`parseDemo(path, {stream: false})`',
		blocking: true,
		fn: p => { p.parseDemo(demoPath, { entities: EntityMode.ALL, stream: false }); }
	},
	{
		label: '`parseDemo(buffer)`',
		blocking: true,
		fn: p => { p.parseDemo(fs.readFileSync(demoPath), { entities: EntityMode.ALL }); }
	},
	{
		label: '`parseDemo(stream)`',
		blocking: false,
		fn: async p => { await p.parseDemo(fs.createReadStream(demoPath), { entities: EntityMode.ALL }); }
	}
];

const methodResults: Result[] = [];
for (const b of methodBenchmarks) {
	process.stdout.write(`  ${b.label}...`);
	const r = await runBenchmark(b.label, b.blocking, b.fn);
	methodResults.push(r);
	console.log(` ${mbPerSec(r)} | ${r.time} | ${r.rss} RSS | ${r.heap} heap`);
}

// --- Validation ---
const allResults = [...modeResults, ...methodResults];
const ticks = new Set(allResults.map(r => r.tick));
if (ticks.size !== 1) {
	console.error('\nINCONSISTENT TICK COUNTS!');
	for (const r of allResults) console.error(`  ${r.label}: tick=${r.tick} entities=${r.entities}`);
	process.exit(1);
}
const methodEnts = new Set(methodResults.map(r => r.entities));
if (methodEnts.size !== 1) {
	console.error('\nINCONSISTENT ENTITY COUNTS (method comparison)!');
	for (const r of methodResults) console.error(`  ${r.label}: entities=${r.entities}`);
	process.exit(1);
}

// --- Output ---
const cpuModel = os.cpus()[0]?.model?.trim() ?? 'Unknown CPU';
const lines = [
	'# Benchmark Results',
	'',
	`CPU: ${cpuModel}`,
	`Demo: \`${path.basename(demoPath)}\` (${sizeMB} MB, ${modeResults[0]!.tick.toLocaleString()} ticks)`,
	'',
	'## Entity Mode Comparison',
	'',
	'| Mode | Throughput | Time | RSS | Heap | Entities |',
	'| --- | --- | --- | --- | --- | --- |',
	...modeResults.map(r => `| ${r.label} | ${mbPerSec(r)} | ${r.time} | ${r.rss} | ${r.heap} | ${r.entities} |`),
	'',
	'`ONLY_GAME_RULES` parses entities but only stores game rules — enables synthetic `round_start`/`round_end` events without full entity tracking overhead.',
	'',
	'## Parse Method Comparison (EntityMode.ALL)',
	'',
	'| Method | Throughput | Time | RSS | Heap | Blocking |',
	'| --- | --- | --- | --- | --- | --- |',
	...methodResults.map(r => `| ${r.label} | ${mbPerSec(r)} | ${r.time} | ${r.rss} | ${r.heap} | ${r.blocking} |`),
	''
];

fs.writeFileSync(OUTPUT, lines.join('\n'));
console.log(`\nWritten to ${OUTPUT}`);
