import { DemoReader } from './dist/index.js';
BigInt.prototype.toJSON = function () {
	return JSON.rawJSON(this.toString());
};
const demoapth = '/home/hubert/TEST2.dem';
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

const getPlayer = (playerId, pawnOverride) => {
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
parser.on('entityCreated', d => {
	if (d[0] === 15254005) console.log('entity with id created', d[0]);
});
let p = true;
console.log(DemoReader.parseHeader(demoapth));
parser.gameEvents.on('player_death', event => {
	const player = parser.players[event.userid];
	if (player) {
		const health = parser.entities[event.userid_pawn & 0x7ff]?.properties?.['CCSPlayerPawn.m_iHealth'];
		const healthAttacker = parser.entities[event.attacker_pawn & 0x7ff]?.properties?.['CCSPlayerPawn.m_iHealth'];
		console.log(
			`[${parser.currentTick}] ${player.name} ${event.attacker_pawn & 0x7ff} KILLED with ${
				event.weapon
			} (D: ${health}) (A: ${healthAttacker})`
		);
		return;
	}
	//  if(did) return;
	const info = getPlayer(event.attacker, event.attacker_pawn & 0x7ff);
	if (!info?.player) {
		return;
	}

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
	// console.log(
	// 	`[${parser.currentTick}] ${info.player.name} ${event.attacker_pawn & 0x7ff} KILLED with ${
	// 		event.weapon
	// 	}, position: ${X} ${Y} ${Z}`
	// );
	// console.log('SAVING ENTITY NUMBER', event.attacker_pawn & 0x7ff);
	// fs.writeFileSync('./dump.json', JSON.stringify(info.pawn, null, 2));
	// process.exit(0);
});
parser.on('debug', console.log);
// parser.gameEvents.on('round_end', console.log);
// parser.parseDemo('F:\\ADR\\TEST2.dem', { entities: false });
parser.on('svc_ServerInfo', serverInfo => {
	console.log(serverInfo.game_session_config?.gamemode);
});

const wait = ms => new Promise(res => setTimeout(res, ms));

const main = async () => {
	let i = 0;

	// while(i <= 10){
	// 	console.log(10 -i);
	// 	await wait(1000);
	// 	i++;
	// }

	const result = parser.parseDemo(demoapth, { entities: true });

	console.log({ result });
};

main();
