import { createReadStream } from 'fs';
import { DemoReader, EntityMode } from './src/index.js';

const mode = 'STREAM' as 'STREAM' | 'MAIN' | 'ASYNC';
const parser = new DemoReader();
const demoPath =
	process.argv[2] ??
	`C:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive\\game\\csgo\\replays\\match730_003809737891798581468_1778215536_388.dem`; // 'E:\\Repositories\\demofile-net-main\\demos\\14140.dem';

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
parser.on('svc_ServerInfo', console.log);
parser.on('debug', console.log);
if (mode === 'STREAM') {
	await parser.parseDemo(createReadStream(demoPath), { entities: EntityMode.ALL });
} else if (mode === 'MAIN') {
	parser.parseDemo(demoPath, { entities: EntityMode.ALL });
} else if (mode === 'ASYNC') {
	await parser.parseDemo(demoPath, { entities: EntityMode.ALL, stream: true });
}
