import type { DemoReader } from '../parser/index.js';
import type { Player } from './player.js';

/**
 * Annotates a game event with resolved Player helper references.
 * The userid/attacker/assister fields are userinfo slot indices (NOT entity IDs).
 * We look up the CMsgPlayerInfo by slot, then match to a controller entity by name.
 */
export function annotateGameEvent(
	parser: DemoReader,
	eventName: string,
	event: Record<string, any>
): Record<string, any> {
	if ('userid' in event && eventName !== 'player_connect') {
		event.player = resolvePlayerByUserSlot(parser, event.userid) ?? null;
	}

	if ('attacker' in event) {
		event.attackerPlayer = resolvePlayerByUserSlot(parser, event.attacker) ?? null;
	}

	if ('assister' in event) {
		event.assisterPlayer = resolvePlayerByUserSlot(parser, event.assister) ?? null;
	}

	return event;
}

function resolvePlayerByUserSlot(parser: DemoReader, userSlot: number): Player | null {
	if (userSlot === undefined) return null;

	const slot = userSlot & 0xff;
	if (slot === 0xff) return null; // 0xFF = no player
	const info = parser.players[slot];
	if (!info) return null;

	// Match to a controller entity by steamid
	const steamId = String(info.steamid);
	for (const pc of parser.playerControllers) {
		if (pc.steamId === steamId) return pc;
	}

	return null;
}
