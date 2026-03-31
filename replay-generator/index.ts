import fs from 'fs';
import path from 'path';
import { DemoReader, EntityMode, Player } from '../src/index.js';

// ─── Constants ───────────────────────────────────────────────────────────────

const STEAM_ID_BASE = 76561197960265728n;
const CELL_BITS = 9;
const MAX_COORD = 1 << 14;
const HANDLE_MASK = 0x7ff;
const HANDLE_MISSING = 2047;

const args = process.argv.slice(2);
const FLAG_TABLE = args.includes('--table');
const FLAG_DEBUG = args.includes('--debug');
const FLAG_ROUND = args.find(a => a.startsWith('--round='));
const FLAG_PLAYER = args.find(a => a.startsWith('--player='));
const FILTER_ROUND = FLAG_ROUND !== undefined ? Number(FLAG_ROUND.split('=')[1]) : undefined;
const FILTER_PLAYER = FLAG_PLAYER?.split('=')[1]?.toLowerCase();
const DEMO_PATH =
	args.find(a => !a.startsWith('--')) ??
	'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive\\game\\csgo\\replays\\match730_003809737891798581468_1778215536_388.dem';
const ROUND_STEP = 4;

// ─── Weapon Mappings ─────────────────────────────────────────────────────────

const NATIVE_TO_NAME: Record<number, string> = {
	32: 'hkp2000',
	4: 'glock',
	36: 'p250',
	1: 'deagle',
	3: 'fiveseven',
	2: 'elite',
	30: 'tec9',
	63: 'cz75a',
	61: 'usp_silencer',
	64: 'revolver',
	13: 'galilar',
	10: 'famas',
	7: 'ak47',
	16: 'm4a1',
	60: 'm4a1_silencer',
	40: 'ssg08',
	39: 'sg556',
	8: 'aug',
	9: 'awp',
	38: 'scar20',
	11: 'g3sg1',
	33: 'mp7',
	34: 'mp9',
	26: 'bizon',
	17: 'mac10',
	24: 'ump45',
	19: 'p90',
	23: 'mp5sd',
	29: 'sawedoff',
	35: 'nova',
	27: 'mag7',
	25: 'xm1014',
	14: 'm249',
	28: 'negev',
	31: 'taser',
	49: 'c4',
	42: 'knife',
	47: 'decoy',
	46: 'molotov',
	48: 'incgrenade',
	43: 'flashbang',
	45: 'smokegrenade',
	44: 'hegrenade'
};

const NAME_TO_CANONICAL: Record<string, number> = {
	hkp2000: 1,
	glock: 2,
	p250: 3,
	deagle: 4,
	fiveseven: 5,
	elite: 6,
	tec9: 7,
	cz75a: 8,
	usp_silencer: 9,
	revolver: 10,
	mp7: 101,
	mp9: 102,
	bizon: 103,
	mac10: 104,
	ump45: 105,
	p90: 106,
	mp5sd: 107,
	sawedoff: 201,
	nova: 202,
	mag7: 203,
	xm1014: 204,
	m249: 205,
	negev: 206,
	galilar: 301,
	famas: 302,
	ak47: 303,
	m4a1: 304,
	m4a1_silencer: 305,
	ssg08: 306,
	sg556: 307,
	aug: 308,
	awp: 309,
	scar20: 310,
	g3sg1: 311,
	taser: 401,
	kevlar: 402,
	helmet: 403,
	c4: 404,
	planted_c4: 404,
	knife: 405,
	defuser: 406,
	world: 407,
	decoy: 501,
	molotov: 502,
	incgrenade: 503,
	flashbang: 504,
	smokegrenade: 505,
	hegrenade: 506
};

const KNIFE_NATIVE_IDS = new Set([42, 59, 500, 505, 506, 507, 508, 509, 512, 514, 515, 516, 526]);

// Reverse map: item name → native defindex
const NAME_TO_NATIVE: Record<string, number> = {};
for (const [nid, name] of Object.entries(NATIVE_TO_NAME)) NAME_TO_NATIVE[name] = Number(nid);

const PROJECTILE_CLASS_TO_GRENADE: Record<string, number> = {
	CSmokeGrenadeProjectile: 505,
	CFlashbangProjectile: 504,
	CHEGrenadeProjectile: 506,
	CMolotovProjectile: 502, // both molotov and incendiary use this when thrown
	CDecoyProjectile: 501
	// CIncendiaryGrenade is an inventory entity, NOT a thrown projectile
};

const CLASS_NAME_TO_DEFINDEX: Record<string, number> = {
	CAK47: 7,
	CDEagle: 1,
	CKnife: 42,
	CC4: 49,
	CWeaponAug: 8,
	CWeaponAWP: 9,
	CWeaponBizon: 26,
	CWeaponCZ75a: 63,
	CWeaponElite: 2,
	CWeaponFamas: 10,
	CWeaponFiveSeven: 3,
	CWeaponG3SG1: 11,
	CWeaponGalilAR: 13,
	CWeaponGlock: 4,
	CWeaponHKP2000: 32,
	CWeaponM249: 14,
	CWeaponM4A1: 16,
	CWeaponM4A1Silencer: 60,
	CWeaponMAC10: 17,
	CWeaponMag7: 27,
	CWeaponMP5SD: 23,
	CWeaponMP7: 33,
	CWeaponMP9: 34,
	CWeaponNegev: 28,
	CWeaponNOVA: 35,
	CWeaponP250: 36,
	CWeaponP90: 19,
	CWeaponRevolver: 64,
	CWeaponSawedoff: 29,
	CWeaponSCAR20: 38,
	CWeaponSG556: 39,
	CWeaponSSG08: 40,
	CWeaponTaser: 31,
	CWeaponTec9: 30,
	CWeaponUMP45: 24,
	CWeaponUSPSilencer: 61,
	CWeaponXM1014: 25,
	CFlashbang: 43,
	CHEGrenade: 44,
	CSmokeGrenade: 45,
	CMolotovGrenade: 46,
	CDecoyGrenade: 47,
	CIncendiaryGrenade: 48
};

function classNameToDefindex(className: string): number | null {
	return CLASS_NAME_TO_DEFINDEX[className] ?? null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function steamId3(steamId64: string): number {
	if (!steamId64) return 0;
	return Number(BigInt(steamId64) - STEAM_ID_BASE);
}

function nativeToCanonical(nativeId: number): number {
	if (KNIFE_NATIVE_IDS.has(nativeId)) return 405;
	const name = NATIVE_TO_NAME[nativeId];
	if (!name) return 405;
	return NAME_TO_CANONICAL[name] ?? 405;
}

function nameToCanonical(weaponName: string): number {
	const clean = weaponName.replace(/^weapon_/, '');
	if (clean.includes('knife') || clean === 'bayonet') return 405;
	return NAME_TO_CANONICAL[clean] ?? 405;
}

function tickToFrame(tick: number, roundStartTick: number): number {
	const rel = tick - roundStartTick;
	return Math.floor(rel / 2) + 1;
}

function resolveHandle(handle: number | undefined): number | null {
	if (handle === undefined || handle === null) return null;
	const id = handle & HANDLE_MASK;
	return id === HANDLE_MISSING ? null : id;
}

function entityPosition(entity: any): { x: number; y: number; z: number } | null {
	const cn = entity.className as string;
	const props = entity.properties;
	const cellX = props[`${cn}.CBodyComponentBaseAnimGraph.m_cellX`];
	if (cellX === undefined) return null;
	const cellY = props[`${cn}.CBodyComponentBaseAnimGraph.m_cellY`] ?? 0;
	const cellZ = props[`${cn}.CBodyComponentBaseAnimGraph.m_cellZ`] ?? 0;
	const vecX = props[`${cn}.CBodyComponentBaseAnimGraph.m_vecX`] ?? 0;
	const vecY = props[`${cn}.CBodyComponentBaseAnimGraph.m_vecY`] ?? 0;
	const vecZ = props[`${cn}.CBodyComponentBaseAnimGraph.m_vecZ`] ?? 0;
	return {
		x: (cellX as number) * (1 << CELL_BITS) - MAX_COORD + (vecX as number),
		y: (cellY as number) * (1 << CELL_BITS) - MAX_COORD + (vecY as number),
		z: (cellZ as number) * (1 << CELL_BITS) - MAX_COORD + (vecZ as number)
	};
}

function getEntityProp(entity: any, suffix: string): unknown {
	const cn = entity.className as string;
	return entity.properties[`${cn}.${suffix}`];
}

// ─── State Types ─────────────────────────────────────────────────────────────

type RoundState = {
	roundIndex: number;
	startTick: number;
	endTick: number;
	winner: number;
	ctEndScore: number;
	tEndScore: number;
	players: Map<
		number,
		{
			steamId3: number;
			name: string;
			team: number;
			// start state
			hp: number;
			armor: number;
			money: number;
			hasDefuser: boolean;
			hasHelmet: boolean;
			inventory: { weapon: number; nativeId: number; uniqueId: string }[];
			activeWeaponId: string;
			hasBomb: boolean;
		}
	>;
	positions: Map<
		number,
		{
			startFrame: number;
			endFrame: number;
			x: number[];
			y: number[];
			z: number[];
			viewX: number[];
			viewY: number[];
			lastFrame: number;
		}
	>;
	grenades: Map<
		number,
		{ type: number; startFrame: number; endFrame: number; x: number[]; y: number[]; z: number[]; lastFrame: number }
	>;
	infernos: Map<number, { startTick: number; endTick: number; x: number; y: number; z: number }>;
	events: { frame: number; type: number; data?: any }[];
};

// ─── Main ────────────────────────────────────────────────────────────────────

const parser = new DemoReader();

const completedRounds: RoundState[] = [];
let currentRound: RoundState | null = null;
let killCounter = 0;
const detonatedProjectiles = new Set<number>(); // entity IDs that have detonated — stop tracking positions

// Track freeze_end ticks and pending round_end/cs_pre_restart ticks
let pendingRoundEnd: { tick: number; winner: number } | null = null;
const INVENTORY_PATCH_WINDOW = 150; // ticks after freeze_end to collect equip events
let inventoryFinalized = false;

// ─── Round Boundary Detection ────────────────────────────────────────────────

parser.gameEvents.on('round_freeze_end', () => {
	const tick = parser.currentTick;
	const roundIndex = parser.gameRules?.roundsPlayed ?? 0;
	detonatedProjectiles.clear();

	currentRound = {
		roundIndex,
		startTick: tick,
		endTick: -1,
		winner: 0,
		ctEndScore: 0,
		tEndScore: 0,
		players: new Map(),
		positions: new Map(),
		grenades: new Map(),
		infernos: new Map(),
		events: []
	};

	// Snapshot player start state
	for (const pc of parser.playerControllers) {
		if (pc.teamNumber < 2 || !pc.isConnected) continue;
		const sid3 = steamId3(pc.steamId);
		if (!sid3 || currentRound.players.has(sid3)) continue;

		const pawn = pc.pawn;
		const inventory = getPlayerInventory(pc);
		const activeHandle = resolveHandle(
			pawn
				? ((pawn.entity?.properties as any)?.[
						'CCSPlayerPawn.CCSPlayer_WeaponServices.m_hActiveWeapon'
					] as number)
				: undefined
		);
		const activeWeaponId = findActiveWeaponId(activeHandle, inventory, pc.name, roundIndex);

		currentRound.players.set(sid3, {
			steamId3: sid3,
			name: pc.name,
			team: pc.teamNumber,
			hp: pc.health,
			armor: pc.armor,
			money: pc.money,
			hasDefuser: pc.hasDefuser,
			hasHelmet: pc.hasHelmet,
			inventory,
			activeWeaponId,
			hasBomb: inventory.some(i => i.weapon === 404)
		});
	}
	inventoryFinalized = false;
});

// Patch bomb ownership from early bomb_dropped (covers C4 entity whose owner isn't set at freeze end)
parser.gameEvents.on('bomb_dropped', event => {
	if (!currentRound || inventoryFinalized) return;
	if (parser.currentTick - currentRound.startTick > INVENTORY_PATCH_WINDOW) return;
	const player = event.player;
	if (!player?.steamId) return;
	const sid3 = steamId3(player.steamId);
	const pState = currentRound.players.get(sid3);
	if (!pState || pState.hasBomb) return;
	// Player dropped the bomb, so they had it at round start
	pState.hasBomb = true;
	if (!pState.inventory.some(i => i.weapon === 404)) {
		const dupIdx = pState.inventory.filter(i => i.nativeId === 49).length;
		pState.inventory.push({ weapon: 404, nativeId: 49, uniqueId: `49_${sid3}_${dupIdx}` });
	}
});

// Patch inventory with early item_equip events (covers weapons whose entity properties lag behind)
parser.gameEvents.on('item_equip', event => {
	if (!currentRound || inventoryFinalized) return;
	if (parser.currentTick - currentRound.startTick > INVENTORY_PATCH_WINDOW) return;
	const player = event.player;
	if (!player?.steamId) return;
	const sid3 = steamId3(player.steamId);
	const pState = currentRound.players.get(sid3);
	if (!pState) return;
	const itemName = (event.item ?? '').replace(/^weapon_/, '');
	if (!itemName) return;
	const canonical = nameToCanonical(itemName);
	// Skip if already in inventory (by canonical ID)
	if (pState.inventory.some(i => i.weapon === canonical)) return;
	const nativeId = NAME_TO_NATIVE[itemName] ?? 0;
	if (!nativeId) return;
	const dupIdx = pState.inventory.filter(i => i.nativeId === nativeId).length;
	const uniqueId = `${nativeId}_${sid3}_${dupIdx}`;
	pState.inventory.push({ weapon: canonical, nativeId, uniqueId });
	if (canonical === 404) pState.hasBomb = true;
});

function finalizeInventory() {
	if (!currentRound || inventoryFinalized) return;
	inventoryFinalized = true;

	// Log round start loadouts
	if (FLAG_TABLE) {
		const teamLabel = { 2: 'T', 3: 'CT' } as Record<number, string>;
		console.log(`\n── Round ${currentRound.roundIndex} ─ tick ${currentRound.startTick} ──`);
		for (const team of [3, 2] as const) {
			const rows = [...currentRound.players.values()]
				.filter(p => p.team === team)
				.map(p => {
					const weapons = p.inventory.map(i => {
						const name =
							NATIVE_TO_NAME[i.nativeId] ??
							(KNIFE_NATIVE_IDS.has(i.nativeId) ? 'knife' : `?${i.nativeId}`);
						const active = i.uniqueId === p.activeWeaponId ? '*' : '';
						return `${name}${active}`;
					});
					return {
						name: p.name.padEnd(22),
						hp: String(p.hp).padStart(3),
						armor: String(p.armor).padStart(3),
						money: ('$' + p.money).padStart(6),
						kit: p.hasDefuser ? 'K' : ' ',
						helm: p.hasHelmet ? 'H' : ' ',
						bomb: p.hasBomb ? 'B' : ' ',
						weapons: weapons.join(', ')
					};
				});
			console.log(`  ${teamLabel[team]}:`);
			for (const r of rows) {
				console.log(
					`    ${r.name} ${r.hp}hp ${r.armor}ar ${r.money} ${r.kit}${r.helm}${r.bomb} │ ${r.weapons}`
				);
			}
		}
	}

	// Inject synthetic round start event (type 54) and equip events (type 39)
	currentRound.events.push({ frame: 1, type: 54 });
	for (const [sid3, pState] of currentRound.players) {
		for (const item of pState.inventory) {
			currentRound.events.push({ frame: 1, type: 39, data: { PlayerID: sid3, Weapon: { Weapon: item.weapon } } });
		}
		// Active weapon equip at frame 2
		const activeItem = pState.inventory.find(i => i.uniqueId === pState.activeWeaponId);
		currentRound.events.push({
			frame: 2,
			type: 39,
			data: { PlayerID: sid3, Weapon: { Weapon: activeItem?.weapon ?? 405 } }
		});
	}
}

function getPlayerInventory(pc: Player): { weapon: number; nativeId: number; uniqueId: string }[] {
	const pawnId = pc.pawnEntityId;
	if (pawnId === null) return [];
	const sid3 = steamId3(pc.steamId);
	const items: { weapon: number; nativeId: number; uniqueId: string }[] = [];
	const nativeCount = new Map<number, number>();

	for (let i = 0; i < parser.entities.length; i++) {
		const ent = parser.entities[i];
		if (!ent) continue;
		const defindex = findDefindex(ent) ?? classNameToDefindex(ent.className);
		if (defindex === null) continue;
		const ownerId = findOwnerEntityId(ent);
		if (ownerId !== pawnId) continue;

		const dupIdx = nativeCount.get(defindex) ?? 0;
		nativeCount.set(defindex, dupIdx + 1);
		items.push({
			weapon: nativeToCanonical(defindex),
			nativeId: defindex,
			uniqueId: `${defindex}_${sid3}_${dupIdx}`
		});
	}
	return items;
}

function findDefindex(entity: any): number | null {
	for (const key of Object.keys(entity.properties)) {
		if (key.endsWith('.m_iItemDefinitionIndex')) {
			return entity.properties[key] as number;
		}
	}
	return null;
}

function findOwnerEntityId(entity: any): number | null {
	for (const key of Object.keys(entity.properties)) {
		if (key.endsWith('.m_hOwnerEntity')) {
			return resolveHandle(entity.properties[key] as number);
		}
	}
	return null;
}

function findActiveWeaponId(
	activeHandle: number | null,
	inventory: { weapon: number; nativeId: number; uniqueId: string }[],
	playerName: string,
	roundIndex: number
): string {
	const fallback = inventory[0]?.uniqueId ?? '';
	const ctx = `[round ${roundIndex}] ${playerName}`;

	if (activeHandle === null) {
		console.warn(`  ${ctx}: active weapon handle is null, fallback to first inventory item`);
		return fallback;
	}
	const activeEnt = parser.entities[activeHandle];
	if (!activeEnt) {
		console.warn(`  ${ctx}: active weapon entity ${activeHandle} not found, fallback to first inventory item`);
		return fallback;
	}
	const defindex = findDefindex(activeEnt) ?? classNameToDefindex(activeEnt.className);
	if (defindex === null) {
		console.warn(
			`  ${ctx}: entity ${activeHandle} (${activeEnt.className}) has no m_iItemDefinitionIndex and unknown class, props: ${Object.keys(activeEnt.properties).slice(0, 5).join(', ')}`
		);
		return fallback;
	}
	const match = inventory.find(i => i.nativeId === defindex);
	if (!match) {
		const name = NATIVE_TO_NAME[defindex] ?? `unknown(${defindex})`;
		console.warn(
			`  ${ctx}: active weapon defindex=${defindex} (${name}) not found in inventory [${inventory.map(i => i.nativeId).join(',')}]`
		);
		return fallback;
	}
	return match.uniqueId;
}

// ─── Round End Detection ─────────────────────────────────────────────────────

parser.gameEvents.on('round_end', event => {
	if (!currentRound) return;
	pendingRoundEnd = { tick: parser.currentTick, winner: event.winner };
});

parser.gameEvents.on('cs_pre_restart', () => {
	if (!currentRound) return;
	finalizeRound(parser.currentTick);
});

// Fallback: if cs_pre_restart never fires, finalize on next round_freeze_end or end
function finalizeRound(endTick: number) {
	if (!currentRound) return;
	finalizeInventory();
	currentRound.endTick = endTick;
	currentRound.winner = pendingRoundEnd?.winner ?? 0;

	// Get team scores
	for (const team of parser.teams) {
		if (team.teamNumber === 3) currentRound.ctEndScore = team.score;
		if (team.teamNumber === 2) currentRound.tEndScore = team.score;
	}

	completedRounds.push(currentRound);
	currentRound = null;
	pendingRoundEnd = null;
}

// ─── Per-Tick Sampling ───────────────────────────────────────────────────────

parser.on('tickend', () => {
	if (!currentRound) return;
	const tick = parser.currentTick;
	if (tick < currentRound.startTick) return;

	// Finalize inventory after patch window
	if (!inventoryFinalized && tick - currentRound.startTick >= INVENTORY_PATCH_WINDOW) {
		finalizeInventory();
	}

	// Sample every 2nd tick
	const relTick = tick - currentRound.startTick;
	if (relTick % 2 !== 0) return;
	const frame = Math.floor(relTick / 2) + 1;

	// Player positions
	for (const pc of parser.playerControllers) {
		if (pc.teamNumber < 2) continue;
		const sid3 = steamId3(pc.steamId);
		if (!sid3) continue;
		if (!pc.isAlive) continue;

		const pos = pc.position;
		if (!pos) continue;
		const eyes = pc.eyeAngles;

		let track = currentRound.positions.get(sid3);
		if (!track) {
			track = { startFrame: frame, endFrame: frame, x: [], y: [], z: [], viewX: [], viewY: [], lastFrame: -1 };
			currentRound.positions.set(sid3, track);
		}
		// Dedup: skip if same frame
		if (track.lastFrame === frame) continue;
		track.lastFrame = frame;
		track.endFrame = frame;
		track.x.push(Math.round(pos.x));
		track.y.push(Math.round(pos.y));
		track.z.push(Math.round(pos.z));
		track.viewX.push(Math.round(eyes.yaw));
		track.viewY.push(Math.round(eyes.pitch));
	}

	// Grenade projectile positions (skip detonated grenades — they linger as entities)
	for (let i = 0; i < parser.entities.length; i++) {
		if (detonatedProjectiles.has(i)) continue;
		const ent = parser.entities[i];
		if (!ent || ent.entityType !== 2) continue; // 2 = Projectile
		const grenadeType = PROJECTILE_CLASS_TO_GRENADE[ent.className];
		if (grenadeType === undefined) continue;

		const pos = entityPosition(ent);
		if (!pos) continue;

		let track = currentRound.grenades.get(i);
		if (!track) {
			track = { type: grenadeType, startFrame: frame, endFrame: frame, x: [], y: [], z: [], lastFrame: -1 };
			currentRound.grenades.set(i, track);
		}
		if (track.lastFrame === frame) continue;
		track.lastFrame = frame;
		track.endFrame = frame;
		track.x.push(Math.round(pos.x));
		track.y.push(Math.round(pos.y));
		track.z.push(Math.round(pos.z));
	}
});

// ─── Game Events ─────────────────────────────────────────────────────────────

function playerSteamId3(player: any): number | null {
	if (!player?.steamId) return null;
	return steamId3(player.steamId);
}



parser.gameEvents.on('player_death', event => {
	if (!currentRound) return;
	killCounter++;
	const frame = tickToFrame(parser.currentTick, currentRound.startTick);
	if (frame < 1) return;
	currentRound.events.push({
		frame,
		type: 1,
		data: {
			KillID: killCounter,
			Victim: playerSteamId3(event.player),
			Killer: playerSteamId3(event.attackerPlayer),
			Assister: playerSteamId3(event.assisterPlayer),
			Weapon: { Weapon: nameToCanonical(event.weapon ?? '') },
			isHeadshot: event.headshot ?? false,
			PenetratedObjects: (event.penetrated ?? 0) > 0,
			KillerBlindEvent: event.attackerblind ?? false,
			ThroughSmoke: event.thrusmoke ?? false,
			FlashAssist: event.assistedflash ?? false,
			noScope: event.noscope ?? false
		}
	});
});

parser.gameEvents.on('player_hurt', event => {
	if (!currentRound) return;
	const frame = tickToFrame(parser.currentTick, currentRound.startTick);
	if (frame < 1) return;
	currentRound.events.push({
		frame,
		type: 47,
		data: {
			PlayerID: playerSteamId3(event.player),
			Health: event.health ?? 0,
			Armor: event.armor ?? 0
		}
	});
});

parser.gameEvents.on('player_blind', event => {
	if (!currentRound) return;
	const frame = tickToFrame(parser.currentTick, currentRound.startTick);
	if (frame < 1) return;
	currentRound.events.push({
		frame,
		type: 46,
		data: {
			PlayerID: playerSteamId3(event.player),
			FlashDuration: 0,
			FlashDurationAdded: event.blind_duration ?? 0
		}
	});
});

parser.gameEvents.on('weapon_fire', event => {
	if (!currentRound) return;
	const frame = tickToFrame(parser.currentTick, currentRound.startTick);
	if (frame < 1) return;
	currentRound.events.push({
		frame,
		type: 66,
		data: {
			Shooter: playerSteamId3(event.player),
			Weapon: { Weapon: nameToCanonical(event.weapon ?? '') }
		}
	});
});

parser.gameEvents.on('item_equip', event => {
	if (!currentRound) return;
	const frame = tickToFrame(parser.currentTick, currentRound.startTick);
	if (frame < 1) return;

	if (FLAG_DEBUG) {
		const ri = currentRound.roundIndex;
		const pName = event.player?.name ?? '?';
		const matchesPlayer =
			!FILTER_PLAYER ||
			pName.toLowerCase().includes(FILTER_PLAYER) ||
			(FILTER_PLAYER === '?' && !event.player);
		if ((FILTER_ROUND === undefined || ri === FILTER_ROUND) && matchesPlayer) {
			const canonical = nameToCanonical(event.item ?? '');
			console.log(
				`  [equip] round=${ri} tick=${parser.currentTick} frame=${frame} player=${pName} userid=${event.userid} item=${event.item} defindex=${event.defindex} canonical=${canonical}`
			);
		}
	}

	currentRound.events.push({
		frame,
		type: 39,
		data: {
			PlayerID: playerSteamId3(event.player),
			Weapon: { Weapon: nameToCanonical(event.item ?? '') }
		}
	});
});

parser.gameEvents.on('item_pickup', event => {
	if (!currentRound) return;
	const frame = tickToFrame(parser.currentTick, currentRound.startTick);
	if (frame < 1) return;
	currentRound.events.push({
		frame,
		type: 40,
		data: {
			PlayerID: playerSteamId3(event.player),
			Weapon: { Weapon: nameToCanonical(event.item ?? '') }
		}
	});
});

parser.gameEvents.on('bomb_beginplant', event => {
	if (!currentRound) return;
	const frame = tickToFrame(parser.currentTick, currentRound.startTick);
	if (frame < 1) return;
	currentRound.events.push({
		frame,
		type: 14,
		data: {
			BombEvent: {
				PlayerID: playerSteamId3(event.player),
				Site: event.site ?? 0
			}
		}
	});
});

parser.gameEvents.on('bomb_planted', event => {
	if (!currentRound) return;
	const frame = tickToFrame(parser.currentTick, currentRound.startTick);
	if (frame < 1) return;
	currentRound.events.push({
		frame,
		type: 15,
		data: {
			BombEvent: {
				PlayerID: playerSteamId3(event.player),
				Site: event.site ?? 0
			}
		}
	});
});

parser.gameEvents.on('bomb_defused', event => {
	if (!currentRound) return;
	const frame = tickToFrame(parser.currentTick, currentRound.startTick);
	if (frame < 1) return;
	currentRound.events.push({ frame, type: 8, data: {} });
});

parser.gameEvents.on('bomb_dropped', event => {
	if (!currentRound) return;
	const frame = tickToFrame(parser.currentTick, currentRound.startTick);
	if (frame < 1) return;
	currentRound.events.push({
		frame,
		type: 9,
		data: { PlayerID: playerSteamId3(event.player) }
	});
});

parser.gameEvents.on('bomb_pickup', event => {
	if (!currentRound) return;
	const frame = tickToFrame(parser.currentTick, currentRound.startTick);
	if (frame < 1) return;
	// bomb_pickup only has userid_pawn (pawn entity handle), resolve to player
	const pawnId = resolveHandle(event.userid_pawn);
	let pickupSid3: number | null = null;
	if (pawnId !== null) {
		for (const pc of parser.playerControllers) {
			if (pc.pawnEntityId === pawnId) {
				pickupSid3 = steamId3(pc.steamId);
				break;
			}
		}
	}
	currentRound.events.push({
		frame,
		type: 13, // bomb_pickup — not in spec event table, using 10
		data: { PlayerID: pickupSid3 }
	});
});

parser.gameEvents.on('bomb_exploded', event => {
	if (!currentRound) return;
	const frame = tickToFrame(parser.currentTick, currentRound.startTick);
	if (frame < 1) return;
	currentRound.events.push({ frame, type: 12, data: { Site: event.site ?? 0 } });
});

parser.gameEvents.on('bomb_begindefuse', event => {
	if (!currentRound) return;
	const frame = tickToFrame(parser.currentTick, currentRound.startTick);
	if (frame < 1) return;
	currentRound.events.push({
		frame,
		type: 7,
		data: {
			HasKit: event.haskit ?? false,
			PlayerID: playerSteamId3(event.player)
		}
	});
});

parser.gameEvents.on('flashbang_detonate', event => {
	if (event.entityid) detonatedProjectiles.add(event.entityid);
	if (!currentRound) return;
	const frame = tickToFrame(parser.currentTick, currentRound.startTick);
	if (frame < 1) return;
	currentRound.events.push({
		frame,
		type: 23,
		data: {
			GrenadeEvent: {
				GrenadeType: 504,
				Grenade: { Weapon: 504 },
				Position: { X: Math.round(event.x), Y: Math.round(event.y), Z: Math.round(event.z) },
				UniqueID: event.entityid ?? 0
			}
		}
	});
});

parser.gameEvents.on('hegrenade_detonate', event => {
	if (event.entityid) detonatedProjectiles.add(event.entityid);
	if (!currentRound) return;
	const frame = tickToFrame(parser.currentTick, currentRound.startTick);
	if (frame < 1) return;
	currentRound.events.push({
		frame,
		type: 33,
		data: {
			GrenadeEvent: {
				UniqueID: event.entityid ?? 0,
				GrenadeType: 506,
				Grenade: { Weapon: 506 },
				Position: { X: Math.round(event.x), Y: Math.round(event.y), Z: Math.round(event.z) }
			}
		}
	});
});

parser.gameEvents.on('smokegrenade_detonate', event => {
	if (event.entityid) detonatedProjectiles.add(event.entityid);
	if (!currentRound) return;
	const frame = tickToFrame(parser.currentTick, currentRound.startTick);
	if (frame < 1) return;
	currentRound.events.push({
		frame,
		type: 62,
		data: {
			GrenadeEvent: {
				Grenade: { Weapon: 505 },
				Position: { X: Math.round(event.x), Y: Math.round(event.y), Z: Math.round(event.z) },
				GrenadeType: 505,
				UniqueID: event.entityid ?? 0
			}
		}
	});
});

parser.gameEvents.on('smokegrenade_expired', event => {
	if (!currentRound) return;
	const frame = tickToFrame(parser.currentTick, currentRound.startTick);
	if (frame < 1) return;
	currentRound.events.push({
		frame,
		type: 61,
		data: {
			GrenadeEvent: {
				Grenade: { Weapon: 505 },
				Position: { X: Math.round(event.x), Y: Math.round(event.y), Z: Math.round(event.z) },
				GrenadeType: 505,
				UniqueID: event.entityid ?? 0
			}
		}
	});
});

parser.gameEvents.on('inferno_startburn', event => {
	if (!currentRound) return;
	const frame = tickToFrame(parser.currentTick, currentRound.startTick);
	if (frame < 1) return;
	currentRound.infernos.set(event.entityid, {
		startTick: parser.currentTick,
		endTick: -1,
		x: event.x,
		y: event.y,
		z: event.z
	});
	currentRound.events.push({ frame, type: 36, data: { Inferno: event.entityid } });
});

parser.gameEvents.on('inferno_expire', event => {
	if (!currentRound) return;
	const frame = tickToFrame(parser.currentTick, currentRound.startTick);
	if (frame < 1) return;
	const inf = currentRound.infernos.get(event.entityid);
	if (inf) inf.endTick = parser.currentTick;
	currentRound.events.push({ frame, type: 35, data: { Inferno: event.entityid } });
});

// ─── Build Output ────────────────────────────────────────────────────────────

function buildRoundReplay(round: RoundState): any {
	const playersSorted = [...round.players.values()];
	const tPlayers = playersSorted.filter(p => p.team === 2);
	const ctPlayers = playersSorted.filter(p => p.team === 3);

	const metaBase = [
		{
			Logo: null,
			Name: null,
			Players: tPlayers.map(p => ({ Name: p.name, PlayerID: p.steamId3 })),
			Bots: []
		},
		{
			Logo: null,
			Name: null,
			Players: ctPlayers.map(p => ({ Name: p.name, PlayerID: p.steamId3 })),
			Bots: []
		}
	];

	const endFrame = round.endTick > round.startTick ? tickToFrame(round.endTick, round.startTick) : 1;

	const Players = playersSorted.map(p => ({
		PlayerID: p.steamId3,
		Team: p.team,
		Assists: [],
		Deaths: [],
		Damage: 0,
		username: p.name
	}));

	const RoundStartState = {
		FrameNumber: 1,
		Players: playersSorted.map(p => ({
			PlayerID: p.steamId3,
			Team: p.team,
			FlashDuration: 0,
			ActiveWeaponID: p.activeWeaponId,
			Armor: p.armor,
			HasDefuseKit: p.hasDefuser,
			HasBomb: p.hasBomb,
			HasHelmet: p.hasHelmet,
			Hp: p.hp,
			Money: p.money,
			ViewX: 0,
			ViewY: 0,
			Inventory: p.inventory.map(i => ({
				Weapon: i.weapon,
				OwnerID: p.steamId3,
				UniqueID: i.uniqueId
			})),
			AdditionalInfo: { StartScore: 0, Assists: 0, Deaths: 0, Kills: 0, MVPs: 0 }
		}))
	};

	const PlayersPositions = playersSorted
		.map(p => {
			const track = round.positions.get(p.steamId3);
			if (!track || track.x.length === 0) return null;
			return {
				StartFrame: track.startFrame,
				EndFrame: track.endFrame,
				PlayerID: p.steamId3,
				X: track.x,
				Y: track.y,
				Z: track.z,
				ViewX: track.viewX,
				ViewY: track.viewY
			};
		})
		.filter(Boolean);

	const GrenadesPositions = [...round.grenades.entries()].map(([entityId, g]) => ({
		StartFrame: g.startFrame,
		EndFrame: g.endFrame,
		grenadeType: g.type,
		UniqueID: entityId,
		X: g.x,
		Y: g.y,
		Z: g.z,
		round: round.roundIndex + 1
	}));

	// Build inferno frames
	const CurrentInfernos: any[] = [];
	for (const [entityId, inf] of round.infernos) {
		const startFrame = tickToFrame(inf.startTick, round.startTick);
		const endTick = inf.endTick > 0 ? inf.endTick : round.endTick;
		const infernoEndFrame = tickToFrame(endTick, round.startTick);
		for (let f = startFrame; f <= infernoEndFrame; f++) {
			const hull: { X: number; Y: number }[] = [];
			const hull3d: { X: number; Y: number; Z: number }[] = [];
			for (let i = 0; i < 8; i++) {
				const angle = (2 * Math.PI * i) / 8;
				const px = Math.round(inf.x + 75 * Math.cos(angle));
				const py = Math.round(inf.y + 75 * Math.sin(angle));
				const pz = Math.round(inf.z);
				hull.push({ X: px, Y: py });
				hull3d.push({ X: px, Y: py, Z: pz });
			}
			let frameEntry = CurrentInfernos.find((e: any) => e.FrameNumber === f);
			if (!frameEntry) {
				frameEntry = { FrameNumber: f, CurrentInfernos: [] };
				CurrentInfernos.push(frameEntry);
			}
			frameEntry.CurrentInfernos.push({
				UniqueID: entityId,
				ConvexHull2D: hull,
				ConvexHull3D: { Vertices: hull3d }
			});
		}
	}
	CurrentInfernos.sort((a: any, b: any) => a.FrameNumber - b.FrameNumber);

	// Projectile synthetic events (spawn/destroy)
	const projEvents: typeof round.events = [];
	for (const [entityId, g] of round.grenades) {
		projEvents.push({ frame: g.startFrame, type: 32, data: { Projectile: { Type: g.type, UniqueID: entityId } } });
		projEvents.push({ frame: g.endFrame, type: 31, data: { Projectile: { Type: g.type, UniqueID: entityId } } });
	}

	const allEvents = [...round.events, ...projEvents].sort((a, b) => a.frame - b.frame);
	const Events = allEvents.map(e => {
		const out: any = { FrameNumber: e.frame, EventType: e.type };
		if (e.data !== undefined) out.Data = e.data;
		return out;
	});
	Events.sort((a: any, b: any) => a.FrameNumber - b.FrameNumber);

	// Team economics
	const winnerTeam = round.winner;
	const ctStartScore = winnerTeam === 3 ? round.ctEndScore - 1 : round.ctEndScore;
	const tStartScore = winnerTeam === 2 ? round.tEndScore - 1 : round.tEndScore;

	return {
		metaBase,
		RoundIndexDemo: round.roundIndex,
		TerroristEndScore: round.tEndScore,
		CounterTerroristsEndScore: round.ctEndScore,
		Winner: round.winner,
		FreezetimeEndFrameNumber: 1,
		RoundStartState,
		RoundEndState: { FrameNumber: endFrame },
		Players,
		Events,
		PlayersPositions,
		GrenadesPositions,
		CurrentInfernos,
		BombPositions: [],
		TeamEconomics: {
			TeamStats: [
				{ Team: 3, StartScore: ctStartScore },
				{ Team: 2, StartScore: tStartScore }
			],
			TeamToIndex: [0, 0, 1, 0]
		}
	};
}

// ─── Parse & Output ──────────────────────────────────────────────────────────

parser.on('end', () => {
	// Finalize any open round
	if (currentRound && pendingRoundEnd) {
		finalizeRound(pendingRoundEnd.tick);
	}

	console.log(`Parsed ${completedRounds.length} rounds total`);

	const outputDir = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), 'output');
	if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

	let written = 0;
	for (const round of completedRounds) {
		if (round.roundIndex % ROUND_STEP !== 0) continue;
		const replay = buildRoundReplay(round);
		const filename = `round_${round.roundIndex}.json`;
		fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(replay, null, 2));
		console.log(`  Written ${filename} (${round.players.size} players, ${round.events.length} events)`);
		written++;
	}
	console.log(`Output ${written} round files to ${outputDir}`);
});

console.log(`Parsing: ${DEMO_PATH}`);
await parser.parseDemo(DEMO_PATH, { entities: EntityMode.ALL });
