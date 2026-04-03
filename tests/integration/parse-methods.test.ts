import { describe, test, expect } from 'bun:test';
import { DemoReader, EntityMode } from '../../src/index.js';
import fs from 'fs';

const demoPath = process.env.CS2_DEMO_PATH ?? 'tests/fixtures/demo.dem';
const demoAvailable = fs.existsSync(demoPath);

describe.skipIf(!demoAvailable)('parse method consistency (EntityMode.ALL)', () => {
	test('all parse methods produce the same tick and entity count', async () => {
		const results: { tick: number; entities: number; method: string }[] = [];

		// Method 1: path-stream (default)
		{
			const r = new DemoReader();
			await r.parseDemo(demoPath, { entities: EntityMode.ALL });
			results.push({ tick: r.currentTick, entities: r.entities.filter(Boolean).length, method: 'path-stream' });
		}

		// Method 2: path-sync (chunked)
		{
			const r = new DemoReader();
			await r.parseDemo(demoPath, { entities: EntityMode.ALL, stream: false });
			results.push({ tick: r.currentTick, entities: r.entities.filter(Boolean).length, method: 'path-sync' });
		}

		// Method 3: buffer
		{
			const r = new DemoReader();
			const buf = fs.readFileSync(demoPath);
			await r.parseDemo(buf, { entities: EntityMode.ALL });
			results.push({ tick: r.currentTick, entities: r.entities.filter(Boolean).length, method: 'buffer' });
		}

		// Method 4: stream
		{
			const r = new DemoReader();
			await r.parseDemo(fs.createReadStream(demoPath), { entities: EntityMode.ALL });
			results.push({ tick: r.currentTick, entities: r.entities.filter(Boolean).length, method: 'stream' });
		}

		// All methods must produce the same results
		const baseTick = results[0]!.tick;
		const baseEntities = results[0]!.entities;

		expect(baseTick).toBeGreaterThan(0);
		expect(baseEntities).toBeGreaterThan(0);

		for (const r of results.slice(1)) {
			expect(r.tick).toBe(baseTick);
			expect(r.entities).toBe(baseEntities);
		}
	});
});
