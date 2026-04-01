import type {
	CMsgSource1LegacyGameEvent_key_t,
	CMsgSource1LegacyGameEventList_descriptor_t
} from '../../ts-proto/gameevents.js';
import { TypedEventEmitter } from './typedEmitter.js';
import type { GameEventsArguments } from './eventTypes.js';
import type { DemoReader } from './../index.js';
import { annotateGameEvent } from '../../helpers/eventAnnotation.js';
import { EntityMode } from '../entities/types.js';
import type { WinRoundReason } from '../../helpers/gameRules.js';

const SYNTHETIC_EVENTS = new Set(['round_start', 'round_end']);

export class GameEvents extends TypedEventEmitter<GameEventsArguments> {
	private _eventDescriptors!: Record<number, CMsgSource1LegacyGameEventList_descriptor_t>;
	private _demoReader!: DemoReader;

	private eventQueue: (GameEventsArguments[keyof GameEventsArguments] & { event_name: string })[] = [];

	private _entityMode: EntityMode = EntityMode.NONE;
	private _lastRoundStartCount: number | undefined = undefined;
	private _lastRoundEndCount: number | undefined = undefined;

	set entityMode(value: EntityMode) {
		this._entityMode = value;
	}

	listen = (demoReader: DemoReader) => {
		this._demoReader = demoReader;

		demoReader.on('GE_Source1LegacyGameEventList', data => {
			const descriptors = data.descriptors.reduce(
				(acc, descriptor) => {
					if (descriptor.eventid) acc[descriptor.eventid] = descriptor;
					return acc;
				},
				{} as Record<number, CMsgSource1LegacyGameEventList_descriptor_t>
			);
			this._eventDescriptors = descriptors;
		});

		demoReader.on('GE_Source1LegacyGameEvent', gameEvent => {
			const descriptor = this._eventDescriptors[gameEvent.eventid ?? -1];
			if (!descriptor?.name) return;

			// Suppress raw round_start/round_end when entity parsing is active (synthetic versions will be emitted)
			if (this._entityMode !== EntityMode.NONE && SYNTHETIC_EVENTS.has(descriptor.name)) return;

			if (!this.eventNames().includes(descriptor.name) && !this.eventNames().includes('gameEvent')) {
				return;
			}
			const gameEventData = {} as any;

			for (let i = 0; i < gameEvent.keys.length; i++) {
				const ge = gameEvent.keys[i]!;
				const desc = descriptor.keys[i]!;

				const value = parseRawEventData(ge);
				gameEventData[desc.name!] = value;
			}
			gameEventData.event_name = descriptor.name;

			this.eventQueue.push(gameEventData);
		});

		demoReader.on('tickend', () => {
			for (const event of this.eventQueue) {
				annotateGameEvent(this._demoReader, event.event_name, event);
				this.emit(event.event_name, event);
				this.emit('gameEvent', event.event_name, event);
			}
			this.eventQueue = [];

			if (this._entityMode !== EntityMode.NONE) {
				this._checkSyntheticRoundEvents();
			}
		});
	};

	private _checkSyntheticRoundEvents() {
		const gameRules = this._demoReader.gameRules;
		if (!gameRules) return;

		const entity = gameRules.entity;
		if (!entity?.properties) return;

		const props = entity.properties as any;
		const roundEndCount = props['CCSGameRulesProxy.CCSGameRules.m_nRoundEndCount'] as number | undefined;
		const roundStartCount = props['CCSGameRulesProxy.CCSGameRules.m_nRoundStartCount'] as number | undefined;

		// Check round_end first (end of previous round fires before start of new round)
		if (roundEndCount !== undefined) {
			if (this._lastRoundEndCount === undefined) {
				this._lastRoundEndCount = roundEndCount;
			} else if (roundEndCount !== this._lastRoundEndCount) {
				this._lastRoundEndCount = roundEndCount;
				const event = {
					event_name: 'round_end',
					winner: (props['CCSGameRulesProxy.CCSGameRules.m_iRoundEndWinnerTeam'] ?? 0) as number,
					reason: (props['CCSGameRulesProxy.CCSGameRules.m_eRoundEndReason'] ?? 0) as WinRoundReason,
					message: (props['CCSGameRulesProxy.CCSGameRules.m_sRoundEndMessage'] ?? '') as string,
					legacy: (props['CCSGameRulesProxy.CCSGameRules.m_iRoundEndLegacy'] ?? 0) as number,
					player_count: (props['CCSGameRulesProxy.CCSGameRules.m_iRoundEndPlayerCount'] ?? 0) as number,
					nomusic: (props['CCSGameRulesProxy.CCSGameRules.m_bRoundEndNoMusic'] ? 1 : 0) as number
				};
				this.emit('round_end', event);
				this.emit('gameEvent', 'round_end', event);
			}
		}

		// Check round_start
		if (roundStartCount !== undefined) {
			if (this._lastRoundStartCount === undefined) {
				this._lastRoundStartCount = roundStartCount;
			} else if (roundStartCount !== this._lastRoundStartCount) {
				this._lastRoundStartCount = roundStartCount;
				const event = {
					event_name: 'round_start',
					timelimit: (props['CCSGameRulesProxy.CCSGameRules.m_iRoundTime'] ?? 0) as number,
					fraglimit: 0,
					objective: ''
				};
				this.emit('round_start', event);
				this.emit('gameEvent', 'round_start', event);
			}
		}
	}
}

export const parseRawEventData = (data: CMsgSource1LegacyGameEvent_key_t) => {
	switch (data.type) {
		case 1:
			return data.val_string!;
		case 2:
			return data.val_float!;
		case 3:
			return data.val_long!;
		case 4:
			return data.val_short!;
		case 5:
			return data.val_byte!;
		case 6:
			return data.val_bool!;
		case 7:
			return data.val_uint64!;
		case 8:
			return data.val_long! | 0;
		case 9:
			return data.val_short! | 0;
	}
};
