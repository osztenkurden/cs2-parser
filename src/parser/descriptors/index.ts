import type { CDemoFileHeader } from '../../ts-proto/demo.js';
import type { CMsgSource1LegacyGameEvent, CMsgSource1LegacyGameEventList } from '../../ts-proto/gameevents.js';
import type { CSVCMsg_UpdateStringTable } from '../../ts-proto/netmessages.js';
import type { CMsgPlayerInfo } from '../../ts-proto/networkbasetypes.js';
import { gameMessages } from './gameevents.js';
import { netMessages } from './net.js';

export const messages = { ...gameMessages, ...netMessages } as const;

type MakeZigUnionToObject<T extends Record<string, any>> = {
	[K in keyof T]: {
		data: T[K];
		field: K;
	};
}[keyof T];

export type StringTableCreated = {
	data: {
		idx: number;
		key: string;
		value: Uint8Array | null;
	}[];
	name: string;
	user_data_size: number;
	user_data_fixed_size: boolean;
	flags: number;
	using_varint_bitcounts: boolean;
};

export type AvailablePacketContent = {
	CMsgSource1LegacyGameEvent: CMsgSource1LegacyGameEvent;
	CMsgSource1LegacyGameEventList: CMsgSource1LegacyGameEventList;
	svc_CreateStringTable: {
		table: StringTableCreated;
		players: CMsgPlayerInfo[];
	} | null;
	svc_UpdateStringTable: CSVCMsg_UpdateStringTable;
	svc_ClearAllStringTables: 0;
};

export type RawFrameMessages = {
	DEM_FileHeader: CDemoFileHeader;
	DEM_Error: 0;
	DEM_Stop: 0;
	DEM_FileInfo: 0;
	DEM_SyncTick: 0;
	DEM_SendTables: 0;
	DEM_ClassInfo: 0;
	DEM_StringTables: 0;
	DEM_Packet: MakeZigUnionToObject<AvailablePacketContent>[];
	DEM_SignonPacket: MakeZigUnionToObject<AvailablePacketContent>[];
	DEM_ConsoleCmd: 0;
	DEM_CustomData: 0;
	DEM_CustomDataCallbacks: 0;
	DEM_UserCmd: 0;
	DEM_FullPacket: MakeZigUnionToObject<AvailablePacketContent>[];
	DEM_SaveGame: 0;
	DEM_SpawnGroups: 0;
	DEM_AnimationData: 0;
	DEM_AnimationHeader: 0;
	DEM_Max: 0;
	DEM_IsCompressed: 0;
};

export type ZigDataFrames = MakeZigUnionToObject<{
	[K in keyof RawFrameMessages]: { value: RawFrameMessages[K]; tick: bigint };
}>;
