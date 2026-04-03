import { describe, test, expect, beforeAll } from 'bun:test';
import { DemoReader, EntityMode } from '../../src/index.js';
import fs from 'fs';

const demoPath = process.env.CS2_DEMO_PATH ?? 'tests/fixtures/demo.dem';
const demoAvailable = fs.existsSync(demoPath);

describe.skipIf(!demoAvailable)('game events', () => {
	let gameEventNames: string[];

	beforeAll(async () => {
		gameEventNames = [];
		const reader = new DemoReader();

		reader.on('gameEvent', event => {
			if (!gameEventNames.includes(event.name)) {
				gameEventNames.push(event.name);
			}
		});

		await reader.parseDemo(demoPath, { entities: EntityMode.ALL });
	});

	test('game events are emitted', () => {
		expect(gameEventNames.length).toBeGreaterThan(0);
	});

	test('player_death events are emitted', () => {
		expect(gameEventNames).toContain('player_death');
	});

	test('round_start events are emitted', () => {
		expect(gameEventNames).toContain('round_start');
	});

	test('round_end events are emitted', () => {
		expect(gameEventNames).toContain('round_end');
	});
});
