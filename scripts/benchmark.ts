import { execSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const RUNNER = path.join(__dirname, 'benchmark-run.ts');
const OUTPUT = path.join(ROOT, 'benchmark.md');
const demoPath = process.argv[2] ?? 'E:/Repositories/demofile-net-main/demos/14140.dem';

type Result = {
	label: string;
	time: string;
	ms: number;
	rss: string;
	heap: string;
	entities: number;
	tick: number;
};

const stat = fs.statSync(demoPath);
const sizeBytes = stat.size;
const sizeMB = (sizeBytes / 1024 / 1024).toFixed(0);

function mbPerSec(result: Result): string {
	return ((sizeBytes / 1024 / 1024) / (result.ms / 1000)).toFixed(1) + ' MB/s';
}

function run(label: string, method: string, entityMode: string): Result {
	const result = execSync(
		`bun ${RUNNER} ${JSON.stringify(demoPath)} ${method} ${entityMode}`,
		{ cwd: ROOT, timeout: 300000, encoding: 'utf-8' }
	).trim();
	return { label, ...JSON.parse(result) };
}

console.log(`Benchmarking: ${path.basename(demoPath)} (${sizeMB} MB)\n`);

// --- Entity Mode Comparison (streaming, default behavior) ---
console.log('=== Entity Mode Comparison (stream) ===');

const modeBenchmarks: { label: string; entityMode: string }[] = [
	{ label: '`EntityMode.NONE`', entityMode: 'NONE' },
	{ label: '`EntityMode.ONLY_GAME_RULES`', entityMode: 'ONLY_GAME_RULES' },
	{ label: '`EntityMode.ALL`', entityMode: 'ALL' }
];

const modeResults: Result[] = [];
for (const b of modeBenchmarks) {
	process.stdout.write(`  ${b.label}...`);
	const r = run(b.label, 'path-stream', b.entityMode,);
	modeResults.push(r);
	console.log(` ${mbPerSec(r)} | ${r.time} | ${r.rss} RSS | ${r.heap} heap | ${r.entities} entities`);
}

// --- Parse Method Comparison (all with EntityMode.ALL) ---
console.log('\n=== Parse Method Comparison (EntityMode.ALL) ===');

const methodBenchmarks: { label: string; method: string; }[] = [
	{ label: '`parseDemo(path)`', method: 'path-stream', },
	{ label: '`parseDemo(path, {stream: false})`', method: 'path-sync', },
	{ label: '`parseDemo(buffer)`', method: 'buffer',  },
	{ label: '`parseDemo(stream)`', method: 'stream', }
];

const methodResults: Result[] = [];
for (const b of methodBenchmarks) {
	process.stdout.write(`  ${b.label}...`);
	const r = run(b.label, b.method, 'ALL',);
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
	`CPU: ${cpuModel}\n`,
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
	'| Method | Throughput | Time | RSS | Heap |',
	'| --- | --- | --- | --- | --- |',
	...methodResults.map(r => `| ${r.label} | ${mbPerSec(r)} | ${r.time} | ${r.rss} | ${r.heap} |`),
	''
];

fs.writeFileSync(OUTPUT, lines.join('\n'));
console.log(`\nWritten to ${OUTPUT}`);
