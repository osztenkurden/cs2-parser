import { DemoReader } from './src/index.js';
const demoapth = 'C:\\ADR\\JUSTY.dem';
const parser = new DemoReader();

// parser.on('header', event => {
// 	console.log(event);
// });

// parser.on('error', console.log);

// parser.on('end', a => {
// 	console.log('FINITO', a);
// });
// parser.on('debug', console.log);
parser.gameEvents.on('player_death', event => {
	const player = parser.players[event.attacker];
	const entityId = event.userid_pawn & 0x7ff;
	console.log('Kill on tick', parser.currentTick, entityId, parser.entities[entityId].entityType);
});

parser.on('entityUpdated', console.log);
parser.on('debug', console.log);
// parser.gameEvents.on('round_end', console.log);
// parser.parseDemo('F:\\ADR\\TEST2.dem', { entities: false });
const result = parser.parseDemoInAPool(demoapth, { entities: !false });

console.log({ result });
