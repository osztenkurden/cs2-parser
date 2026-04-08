import type { CDemoFileHeader } from '../../ts-proto/demo.js';
import type { CMsgSource1LegacyGameEventList, CMsgSource1LegacyGameEvent } from '../../ts-proto/gameevents.js';
import type { CSVCMsg_ServerInfo, MessageFns, SVC_Messages } from '../../ts-proto/netmessages.js';
import type { optionalSvcMessages } from '../descriptors/svc.js';
import type { createStringTable, updateStringTable } from '../stringtables.js';
import type { EntityTypeEnum } from './entityParser.js';

export const EntityMode = {
	NONE: 0,
	ALL: 1,
	ONLY_GAME_RULES: 2
} as const;

export type EntityMode = (typeof EntityMode)[keyof typeof EntityMode];

// type Replace<I extends Record<string, any>, U extends Record<string, any>> = Omit<I, keyof U> & U;

type _OptionalMessagesMap<T extends Record<string, number>, E extends Record<number, MessageFns<any>>> = {
	[K in keyof T]: T[K] extends keyof E ? ReturnType<E[T[K]]['decode']> : never;
};

type OptionalMessagesMap<
	T extends Record<string, number>,
	E extends Record<number, any>,
	D extends Record<string, any> = _OptionalMessagesMap<T, E>
> = {
	[K in {
		[Z in keyof D]: D[Z] extends never ? never : Z;
	}[keyof D]]: D[K];
};
export type IdToName<T extends Record<string, number>> = {
	[K in keyof T as T[K]]: K;
};

type OptionalSVCMessages = OptionalMessagesMap<typeof SVC_Messages, typeof optionalSvcMessages>;
export interface OnDemandEvents extends OptionalSVCMessages {}
export interface OutputEvents extends OnDemandEvents {
	progress: number;
	end: { incomplete: boolean; error?: any };
	error: { error: Error };
	tickstart: number;
	tickend: number;
	header: CDemoFileHeader;
	gameeventlist: CMsgSource1LegacyGameEventList;
	gameevent: CMsgSource1LegacyGameEvent;
	clearallstringtables: never;
	createstringtable: null | NonNullable<ReturnType<typeof createStringTable>>;
	updatestringtable: NonNullable<ReturnType<typeof updateStringTable>>;
	serverinfo: CSVCMsg_ServerInfo;
	cancel: never;
	debug: string;
	entitycreated: [entityId: number, classId: number, entityType: EntityTypeEnum, className: string];
	entityupdated: { entityId: number; value: any; propId: number };
	entitydeleted: number;
}

export type emit = <T extends keyof OutputEvents>(eventName: T, ...data: OutputEvents[T][]) => void;

export type EmitQueue = (data: EventQueue, index: number, available: false) => void;

export type EventQueueElement = {
	[E in keyof OutputEvents]: [E, OutputEvents[E]];
}[keyof OutputEvents];

export type EventQueue = EventQueueElement[];
