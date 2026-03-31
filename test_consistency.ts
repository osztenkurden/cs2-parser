import { DemoReader } from './src/index.js';
import fs from 'fs';

const demoPath = process.argv[2] || 'C:/repos/demofile-net/demos/14140.dem';

type Snapshot = {
	tick: number;
	entCount: number;
	players: number;
	kills: number;
	totalProps: number;
	entProps: Record<string, number>;
};

function snapshot(parser: DemoReader): Promise<Snapshot> {
	const kills: { tick: number; weapon: string }[] = [];
	parser.gameEvents.on('player_death', (e: any) => kills.push({ tick: parser.currentTick, weapon: e.weapon }));
	return new Promise(resolve => {
		parser.on('end', () => {
			const ents = parser.entities.filter(Boolean);
			const totalProps = ents.reduce((s, e) => s + Object.keys(e.properties).length, 0);
			const entProps: Record<string, number> = {};
			for (let i = 0; i < parser.entities.length; i++) {
				const e = parser.entities[i];
				if (e) entProps[i] = Object.keys(e.properties).length;
			}
			resolve({
				tick: parser.currentTick,
				entCount: ents.length,
				players: Object.keys(parser.playerInfoMap).length,
				kills: kills.length,
				totalProps,
				entProps
			});
		});
	});
}

function compareSnapshots(reference: Snapshot, test: Snapshot, name: string): number {
	let failures = 0;

	if (reference.tick !== test.tick) { console.log(`  FAIL [${name}] tick: ${reference.tick} vs ${test.tick}`); failures++; }
	if (reference.entCount !== test.entCount) { console.log(`  FAIL [${name}] entCount: ${reference.entCount} vs ${test.entCount}`); failures++; }
	if (reference.players !== test.players) { console.log(`  FAIL [${name}] players: ${reference.players} vs ${test.players}`); failures++; }
	if (reference.kills !== test.kills) { console.log(`  FAIL [${name}] kills: ${reference.kills} vs ${test.kills}`); failures++; }
	if (reference.totalProps !== test.totalProps) { console.log(`  FAIL [${name}] totalProps: ${reference.totalProps} vs ${test.totalProps}`); failures++; }

	let entDiffs = 0;
	for (const id of new Set([...Object.keys(reference.entProps), ...Object.keys(test.entProps)])) {
		if ((reference.entProps[id] || 0) !== (test.entProps[id] || 0)) entDiffs++;
	}
	if (entDiffs > 0) { console.log(`  FAIL [${name}] ${entDiffs} entities with different prop counts`); failures++; }

	if (failures === 0) console.log(`  PASS [${name}]`);
	return failures;
}

async function main() {
	console.log(`Testing: ${demoPath}\n`);

	const memMB = () => {
		const mem = process.memoryUsage();
		return { rss: mem.rss / 1024 / 1024, heap: mem.heapUsed / 1024 / 1024 };
	};

	const fmtMem = (before: { rss: number; heap: number }, after: { rss: number; heap: number }) => {
		const dRss = (after.rss - before.rss).toFixed(1);
		const dHeap = (after.heap - before.heap).toFixed(1);
		return `+${dRss}MB RSS, +${dHeap}MB heap (total: ${after.rss.toFixed(0)}MB)`;
	};

	// 1. parseDemo (reference)
	let before = memMB();
	console.log('Parsing: parseDemo (file)...');
	const p1 = new DemoReader();
	const mainSnap = snapshot(p1);
	let t = performance.now();
	p1.parseDemo(demoPath, { entities: true });
	const main = await mainSnap;
	let after = memMB();
	console.log(`  ${(performance.now() - t).toFixed(0)}ms | ${fmtMem(before, after)} | ${main.entCount} entities, ${main.totalProps} props, ${main.kills} kills\n`);

	// 2. parseDemo(stream)
	before = memMB();
	console.log('Parsing: parseDemo(stream)...');
	const p2 = new DemoReader();
	const streamSnap = snapshot(p2);
	t = performance.now();
	await p2.parseDemo(fs.createReadStream(demoPath), { entities: true });
	const strm = await streamSnap;
	after = memMB();
	console.log(`  ${(performance.now() - t).toFixed(0)}ms | ${fmtMem(before, after)}`);

	// 3. parseDemo(buffer)
	before = memMB();
	console.log('Parsing: parseDemo(buffer)...');
	const p3 = new DemoReader();
	const bufSnap = snapshot(p3);
	t = performance.now();
	p3.parseDemo(fs.readFileSync(demoPath), { entities: true });
	const buf = await bufSnap;
	after = memMB();
	console.log(`  ${(performance.now() - t).toFixed(0)}ms | ${fmtMem(before, after)}`);

	// Compare
	console.log('\n--- Consistency Results ---');
	let totalFailures = 0;
	totalFailures += compareSnapshots(main, strm, 'stream vs file');
	totalFailures += compareSnapshots(main, buf, 'buffer vs file');

	console.log(`\n${totalFailures === 0 ? 'ALL CONSISTENT' : totalFailures + ' FAILURES'}`);
	process.exit(totalFailures > 0 ? 1 : 0);
}

main();
