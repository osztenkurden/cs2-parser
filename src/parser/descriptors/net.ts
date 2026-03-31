import {
	CSVCMsg_ClearAllStringTables,
	CSVCMsg_CreateStringTable,
	CSVCMsg_FlattenedSerializer,
	CSVCMsg_PacketEntities,
	CSVCMsg_ServerInfo,
	CSVCMsg_UpdateStringTable,
	// CSVCMsg_UserCommands,
	CSVCMsg_UserMessage,
	SVC_Messages
} from '../../ts-proto/netmessages.js';

//import ImportedCLCMessages = ;

export const netMessages = {
	[SVC_Messages.svc_PacketEntities]: {
		name: 'svc_PacketEntities', // TODO: What name is used for?
		id: SVC_Messages.svc_PacketEntities,
		class: CSVCMsg_PacketEntities
	},
	[SVC_Messages.svc_ServerInfo]: {
		name: 'svc_ServerInfo',
		id: SVC_Messages.svc_ServerInfo,
		class: CSVCMsg_ServerInfo
	},
	[SVC_Messages.svc_FlattenedSerializer]: {
		name: 'svc_FlattenedSerializer',
		id: SVC_Messages.svc_FlattenedSerializer,
		class: CSVCMsg_FlattenedSerializer
	},
	[SVC_Messages.svc_CreateStringTable]: {
		name: 'svc_CreateStringTable',
		id: SVC_Messages.svc_CreateStringTable,
		class: CSVCMsg_CreateStringTable
	},
	[SVC_Messages.svc_UpdateStringTable]: {
		name: 'svc_UpdateStringTable',
		id: SVC_Messages.svc_UpdateStringTable,
		class: CSVCMsg_UpdateStringTable
	},
	[SVC_Messages.svc_ClearAllStringTables]: {
		name: 'svc_ClearAllStringTables',
		id: SVC_Messages.svc_ClearAllStringTables,
		class: CSVCMsg_ClearAllStringTables
	},
	[SVC_Messages.svc_UserMessage]: {
		name: 'svc_UserMessage',
		id: SVC_Messages.svc_UserMessage,
		class: CSVCMsg_UserMessage
	}
	// [SVCMessages.svc_UserCmds]: {
	//   name: "svc_UserCmds",
	//   id: SVCMessages.svc_UserCmds,
	//   class: CSVCMsgUserCommands,
	// },
} as const;
