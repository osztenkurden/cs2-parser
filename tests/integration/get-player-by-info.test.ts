import { describe, test, expect, beforeAll } from 'bun:test';
import { DemoReader, EntityMode } from '../../src/index.js';
import fs from 'fs';

const demoPath = process.env.CS2_DEMO_PATH ?? 'tests/fixtures/demo.dem';
const demoAvailable = fs.existsSync(demoPath);

describe.skipIf(!demoAvailable)('getPlayerByInfo', () => {
	let reader: DemoReader;

	beforeAll(async () => {
		reader = new DemoReader();
		reader.on('tickend', () => {
			if (reader.currentTick >= 1000) {
				reader.cancel();
			}
		});
		await reader.parseDemo(demoPath, { entities: EntityMode.ALL });
	});

	test('parser.players is non-empty', () => {
		expect(reader.players.length).toBeGreaterThan(0);
	});

	test('every non-bot player resolves to a Player with matching steamId', () => {
		const nonBots = reader.players.filter(p => p.steamid !== undefined && p.steamid !== '0' && !p.fakeplayer);
		expect(nonBots.length).toBeGreaterThan(0);
		for (const info of nonBots) {
			const player = reader.getPlayerByInfo(info);
			expect(player).not.toBeNull();
			expect(player!.steamId).toBe(String(info.steamid));
		}
	});

	test('round-trip: getPlayerByInfo(player.userInfo) returns equivalent player', () => {
		const controllers = reader.playerControllers.filter(pc => pc.steamId && pc.steamId !== '0');
		expect(controllers.length).toBeGreaterThan(0);
		for (const original of controllers) {
			const info = original.userInfo;
			if (!info) continue;
			const roundTripped = reader.getPlayerByInfo(info);
			expect(roundTripped).not.toBeNull();
			expect(roundTripped!.entityId).toBe(original.entityId);
			expect(roundTripped!.steamId).toBe(original.steamId);
		}
	});

	test('returns null for bot info (steamid === "0")', () => {
		const botInfo = reader.players.find(p => p.steamid === '0' || p.fakeplayer);
		if (botInfo) {
			expect(reader.getPlayerByInfo(botInfo)).toBeNull();
		}
	});

	test('returns null for null/undefined info', () => {
		expect(reader.getPlayerByInfo(null)).toBeNull();
		expect(reader.getPlayerByInfo(undefined)).toBeNull();
	});

	test('returns null for info with no steamid', () => {
		expect(reader.getPlayerByInfo({} as any)).toBeNull();
	});
});
