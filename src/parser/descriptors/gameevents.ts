import {
	CMsgSource1LegacyGameEvent,
	CMsgSource1LegacyGameEventList,
	EBaseGameEvents
} from '../../ts-proto/gameevents.js';

export const gameMessages = {
	[EBaseGameEvents.GE_Source1LegacyGameEventList]: {
		name: 'GE_Source1LegacyGameEventList',
		id: EBaseGameEvents.GE_Source1LegacyGameEventList,
		class: CMsgSource1LegacyGameEventList
	},
	[EBaseGameEvents.GE_Source1LegacyGameEvent]: {
		name: 'GE_Source1LegacyGameEvent',
		id: EBaseGameEvents.GE_Source1LegacyGameEvent,
		class: CMsgSource1LegacyGameEvent
	}
} as const;
