import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUTPUT = path.join(ROOT, 'benchmark.md');
const TMP = path.join(ROOT, '_bench_tmp.ts');
const demoPath = process.argv[2] ?? 'E:/Repositories/demofile-net-main/demos/14140.dem';

type Result = {
	label: string;
	time: string;
	rss: string;
	heap: string;
	blocking: string;
	entities: number;
	tick: number;
};

function runIsolated(label: string, code: string, blocking: boolean): Result {
	const script = `
import { DemoReader, EntityMode } from './src/index.js';
import fs from 'fs';
const p = new DemoReader();
const start = performance.now();
${code}
const ms = performance.now() - start;
const mem = process.memoryUsage();
console.log(JSON.stringify({
  time: (ms / 1000).toFixed(1) + 's',
  rss: (mem.rss / 1024 / 1024).toFixed(0) + 'MB',
  heap: (mem.heapUsed / 1024 / 1024).toFixed(0) + 'MB',
  entities: p.entities.filter(Boolean).length,
  tick: p.currentTick
}));
`;

	fs.writeFileSync(TMP, script);
	try {
		const result = execSync(`bun ${TMP}`, { cwd: ROOT, timeout: 300000, encoding: 'utf-8' }).trim();
		return { label, blocking: blocking ? 'yes' : 'no', ...JSON.parse(result) };
	} finally {
		fs.unlinkSync(TMP);
	}
}

const stat = fs.statSync(demoPath);
const sizeMB = (stat.size / 1024 / 1024).toFixed(0);
const dp = demoPath.replace(/\\/g, '/');

console.log(`Benchmarking: ${path.basename(demoPath)} (${sizeMB} MB)\n`);

// --- Entity Mode Comparison (streaming, default behavior) ---
console.log('=== Entity Mode Comparison (stream) ===');

const modeBenchmarks = [
	{
		label: '`EntityMode.NONE`',
		code: `await p.parseDemo('${dp}');`,
		blocking: false
	},
	{
		label: '`EntityMode.ONLY_GAME_RULES`',
		code: `await p.parseDemo('${dp}', { entities: EntityMode.ONLY_GAME_RULES });`,
		blocking: false
	},
	{
		label: '`EntityMode.ALL`',
		code: `await p.parseDemo('${dp}', { entities: EntityMode.ALL });`,
		blocking: false
	}
];

const modeResults: Result[] = [];
for (const b of modeBenchmarks) {
	process.stdout.write(`  ${b.label}...`);
	const r = runIsolated(b.label, b.code, b.blocking);
	modeResults.push(r);
	console.log(` ${r.time} | ${r.rss} RSS | ${r.heap} heap | ${r.entities} entities`);
}

// --- Parse Method Comparison (all with EntityMode.ALL) ---
console.log('\n=== Parse Method Comparison (EntityMode.ALL) ===');

const methodBenchmarks = [
	{
		label: '`parseDemo(path)`',
		code: `await p.parseDemo('${dp}', { entities: EntityMode.ALL });`,
		blocking: false
	},
	{
		label: '`parseDemo(path, {stream: false})`',
		code: `p.parseDemo('${dp}', { entities: EntityMode.ALL, stream: false });`,
		blocking: true
	},
	{
		label: '`parseDemo(buffer)`',
		code: `p.parseDemo(fs.readFileSync('${dp}'), { entities: EntityMode.ALL });`,
		blocking: true
	},
	{
		label: '`parseDemo(stream)`',
		code: `await p.parseDemo(fs.createReadStream('${dp}'), { entities: EntityMode.ALL });`,
		blocking: false
	}
];

const methodResults: Result[] = [];
for (const b of methodBenchmarks) {
	process.stdout.write(`  ${b.label}...`);
	const r = runIsolated(b.label, b.code, b.blocking);
	methodResults.push(r);
	console.log(` ${r.time} | ${r.rss} RSS | ${r.heap} heap`);
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
const lines = [
	'# Benchmark Results',
	'',
	`Demo: \`${path.basename(demoPath)}\` (${sizeMB} MB, ${modeResults[0]!.tick.toLocaleString()} ticks)`,
	'',
	'## Entity Mode Comparison',
	'',
	'| Mode | Time | RSS | Heap | Entities |',
	'| --- | --- | --- | --- | --- |',
	...modeResults.map(r => `| ${r.label} | ${r.time} | ${r.rss} | ${r.heap} | ${r.entities} |`),
	'',
	'`ONLY_GAME_RULES` parses entities but only stores game rules — enables synthetic `round_start`/`round_end` events without full entity tracking overhead.',
	'',
	'## Parse Method Comparison (EntityMode.ALL)',
	'',
	'| Method | Time | RSS | Heap | Blocking |',
	'| --- | --- | --- | --- | --- |',
	...methodResults.map(r => `| ${r.label} | ${r.time} | ${r.rss} | ${r.heap} | ${r.blocking} |`),
	'',
	'Streaming uses ~13x less memory by never holding the full file in RAM.',
	''
];

fs.writeFileSync(OUTPUT, lines.join('\n'));
console.log(`\nWritten to ${OUTPUT}`);
