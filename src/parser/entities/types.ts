import type { CDemoFileHeader } from '../../ts-proto/demo.js';
import type { CMsgSource1LegacyGameEventList, CMsgSource1LegacyGameEvent } from '../../ts-proto/gameevents.js';
import type { CSVCMsg_ServerInfo, CSVCMsg_UserMessage } from '../../ts-proto/netmessages.js';
import type { createStringTable } from '../stringtables.js';
import type { EntityTypeEnum } from './entityParser.js';

export const EntityMode = {
	NONE: 0,
	ALL: 1,
	ONLY_GAME_RULES: 2
} as const;

export type EntityMode = (typeof EntityMode)[keyof typeof EntityMode];

export type OutputEvents = {
	progress: number;
	end: { incomplete: boolean; error?: any };
	error: { error: Error };
	tickstart: number;
	tickend: number;
	header: CDemoFileHeader;
	GE_Source1LegacyGameEventList: CMsgSource1LegacyGameEventList;
	GE_Source1LegacyGameEvent: CMsgSource1LegacyGameEvent;
	svc_ClearAllStringTables: null;
	svc_CreateStringTable: null | NonNullable<ReturnType<typeof createStringTable>>;
	svc_ServerInfo: CSVCMsg_ServerInfo;
	cancel: never,
	debug: string;
	entityCreated: [entityId: number, classId: number, entityType: EntityTypeEnum, className: string];
	entityUpdated: { entityId: number; value: any; propId: number };
	entityDeleted: number;
	svc_UserMessage: CSVCMsg_UserMessage;
};

export type emit = <T extends keyof OutputEvents>(eventName: T, data: OutputEvents[T]) => void;

export type EmitQueue = (data: EventQueue, index: number, available: false) => void;

export type EventQueueElement = {
	[E in keyof OutputEvents]: [E, OutputEvents[E]];
}[keyof OutputEvents];

export type EventQueue = EventQueueElement[];
