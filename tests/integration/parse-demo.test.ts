import { describe, test, expect, beforeAll } from 'bun:test';
import { DemoReader, EntityMode } from '../../src/index.js';
import fs from 'fs';

const demoPath = process.env.CS2_DEMO_PATH ?? 'tests/fixtures/demo.dem';
const demoAvailable = fs.existsSync(demoPath);

describe.skipIf(!demoAvailable)('parse demo (full integration)', () => {
	let reader: DemoReader;
	let eventCounts: Record<string, number>;

	beforeAll(async () => {
		reader = new DemoReader();
		eventCounts = {};

		reader.on('tickstart', () => {
			eventCounts['tickstart'] = (eventCounts['tickstart'] ?? 0) + 1;
		});
		reader.on('end', () => {
			eventCounts['end'] = (eventCounts['end'] ?? 0) + 1;
		});

		await reader.parseDemo(demoPath, { entities: EntityMode.ALL });
	});

	test('currentTick is positive after parsing', () => {
		expect(reader.currentTick).toBeGreaterThan(0);
	});

	test('entities array is populated', () => {
		const entityCount = reader.entities.filter(Boolean).length;
		expect(entityCount).toBeGreaterThan(0);
	});

	test('players are available from userinfo', () => {
		expect(reader.players.length).toBeGreaterThan(0);
	});

	test('player controllers are available', () => {
		expect(reader.playerControllers.length).toBeGreaterThan(0);
	});

	test('teams are available', () => {
		expect(reader.teams.length).toBeGreaterThan(0);
	});

	test('game rules are available', () => {
		expect(reader.gameRules).not.toBeNull();
	});

	test('tickstart events were emitted', () => {
		expect(eventCounts['tickstart']).toBeGreaterThan(0);
	});

	test('end event was emitted exactly once', () => {
		expect(eventCounts['end']).toBe(1);
	});
});
