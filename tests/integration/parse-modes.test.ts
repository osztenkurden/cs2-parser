import { describe, test, expect } from 'bun:test';
import { DemoReader, EntityMode } from '../../src/index.js';
import fs from 'fs';

const demoPath = process.env.CS2_DEMO_PATH ?? 'tests/fixtures/demo.dem';
const demoAvailable = fs.existsSync(demoPath);

describe.skipIf(!demoAvailable)('entity mode consistency', () => {
	test('all entity modes produce the same tick count', async () => {
		const modes = [EntityMode.NONE, EntityMode.ONLY_GAME_RULES, EntityMode.ALL] as const;
		const ticks: number[] = [];

		for (const mode of modes) {
			const reader = new DemoReader();
			await reader.parseDemo(demoPath, { entities: mode });
			ticks.push(reader.currentTick);
		}

		// All modes should produce the same final tick
		expect(ticks[0]).toBeGreaterThan(0);
		expect(ticks[1]).toBe(ticks[0]);
		expect(ticks[2]).toBe(ticks[0]);
	});

	test('NONE mode has no entities', async () => {
		const reader = new DemoReader();
		await reader.parseDemo(demoPath, { entities: EntityMode.NONE });
		const entityCount = reader.entities.filter(Boolean).length;
		expect(entityCount).toBe(0);
	});

	test('ALL mode has entities', async () => {
		const reader = new DemoReader();
		await reader.parseDemo(demoPath, { entities: EntityMode.ALL });
		const entityCount = reader.entities.filter(Boolean).length;
		expect(entityCount).toBeGreaterThan(0);
	});

	test('players are available in all modes (from userinfo)', async () => {
		for (const mode of [EntityMode.NONE, EntityMode.ONLY_GAME_RULES, EntityMode.ALL] as const) {
			const reader = new DemoReader();
			await reader.parseDemo(demoPath, { entities: mode });
			expect(reader.players.length).toBeGreaterThan(0);
		}
	});
});
