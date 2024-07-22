import {
  CDemoClassInfo,
  CDemoConsoleCmd,
  CDemoCustomData,
  CDemoCustomDataCallbacks,
  CDemoFileHeader,
  CDemoFileInfo,
  CDemoFullPacket,
  CDemoPacket,
  CDemoSaveGame,
  CDemoSendTables,
  CDemoSpawnGroups,
  CDemoStringTables,
  CDemoSyncTick,
  CDemoUserCmd,
  EDemoCommands,
} from "../ts-proto/demo";

export const decoders = {
  //  [EDemoCommands.DEM_Error]: null,
  //  [EDemoCommands.DEM_Stop]: null,
  [EDemoCommands.DEM_FileHeader]: {
    type: EDemoCommands.DEM_FileHeader,
    decode: CDemoFileHeader.decode,
  },
  [EDemoCommands.DEM_FileInfo]: {
    type: EDemoCommands.DEM_FileInfo,
    decode: CDemoFileInfo.decode,
  },
  [EDemoCommands.DEM_SyncTick]: {
    type: EDemoCommands.DEM_SyncTick,
    decode: CDemoSyncTick.decode,
  },
  [EDemoCommands.DEM_SendTables]: {
    type: EDemoCommands.DEM_SendTables,
    decode: CDemoSendTables.decode,
  },
  [EDemoCommands.DEM_ClassInfo]: {
    type: EDemoCommands.DEM_ClassInfo,
    decode: CDemoClassInfo.decode,
  },
  [EDemoCommands.DEM_StringTables]: {
    type: EDemoCommands.DEM_StringTables,
    decode: CDemoStringTables.decode,
  },
  [EDemoCommands.DEM_Packet]: {
    type: EDemoCommands.DEM_Packet,
    decode: CDemoPacket.decode,
  },
  [EDemoCommands.DEM_SignonPacket]: {
    type: EDemoCommands.DEM_SignonPacket,
    decode: CDemoPacket.decode,
  },
  [EDemoCommands.DEM_ConsoleCmd]: {
    type: EDemoCommands.DEM_ConsoleCmd,
    decode: CDemoConsoleCmd.decode,
  },
  [EDemoCommands.DEM_CustomData]: {
    type: EDemoCommands.DEM_CustomData,
    decode: CDemoCustomData.decode,
  },
  [EDemoCommands.DEM_CustomDataCallbacks]: {
    type: EDemoCommands.DEM_CustomDataCallbacks,
    decode: CDemoCustomDataCallbacks.decode,
  },
  [EDemoCommands.DEM_UserCmd]: {
    type: EDemoCommands.DEM_UserCmd,
    decode: CDemoUserCmd.decode,
  },
  [EDemoCommands.DEM_FullPacket]: {
    type: EDemoCommands.DEM_FullPacket,
    decode: CDemoFullPacket.decode,
  },
  [EDemoCommands.DEM_SaveGame]: {
    type: EDemoCommands.DEM_SaveGame,
    decode: CDemoSaveGame.decode,
  },
  [EDemoCommands.DEM_SpawnGroups]: {
    type: EDemoCommands.DEM_SpawnGroups,
    decode: CDemoSpawnGroups.decode,
  },
  // [EDemoCommands.DEM_AnimationData]: null,//CDemoAnimationData.decode,
  //  [EDemoCommands.DEM_AnimationHeader]: null,//CDemoAnimationHeader.decode,
  //  [EDemoCommands.DEM_Max]: null,
  // [EDemoCommands.DEM_IsCompressed]: null,
} as const;

export type DecoderKeys = keyof typeof decoders;
export type Decoders = typeof decoders;
