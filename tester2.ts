import { DemoReader } from './src/index.js';
BigInt.prototype.toJSON = function () {
	return JSON.rawJSON(this.toString());
};
const parser = new DemoReader();

const CELL_BITS = 9;
const MAX_COORD = (1 << 14) * 1.0;
// parser.on('header', event => {
// 	console.log(event);
// });

// parser.on('error', console.log);

// parser.on('end', a => {
// 	console.log('FINITO', a);
// });
// parser.on('debug', console.log);

const getPlayer = (playerId: number, pawnOverride: number) => {
	const player = parser.players[playerId];

	let pawn = parser.entities[pawnOverride];
	if (!pawn) {
		return null;
	}
	pawn.id = pawnOverride;
	return { player, pawn };
};
function coordFromCell(cell, offset) {
	const cellCoord = cell * (1 << CELL_BITS) - MAX_COORD;
	return cellCoord + offset;
}

// parser.on('entityUpdated', console.log);
let p = true;
const demoapth = process.argv[2]; //'C:\\repos\\demofile-net\\demos\\14008.dem';
let patch = 0;
parser.on('header', h => {
	patch = h.patch_version ?? 0;
	// console.log(h.patch_version);
});
// parser.on('svc_UserMessage', msg => {
// 	console.log(msg);
// });
parser.gameEvents.on('player_death', event => {
	const player = parser.players[event.userid];
	// if (player) {
	// 	const health = parser.entities[event.userid_pawn & 0x7ff]?.properties?.['CCSPlayerPawn.m_iHealth'];
	// 	const healthAttacker = parser.entities[event.attacker_pawn & 0x7ff]?.properties?.['CCSPlayerPawn.m_iHealth'];
	// 	console.log(
	// 		`[${parser.currentTick}] ${player.name} ${event.attacker_pawn & 0x7ff} KILLED with ${
	// 			event.weapon
	// 		} (D: ${health}) (A: ${healthAttacker})`
	// 	);
	// 	return;
	// }
	//  if(did) return;
	const info = getPlayer(event.attacker, event.attacker_pawn & 0x7ff);

	if (!info) return;

	const cellX = info.pawn?.properties['CCSPlayerPawn.CBodyComponentBaseAnimGraph.m_cellX'] ?? 0;
	const offsetX = info.pawn?.properties['CCSPlayerPawn.CBodyComponentBaseAnimGraph.m_vecX'] ?? 0;

	const cellY = info.pawn?.properties['CCSPlayerPawn.CBodyComponentBaseAnimGraph.m_cellY'] ?? 0;
	const offsetY = info.pawn?.properties['CCSPlayerPawn.CBodyComponentBaseAnimGraph.m_vecY'] ?? 0;

	const cellZ = info.pawn?.properties['CCSPlayerPawn.CBodyComponentBaseAnimGraph.m_cellZ'] ?? 0;
	const offsetZ = info.pawn?.properties['CCSPlayerPawn.CBodyComponentBaseAnimGraph.m_vecZ'] ?? 0;

	const X = coordFromCell(cellX, offsetX);
	const Y = coordFromCell(cellY, offsetY);
	const Z = coordFromCell(cellZ, offsetZ);

	// console.log(info.pawn?.properties)
	console.log(
		`[${parser.currentTick}] ${info.player.name} ${event.attacker_pawn & 0x7ff} KILLED with ${
			event.weapon
		}, position: ${X} ${Y} ${Z}`
	);
	// console.log('SAVING ENTITY NUMBER', event.attacker_pawn & 0x7ff);
	// fs.writeFileSync('./dump.json', JSON.stringify(info.pawn, null, 2));
	// process.exit(0);
});
parser.on('debug', console.log);
parser.on('error', e => {
	console.log('Tick', parser.currentTick);
	console.log(e);
});
parser.on('end', data => {
	if (!patch) {
		console.log('NO PATCH VERSION?');
	} else {
		console.log(`${patch}:`, !data.error);
	}
});
parser.gameEvents.on('round_end', console.log);
// parser.parseDemo('F:\\ADR\\TEST2.dem', { entities: false });
parser.on('svc_ServerInfo', serverInfo => {
	// console.log(serverInfo.game_session_config?.gamemode);
});
const result = parser.parseDemo(demoapth, { entities: true });

// console.log({ result });
