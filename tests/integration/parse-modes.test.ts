import { describe, test, expect, beforeAll } from 'bun:test';
import { DemoReader, EntityMode } from '../../src/index.js';
import fs from 'fs';

const demoPath = process.env.CS2_DEMO_PATH ?? 'tests/fixtures/demo.dem';
const demoAvailable = fs.existsSync(demoPath);

describe.skipIf(!demoAvailable)('entity mode consistency', () => {
	const results: Partial<Record<'NONE' | 'ONLY_GAME_RULES' | 'ALL', { tick: number; entities: number; players: number }>> =
		{};

	beforeAll(async () => {
		const modes = {
			NONE: EntityMode.NONE,
			ONLY_GAME_RULES: EntityMode.ONLY_GAME_RULES,
			ALL: EntityMode.ALL
		} as const;

		for (const [name, mode] of Object.entries(modes)) {
			const reader = new DemoReader();
			await reader.parseDemo(demoPath, { entities: mode });
			results[name as keyof typeof results] = {
				tick: reader.currentTick,
				entities: reader.entities.filter(Boolean).length,
				players: reader.players.length
			};
		}
	});

	test('all entity modes produce the same tick count', () => {
		expect(results.NONE?.tick ?? 0).toBeGreaterThan(0);
		expect(results.ONLY_GAME_RULES?.tick).toBe(results.NONE?.tick ?? 0);
		expect(results.ALL?.tick).toBe(results.NONE?.tick ?? 0);
	});

	test('NONE mode has no entities', () => {
		expect(results.NONE?.entities).toBe(0);
	});

	test('ALL mode has entities', () => {
		expect(results.ALL?.entities).toBeGreaterThan(0);
	});

	test('players are available in all modes (from userinfo)', () => {
		expect(results.NONE?.players).toBeGreaterThan(0);
		expect(results.ONLY_GAME_RULES?.players).toBeGreaterThan(0);
		expect(results.ALL?.players).toBeGreaterThan(0);
	});
});
