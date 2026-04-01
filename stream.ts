import { createReadStream, readFileSync } from 'fs';
import { DemoReader, EntityMode } from './src/index.js';

const MODES = ['path-stream', 'path-chunked', 'buffer', 'stream'] as const;
type Mode = (typeof MODES)[number];

const mode = process.argv[2] as Mode | undefined;
const demoPath = process.argv[3];

if (!mode || !MODES.includes(mode) || !demoPath) {
	console.error(`Usage: bun stream.ts <${MODES.join('|')}> <path-to-demo>`);
	process.exit(1);
}

const cancelAfter = process.argv[4] ? parseInt(process.argv[4]) : false;

const parser = new DemoReader();

// Game events are available with EntityMode.ALL or EntityMode.ONLY_GAME_RULES
parser.gameEvents.on('player_death', event => {
	// event.attackerPlayer / event.player are auto-resolved Player helpers
	const attackerInfo = parser.players[event.attacker];
	const attacker = event.attackerPlayer;
	const victim = event.player;

	if (!attacker || !victim) return;

	const pos = attacker.position;
	const victimPos = victim.position;

	console.log(
		`[${parser.currentTick}] ${attacker.name} (${attackerInfo?.name}) (${attacker.health}hp) killed ${victim.name} with ${event.weapon}${event.headshot ? ' (HS)' : ''}` +
			(pos ? ` from ${pos.x.toFixed(0)},${pos.y.toFixed(0)},${pos.z.toFixed(0)}` : '') +
			(victimPos ? ` at ${victimPos.x.toFixed(0)},${victimPos.y.toFixed(0)},${victimPos.z.toFixed(0)}` : '')
	);
});

// Round end shows team scores via helpers
parser.gameEvents.on('round_end', data => {
	const rules = parser.gameRules;
	let text = `[${parser.currentTick}] `;
	if (rules) {
		text += `Round ${rules.roundsPlayed} ended | phase: ${rules.phase} |`;
	}
	for (const team of parser.teams) {
		if (team.teamNumber < 2) continue;
		text += `  ${team.clanName || team.teamName}: ${team.score}`;
	}
	console.log(text);
});

parser.on('end', () => {
	// parser.players is always available (from string tables), even without entities
	console.log('\n=== Final Scoreboard ===');
	for (const pc of parser.playerControllers) {
		if (pc.teamNumber < 2) continue;
		const pos = pc.position;
		console.log(
			`  ${pc.name.padEnd(12)} team:${pc.teamNumber} k/d/a:${pc.kills}/${pc.deaths}/${pc.assists} money:$${pc.money}` +
				(pos ? ` pos:${pos.x.toFixed(0)},${pos.y.toFixed(0)},${pos.z.toFixed(0)}` : '')
		);
	}

	// parser.players works even with EntityMode.NONE
	console.log('\n=== Player Info (always available) ===');
	for (const p of parser.players) {
		console.log(`  ${p.name?.padEnd(12)} steamid:${p.steamid}`);
	}
});
parser.on('header', console.log);
// parser.on('svc_ServerInfo', console.log);
parser.on('debug', console.log);
if(cancelAfter !== false){
	setTimeout(() => {
		parser.cancel();
	}, cancelAfter)
}
switch (mode) {
	case 'path-stream':
		await parser.parseDemo(demoPath, { entities: EntityMode.ALL });
		break;
	case 'path-chunked':
		await parser.parseDemo(demoPath, { entities: EntityMode.ALL, stream: false });
		break;
	case 'buffer':
		await parser.parseDemo(readFileSync(demoPath), { entities: EntityMode.ALL });
		break;
	case 'stream':
		await parser.parseDemo(createReadStream(demoPath), { entities: EntityMode.ALL });
		break;
}
