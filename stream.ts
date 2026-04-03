import { createReadStream, readFileSync } from 'fs';
import { DemoReader, EntityMode } from './src/index.js';

const MODES = ['path-stream', 'path-chunked', 'buffer', 'stream'] as const;
type Mode = (typeof MODES)[number];

const args = process.argv.slice(2);
let compareTarget: string | null = null;

// Parse --compare <file> flag
const compareIdx = args.indexOf('--compare');
if (compareIdx !== -1) {
	compareTarget = args[compareIdx + 1] ?? null;
	args.splice(compareIdx, 2);
}

const mode = args[0] as Mode | undefined;
const demoPath = args[1];

if (!mode || !MODES.includes(mode) || !demoPath) {
	console.error(`Usage: bun stream.ts <${MODES.join('|')}> <path-to-demo> [--compare <reference-file>]`);
	process.exit(1);
}

const cancelAfter = false;//args[2] ? parseInt(args[2]) : false;

const output: string[] = [];
const log = (line: string) => {
	output.push(line);
	console.log(line);
};

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

	log(
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
	log(text);
});

parser.on('end', () => {
	// parser.players is always available (from string tables), even without entities
	log('\n=== Final Scoreboard ===');
	for (const pc of parser.playerControllers) {
		if (pc.teamNumber < 2) continue;
		const pos = pc.position;
		log(
			`  ${pc.name.padEnd(12)} team:${pc.teamNumber} k/d/a:${pc.kills}/${pc.deaths}/${pc.assists} money:$${pc.money}` +
				(pos ? ` pos:${pos.x.toFixed(0)},${pos.y.toFixed(0)},${pos.z.toFixed(0)}` : '')
		);
	}

	// parser.players works even with EntityMode.NONE
	log('\n=== Player Info (always available) ===');
	for (const p of parser.players) {
		log(`  ${p.name?.padEnd(12)} steamid:${p.steamid}`);
	}

	if (compareTarget) {
		compare(compareTarget);
	}
});
parser.on('header', console.log);
// parser.on('svc_ServerInfo', console.log);
parser.on('debug', console.log);

function compare(refPath: string) {
	const reference = readFileSync(refPath, 'utf-8');
	const refLines = reference.split('\n').filter(l => l.length > 0);
	const outLines = output.filter(l => l.trim().length > 0);

	let mismatches = 0;
	const maxLines = Math.max(refLines.length, outLines.length);

	for (let i = 0; i < maxLines; i++) {
		const ref = refLines[i] ?? '<missing>';
		const out = outLines[i] ?? '<missing>';
		if (ref !== out) {
			if (mismatches === 0) console.log('\n=== Compare: DIFFERENCES FOUND ===');
			mismatches++;
			console.log(`  line ${i + 1}:`);
			console.log(`    expected: ${ref}`);
			console.log(`    actual:   ${out}`);
		}
	}

	if (mismatches === 0) {
		console.log('\n=== Compare: OK (output matches reference) ===');
	} else {
		console.log(`\n=== Compare: ${mismatches} difference(s) found ===`);
		process.exitCode = 1;
	}
}
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
