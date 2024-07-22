import {
  CSVCMsgClearAllStringTables,
  CSVCMsgCreateStringTable,
  CSVCMsgFlattenedSerializer,
  CSVCMsgServerInfo,
  CSVCMsgUpdateStringTable,
  CSVCMsgUserCommands,
  CSVCMsgUserMessage,
  SVCMessages,
} from "../../ts-proto/netmessages";

//import ImportedCLCMessages = ;


export const netMessages = {
  [SVCMessages.svc_ServerInfo]: {
    name: "svc_ServerInfo",
    id: SVCMessages.svc_ServerInfo,
    class: CSVCMsgServerInfo,
  },
  [SVCMessages.svc_FlattenedSerializer]: {
    name: "svc_FlattenedSerializer",
    id: SVCMessages.svc_FlattenedSerializer,
    class: CSVCMsgFlattenedSerializer,
  },
  [SVCMessages.svc_CreateStringTable]: {
    name: "svc_CreateStringTable",
    id: SVCMessages.svc_CreateStringTable,
    class: CSVCMsgCreateStringTable,
  },
  [SVCMessages.svc_UpdateStringTable]: {
    name: "svc_UpdateStringTable",
    id: SVCMessages.svc_UpdateStringTable,
    class: CSVCMsgUpdateStringTable,
  },
  [SVCMessages.svc_ClearAllStringTables]: {
    name: "svc_ClearAllStringTables",
    id: SVCMessages.svc_ClearAllStringTables,
    class: CSVCMsgClearAllStringTables,
  },
  [SVCMessages.svc_UserMessage]: {
    name: "svc_UserMessage",
    id: SVCMessages.svc_UserMessage,
    class: CSVCMsgUserMessage,
  },
  [SVCMessages.svc_UserCmds]: {
    name: "svc_UserCmds",
    id: SVCMessages.svc_UserCmds,
    class: CSVCMsgUserCommands,
  },
} as const;
