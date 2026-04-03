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

		const cancelIfThree = () => {
			if(gameEventNames.length >= 3){
				reader.cancel();
			}
		}

		reader.gameEvents.once("round_end", () => {
			gameEventNames.push("round_end");
			cancelIfThree();
		});

		reader.gameEvents.once("player_death", () => {
			gameEventNames.push("player_death");
			cancelIfThree();
		});

		reader.gameEvents.once("round_start", () => {
			gameEventNames.push("round_start");
			cancelIfThree();
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
