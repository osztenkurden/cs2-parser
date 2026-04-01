import fs from 'fs';
import { DemoReader, EntityMode } from '../src/index.js';

const demoPath = process.argv[2]!;
const method = process.argv[3]!;
const entityMode =
	process.argv[4] === 'ALL' ? EntityMode.ALL
	: process.argv[4] === 'ONLY_GAME_RULES' ? EntityMode.ONLY_GAME_RULES
	: EntityMode.NONE;

const p = new DemoReader();
const start = performance.now();

switch (method) {
	case 'path-stream':
		await p.parseDemo(demoPath, { entities: entityMode });
		break;
	case 'path-sync':
		await p.parseDemo(demoPath, { entities: entityMode, stream: false });
		break;
	case 'buffer':
		await p.parseDemo(fs.readFileSync(demoPath), { entities: entityMode });
		break;
	case 'stream':
		await p.parseDemo(fs.createReadStream(demoPath), { entities: entityMode });
		break;
}

const ms = performance.now() - start;
const mem = process.memoryUsage();
console.log(JSON.stringify({
	time: (ms / 1000).toFixed(1) + 's',
	ms,
	rss: (mem.rss / 1024 / 1024).toFixed(0) + 'MB',
	heap: (mem.heapUsed / 1024 / 1024).toFixed(0) + 'MB',
	entities: p.entities.filter(Boolean).length,
	tick: p.currentTick
}));
