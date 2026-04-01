// AUTO-GENERATED - DO NOT EDIT
// Generated from demo: demo.dem on 2026-04-01

/** Prefixes all keys of T with "P." */
type Prefixed<P extends string, T> = {
	readonly [K in keyof T as K extends string ? `${P}.${K}` : never]: T[K];
};

interface _CBodyComponentBaseAnimGraph {
	readonly "m_angRotation"?: [number, number, number];
	readonly "m_bClientClothCreationSuppressed"?: boolean;
	readonly "m_bIsAnimationEnabled"?: boolean;
	readonly "m_bUseParentRenderBounds"?: boolean;
	readonly "m_cellX"?: number;
	readonly "m_cellY"?: number;
	readonly "m_cellZ"?: number;
	readonly "m_flLastTeleportTime"?: number;
	readonly "m_flPlaybackRate"?: number;
	readonly "m_flScale"?: number;
	readonly "m_flSeqFixedCycle"?: number;
	readonly "m_flSeqStartTime"?: number;
	readonly "m_hGraphDefinitionAG2"?: bigint;
	readonly "m_hierarchyAttachName"?: number;
	readonly "m_hModel"?: bigint;
	readonly "m_hParent"?: number;
	readonly "m_hSequence"?: bigint;
	readonly "m_materialGroup"?: number;
	readonly "m_MeshGroupMask"?: bigint;
	readonly "m_name"?: number;
	readonly "m_nAnimationAlgorithm"?: number;
	readonly "m_nAnimLoopMode"?: number;
	readonly "m_nBodyGroupChoices"?: number;
	readonly "m_nBoolVariablesCount"?: number;
	readonly "m_nHitboxSet"?: number;
	readonly "m_nIdealMotionType"?: number;
	readonly "m_nOutsideWorld"?: number;
	readonly "m_nOwnerOnlyBoolVariablesCount"?: number;
	readonly "m_nRandomSeedOffset"?: number;
	readonly "m_nSecondarySkeletonMasterCount"?: number;
	readonly "m_nSerializePoseRecipeSizeAG2"?: number;
	readonly "m_nSerializePoseRecipeVersionAG2"?: number;
	readonly "m_nServerGraphInstanceIteration"?: number;
	readonly "m_nServerSerializationContextIteration"?: number;
	readonly "m_OwnerOnlyPredNetBoolVariables"?: number;
	readonly "m_OwnerOnlyPredNetByteVariables"?: number;
	readonly "m_OwnerOnlyPredNetFloatVariables"?: number;
	readonly "m_OwnerOnlyPredNetGlobalSymbolVariables"?: number;
	readonly "m_OwnerOnlyPredNetIntVariables"?: number;
	readonly "m_OwnerOnlyPredNetQuaternionVariables"?: number;
	readonly "m_OwnerOnlyPredNetUInt16Variables"?: number;
	readonly "m_OwnerOnlyPredNetUInt32Variables"?: number;
	readonly "m_OwnerOnlyPredNetUInt64Variables"?: number;
	readonly "m_OwnerOnlyPredNetVectorVariables"?: [number, number, number];
	readonly "m_PredBoolVariables"?: number;
	readonly "m_PredByteVariables"?: number;
	readonly "m_PredFloatVariables"?: number;
	readonly "m_PredGlobalSymbolVariables"?: number;
	readonly "m_PredIntVariables"?: number;
	readonly "m_PredQuaternionVariables"?: number;
	readonly "m_PredUInt16Variables"?: number;
	readonly "m_PredUInt32Variables"?: number;
	readonly "m_PredUInt64Variables"?: number;
	readonly "m_PredVectorVariables"?: [number, number, number];
	readonly "m_primaryGraphId"?: number;
	readonly "m_serializedPoseRecipeAG2"?: number;
	readonly "m_vecExternalClipIds"?: number;
	readonly "m_vecExternalGraphIds"?: number;
	readonly "m_vecSecondarySkeletons"?: number;
	readonly "m_vecX"?: number;
	readonly "m_vecY"?: number;
	readonly "m_vecZ"?: number;
}

interface _CBodyComponentBaseModelEntity {
	readonly "m_angRotation"?: [number, number, number];
	readonly "m_bClientClothCreationSuppressed"?: boolean;
	readonly "m_bIsAnimationEnabled"?: boolean;
	readonly "m_bUseParentRenderBounds"?: boolean;
	readonly "m_cellX"?: number;
	readonly "m_cellY"?: number;
	readonly "m_cellZ"?: number;
	readonly "m_flScale"?: number;
	readonly "m_hierarchyAttachName"?: number;
	readonly "m_hModel"?: bigint;
	readonly "m_hParent"?: number;
	readonly "m_materialGroup"?: number;
	readonly "m_MeshGroupMask"?: bigint;
	readonly "m_name"?: number;
	readonly "m_nBodyGroupChoices"?: number;
	readonly "m_nHitboxSet"?: number;
	readonly "m_nIdealMotionType"?: number;
	readonly "m_nOutsideWorld"?: number;
	readonly "m_vecX"?: number;
	readonly "m_vecY"?: number;
	readonly "m_vecZ"?: number;
}

interface _CBodyComponentPoint {
	readonly "m_angRotation"?: [number, number, number];
	readonly "m_cellX"?: number;
	readonly "m_cellY"?: number;
	readonly "m_cellZ"?: number;
	readonly "m_flScale"?: number;
	readonly "m_hierarchyAttachName"?: number;
	readonly "m_hParent"?: number;
	readonly "m_name"?: number;
	readonly "m_nOutsideWorld"?: number;
	readonly "m_vecX"?: number;
	readonly "m_vecY"?: number;
	readonly "m_vecZ"?: number;
}

interface _CCSGameRules {
	readonly "m_arrProhibitedItemIndices"?: number;
	readonly "m_arrTournamentActiveCasterAccounts"?: number;
	readonly "m_bAnyHostageReached"?: boolean;
	readonly "m_bBlockersPresent"?: boolean;
	readonly "m_bBombDropped"?: boolean;
	readonly "m_bBombPlanted"?: boolean;
	readonly "m_bCTCantBuy"?: boolean;
	readonly "m_bCTTimeOutActive"?: boolean;
	readonly "m_bFreezePeriod"?: boolean;
	readonly "m_bGamePaused"?: boolean;
	readonly "m_bGameRestart"?: boolean;
	readonly "m_bHasMatchStarted"?: boolean;
	readonly "m_bIsDroppingItems"?: boolean;
	readonly "m_bIsHltvActive"?: boolean;
	readonly "m_bIsQuestEligible"?: boolean;
	readonly "m_bIsQueuedMatchmaking"?: boolean;
	readonly "m_bIsValveDS"?: boolean;
	readonly "m_bLogoMap"?: boolean;
	readonly "m_bMapHasBombTarget"?: boolean;
	readonly "m_bMapHasBuyZone"?: boolean;
	readonly "m_bMapHasRescueZone"?: boolean;
	readonly "m_bMatchWaitingForResume"?: boolean;
	readonly "m_bPlayAllStepSoundsOnServer"?: boolean;
	readonly "m_bRoundEndNoMusic"?: boolean;
	readonly "m_bRoundEndShowTimerDefend"?: boolean;
	readonly "m_bRoundInProgress"?: boolean;
	readonly "m_bTCantBuy"?: boolean;
	readonly "m_bTeamIntroPeriod"?: boolean;
	readonly "m_bTechnicalTimeOut"?: boolean;
	readonly "m_bTerroristTimeOutActive"?: boolean;
	readonly "m_bWarmupPeriod"?: boolean;
	readonly "m_eRoundEndReason"?: number;
	readonly "m_eRoundWinReason"?: number;
	readonly "m_flCMMItemDropRevealEndTime"?: number;
	readonly "m_flCMMItemDropRevealStartTime"?: number;
	readonly "m_flCTTimeOutRemaining"?: number;
	readonly "m_flGameStartTime"?: number;
	readonly "m_flNextRespawnWave"?: number;
	readonly "m_flRestartRoundTime"?: number;
	readonly "m_flTerroristTimeOutRemaining"?: number;
	readonly "m_fMatchStartTime"?: number;
	readonly "m_fRoundStartTime"?: number;
	readonly "m_fWarmupPeriodEnd"?: number;
	readonly "m_fWarmupPeriodStart"?: number;
	readonly "m_gamePhase"?: number;
	readonly "m_hBombPlanter"?: number;
	readonly "m_iBombSite"?: number;
	readonly "m_iFirstSecondHalfRound"?: number;
	readonly "m_iFreezeTime"?: number;
	readonly "m_iHostagesRemaining"?: number;
	readonly "m_iMatchStats_PlayersAlive_CT"?: number;
	readonly "m_iMatchStats_PlayersAlive_T"?: number;
	readonly "m_iMatchStats_RoundResults"?: number;
	readonly "m_iNumConsecutiveCTLoses"?: number;
	readonly "m_iNumConsecutiveTerroristLoses"?: number;
	readonly "m_iRoundEndFunFactData1"?: number;
	readonly "m_iRoundEndFunFactData2"?: number;
	readonly "m_iRoundEndFunFactData3"?: number;
	readonly "m_iRoundEndFunFactPlayerSlot"?: number;
	readonly "m_iRoundEndLegacy"?: number;
	readonly "m_iRoundEndPlayerCount"?: number;
	readonly "m_iRoundEndTimerTime"?: number;
	readonly "m_iRoundEndWinnerTeam"?: number;
	readonly "m_iRoundStartRoundNumber"?: number;
	readonly "m_iRoundTime"?: number;
	readonly "m_iRoundWinStatus"?: number;
	readonly "m_iSpectatorSlotCount"?: number;
	readonly "m_MatchDevice"?: number;
	readonly "m_MinimapVerticalSectionHeights"?: number;
	readonly "m_nCTTeamIntroVariant"?: number;
	readonly "m_nCTTimeOuts"?: number;
	readonly "m_nEndMatchMapGroupVoteOptions"?: number;
	readonly "m_nEndMatchMapGroupVoteTypes"?: number;
	readonly "m_nEndMatchMapVoteWinner"?: number;
	readonly "m_nHalloweenMaskListSeed"?: number;
	readonly "m_nMatchAbortedEarlyReason"?: number;
	readonly "m_nMatchEndCount"?: number;
	readonly "m_nMatchSeed"?: number;
	readonly "m_nNextMapInMapgroup"?: number;
	readonly "m_nOvertimePlaying"?: number;
	readonly "m_nPauseStartTick"?: number;
	readonly "m_nQueuedMatchmakingMode"?: number;
	readonly "m_nRoundEndCount"?: number;
	readonly "m_nRoundsPlayedThisPhase"?: number;
	readonly "m_nRoundStartCount"?: number;
	readonly "m_nTerroristTimeOuts"?: number;
	readonly "m_nTotalPausedTicks"?: number;
	readonly "m_nTournamentPredictionsPct"?: number;
	readonly "m_nTTeamIntroVariant"?: number;
	readonly "m_numBestOfMaps"?: number;
	readonly "m_sRoundEndFunFactToken"?: string;
	readonly "m_sRoundEndMessage"?: string;
	readonly "m_szMatchStatTxt"?: string;
	readonly "m_szTournamentEventName"?: string;
	readonly "m_szTournamentEventStage"?: string;
	readonly "m_szTournamentPredictionsTxt"?: string;
	readonly "m_TeamRespawnWaveTimes"?: number;
	readonly "m_timeUntilNextPhaseStarts"?: number;
	readonly "m_totalRoundsPlayed"?: number;
	readonly "m_vMinimapMaxs"?: [number, number, number];
	readonly "m_vMinimapMins"?: [number, number, number];
}

interface _CCSPlayer_ActionTrackingServices {
	readonly "m_bIsRescuing"?: boolean;
	readonly "m_nCount"?: number;
	readonly "m_nItemDefIndex"?: number;
	readonly "WeaponPurchaseCount_t.m_nCount"?: number;
	readonly "WeaponPurchaseCount_t.m_nItemDefIndex"?: number;
}

interface _CCSPlayer_BulletServices {
	readonly "m_totalHitsOnServer"?: number;
}

interface _CCSPlayer_BuyServices {
	readonly "m_bPrevHelmet"?: boolean;
	readonly "m_hItem"?: bigint;
	readonly "m_nCost"?: number;
	readonly "m_nPrevArmor"?: number;
	readonly "m_unDefIdx"?: number;
	readonly "SellbackPurchaseEntry_t.m_bPrevHelmet"?: boolean;
	readonly "SellbackPurchaseEntry_t.m_hItem"?: bigint;
	readonly "SellbackPurchaseEntry_t.m_nCost"?: number;
	readonly "SellbackPurchaseEntry_t.m_nPrevArmor"?: number;
	readonly "SellbackPurchaseEntry_t.m_unDefIdx"?: number;
}

interface _CCSPlayer_CameraServices {
	readonly "localBits"?: number;
	readonly "localSound"?: [number, number, number];
	readonly "m_flCsViewPunchAngleTickRatio"?: number;
	readonly "m_flFOVRate"?: number;
	readonly "m_flFOVTime"?: number;
	readonly "m_hColorCorrectionCtrl"?: number;
	readonly "m_hCtrl"?: number;
	readonly "m_hTonemapController"?: number;
	readonly "m_hViewEntity"?: number;
	readonly "m_hZoomOwner"?: number;
	readonly "m_iFOV"?: number;
	readonly "m_iFOVStart"?: number;
	readonly "m_nCsViewPunchAngleTick"?: number;
	readonly "m_PostProcessingVolumes"?: number;
	readonly "m_vecCsViewPunchAngle"?: [number, number, number];
	readonly "soundEventHash"?: number;
	readonly "soundscapeEntityListIndex"?: number;
	readonly "soundscapeIndex"?: number;
}

interface _CCSPlayer_HostageServices {
	readonly "m_hCarriedHostage"?: number;
	readonly "m_hCarriedHostageProp"?: number;
}

interface _CCSPlayer_ItemServices {
	readonly "m_bHasDefuser"?: boolean;
	readonly "m_bHasHelmet"?: boolean;
}

interface _CCSPlayer_MovementServices {
	readonly "m_arrForceSubtickMoveWhen"?: number;
	readonly "m_bDesiresDuck"?: boolean;
	readonly "m_bDucked"?: boolean;
	readonly "m_bDucking"?: boolean;
	readonly "m_bDuckOverride"?: boolean;
	readonly "m_bJumpApexPending"?: boolean;
	readonly "m_bOldJumpPressed"?: boolean;
	readonly "m_bWasSurfing"?: boolean;
	readonly "m_flDuckAmount"?: number;
	readonly "m_flDuckOffset"?: number;
	readonly "m_flDuckSpeed"?: number;
	readonly "m_flFallVelocity"?: number;
	readonly "m_flLastActualJumpPressFrac"?: number;
	readonly "m_flLastDuckTime"?: number;
	readonly "m_flLastJumpFrac"?: number;
	readonly "m_flLastJumpVelocityZ"?: number;
	readonly "m_flLastLandedFrac"?: number;
	readonly "m_flLastLandedVelocityX"?: number;
	readonly "m_flLastLandedVelocityY"?: number;
	readonly "m_flLastLandedVelocityZ"?: number;
	readonly "m_flLastUsableJumpPressFrac"?: number;
	readonly "m_flMaxspeed"?: number;
	readonly "m_flOffsetTickCompleteTime"?: number;
	readonly "m_flOffsetTickStashedSpeed"?: number;
	readonly "m_flStamina"?: number;
	readonly "m_fStashGrenadeParameterWhen"?: number;
	readonly "m_nButtonDownMaskPrev"?: bigint;
	readonly "m_nDuckJumpTimeMsecs"?: number;
	readonly "m_nDuckTimeMsecs"?: number;
	readonly "m_nGameCodeHasMovedPlayerAfterCommand"?: number;
	readonly "m_nJumpTimeMsecs"?: number;
	readonly "m_nLadderSurfacePropIndex"?: number;
	readonly "m_nLastActualJumpPressTick"?: number;
	readonly "m_nLastJumpTick"?: number;
	readonly "m_nLastLandedTick"?: number;
	readonly "m_nLastUsableJumpPressTick"?: number;
	readonly "m_nToggleButtonDownMask"?: bigint;
}

interface _CCSPlayer_PingServices {
	readonly "m_hPlayerPing"?: number;
}

interface _CCSPlayer_WeaponServices {
	readonly "m_bBlockInspectUntilNextGraphUpdate"?: boolean;
	readonly "m_bIsHoldingLookAtWeapon"?: boolean;
	readonly "m_bIsLookingAtWeapon"?: boolean;
	readonly "m_flNextAttack"?: number;
	readonly "m_hActiveWeapon"?: number;
	readonly "m_hLastWeapon"?: number;
	readonly "m_hMyWeapons"?: number;
	readonly "m_iAmmo"?: number;
	readonly "m_networkAnimTiming"?: number;
}

interface _CCSPlayerController_ActionTrackingServices {
	readonly "CSPerRoundStats_t.m_iAssists"?: number;
	readonly "CSPerRoundStats_t.m_iCashEarned"?: number;
	readonly "CSPerRoundStats_t.m_iDamage"?: number;
	readonly "CSPerRoundStats_t.m_iDeaths"?: number;
	readonly "CSPerRoundStats_t.m_iEnemiesFlashed"?: number;
	readonly "CSPerRoundStats_t.m_iEquipmentValue"?: number;
	readonly "CSPerRoundStats_t.m_iHeadShotKills"?: number;
	readonly "CSPerRoundStats_t.m_iKillReward"?: number;
	readonly "CSPerRoundStats_t.m_iKills"?: number;
	readonly "CSPerRoundStats_t.m_iLiveTime"?: number;
	readonly "CSPerRoundStats_t.m_iMoneySaved"?: number;
	readonly "CSPerRoundStats_t.m_iObjective"?: number;
	readonly "CSPerRoundStats_t.m_iUtilityDamage"?: number;
	readonly "m_flTotalRoundDamageDealt"?: number;
	readonly "m_iAssists"?: number;
	readonly "m_iCashEarned"?: number;
	readonly "m_iDamage"?: number;
	readonly "m_iDeaths"?: number;
	readonly "m_iEnemiesFlashed"?: number;
	readonly "m_iEnemy3Ks"?: number;
	readonly "m_iEnemy4Ks"?: number;
	readonly "m_iEnemy5Ks"?: number;
	readonly "m_iEnemyKnifeKills"?: number;
	readonly "m_iEnemyTaserKills"?: number;
	readonly "m_iEquipmentValue"?: number;
	readonly "m_iHeadShotKills"?: number;
	readonly "m_iKillReward"?: number;
	readonly "m_iKills"?: number;
	readonly "m_iLiveTime"?: number;
	readonly "m_iMoneySaved"?: number;
	readonly "m_iNumRoundKills"?: number;
	readonly "m_iNumRoundKillsHeadshots"?: number;
	readonly "m_iObjective"?: number;
	readonly "m_iUtilityDamage"?: number;
}

interface _CCSPlayerController_DamageServices {
	readonly "CDamageRecord.m_bIsOtherEnemy"?: boolean;
	readonly "CDamageRecord.m_DamagerXuid"?: bigint;
	readonly "CDamageRecord.m_flActualHealthRemoved"?: number;
	readonly "CDamageRecord.m_flDamage"?: number;
	readonly "CDamageRecord.m_hPlayerControllerDamager"?: number;
	readonly "CDamageRecord.m_hPlayerControllerRecipient"?: number;
	readonly "CDamageRecord.m_iLastBulletUpdate"?: number;
	readonly "CDamageRecord.m_iNumHits"?: number;
	readonly "CDamageRecord.m_killType"?: number;
	readonly "CDamageRecord.m_PlayerDamager"?: number;
	readonly "CDamageRecord.m_PlayerRecipient"?: number;
	readonly "CDamageRecord.m_RecipientXuid"?: bigint;
	readonly "CDamageRecord.m_szPlayerDamagerName"?: string;
	readonly "CDamageRecord.m_szPlayerRecipientName"?: string;
	readonly "m_bIsOtherEnemy"?: boolean;
	readonly "m_DamagerXuid"?: bigint;
	readonly "m_flActualHealthRemoved"?: number;
	readonly "m_flDamage"?: number;
	readonly "m_hPlayerControllerDamager"?: number;
	readonly "m_hPlayerControllerRecipient"?: number;
	readonly "m_iLastBulletUpdate"?: number;
	readonly "m_iNumHits"?: number;
	readonly "m_killType"?: number;
	readonly "m_nSendUpdate"?: number;
	readonly "m_PlayerDamager"?: number;
	readonly "m_PlayerRecipient"?: number;
	readonly "m_RecipientXuid"?: bigint;
	readonly "m_szPlayerDamagerName"?: string;
	readonly "m_szPlayerRecipientName"?: string;
}

interface _CCSPlayerController_InGameMoneyServices {
	readonly "m_iAccount"?: number;
	readonly "m_iCashSpentThisRound"?: number;
	readonly "m_iStartAccount"?: number;
	readonly "m_iTotalCashSpent"?: number;
}

interface _CCSPlayerController_InventoryServices {
	readonly "m_nPersonaDataPublicCommendsFriendly"?: number;
	readonly "m_nPersonaDataPublicCommendsLeader"?: number;
	readonly "m_nPersonaDataPublicCommendsTeacher"?: number;
	readonly "m_nPersonaDataPublicLevel"?: number;
	readonly "m_nPersonaDataXpTrailLevel"?: number;
	readonly "m_rank"?: bigint;
	readonly "m_unMusicID"?: number;
	readonly "ServerAuthoritativeWeaponSlot_t.unClass"?: number;
	readonly "ServerAuthoritativeWeaponSlot_t.unItemDefIdx"?: number;
	readonly "ServerAuthoritativeWeaponSlot_t.unSlot"?: number;
	readonly "unClass"?: number;
	readonly "unItemDefIdx"?: number;
	readonly "unSlot"?: number;
}

interface _CDamageRecord {
	readonly "m_bIsOtherEnemy"?: boolean;
	readonly "m_DamagerXuid"?: bigint;
	readonly "m_flActualHealthRemoved"?: number;
	readonly "m_flDamage"?: number;
	readonly "m_hPlayerControllerDamager"?: number;
	readonly "m_hPlayerControllerRecipient"?: number;
	readonly "m_iLastBulletUpdate"?: number;
	readonly "m_iNumHits"?: number;
	readonly "m_killType"?: number;
	readonly "m_PlayerDamager"?: number;
	readonly "m_PlayerRecipient"?: number;
	readonly "m_RecipientXuid"?: bigint;
	readonly "m_szPlayerDamagerName"?: string;
	readonly "m_szPlayerRecipientName"?: string;
}

interface _CDestructiblePartsComponent {
	readonly "m_hOwner"?: number;
}

interface _CEconItemAttribute {
	readonly "m_bSetBonus"?: boolean;
	readonly "m_flInitialValue"?: number;
	readonly "m_iAttributeDefinitionIndex"?: number;
	readonly "m_iRawValue32"?: number;
	readonly "m_nRefundableCurrency"?: number;
}

interface _CEntityIdentity {
	readonly "m_nameStringableIndex"?: number;
}

interface _CPlayer_CameraServices {
	readonly "localBits"?: number;
	readonly "localSound"?: [number, number, number];
	readonly "m_flCsViewPunchAngleTickRatio"?: number;
	readonly "m_hColorCorrectionCtrl"?: number;
	readonly "m_hCtrl"?: number;
	readonly "m_hTonemapController"?: number;
	readonly "m_hViewEntity"?: number;
	readonly "m_nCsViewPunchAngleTick"?: number;
	readonly "m_PostProcessingVolumes"?: number;
	readonly "m_vecCsViewPunchAngle"?: [number, number, number];
	readonly "soundEventHash"?: number;
	readonly "soundscapeEntityListIndex"?: number;
	readonly "soundscapeIndex"?: number;
}

interface _CSPerRoundStats_t {
	readonly "m_iAssists"?: number;
	readonly "m_iCashEarned"?: number;
	readonly "m_iDamage"?: number;
	readonly "m_iDeaths"?: number;
	readonly "m_iEnemiesFlashed"?: number;
	readonly "m_iEquipmentValue"?: number;
	readonly "m_iHeadShotKills"?: number;
	readonly "m_iKillReward"?: number;
	readonly "m_iKills"?: number;
	readonly "m_iLiveTime"?: number;
	readonly "m_iMoneySaved"?: number;
	readonly "m_iObjective"?: number;
	readonly "m_iUtilityDamage"?: number;
}

interface _EntityRenderAttribute_t {
	readonly "m_ID"?: number;
	readonly "m_Values"?: [number, number, number];
}

interface _PredictedDamageTag_t {
	readonly "flFlinchModLarge"?: number;
	readonly "flFlinchModSmall"?: number;
	readonly "flFriendlyFireDamageReductionRatio"?: number;
	readonly "nTagTick"?: number;
}

interface _SellbackPurchaseEntry_t {
	readonly "m_bPrevHelmet"?: boolean;
	readonly "m_hItem"?: bigint;
	readonly "m_nCost"?: number;
	readonly "m_nPrevArmor"?: number;
	readonly "m_unDefIdx"?: number;
}

interface _ServerAuthoritativeWeaponSlot_t {
	readonly "unClass"?: number;
	readonly "unItemDefIdx"?: number;
	readonly "unSlot"?: number;
}

interface _ViewAngleServerChange_t {
	readonly "nIndex"?: number;
	readonly "nType"?: number;
	readonly "qAngle"?: [number, number, number];
}

interface _WeaponPurchaseCount_t {
	readonly "m_nCount"?: number;
	readonly "m_nItemDefIndex"?: number;
}

interface _CAK47Own {
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bAnimGraphUpdateEnabled"?: boolean;
	readonly "m_bBurstMode"?: boolean;
	readonly "m_bClientSideRagdoll"?: boolean;
	readonly "m_bDroppedNearBuyZone"?: boolean;
	readonly "m_bEligibleForScreenHighlight"?: boolean;
	readonly "m_bFlashing"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bInitialized"?: boolean;
	readonly "m_bInitiallyPopulateInterpHistory"?: boolean;
	readonly "m_bInReload"?: boolean;
	readonly "m_bInspectPending"?: boolean;
	readonly "m_bInspectShouldLoop"?: boolean;
	readonly "m_bIsHauledBack"?: boolean;
	readonly "m_bNeedsBoltAction"?: boolean;
	readonly "m_bNoInterpolate"?: boolean;
	readonly "m_bRagdollClientSide"?: boolean;
	readonly "m_bRagdollEnabled"?: boolean;
	readonly "m_bRenderToCubemaps"?: boolean;
	readonly "m_bSetBonus"?: boolean;
	readonly "m_bSilencerOn"?: boolean;
	readonly "m_bvDisabledHitGroups"?: number;
	readonly "m_bWasActiveWeaponWhenDropped"?: boolean;
	readonly "m_clrRender"?: number;
	readonly "m_CollisionGroup"?: number;
	readonly "m_fAccuracyPenalty"?: number;
	readonly "m_fadeMaxDist"?: number;
	readonly "m_fadeMinDist"?: number;
	readonly "m_fEffects"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_fLastShotTime"?: number;
	readonly "m_flCapsuleRadius"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flDroppedAtTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flFadeScale"?: number;
	readonly "m_flFallbackWear"?: number;
	readonly "m_flGlowBackfaceMult"?: number;
	readonly "m_flGlowStartTime"?: number;
	readonly "m_flGlowTime"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flInitialValue"?: number;
	readonly "m_flInspectCancelCompleteTime"?: number;
	readonly "m_flLastShakeTime"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flNextPrimaryAttackTickRatio"?: number;
	readonly "m_flNextSecondaryAttackTickRatio"?: number;
	readonly "m_flPostponeFireReadyFrac"?: number;
	readonly "m_flRecoilIndex"?: number;
	readonly "m_flShadowStrength"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_flTimeSilencerSwitchComplete"?: number;
	readonly "m_flWatTickOffset"?: number;
	readonly "m_flWeaponActionPlaybackRate"?: number;
	readonly "m_flWeaponGameplayAnimStateTimestamp"?: number;
	readonly "m_glowColorOverride"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hOuter"?: number;
	readonly "m_hOwner"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_hPrevOwner"?: number;
	readonly "m_iAccountID"?: number;
	readonly "m_iAttributeDefinitionIndex"?: number;
	readonly "m_iBurstShotsRemaining"?: number;
	readonly "m_iClip1"?: number;
	readonly "m_iClip2"?: number;
	readonly "m_ID"?: number;
	readonly "m_iEntityLevel"?: number;
	readonly "m_iEntityQuality"?: number;
	readonly "m_iGlowTeam"?: number;
	readonly "m_iGlowType"?: number;
	readonly "m_iInventoryPosition"?: number;
	readonly "m_iIronSightMode"?: number;
	readonly "m_iItemDefinitionIndex"?: number;
	readonly "m_iItemIDHigh"?: number;
	readonly "m_iItemIDLow"?: number;
	readonly "m_iMostRecentTeamNumber"?: number;
	readonly "m_iOriginalTeamNumber"?: number;
	readonly "m_iRawValue32"?: number;
	readonly "m_iReapplyProvisionParity"?: number;
	readonly "m_iRecoilIndex"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_iWeaponGameplayAnimState"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nCollisionFunctionMask"?: number;
	readonly "m_nCollisionGroup"?: number;
	readonly "m_nDetailLayerMask"?: number;
	readonly "m_nDetailLayerMaskType"?: number;
	readonly "m_nDropTick"?: number;
	readonly "m_nEnablePhysics"?: number;
	readonly "m_nEntityId"?: number;
	readonly "m_nextPrevOwnerUseTime"?: number;
	readonly "m_nFallbackPaintKit"?: number;
	readonly "m_nFallbackSeed"?: number;
	readonly "m_nFallbackStatTrak"?: number;
	readonly "m_nForceBone"?: number;
	readonly "m_nGlowRange"?: number;
	readonly "m_nGlowRangeMin"?: number;
	readonly "m_nHierarchyId"?: number;
	readonly "m_nInteractsAs"?: bigint;
	readonly "m_nInteractsExclude"?: bigint;
	readonly "m_nInteractsWith"?: bigint;
	readonly "m_nNextPrimaryAttackTick"?: number;
	readonly "m_nNextSecondaryAttackTick"?: number;
	readonly "m_nNextThinkTick"?: number;
	readonly "m_nObjectCulling"?: number;
	readonly "m_nOwnerId"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nPostponeFireReadyTicks"?: number;
	readonly "m_nRefundableCurrency"?: number;
	readonly "m_nRenderFX"?: bigint;
	readonly "m_nRenderMode"?: bigint;
	readonly "m_nRevolverCylinderIdx"?: number;
	readonly "m_nSolidType"?: bigint;
	readonly "m_nSubclassID"?: number;
	readonly "m_nSurroundType"?: bigint;
	readonly "m_nTargetDetailLayer"?: number;
	readonly "m_OriginalOwnerXuidHigh"?: number;
	readonly "m_OriginalOwnerXuidLow"?: number;
	readonly "m_pReserveAmmo"?: number;
	readonly "m_ProviderType"?: number;
	readonly "m_szCustomName"?: string;
	readonly "m_Transforms"?: number;
	readonly "m_triggerBloat"?: number;
	readonly "m_ubInterpolationFrame"?: number;
	readonly "m_usSolidFlags"?: number;
	readonly "m_Values"?: [number, number, number];
	readonly "m_vCapsuleCenter1"?: [number, number, number];
	readonly "m_vCapsuleCenter2"?: [number, number, number];
	readonly "m_vecForce"?: [number, number, number];
	readonly "m_vecMaxs"?: [number, number, number];
	readonly "m_vecMins"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMaxs"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMins"?: [number, number, number];
	readonly "m_vLookTargetPosition"?: [number, number, number];
	readonly "m_weaponMode"?: bigint;
	readonly "m_zoomLevel"?: number;
}

interface _CBaseCSGrenadeProjectileOwn {
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bAnimGraphUpdateEnabled"?: boolean;
	readonly "m_bClientSideRagdoll"?: boolean;
	readonly "m_bEligibleForScreenHighlight"?: boolean;
	readonly "m_bFlashing"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bInitiallyPopulateInterpHistory"?: boolean;
	readonly "m_bIsLive"?: boolean;
	readonly "m_bNoInterpolate"?: boolean;
	readonly "m_bRagdollClientSide"?: boolean;
	readonly "m_bRagdollEnabled"?: boolean;
	readonly "m_bRenderToCubemaps"?: boolean;
	readonly "m_bvDisabledHitGroups"?: number;
	readonly "m_clrRender"?: number;
	readonly "m_CollisionGroup"?: number;
	readonly "m_DmgRadius"?: number;
	readonly "m_fadeMaxDist"?: number;
	readonly "m_fadeMinDist"?: number;
	readonly "m_fEffects"?: number;
	readonly "m_fFlags"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_flCapsuleRadius"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flDamage"?: number;
	readonly "m_flDetonateTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flFadeScale"?: number;
	readonly "m_flGlowBackfaceMult"?: number;
	readonly "m_flGlowStartTime"?: number;
	readonly "m_flGlowTime"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flShadowStrength"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_glowColorOverride"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hOwner"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_hThrower"?: number;
	readonly "m_ID"?: number;
	readonly "m_iGlowTeam"?: number;
	readonly "m_iGlowType"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nBounces"?: number;
	readonly "m_nCollisionFunctionMask"?: number;
	readonly "m_nCollisionGroup"?: number;
	readonly "m_nDetailLayerMask"?: number;
	readonly "m_nDetailLayerMaskType"?: number;
	readonly "m_nEnablePhysics"?: number;
	readonly "m_nEntityId"?: number;
	readonly "m_nExplodeEffectIndex"?: bigint;
	readonly "m_nExplodeEffectTickBegin"?: number;
	readonly "m_nForceBone"?: number;
	readonly "m_nGlowRange"?: number;
	readonly "m_nGlowRangeMin"?: number;
	readonly "m_nHierarchyId"?: number;
	readonly "m_nInteractsAs"?: bigint;
	readonly "m_nInteractsExclude"?: bigint;
	readonly "m_nInteractsWith"?: bigint;
	readonly "m_nObjectCulling"?: number;
	readonly "m_nOwnerId"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nRenderFX"?: bigint;
	readonly "m_nRenderMode"?: bigint;
	readonly "m_nSolidType"?: bigint;
	readonly "m_nSubclassID"?: number;
	readonly "m_nSurroundType"?: bigint;
	readonly "m_nTargetDetailLayer"?: number;
	readonly "m_Transforms"?: number;
	readonly "m_triggerBloat"?: number;
	readonly "m_ubInterpolationFrame"?: number;
	readonly "m_usSolidFlags"?: number;
	readonly "m_Values"?: [number, number, number];
	readonly "m_vCapsuleCenter1"?: [number, number, number];
	readonly "m_vCapsuleCenter2"?: [number, number, number];
	readonly "m_vecExplodeEffectOrigin"?: [number, number, number];
	readonly "m_vecForce"?: [number, number, number];
	readonly "m_vecMaxs"?: [number, number, number];
	readonly "m_vecMins"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMaxs"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMins"?: [number, number, number];
	readonly "m_vecX"?: number;
	readonly "m_vecY"?: number;
	readonly "m_vecZ"?: number;
	readonly "m_vInitialPosition"?: [number, number, number];
	readonly "m_vInitialVelocity"?: [number, number, number];
	readonly "m_vLookTargetPosition"?: [number, number, number];
}

interface _CBaseGrenadeOwn {
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bAnimGraphUpdateEnabled"?: boolean;
	readonly "m_bClientSideRagdoll"?: boolean;
	readonly "m_bEligibleForScreenHighlight"?: boolean;
	readonly "m_bFlashing"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bInitiallyPopulateInterpHistory"?: boolean;
	readonly "m_bIsLive"?: boolean;
	readonly "m_bNoInterpolate"?: boolean;
	readonly "m_bRagdollClientSide"?: boolean;
	readonly "m_bRagdollEnabled"?: boolean;
	readonly "m_bRenderToCubemaps"?: boolean;
	readonly "m_bvDisabledHitGroups"?: number;
	readonly "m_clrRender"?: number;
	readonly "m_CollisionGroup"?: number;
	readonly "m_DmgRadius"?: number;
	readonly "m_fadeMaxDist"?: number;
	readonly "m_fadeMinDist"?: number;
	readonly "m_fEffects"?: number;
	readonly "m_fFlags"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_flCapsuleRadius"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flDamage"?: number;
	readonly "m_flDetonateTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flFadeScale"?: number;
	readonly "m_flGlowBackfaceMult"?: number;
	readonly "m_flGlowStartTime"?: number;
	readonly "m_flGlowTime"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flShadowStrength"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_glowColorOverride"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hOwner"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_hThrower"?: number;
	readonly "m_ID"?: number;
	readonly "m_iGlowTeam"?: number;
	readonly "m_iGlowType"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nCollisionFunctionMask"?: number;
	readonly "m_nCollisionGroup"?: number;
	readonly "m_nDetailLayerMask"?: number;
	readonly "m_nDetailLayerMaskType"?: number;
	readonly "m_nEnablePhysics"?: number;
	readonly "m_nEntityId"?: number;
	readonly "m_nForceBone"?: number;
	readonly "m_nGlowRange"?: number;
	readonly "m_nGlowRangeMin"?: number;
	readonly "m_nHierarchyId"?: number;
	readonly "m_nInteractsAs"?: bigint;
	readonly "m_nInteractsExclude"?: bigint;
	readonly "m_nInteractsWith"?: bigint;
	readonly "m_nObjectCulling"?: number;
	readonly "m_nOwnerId"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nRenderFX"?: bigint;
	readonly "m_nRenderMode"?: bigint;
	readonly "m_nSolidType"?: bigint;
	readonly "m_nSubclassID"?: number;
	readonly "m_nSurroundType"?: bigint;
	readonly "m_nTargetDetailLayer"?: number;
	readonly "m_Transforms"?: number;
	readonly "m_triggerBloat"?: number;
	readonly "m_ubInterpolationFrame"?: number;
	readonly "m_usSolidFlags"?: number;
	readonly "m_Values"?: [number, number, number];
	readonly "m_vCapsuleCenter1"?: [number, number, number];
	readonly "m_vCapsuleCenter2"?: [number, number, number];
	readonly "m_vecForce"?: [number, number, number];
	readonly "m_vecMaxs"?: [number, number, number];
	readonly "m_vecMins"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMaxs"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMins"?: [number, number, number];
	readonly "m_vecX"?: number;
	readonly "m_vecY"?: number;
	readonly "m_vecZ"?: number;
	readonly "m_vLookTargetPosition"?: [number, number, number];
}

interface _CBasePlayerControllerOwn {
	readonly "m_bKnownTeamMismatch"?: boolean;
	readonly "m_bNoClipEnabled"?: boolean;
	readonly "m_fFlags"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flFriction"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_flTimeScale"?: number;
	readonly "m_hPawn"?: number;
	readonly "m_iConnected"?: number;
	readonly "m_iDesiredFOV"?: number;
	readonly "m_iszPlayerName"?: string;
	readonly "m_iTeamNum"?: number;
	readonly "m_nNextThinkTick"?: number;
	readonly "m_nTickBase"?: number;
	readonly "m_steamID"?: bigint;
	readonly "m_vecBaseVelocity"?: [number, number, number];
	readonly "m_vecX"?: number;
	readonly "m_vecY"?: number;
	readonly "m_vecZ"?: number;
}

interface _CBasePlayerPawnOwn {
	readonly "bClip3DSkyBoxNearToWorldFar"?: boolean;
	readonly "blend"?: boolean;
	readonly "blendtobackground"?: number;
	readonly "colorPrimary"?: number;
	readonly "colorPrimaryLerpTo"?: number;
	readonly "colorSecondary"?: number;
	readonly "colorSecondaryLerpTo"?: number;
	readonly "dirPrimary"?: [number, number, number];
	readonly "duration"?: number;
	readonly "enable"?: boolean;
	readonly "end"?: number;
	readonly "endLerpTo"?: number;
	readonly "exponent"?: number;
	readonly "farz"?: number;
	readonly "flClip3DSkyBoxNearToWorldFarOffset"?: number;
	readonly "HDRColorScale"?: number;
	readonly "lerptime"?: number;
	readonly "locallightscale"?: number;
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bAnimGraphUpdateEnabled"?: boolean;
	readonly "m_bClientSideRagdoll"?: boolean;
	readonly "m_bEligibleForScreenHighlight"?: boolean;
	readonly "m_bFlashing"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bInitiallyPopulateInterpHistory"?: boolean;
	readonly "m_bNoInterpolate"?: boolean;
	readonly "m_bRagdollClientSide"?: boolean;
	readonly "m_bRagdollEnabled"?: boolean;
	readonly "m_bRenderToCubemaps"?: boolean;
	readonly "m_bvDisabledHitGroups"?: number;
	readonly "m_clrRender"?: number;
	readonly "m_CollisionGroup"?: number;
	readonly "m_fadeMaxDist"?: number;
	readonly "m_fadeMinDist"?: number;
	readonly "m_fEffects"?: number;
	readonly "m_fFlags"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_flCapsuleRadius"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flDeathTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flexWeight"?: number;
	readonly "m_flFadeScale"?: number;
	readonly "m_flFriction"?: number;
	readonly "m_flGlowBackfaceMult"?: number;
	readonly "m_flGlowStartTime"?: number;
	readonly "m_flGlowTime"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flShadowStrength"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_flTimeScale"?: number;
	readonly "m_flWaterLevel"?: number;
	readonly "m_glowColorOverride"?: number;
	readonly "m_hController"?: number;
	readonly "m_hDefaultController"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hGroundEntity"?: number;
	readonly "m_hMyWearables"?: number;
	readonly "m_hOwner"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_ID"?: number;
	readonly "m_iGlowTeam"?: number;
	readonly "m_iGlowType"?: number;
	readonly "m_iHealth"?: number;
	readonly "m_iHideHUD"?: number;
	readonly "m_iMaxHealth"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_lifeState"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nCollisionFunctionMask"?: number;
	readonly "m_nCollisionGroup"?: number;
	readonly "m_nDetailLayerMask"?: number;
	readonly "m_nDetailLayerMaskType"?: number;
	readonly "m_nEnablePhysics"?: number;
	readonly "m_nEntityId"?: number;
	readonly "m_nForceBone"?: number;
	readonly "m_nGlowRange"?: number;
	readonly "m_nGlowRangeMin"?: number;
	readonly "m_nGroundBodyIndex"?: number;
	readonly "m_nHierarchyId"?: number;
	readonly "m_nInteractsAs"?: bigint;
	readonly "m_nInteractsExclude"?: bigint;
	readonly "m_nInteractsWith"?: bigint;
	readonly "m_nNextThinkTick"?: number;
	readonly "m_nObjectCulling"?: number;
	readonly "m_nOwnerId"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nRenderFX"?: bigint;
	readonly "m_nRenderMode"?: bigint;
	readonly "m_nSolidType"?: bigint;
	readonly "m_nSubclassID"?: number;
	readonly "m_nSurroundType"?: bigint;
	readonly "m_nTargetDetailLayer"?: number;
	readonly "m_nWorldGroupID"?: number;
	readonly "m_Transforms"?: number;
	readonly "m_triggerBloat"?: number;
	readonly "m_ubInterpolationFrame"?: number;
	readonly "m_usSolidFlags"?: number;
	readonly "m_Values"?: [number, number, number];
	readonly "m_vCapsuleCenter1"?: [number, number, number];
	readonly "m_vCapsuleCenter2"?: [number, number, number];
	readonly "m_vecBaseVelocity"?: [number, number, number];
	readonly "m_vecForce"?: [number, number, number];
	readonly "m_vecMaxs"?: [number, number, number];
	readonly "m_vecMins"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMaxs"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMins"?: [number, number, number];
	readonly "m_vecX"?: number;
	readonly "m_vecY"?: number;
	readonly "m_vecZ"?: number;
	readonly "m_vLookTargetPosition"?: [number, number, number];
	readonly "maxdensity"?: number;
	readonly "maxdensityLerpTo"?: number;
	readonly "nIndex"?: number;
	readonly "nType"?: number;
	readonly "origin"?: [number, number, number];
	readonly "qAngle"?: [number, number, number];
	readonly "scale"?: number;
	readonly "scattering"?: number;
	readonly "skyboxFogFactor"?: number;
	readonly "skyboxFogFactorLerpTo"?: number;
	readonly "start"?: number;
	readonly "startLerpTo"?: number;
}

interface _CBasePlayerWeaponOwn {
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bAnimGraphUpdateEnabled"?: boolean;
	readonly "m_bClientSideRagdoll"?: boolean;
	readonly "m_bEligibleForScreenHighlight"?: boolean;
	readonly "m_bFlashing"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bInitialized"?: boolean;
	readonly "m_bInitiallyPopulateInterpHistory"?: boolean;
	readonly "m_bNoInterpolate"?: boolean;
	readonly "m_bRagdollClientSide"?: boolean;
	readonly "m_bRagdollEnabled"?: boolean;
	readonly "m_bRenderToCubemaps"?: boolean;
	readonly "m_bSetBonus"?: boolean;
	readonly "m_bvDisabledHitGroups"?: number;
	readonly "m_clrRender"?: number;
	readonly "m_CollisionGroup"?: number;
	readonly "m_fadeMaxDist"?: number;
	readonly "m_fadeMinDist"?: number;
	readonly "m_fEffects"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_flCapsuleRadius"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flFadeScale"?: number;
	readonly "m_flFallbackWear"?: number;
	readonly "m_flGlowBackfaceMult"?: number;
	readonly "m_flGlowStartTime"?: number;
	readonly "m_flGlowTime"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flInitialValue"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flNextPrimaryAttackTickRatio"?: number;
	readonly "m_flNextSecondaryAttackTickRatio"?: number;
	readonly "m_flShadowStrength"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_glowColorOverride"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hOuter"?: number;
	readonly "m_hOwner"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_iAccountID"?: number;
	readonly "m_iAttributeDefinitionIndex"?: number;
	readonly "m_iClip1"?: number;
	readonly "m_iClip2"?: number;
	readonly "m_ID"?: number;
	readonly "m_iEntityLevel"?: number;
	readonly "m_iEntityQuality"?: number;
	readonly "m_iGlowTeam"?: number;
	readonly "m_iGlowType"?: number;
	readonly "m_iInventoryPosition"?: number;
	readonly "m_iItemDefinitionIndex"?: number;
	readonly "m_iItemIDHigh"?: number;
	readonly "m_iItemIDLow"?: number;
	readonly "m_iRawValue32"?: number;
	readonly "m_iReapplyProvisionParity"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nCollisionFunctionMask"?: number;
	readonly "m_nCollisionGroup"?: number;
	readonly "m_nDetailLayerMask"?: number;
	readonly "m_nDetailLayerMaskType"?: number;
	readonly "m_nEnablePhysics"?: number;
	readonly "m_nEntityId"?: number;
	readonly "m_nFallbackPaintKit"?: number;
	readonly "m_nFallbackSeed"?: number;
	readonly "m_nFallbackStatTrak"?: number;
	readonly "m_nForceBone"?: number;
	readonly "m_nGlowRange"?: number;
	readonly "m_nGlowRangeMin"?: number;
	readonly "m_nHierarchyId"?: number;
	readonly "m_nInteractsAs"?: bigint;
	readonly "m_nInteractsExclude"?: bigint;
	readonly "m_nInteractsWith"?: bigint;
	readonly "m_nNextPrimaryAttackTick"?: number;
	readonly "m_nNextSecondaryAttackTick"?: number;
	readonly "m_nNextThinkTick"?: number;
	readonly "m_nObjectCulling"?: number;
	readonly "m_nOwnerId"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nRefundableCurrency"?: number;
	readonly "m_nRenderFX"?: bigint;
	readonly "m_nRenderMode"?: bigint;
	readonly "m_nSolidType"?: bigint;
	readonly "m_nSubclassID"?: number;
	readonly "m_nSurroundType"?: bigint;
	readonly "m_nTargetDetailLayer"?: number;
	readonly "m_OriginalOwnerXuidHigh"?: number;
	readonly "m_OriginalOwnerXuidLow"?: number;
	readonly "m_pReserveAmmo"?: number;
	readonly "m_ProviderType"?: number;
	readonly "m_szCustomName"?: string;
	readonly "m_Transforms"?: number;
	readonly "m_triggerBloat"?: number;
	readonly "m_ubInterpolationFrame"?: number;
	readonly "m_usSolidFlags"?: number;
	readonly "m_Values"?: [number, number, number];
	readonly "m_vCapsuleCenter1"?: [number, number, number];
	readonly "m_vCapsuleCenter2"?: [number, number, number];
	readonly "m_vecForce"?: [number, number, number];
	readonly "m_vecMaxs"?: [number, number, number];
	readonly "m_vecMins"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMaxs"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMins"?: [number, number, number];
	readonly "m_vLookTargetPosition"?: [number, number, number];
}

interface _CC4Own {
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bAnimGraphUpdateEnabled"?: boolean;
	readonly "m_bBombPlacedAnimation"?: boolean;
	readonly "m_bBurstMode"?: boolean;
	readonly "m_bClientSideRagdoll"?: boolean;
	readonly "m_bDroppedNearBuyZone"?: boolean;
	readonly "m_bEligibleForScreenHighlight"?: boolean;
	readonly "m_bFlashing"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bInitialized"?: boolean;
	readonly "m_bInitiallyPopulateInterpHistory"?: boolean;
	readonly "m_bInReload"?: boolean;
	readonly "m_bInspectPending"?: boolean;
	readonly "m_bInspectShouldLoop"?: boolean;
	readonly "m_bIsHauledBack"?: boolean;
	readonly "m_bIsPlantingViaUse"?: boolean;
	readonly "m_bNoInterpolate"?: boolean;
	readonly "m_bRagdollClientSide"?: boolean;
	readonly "m_bRagdollEnabled"?: boolean;
	readonly "m_bRenderToCubemaps"?: boolean;
	readonly "m_bSetBonus"?: boolean;
	readonly "m_bSilencerOn"?: boolean;
	readonly "m_bSpotted"?: boolean;
	readonly "m_bSpottedByMask"?: number;
	readonly "m_bStartedArming"?: boolean;
	readonly "m_bvDisabledHitGroups"?: number;
	readonly "m_bWasActiveWeaponWhenDropped"?: boolean;
	readonly "m_clrRender"?: number;
	readonly "m_CollisionGroup"?: number;
	readonly "m_fAccuracyPenalty"?: number;
	readonly "m_fadeMaxDist"?: number;
	readonly "m_fadeMinDist"?: number;
	readonly "m_fArmedTime"?: number;
	readonly "m_fEffects"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_fLastShotTime"?: number;
	readonly "m_flCapsuleRadius"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flDroppedAtTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flFadeScale"?: number;
	readonly "m_flFallbackWear"?: number;
	readonly "m_flGlowBackfaceMult"?: number;
	readonly "m_flGlowStartTime"?: number;
	readonly "m_flGlowTime"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flInitialValue"?: number;
	readonly "m_flInspectCancelCompleteTime"?: number;
	readonly "m_flLastShakeTime"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flNextPrimaryAttackTickRatio"?: number;
	readonly "m_flNextSecondaryAttackTickRatio"?: number;
	readonly "m_flPostponeFireReadyFrac"?: number;
	readonly "m_flRecoilIndex"?: number;
	readonly "m_flShadowStrength"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_flTimeSilencerSwitchComplete"?: number;
	readonly "m_flWatTickOffset"?: number;
	readonly "m_flWeaponActionPlaybackRate"?: number;
	readonly "m_flWeaponGameplayAnimStateTimestamp"?: number;
	readonly "m_glowColorOverride"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hOuter"?: number;
	readonly "m_hOwner"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_hPrevOwner"?: number;
	readonly "m_iAccountID"?: number;
	readonly "m_iAttributeDefinitionIndex"?: number;
	readonly "m_iClip1"?: number;
	readonly "m_iClip2"?: number;
	readonly "m_ID"?: number;
	readonly "m_iEntityLevel"?: number;
	readonly "m_iEntityQuality"?: number;
	readonly "m_iGlowTeam"?: number;
	readonly "m_iGlowType"?: number;
	readonly "m_iInventoryPosition"?: number;
	readonly "m_iIronSightMode"?: number;
	readonly "m_iItemDefinitionIndex"?: number;
	readonly "m_iItemIDHigh"?: number;
	readonly "m_iItemIDLow"?: number;
	readonly "m_iMostRecentTeamNumber"?: number;
	readonly "m_iOriginalTeamNumber"?: number;
	readonly "m_iRawValue32"?: number;
	readonly "m_iReapplyProvisionParity"?: number;
	readonly "m_iRecoilIndex"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_iWeaponGameplayAnimState"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nCollisionFunctionMask"?: number;
	readonly "m_nCollisionGroup"?: number;
	readonly "m_nDetailLayerMask"?: number;
	readonly "m_nDetailLayerMaskType"?: number;
	readonly "m_nDropTick"?: number;
	readonly "m_nEnablePhysics"?: number;
	readonly "m_nEntityId"?: number;
	readonly "m_nextPrevOwnerUseTime"?: number;
	readonly "m_nFallbackPaintKit"?: number;
	readonly "m_nFallbackSeed"?: number;
	readonly "m_nFallbackStatTrak"?: number;
	readonly "m_nForceBone"?: number;
	readonly "m_nGlowRange"?: number;
	readonly "m_nGlowRangeMin"?: number;
	readonly "m_nHierarchyId"?: number;
	readonly "m_nInteractsAs"?: bigint;
	readonly "m_nInteractsExclude"?: bigint;
	readonly "m_nInteractsWith"?: bigint;
	readonly "m_nNextPrimaryAttackTick"?: number;
	readonly "m_nNextSecondaryAttackTick"?: number;
	readonly "m_nNextThinkTick"?: number;
	readonly "m_nObjectCulling"?: number;
	readonly "m_nOwnerId"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nPostponeFireReadyTicks"?: number;
	readonly "m_nRefundableCurrency"?: number;
	readonly "m_nRenderFX"?: bigint;
	readonly "m_nRenderMode"?: bigint;
	readonly "m_nSolidType"?: bigint;
	readonly "m_nSubclassID"?: number;
	readonly "m_nSurroundType"?: bigint;
	readonly "m_nTargetDetailLayer"?: number;
	readonly "m_OriginalOwnerXuidHigh"?: number;
	readonly "m_OriginalOwnerXuidLow"?: number;
	readonly "m_pReserveAmmo"?: number;
	readonly "m_ProviderType"?: number;
	readonly "m_szCustomName"?: string;
	readonly "m_Transforms"?: number;
	readonly "m_triggerBloat"?: number;
	readonly "m_ubInterpolationFrame"?: number;
	readonly "m_usSolidFlags"?: number;
	readonly "m_Values"?: [number, number, number];
	readonly "m_vCapsuleCenter1"?: [number, number, number];
	readonly "m_vCapsuleCenter2"?: [number, number, number];
	readonly "m_vecForce"?: [number, number, number];
	readonly "m_vecMaxs"?: [number, number, number];
	readonly "m_vecMins"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMaxs"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMins"?: [number, number, number];
	readonly "m_vLookTargetPosition"?: [number, number, number];
	readonly "m_weaponMode"?: bigint;
}

interface _CCSGameModeRules_ArmsRaceOwn {
	readonly "m_WeaponSequence"?: number;
}

interface _CCSGameModeRules_DeathmatchOwn {
	readonly "m_flDMBonusStartTime"?: number;
	readonly "m_flDMBonusTimeLength"?: number;
	readonly "m_sDMBonusWeapon"?: string;
}

interface _CCSGameRulesOwn {
	readonly "m_arrProhibitedItemIndices"?: number;
	readonly "m_arrTournamentActiveCasterAccounts"?: number;
	readonly "m_bAnyHostageReached"?: boolean;
	readonly "m_bBlockersPresent"?: boolean;
	readonly "m_bBombDropped"?: boolean;
	readonly "m_bBombPlanted"?: boolean;
	readonly "m_bCTCantBuy"?: boolean;
	readonly "m_bCTTimeOutActive"?: boolean;
	readonly "m_bFreezePeriod"?: boolean;
	readonly "m_bGamePaused"?: boolean;
	readonly "m_bGameRestart"?: boolean;
	readonly "m_bHasMatchStarted"?: boolean;
	readonly "m_bIsDroppingItems"?: boolean;
	readonly "m_bIsHltvActive"?: boolean;
	readonly "m_bIsQuestEligible"?: boolean;
	readonly "m_bIsQueuedMatchmaking"?: boolean;
	readonly "m_bIsValveDS"?: boolean;
	readonly "m_bLogoMap"?: boolean;
	readonly "m_bMapHasBombTarget"?: boolean;
	readonly "m_bMapHasBuyZone"?: boolean;
	readonly "m_bMapHasRescueZone"?: boolean;
	readonly "m_bMatchWaitingForResume"?: boolean;
	readonly "m_bPlayAllStepSoundsOnServer"?: boolean;
	readonly "m_bRoundEndNoMusic"?: boolean;
	readonly "m_bRoundEndShowTimerDefend"?: boolean;
	readonly "m_bRoundInProgress"?: boolean;
	readonly "m_bTCantBuy"?: boolean;
	readonly "m_bTeamIntroPeriod"?: boolean;
	readonly "m_bTechnicalTimeOut"?: boolean;
	readonly "m_bTerroristTimeOutActive"?: boolean;
	readonly "m_bWarmupPeriod"?: boolean;
	readonly "m_eRoundEndReason"?: number;
	readonly "m_eRoundWinReason"?: number;
	readonly "m_flCMMItemDropRevealEndTime"?: number;
	readonly "m_flCMMItemDropRevealStartTime"?: number;
	readonly "m_flCTTimeOutRemaining"?: number;
	readonly "m_flGameStartTime"?: number;
	readonly "m_flNextRespawnWave"?: number;
	readonly "m_flRestartRoundTime"?: number;
	readonly "m_flTerroristTimeOutRemaining"?: number;
	readonly "m_fMatchStartTime"?: number;
	readonly "m_fRoundStartTime"?: number;
	readonly "m_fWarmupPeriodEnd"?: number;
	readonly "m_fWarmupPeriodStart"?: number;
	readonly "m_gamePhase"?: number;
	readonly "m_hBombPlanter"?: number;
	readonly "m_iBombSite"?: number;
	readonly "m_iFirstSecondHalfRound"?: number;
	readonly "m_iFreezeTime"?: number;
	readonly "m_iHostagesRemaining"?: number;
	readonly "m_iMatchStats_PlayersAlive_CT"?: number;
	readonly "m_iMatchStats_PlayersAlive_T"?: number;
	readonly "m_iMatchStats_RoundResults"?: number;
	readonly "m_iNumConsecutiveCTLoses"?: number;
	readonly "m_iNumConsecutiveTerroristLoses"?: number;
	readonly "m_iRoundEndFunFactData1"?: number;
	readonly "m_iRoundEndFunFactData2"?: number;
	readonly "m_iRoundEndFunFactData3"?: number;
	readonly "m_iRoundEndFunFactPlayerSlot"?: number;
	readonly "m_iRoundEndLegacy"?: number;
	readonly "m_iRoundEndPlayerCount"?: number;
	readonly "m_iRoundEndTimerTime"?: number;
	readonly "m_iRoundEndWinnerTeam"?: number;
	readonly "m_iRoundStartRoundNumber"?: number;
	readonly "m_iRoundTime"?: number;
	readonly "m_iRoundWinStatus"?: number;
	readonly "m_iSpectatorSlotCount"?: number;
	readonly "m_MatchDevice"?: number;
	readonly "m_MinimapVerticalSectionHeights"?: number;
	readonly "m_nCTTeamIntroVariant"?: number;
	readonly "m_nCTTimeOuts"?: number;
	readonly "m_nEndMatchMapGroupVoteOptions"?: number;
	readonly "m_nEndMatchMapGroupVoteTypes"?: number;
	readonly "m_nEndMatchMapVoteWinner"?: number;
	readonly "m_nHalloweenMaskListSeed"?: number;
	readonly "m_nMatchAbortedEarlyReason"?: number;
	readonly "m_nMatchEndCount"?: number;
	readonly "m_nMatchSeed"?: number;
	readonly "m_nNextMapInMapgroup"?: number;
	readonly "m_nOvertimePlaying"?: number;
	readonly "m_nPauseStartTick"?: number;
	readonly "m_nQueuedMatchmakingMode"?: number;
	readonly "m_nRoundEndCount"?: number;
	readonly "m_nRoundsPlayedThisPhase"?: number;
	readonly "m_nRoundStartCount"?: number;
	readonly "m_nTerroristTimeOuts"?: number;
	readonly "m_nTotalPausedTicks"?: number;
	readonly "m_nTournamentPredictionsPct"?: number;
	readonly "m_nTTeamIntroVariant"?: number;
	readonly "m_numBestOfMaps"?: number;
	readonly "m_sRoundEndFunFactToken"?: string;
	readonly "m_sRoundEndMessage"?: string;
	readonly "m_szMatchStatTxt"?: string;
	readonly "m_szTournamentEventName"?: string;
	readonly "m_szTournamentEventStage"?: string;
	readonly "m_szTournamentPredictionsTxt"?: string;
	readonly "m_TeamRespawnWaveTimes"?: number;
	readonly "m_timeUntilNextPhaseStarts"?: number;
	readonly "m_totalRoundsPlayed"?: number;
	readonly "m_vMinimapMaxs"?: [number, number, number];
	readonly "m_vMinimapMins"?: [number, number, number];
}

interface _CCSGO_TeamIntroCounterTerroristPositionOwn {
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bInitialized"?: boolean;
	readonly "m_bSetBonus"?: boolean;
	readonly "m_fEffects"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flInitialValue"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_iAccountID"?: number;
	readonly "m_iAttributeDefinitionIndex"?: number;
	readonly "m_iEntityLevel"?: number;
	readonly "m_iEntityQuality"?: number;
	readonly "m_iInventoryPosition"?: number;
	readonly "m_iItemDefinitionIndex"?: number;
	readonly "m_iItemIDHigh"?: number;
	readonly "m_iItemIDLow"?: number;
	readonly "m_iRawValue32"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nOrdinal"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nRandom"?: number;
	readonly "m_nRefundableCurrency"?: number;
	readonly "m_nSubclassID"?: number;
	readonly "m_nVariant"?: number;
	readonly "m_sWeaponName"?: string;
	readonly "m_szCustomName"?: string;
	readonly "m_ubInterpolationFrame"?: number;
	readonly "m_xuid"?: bigint;
}

interface _CCSPlayer_ActionTrackingServicesOwn {
	readonly "m_bIsRescuing"?: boolean;
	readonly "m_nCount"?: number;
	readonly "m_nItemDefIndex"?: number;
}

interface _CCSPlayer_BulletServicesOwn {
	readonly "m_totalHitsOnServer"?: number;
}

interface _CCSPlayer_BuyServicesOwn {
	readonly "m_bPrevHelmet"?: boolean;
	readonly "m_hItem"?: bigint;
	readonly "m_nCost"?: number;
	readonly "m_nPrevArmor"?: number;
	readonly "m_unDefIdx"?: number;
}

interface _CCSPlayer_CameraServicesOwn {
	readonly "localBits"?: number;
	readonly "localSound"?: [number, number, number];
	readonly "m_flCsViewPunchAngleTickRatio"?: number;
	readonly "m_flFOVRate"?: number;
	readonly "m_flFOVTime"?: number;
	readonly "m_hColorCorrectionCtrl"?: number;
	readonly "m_hCtrl"?: number;
	readonly "m_hTonemapController"?: number;
	readonly "m_hViewEntity"?: number;
	readonly "m_hZoomOwner"?: number;
	readonly "m_iFOV"?: number;
	readonly "m_iFOVStart"?: number;
	readonly "m_nCsViewPunchAngleTick"?: number;
	readonly "m_PostProcessingVolumes"?: number;
	readonly "m_vecCsViewPunchAngle"?: [number, number, number];
	readonly "soundEventHash"?: number;
	readonly "soundscapeEntityListIndex"?: number;
	readonly "soundscapeIndex"?: number;
}

interface _CCSPlayer_HostageServicesOwn {
	readonly "m_hCarriedHostage"?: number;
	readonly "m_hCarriedHostageProp"?: number;
}

interface _CCSPlayer_ItemServicesOwn {
	readonly "m_bHasDefuser"?: boolean;
	readonly "m_bHasHelmet"?: boolean;
}

interface _CCSPlayer_MovementServicesOwn {
	readonly "m_arrForceSubtickMoveWhen"?: number;
	readonly "m_bDesiresDuck"?: boolean;
	readonly "m_bDucked"?: boolean;
	readonly "m_bDucking"?: boolean;
	readonly "m_bDuckOverride"?: boolean;
	readonly "m_bJumpApexPending"?: boolean;
	readonly "m_bOldJumpPressed"?: boolean;
	readonly "m_bWasSurfing"?: boolean;
	readonly "m_flDuckAmount"?: number;
	readonly "m_flDuckOffset"?: number;
	readonly "m_flDuckSpeed"?: number;
	readonly "m_flFallVelocity"?: number;
	readonly "m_flLastActualJumpPressFrac"?: number;
	readonly "m_flLastDuckTime"?: number;
	readonly "m_flLastJumpFrac"?: number;
	readonly "m_flLastJumpVelocityZ"?: number;
	readonly "m_flLastLandedFrac"?: number;
	readonly "m_flLastLandedVelocityX"?: number;
	readonly "m_flLastLandedVelocityY"?: number;
	readonly "m_flLastLandedVelocityZ"?: number;
	readonly "m_flLastUsableJumpPressFrac"?: number;
	readonly "m_flMaxspeed"?: number;
	readonly "m_flOffsetTickCompleteTime"?: number;
	readonly "m_flOffsetTickStashedSpeed"?: number;
	readonly "m_flStamina"?: number;
	readonly "m_fStashGrenadeParameterWhen"?: number;
	readonly "m_nButtonDownMaskPrev"?: bigint;
	readonly "m_nDuckJumpTimeMsecs"?: number;
	readonly "m_nDuckTimeMsecs"?: number;
	readonly "m_nGameCodeHasMovedPlayerAfterCommand"?: number;
	readonly "m_nJumpTimeMsecs"?: number;
	readonly "m_nLadderSurfacePropIndex"?: number;
	readonly "m_nLastActualJumpPressTick"?: number;
	readonly "m_nLastJumpTick"?: number;
	readonly "m_nLastLandedTick"?: number;
	readonly "m_nLastUsableJumpPressTick"?: number;
	readonly "m_nToggleButtonDownMask"?: bigint;
}

interface _CCSPlayer_PingServicesOwn {
	readonly "m_hPlayerPing"?: number;
}

interface _CCSPlayer_WeaponServicesOwn {
	readonly "m_bBlockInspectUntilNextGraphUpdate"?: boolean;
	readonly "m_bIsHoldingLookAtWeapon"?: boolean;
	readonly "m_bIsLookingAtWeapon"?: boolean;
	readonly "m_flNextAttack"?: number;
	readonly "m_hActiveWeapon"?: number;
	readonly "m_hLastWeapon"?: number;
	readonly "m_hMyWeapons"?: number;
	readonly "m_iAmmo"?: number;
	readonly "m_networkAnimTiming"?: number;
}

interface _CCSPlayerControllerOwn {
	readonly "m_bCanControlObservedBot"?: boolean;
	readonly "m_bControllingBot"?: boolean;
	readonly "m_bEverPlayedOnTeam"?: boolean;
	readonly "m_bFireBulletsSeedSynchronized"?: boolean;
	readonly "m_bHasCommunicationAbuseMute"?: boolean;
	readonly "m_bHasControlledBotThisRound"?: boolean;
	readonly "m_bKnownTeamMismatch"?: boolean;
	readonly "m_bMvpNoMusic"?: boolean;
	readonly "m_bNoClipEnabled"?: boolean;
	readonly "m_bPawnHasDefuser"?: boolean;
	readonly "m_bPawnHasHelmet"?: boolean;
	readonly "m_bPawnIsAlive"?: boolean;
	readonly "m_eMvpReason"?: number;
	readonly "m_fFlags"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flForceTeamTime"?: number;
	readonly "m_flFriction"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_flTimeScale"?: number;
	readonly "m_hObserverPawn"?: number;
	readonly "m_hOriginalControllerOfCurrentPawn"?: number;
	readonly "m_hPawn"?: number;
	readonly "m_hPlayerPawn"?: number;
	readonly "m_iCoachingTeam"?: number;
	readonly "m_iCompetitiveRanking"?: number;
	readonly "m_iCompetitiveRankingPredicted_Loss"?: number;
	readonly "m_iCompetitiveRankingPredicted_Tie"?: number;
	readonly "m_iCompetitiveRankingPredicted_Win"?: number;
	readonly "m_iCompetitiveRankType"?: number;
	readonly "m_iCompetitiveWins"?: number;
	readonly "m_iCompTeammateColor"?: number;
	readonly "m_iConnected"?: number;
	readonly "m_iDesiredFOV"?: number;
	readonly "m_iMusicKitID"?: number;
	readonly "m_iMusicKitMVPs"?: number;
	readonly "m_iMVPs"?: number;
	readonly "m_iPawnArmor"?: number;
	readonly "m_iPawnBotDifficulty"?: number;
	readonly "m_iPawnHealth"?: number;
	readonly "m_iPawnLifetimeEnd"?: number;
	readonly "m_iPawnLifetimeStart"?: number;
	readonly "m_iPendingTeamNum"?: number;
	readonly "m_iPing"?: number;
	readonly "m_iScore"?: number;
	readonly "m_iszPlayerName"?: string;
	readonly "m_iTeamNum"?: number;
	readonly "m_nDisconnectionTick"?: number;
	readonly "m_nEndMatchNextMapVote"?: number;
	readonly "m_nFirstKill"?: number;
	readonly "m_nKillCount"?: number;
	readonly "m_nNextThinkTick"?: number;
	readonly "m_nPawnCharacterDefIndex"?: number;
	readonly "m_nPlayerDominated"?: bigint;
	readonly "m_nPlayerDominatingMe"?: bigint;
	readonly "m_nQuestProgressReason"?: bigint;
	readonly "m_nTickBase"?: number;
	readonly "m_recentKillQueue"?: number;
	readonly "m_rtActiveMissionPeriod"?: number;
	readonly "m_steamID"?: bigint;
	readonly "m_szClan"?: string;
	readonly "m_szCrosshairCodes"?: string;
	readonly "m_uiCommunicationMuteFlags"?: number;
	readonly "m_unActiveQuestId"?: number;
	readonly "m_unPlayerTvControlFlags"?: number;
	readonly "m_vecBaseVelocity"?: [number, number, number];
	readonly "m_vecX"?: number;
	readonly "m_vecY"?: number;
	readonly "m_vecZ"?: number;
}

interface _CCSPlayerController_ActionTrackingServicesOwn {
	readonly "m_flTotalRoundDamageDealt"?: number;
	readonly "m_iAssists"?: number;
	readonly "m_iCashEarned"?: number;
	readonly "m_iDamage"?: number;
	readonly "m_iDeaths"?: number;
	readonly "m_iEnemiesFlashed"?: number;
	readonly "m_iEnemy3Ks"?: number;
	readonly "m_iEnemy4Ks"?: number;
	readonly "m_iEnemy5Ks"?: number;
	readonly "m_iEnemyKnifeKills"?: number;
	readonly "m_iEnemyTaserKills"?: number;
	readonly "m_iEquipmentValue"?: number;
	readonly "m_iHeadShotKills"?: number;
	readonly "m_iKillReward"?: number;
	readonly "m_iKills"?: number;
	readonly "m_iLiveTime"?: number;
	readonly "m_iMoneySaved"?: number;
	readonly "m_iNumRoundKills"?: number;
	readonly "m_iNumRoundKillsHeadshots"?: number;
	readonly "m_iObjective"?: number;
	readonly "m_iUtilityDamage"?: number;
}

interface _CCSPlayerController_DamageServicesOwn {
	readonly "m_bIsOtherEnemy"?: boolean;
	readonly "m_DamagerXuid"?: bigint;
	readonly "m_flActualHealthRemoved"?: number;
	readonly "m_flDamage"?: number;
	readonly "m_hPlayerControllerDamager"?: number;
	readonly "m_hPlayerControllerRecipient"?: number;
	readonly "m_iLastBulletUpdate"?: number;
	readonly "m_iNumHits"?: number;
	readonly "m_killType"?: number;
	readonly "m_nSendUpdate"?: number;
	readonly "m_PlayerDamager"?: number;
	readonly "m_PlayerRecipient"?: number;
	readonly "m_RecipientXuid"?: bigint;
	readonly "m_szPlayerDamagerName"?: string;
	readonly "m_szPlayerRecipientName"?: string;
}

interface _CCSPlayerController_InGameMoneyServicesOwn {
	readonly "m_iAccount"?: number;
	readonly "m_iCashSpentThisRound"?: number;
	readonly "m_iStartAccount"?: number;
	readonly "m_iTotalCashSpent"?: number;
}

interface _CCSPlayerController_InventoryServicesOwn {
	readonly "m_nPersonaDataPublicCommendsFriendly"?: number;
	readonly "m_nPersonaDataPublicCommendsLeader"?: number;
	readonly "m_nPersonaDataPublicCommendsTeacher"?: number;
	readonly "m_nPersonaDataPublicLevel"?: number;
	readonly "m_nPersonaDataXpTrailLevel"?: number;
	readonly "m_rank"?: bigint;
	readonly "m_unMusicID"?: number;
	readonly "unClass"?: number;
	readonly "unItemDefIdx"?: number;
	readonly "unSlot"?: number;
}

interface _CCSPlayerPawnOwn {
	readonly "bClip3DSkyBoxNearToWorldFar"?: boolean;
	readonly "blend"?: boolean;
	readonly "blendtobackground"?: number;
	readonly "colorPrimary"?: number;
	readonly "colorPrimaryLerpTo"?: number;
	readonly "colorSecondary"?: number;
	readonly "colorSecondaryLerpTo"?: number;
	readonly "dirPrimary"?: [number, number, number];
	readonly "duration"?: number;
	readonly "enable"?: boolean;
	readonly "end"?: number;
	readonly "endLerpTo"?: number;
	readonly "exponent"?: number;
	readonly "farz"?: number;
	readonly "flClip3DSkyBoxNearToWorldFarOffset"?: number;
	readonly "flFlinchModLarge"?: number;
	readonly "flFlinchModSmall"?: number;
	readonly "flFriendlyFireDamageReductionRatio"?: number;
	readonly "HDRColorScale"?: number;
	readonly "lerptime"?: number;
	readonly "locallightscale"?: number;
	readonly "m_aimPunchAngle"?: [number, number, number];
	readonly "m_aimPunchAngleVel"?: [number, number, number];
	readonly "m_aimPunchTickBase"?: number;
	readonly "m_aimPunchTickFraction"?: number;
	readonly "m_angEyeAngles"?: [number, number, number];
	readonly "m_ArmorValue"?: number;
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bAnimGraphUpdateEnabled"?: boolean;
	readonly "m_bClientSideRagdoll"?: boolean;
	readonly "m_bEligibleForScreenHighlight"?: boolean;
	readonly "m_bFlashing"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bGunGameImmunity"?: boolean;
	readonly "m_bHasFemaleVoice"?: boolean;
	readonly "m_bHasMovedSinceSpawn"?: boolean;
	readonly "m_bInBombZone"?: boolean;
	readonly "m_bInBuyZone"?: boolean;
	readonly "m_bInHostageRescueZone"?: boolean;
	readonly "m_bInitialized"?: boolean;
	readonly "m_bInitiallyPopulateInterpHistory"?: boolean;
	readonly "m_bInNoDefuseArea"?: boolean;
	readonly "m_bIsBuyMenuOpen"?: boolean;
	readonly "m_bIsDefusing"?: boolean;
	readonly "m_bIsGrabbingHostage"?: boolean;
	readonly "m_bIsScoped"?: boolean;
	readonly "m_bIsWalking"?: boolean;
	readonly "m_bKilledByHeadshot"?: boolean;
	readonly "m_bLeftHanded"?: boolean;
	readonly "m_bNoInterpolate"?: boolean;
	readonly "m_bRagdollClientSide"?: boolean;
	readonly "m_bRagdollDamageHeadshot"?: boolean;
	readonly "m_bRagdollEnabled"?: boolean;
	readonly "m_bRenderToCubemaps"?: boolean;
	readonly "m_bResumeZoom"?: boolean;
	readonly "m_bRetakesHasDefuseKit"?: boolean;
	readonly "m_bRetakesMVPLastRound"?: boolean;
	readonly "m_bSetBonus"?: boolean;
	readonly "m_bSpotted"?: boolean;
	readonly "m_bSpottedByMask"?: number;
	readonly "m_bvDisabledHitGroups"?: number;
	readonly "m_bWaitForNoAttack"?: boolean;
	readonly "m_clrRender"?: number;
	readonly "m_CollisionGroup"?: number;
	readonly "m_fadeMaxDist"?: number;
	readonly "m_fadeMinDist"?: number;
	readonly "m_fEffects"?: number;
	readonly "m_fFlags"?: number;
	readonly "m_fImmuneToGunGameDamageTime"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_flCapsuleRadius"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flDeathTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flEmitSoundTime"?: number;
	readonly "m_flFadeScale"?: number;
	readonly "m_flFlashDuration"?: number;
	readonly "m_flFlashMaxAlpha"?: number;
	readonly "m_flFlinchStack"?: number;
	readonly "m_flFriction"?: number;
	readonly "m_flGlowBackfaceMult"?: number;
	readonly "m_flGlowStartTime"?: number;
	readonly "m_flGlowTime"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flHealthShotBoostExpirationTime"?: number;
	readonly "m_flHitHeading"?: number;
	readonly "m_flInitialValue"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flNextSprayDecalTime"?: number;
	readonly "m_flProgressBarStartTime"?: number;
	readonly "m_flShadowStrength"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_flSlopeDropHeight"?: number;
	readonly "m_flSlopeDropOffset"?: number;
	readonly "m_flTimeOfLastInjury"?: number;
	readonly "m_flTimeScale"?: number;
	readonly "m_flVelocityModifier"?: number;
	readonly "m_flViewmodelFOV"?: number;
	readonly "m_flViewmodelOffsetX"?: number;
	readonly "m_flViewmodelOffsetY"?: number;
	readonly "m_flViewmodelOffsetZ"?: number;
	readonly "m_flWaterLevel"?: number;
	readonly "m_fMolotovDamageTime"?: number;
	readonly "m_fSwitchedHandednessTime"?: number;
	readonly "m_glowColorOverride"?: number;
	readonly "m_GunGameImmunityColor"?: number;
	readonly "m_hController"?: number;
	readonly "m_hDefaultController"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hGroundEntity"?: number;
	readonly "m_hMyWearables"?: number;
	readonly "m_hOriginalController"?: number;
	readonly "m_hOwner"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_iAccountID"?: number;
	readonly "m_iAttributeDefinitionIndex"?: number;
	readonly "m_iBlockingUseActionInProgress"?: bigint;
	readonly "m_ID"?: number;
	readonly "m_iEntityLevel"?: number;
	readonly "m_iEntityQuality"?: number;
	readonly "m_iGlowTeam"?: number;
	readonly "m_iGlowType"?: number;
	readonly "m_iHealth"?: number;
	readonly "m_iHideHUD"?: number;
	readonly "m_iInventoryPosition"?: number;
	readonly "m_iItemDefinitionIndex"?: number;
	readonly "m_iItemIDHigh"?: number;
	readonly "m_iItemIDLow"?: number;
	readonly "m_iMaxHealth"?: number;
	readonly "m_iPlayerState"?: bigint;
	readonly "m_iProgressBarDuration"?: number;
	readonly "m_iRawValue32"?: number;
	readonly "m_iRetakesMVPBoostItem"?: number;
	readonly "m_iRetakesOffering"?: number;
	readonly "m_iRetakesOfferingCard"?: number;
	readonly "m_iShotsFired"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_lifeState"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nCollisionFunctionMask"?: number;
	readonly "m_nCollisionGroup"?: number;
	readonly "m_nDetailLayerMask"?: number;
	readonly "m_nDetailLayerMaskType"?: number;
	readonly "m_nEconGlovesChanged"?: number;
	readonly "m_nEnablePhysics"?: number;
	readonly "m_nEntityId"?: number;
	readonly "m_nForceBone"?: number;
	readonly "m_nGlowRange"?: number;
	readonly "m_nGlowRangeMin"?: number;
	readonly "m_nGroundBodyIndex"?: number;
	readonly "m_nHierarchyId"?: number;
	readonly "m_nHitBodyPart"?: number;
	readonly "m_nInteractsAs"?: bigint;
	readonly "m_nInteractsExclude"?: bigint;
	readonly "m_nInteractsWith"?: bigint;
	readonly "m_nLastKillerIndex"?: bigint;
	readonly "m_nNextThinkTick"?: number;
	readonly "m_nObjectCulling"?: number;
	readonly "m_nOwnerId"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nRagdollDamageBone"?: number;
	readonly "m_nRefundableCurrency"?: number;
	readonly "m_nRenderFX"?: bigint;
	readonly "m_nRenderMode"?: bigint;
	readonly "m_nSolidType"?: bigint;
	readonly "m_nSubclassID"?: number;
	readonly "m_nSurroundType"?: bigint;
	readonly "m_nTargetDetailLayer"?: number;
	readonly "m_nWhichBombZone"?: number;
	readonly "m_nWorldGroupID"?: number;
	readonly "m_qDeathEyeAngles"?: [number, number, number];
	readonly "m_RetakesMVPBoostExtraUtility"?: number;
	readonly "m_szCustomName"?: string;
	readonly "m_szLastPlaceName"?: string;
	readonly "m_szRagdollDamageWeaponName"?: string;
	readonly "m_thirdPersonHeading"?: [number, number, number];
	readonly "m_Transforms"?: number;
	readonly "m_triggerBloat"?: number;
	readonly "m_ubInterpolationFrame"?: number;
	readonly "m_unCurrentEquipmentValue"?: number;
	readonly "m_unFreezetimeEndEquipmentValue"?: number;
	readonly "m_unRoundStartEquipmentValue"?: number;
	readonly "m_usSolidFlags"?: number;
	readonly "m_Values"?: [number, number, number];
	readonly "m_vCapsuleCenter1"?: [number, number, number];
	readonly "m_vCapsuleCenter2"?: [number, number, number];
	readonly "m_vecBaseVelocity"?: [number, number, number];
	readonly "m_vecForce"?: [number, number, number];
	readonly "m_vecMaxs"?: [number, number, number];
	readonly "m_vecMins"?: [number, number, number];
	readonly "m_vecPlayerPatchEconIndices"?: number;
	readonly "m_vecSpecifiedSurroundingMaxs"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMins"?: [number, number, number];
	readonly "m_vecX"?: number;
	readonly "m_vecY"?: number;
	readonly "m_vecZ"?: number;
	readonly "m_vHeadConstraintOffset"?: [number, number, number];
	readonly "m_vLookTargetPosition"?: [number, number, number];
	readonly "m_vRagdollDamageForce"?: [number, number, number];
	readonly "m_vRagdollDamagePosition"?: [number, number, number];
	readonly "m_vRagdollServerOrigin"?: [number, number, number];
	readonly "maxdensity"?: number;
	readonly "maxdensityLerpTo"?: number;
	readonly "nIndex"?: number;
	readonly "nTagTick"?: number;
	readonly "nType"?: number;
	readonly "origin"?: [number, number, number];
	readonly "qAngle"?: [number, number, number];
	readonly "scale"?: number;
	readonly "scattering"?: number;
	readonly "skyboxFogFactor"?: number;
	readonly "skyboxFogFactorLerpTo"?: number;
	readonly "start"?: number;
	readonly "startLerpTo"?: number;
}

interface _CCSPlayerPawnBaseOwn {
	readonly "bClip3DSkyBoxNearToWorldFar"?: boolean;
	readonly "blend"?: boolean;
	readonly "blendtobackground"?: number;
	readonly "colorPrimary"?: number;
	readonly "colorPrimaryLerpTo"?: number;
	readonly "colorSecondary"?: number;
	readonly "colorSecondaryLerpTo"?: number;
	readonly "dirPrimary"?: [number, number, number];
	readonly "duration"?: number;
	readonly "enable"?: boolean;
	readonly "end"?: number;
	readonly "endLerpTo"?: number;
	readonly "exponent"?: number;
	readonly "farz"?: number;
	readonly "flClip3DSkyBoxNearToWorldFarOffset"?: number;
	readonly "HDRColorScale"?: number;
	readonly "lerptime"?: number;
	readonly "locallightscale"?: number;
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bAnimGraphUpdateEnabled"?: boolean;
	readonly "m_bClientSideRagdoll"?: boolean;
	readonly "m_bEligibleForScreenHighlight"?: boolean;
	readonly "m_bFlashing"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bHasMovedSinceSpawn"?: boolean;
	readonly "m_bInitiallyPopulateInterpHistory"?: boolean;
	readonly "m_bNoInterpolate"?: boolean;
	readonly "m_bRagdollClientSide"?: boolean;
	readonly "m_bRagdollEnabled"?: boolean;
	readonly "m_bRenderToCubemaps"?: boolean;
	readonly "m_bvDisabledHitGroups"?: number;
	readonly "m_clrRender"?: number;
	readonly "m_CollisionGroup"?: number;
	readonly "m_fadeMaxDist"?: number;
	readonly "m_fadeMinDist"?: number;
	readonly "m_fEffects"?: number;
	readonly "m_fFlags"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_flCapsuleRadius"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flDeathTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flFadeScale"?: number;
	readonly "m_flFlashDuration"?: number;
	readonly "m_flFlashMaxAlpha"?: number;
	readonly "m_flFriction"?: number;
	readonly "m_flGlowBackfaceMult"?: number;
	readonly "m_flGlowStartTime"?: number;
	readonly "m_flGlowTime"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flProgressBarStartTime"?: number;
	readonly "m_flShadowStrength"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_flTimeScale"?: number;
	readonly "m_flWaterLevel"?: number;
	readonly "m_glowColorOverride"?: number;
	readonly "m_hController"?: number;
	readonly "m_hDefaultController"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hGroundEntity"?: number;
	readonly "m_hMyWearables"?: number;
	readonly "m_hOriginalController"?: number;
	readonly "m_hOwner"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_ID"?: number;
	readonly "m_iGlowTeam"?: number;
	readonly "m_iGlowType"?: number;
	readonly "m_iHealth"?: number;
	readonly "m_iHideHUD"?: number;
	readonly "m_iMaxHealth"?: number;
	readonly "m_iPlayerState"?: bigint;
	readonly "m_iProgressBarDuration"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_lifeState"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nCollisionFunctionMask"?: number;
	readonly "m_nCollisionGroup"?: number;
	readonly "m_nDetailLayerMask"?: number;
	readonly "m_nDetailLayerMaskType"?: number;
	readonly "m_nEnablePhysics"?: number;
	readonly "m_nEntityId"?: number;
	readonly "m_nForceBone"?: number;
	readonly "m_nGlowRange"?: number;
	readonly "m_nGlowRangeMin"?: number;
	readonly "m_nGroundBodyIndex"?: number;
	readonly "m_nHierarchyId"?: number;
	readonly "m_nInteractsAs"?: bigint;
	readonly "m_nInteractsExclude"?: bigint;
	readonly "m_nInteractsWith"?: bigint;
	readonly "m_nNextThinkTick"?: number;
	readonly "m_nObjectCulling"?: number;
	readonly "m_nOwnerId"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nRenderFX"?: bigint;
	readonly "m_nRenderMode"?: bigint;
	readonly "m_nSolidType"?: bigint;
	readonly "m_nSubclassID"?: number;
	readonly "m_nSurroundType"?: bigint;
	readonly "m_nTargetDetailLayer"?: number;
	readonly "m_nWorldGroupID"?: number;
	readonly "m_Transforms"?: number;
	readonly "m_triggerBloat"?: number;
	readonly "m_ubInterpolationFrame"?: number;
	readonly "m_usSolidFlags"?: number;
	readonly "m_Values"?: [number, number, number];
	readonly "m_vCapsuleCenter1"?: [number, number, number];
	readonly "m_vCapsuleCenter2"?: [number, number, number];
	readonly "m_vecBaseVelocity"?: [number, number, number];
	readonly "m_vecForce"?: [number, number, number];
	readonly "m_vecMaxs"?: [number, number, number];
	readonly "m_vecMins"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMaxs"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMins"?: [number, number, number];
	readonly "m_vecX"?: number;
	readonly "m_vecY"?: number;
	readonly "m_vecZ"?: number;
	readonly "m_vLookTargetPosition"?: [number, number, number];
	readonly "maxdensity"?: number;
	readonly "maxdensityLerpTo"?: number;
	readonly "nIndex"?: number;
	readonly "nType"?: number;
	readonly "origin"?: [number, number, number];
	readonly "qAngle"?: [number, number, number];
	readonly "scale"?: number;
	readonly "scattering"?: number;
	readonly "skyboxFogFactor"?: number;
	readonly "skyboxFogFactorLerpTo"?: number;
	readonly "start"?: number;
	readonly "startLerpTo"?: number;
}

interface _CCSPlayerResourceOwn {
	readonly "m_bEndMatchNextMapAllVoted"?: boolean;
	readonly "m_bHostageAlive"?: boolean;
	readonly "m_bombsiteCenterA"?: [number, number, number];
	readonly "m_bombsiteCenterB"?: [number, number, number];
	readonly "m_hostageRescueX"?: number;
	readonly "m_hostageRescueY"?: number;
	readonly "m_hostageRescueZ"?: number;
	readonly "m_iHostageEntityIDs"?: bigint;
	readonly "m_isHostageFollowingSomeone"?: boolean;
}

interface _CCSTeamOwn {
	readonly "m_aPawns"?: number;
	readonly "m_aPlayers"?: number;
	readonly "m_bSurrendered"?: boolean;
	readonly "m_iClanID"?: number;
	readonly "m_iScore"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_numMapVictories"?: number;
	readonly "m_scoreFirstHalf"?: number;
	readonly "m_scoreOvertime"?: number;
	readonly "m_scoreSecondHalf"?: number;
	readonly "m_szClanTeamname"?: string;
	readonly "m_szTeamFlagImage"?: string;
	readonly "m_szTeamLogoImage"?: string;
	readonly "m_szTeamMatchStat"?: string;
	readonly "m_szTeamname"?: string;
}

interface _CCSWeaponBaseShotgunOwn {
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bAnimGraphUpdateEnabled"?: boolean;
	readonly "m_bBurstMode"?: boolean;
	readonly "m_bClientSideRagdoll"?: boolean;
	readonly "m_bDroppedNearBuyZone"?: boolean;
	readonly "m_bEligibleForScreenHighlight"?: boolean;
	readonly "m_bFlashing"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bInitialized"?: boolean;
	readonly "m_bInitiallyPopulateInterpHistory"?: boolean;
	readonly "m_bInReload"?: boolean;
	readonly "m_bInspectPending"?: boolean;
	readonly "m_bInspectShouldLoop"?: boolean;
	readonly "m_bIsHauledBack"?: boolean;
	readonly "m_bNoInterpolate"?: boolean;
	readonly "m_bRagdollClientSide"?: boolean;
	readonly "m_bRagdollEnabled"?: boolean;
	readonly "m_bRenderToCubemaps"?: boolean;
	readonly "m_bSetBonus"?: boolean;
	readonly "m_bSilencerOn"?: boolean;
	readonly "m_bvDisabledHitGroups"?: number;
	readonly "m_bWasActiveWeaponWhenDropped"?: boolean;
	readonly "m_clrRender"?: number;
	readonly "m_CollisionGroup"?: number;
	readonly "m_fAccuracyPenalty"?: number;
	readonly "m_fadeMaxDist"?: number;
	readonly "m_fadeMinDist"?: number;
	readonly "m_fEffects"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_fLastShotTime"?: number;
	readonly "m_flCapsuleRadius"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flDroppedAtTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flFadeScale"?: number;
	readonly "m_flFallbackWear"?: number;
	readonly "m_flGlowBackfaceMult"?: number;
	readonly "m_flGlowStartTime"?: number;
	readonly "m_flGlowTime"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flInitialValue"?: number;
	readonly "m_flInspectCancelCompleteTime"?: number;
	readonly "m_flLastShakeTime"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flNextPrimaryAttackTickRatio"?: number;
	readonly "m_flNextSecondaryAttackTickRatio"?: number;
	readonly "m_flPostponeFireReadyFrac"?: number;
	readonly "m_flRecoilIndex"?: number;
	readonly "m_flShadowStrength"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_flTimeSilencerSwitchComplete"?: number;
	readonly "m_flWatTickOffset"?: number;
	readonly "m_flWeaponActionPlaybackRate"?: number;
	readonly "m_flWeaponGameplayAnimStateTimestamp"?: number;
	readonly "m_glowColorOverride"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hOuter"?: number;
	readonly "m_hOwner"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_hPrevOwner"?: number;
	readonly "m_iAccountID"?: number;
	readonly "m_iAttributeDefinitionIndex"?: number;
	readonly "m_iClip1"?: number;
	readonly "m_iClip2"?: number;
	readonly "m_ID"?: number;
	readonly "m_iEntityLevel"?: number;
	readonly "m_iEntityQuality"?: number;
	readonly "m_iGlowTeam"?: number;
	readonly "m_iGlowType"?: number;
	readonly "m_iInventoryPosition"?: number;
	readonly "m_iIronSightMode"?: number;
	readonly "m_iItemDefinitionIndex"?: number;
	readonly "m_iItemIDHigh"?: number;
	readonly "m_iItemIDLow"?: number;
	readonly "m_iMostRecentTeamNumber"?: number;
	readonly "m_iOriginalTeamNumber"?: number;
	readonly "m_iRawValue32"?: number;
	readonly "m_iReapplyProvisionParity"?: number;
	readonly "m_iRecoilIndex"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_iWeaponGameplayAnimState"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nCollisionFunctionMask"?: number;
	readonly "m_nCollisionGroup"?: number;
	readonly "m_nDetailLayerMask"?: number;
	readonly "m_nDetailLayerMaskType"?: number;
	readonly "m_nDropTick"?: number;
	readonly "m_nEnablePhysics"?: number;
	readonly "m_nEntityId"?: number;
	readonly "m_nextPrevOwnerUseTime"?: number;
	readonly "m_nFallbackPaintKit"?: number;
	readonly "m_nFallbackSeed"?: number;
	readonly "m_nFallbackStatTrak"?: number;
	readonly "m_nForceBone"?: number;
	readonly "m_nGlowRange"?: number;
	readonly "m_nGlowRangeMin"?: number;
	readonly "m_nHierarchyId"?: number;
	readonly "m_nInteractsAs"?: bigint;
	readonly "m_nInteractsExclude"?: bigint;
	readonly "m_nInteractsWith"?: bigint;
	readonly "m_nNextPrimaryAttackTick"?: number;
	readonly "m_nNextSecondaryAttackTick"?: number;
	readonly "m_nNextThinkTick"?: number;
	readonly "m_nObjectCulling"?: number;
	readonly "m_nOwnerId"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nPostponeFireReadyTicks"?: number;
	readonly "m_nRefundableCurrency"?: number;
	readonly "m_nRenderFX"?: bigint;
	readonly "m_nRenderMode"?: bigint;
	readonly "m_nSolidType"?: bigint;
	readonly "m_nSubclassID"?: number;
	readonly "m_nSurroundType"?: bigint;
	readonly "m_nTargetDetailLayer"?: number;
	readonly "m_OriginalOwnerXuidHigh"?: number;
	readonly "m_OriginalOwnerXuidLow"?: number;
	readonly "m_pReserveAmmo"?: number;
	readonly "m_ProviderType"?: number;
	readonly "m_szCustomName"?: string;
	readonly "m_Transforms"?: number;
	readonly "m_triggerBloat"?: number;
	readonly "m_ubInterpolationFrame"?: number;
	readonly "m_usSolidFlags"?: number;
	readonly "m_Values"?: [number, number, number];
	readonly "m_vCapsuleCenter1"?: [number, number, number];
	readonly "m_vCapsuleCenter2"?: [number, number, number];
	readonly "m_vecForce"?: [number, number, number];
	readonly "m_vecMaxs"?: [number, number, number];
	readonly "m_vecMins"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMaxs"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMins"?: [number, number, number];
	readonly "m_vLookTargetPosition"?: [number, number, number];
	readonly "m_weaponMode"?: bigint;
}

interface _CDecoyGrenadeOwn {
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bAnimGraphUpdateEnabled"?: boolean;
	readonly "m_bBurstMode"?: boolean;
	readonly "m_bClientSideRagdoll"?: boolean;
	readonly "m_bDroppedNearBuyZone"?: boolean;
	readonly "m_bEligibleForScreenHighlight"?: boolean;
	readonly "m_bFlashing"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bInitialized"?: boolean;
	readonly "m_bInitiallyPopulateInterpHistory"?: boolean;
	readonly "m_bInReload"?: boolean;
	readonly "m_bInspectPending"?: boolean;
	readonly "m_bInspectShouldLoop"?: boolean;
	readonly "m_bIsHauledBack"?: boolean;
	readonly "m_bIsHeldByPlayer"?: boolean;
	readonly "m_bJumpThrow"?: boolean;
	readonly "m_bJustPulledPin"?: boolean;
	readonly "m_bNoInterpolate"?: boolean;
	readonly "m_bPinPulled"?: boolean;
	readonly "m_bRagdollClientSide"?: boolean;
	readonly "m_bRagdollEnabled"?: boolean;
	readonly "m_bRedraw"?: boolean;
	readonly "m_bRenderToCubemaps"?: boolean;
	readonly "m_bSetBonus"?: boolean;
	readonly "m_bSilencerOn"?: boolean;
	readonly "m_bThrowAnimating"?: boolean;
	readonly "m_bvDisabledHitGroups"?: number;
	readonly "m_bWasActiveWeaponWhenDropped"?: boolean;
	readonly "m_clrRender"?: number;
	readonly "m_CollisionGroup"?: number;
	readonly "m_fAccuracyPenalty"?: number;
	readonly "m_fadeMaxDist"?: number;
	readonly "m_fadeMinDist"?: number;
	readonly "m_fDropTime"?: number;
	readonly "m_fEffects"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_fLastShotTime"?: number;
	readonly "m_flCapsuleRadius"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flDroppedAtTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flFadeScale"?: number;
	readonly "m_flFallbackWear"?: number;
	readonly "m_flGlowBackfaceMult"?: number;
	readonly "m_flGlowStartTime"?: number;
	readonly "m_flGlowTime"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flInitialValue"?: number;
	readonly "m_flInspectCancelCompleteTime"?: number;
	readonly "m_flLastShakeTime"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flNextHoldFrac"?: number;
	readonly "m_flNextPrimaryAttackTickRatio"?: number;
	readonly "m_flNextSecondaryAttackTickRatio"?: number;
	readonly "m_flPostponeFireReadyFrac"?: number;
	readonly "m_flRecoilIndex"?: number;
	readonly "m_flShadowStrength"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_flThrowStrength"?: number;
	readonly "m_flTimeSilencerSwitchComplete"?: number;
	readonly "m_flWatTickOffset"?: number;
	readonly "m_flWeaponActionPlaybackRate"?: number;
	readonly "m_flWeaponGameplayAnimStateTimestamp"?: number;
	readonly "m_fPinPullTime"?: number;
	readonly "m_fThrowTime"?: number;
	readonly "m_glowColorOverride"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hOuter"?: number;
	readonly "m_hOwner"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_hPrevOwner"?: number;
	readonly "m_hSwitchToWeaponAfterThrow"?: number;
	readonly "m_iAccountID"?: number;
	readonly "m_iAttributeDefinitionIndex"?: number;
	readonly "m_iClip1"?: number;
	readonly "m_iClip2"?: number;
	readonly "m_ID"?: number;
	readonly "m_iEntityLevel"?: number;
	readonly "m_iEntityQuality"?: number;
	readonly "m_iGlowTeam"?: number;
	readonly "m_iGlowType"?: number;
	readonly "m_iInventoryPosition"?: number;
	readonly "m_iIronSightMode"?: number;
	readonly "m_iItemDefinitionIndex"?: number;
	readonly "m_iItemIDHigh"?: number;
	readonly "m_iItemIDLow"?: number;
	readonly "m_iMostRecentTeamNumber"?: number;
	readonly "m_iOriginalTeamNumber"?: number;
	readonly "m_iRawValue32"?: number;
	readonly "m_iReapplyProvisionParity"?: number;
	readonly "m_iRecoilIndex"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_iWeaponGameplayAnimState"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nCollisionFunctionMask"?: number;
	readonly "m_nCollisionGroup"?: number;
	readonly "m_nDetailLayerMask"?: number;
	readonly "m_nDetailLayerMaskType"?: number;
	readonly "m_nDropTick"?: number;
	readonly "m_nEnablePhysics"?: number;
	readonly "m_nEntityId"?: number;
	readonly "m_nextPrevOwnerUseTime"?: number;
	readonly "m_nFallbackPaintKit"?: number;
	readonly "m_nFallbackSeed"?: number;
	readonly "m_nFallbackStatTrak"?: number;
	readonly "m_nForceBone"?: number;
	readonly "m_nGlowRange"?: number;
	readonly "m_nGlowRangeMin"?: number;
	readonly "m_nHierarchyId"?: number;
	readonly "m_nInteractsAs"?: bigint;
	readonly "m_nInteractsExclude"?: bigint;
	readonly "m_nInteractsWith"?: bigint;
	readonly "m_nNextHoldTick"?: number;
	readonly "m_nNextPrimaryAttackTick"?: number;
	readonly "m_nNextSecondaryAttackTick"?: number;
	readonly "m_nNextThinkTick"?: number;
	readonly "m_nObjectCulling"?: number;
	readonly "m_nOwnerId"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nPostponeFireReadyTicks"?: number;
	readonly "m_nRefundableCurrency"?: number;
	readonly "m_nRenderFX"?: bigint;
	readonly "m_nRenderMode"?: bigint;
	readonly "m_nSolidType"?: bigint;
	readonly "m_nSubclassID"?: number;
	readonly "m_nSurroundType"?: bigint;
	readonly "m_nTargetDetailLayer"?: number;
	readonly "m_OriginalOwnerXuidHigh"?: number;
	readonly "m_OriginalOwnerXuidLow"?: number;
	readonly "m_pReserveAmmo"?: number;
	readonly "m_ProviderType"?: number;
	readonly "m_szCustomName"?: string;
	readonly "m_Transforms"?: number;
	readonly "m_triggerBloat"?: number;
	readonly "m_ubInterpolationFrame"?: number;
	readonly "m_usSolidFlags"?: number;
	readonly "m_Values"?: [number, number, number];
	readonly "m_vCapsuleCenter1"?: [number, number, number];
	readonly "m_vCapsuleCenter2"?: [number, number, number];
	readonly "m_vecForce"?: [number, number, number];
	readonly "m_vecMaxs"?: [number, number, number];
	readonly "m_vecMins"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMaxs"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMins"?: [number, number, number];
	readonly "m_vLookTargetPosition"?: [number, number, number];
	readonly "m_weaponMode"?: bigint;
}

interface _CDecoyProjectileOwn {
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bAnimGraphUpdateEnabled"?: boolean;
	readonly "m_bClientSideRagdoll"?: boolean;
	readonly "m_bEligibleForScreenHighlight"?: boolean;
	readonly "m_bFlashing"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bInitiallyPopulateInterpHistory"?: boolean;
	readonly "m_bIsLive"?: boolean;
	readonly "m_bNoInterpolate"?: boolean;
	readonly "m_bRagdollClientSide"?: boolean;
	readonly "m_bRagdollEnabled"?: boolean;
	readonly "m_bRenderToCubemaps"?: boolean;
	readonly "m_bvDisabledHitGroups"?: number;
	readonly "m_clrRender"?: number;
	readonly "m_CollisionGroup"?: number;
	readonly "m_DmgRadius"?: number;
	readonly "m_fadeMaxDist"?: number;
	readonly "m_fadeMinDist"?: number;
	readonly "m_fEffects"?: number;
	readonly "m_fFlags"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_flCapsuleRadius"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flDamage"?: number;
	readonly "m_flDetonateTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flFadeScale"?: number;
	readonly "m_flGlowBackfaceMult"?: number;
	readonly "m_flGlowStartTime"?: number;
	readonly "m_flGlowTime"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flShadowStrength"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_glowColorOverride"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hOwner"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_hThrower"?: number;
	readonly "m_ID"?: number;
	readonly "m_iGlowTeam"?: number;
	readonly "m_iGlowType"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nBounces"?: number;
	readonly "m_nCollisionFunctionMask"?: number;
	readonly "m_nCollisionGroup"?: number;
	readonly "m_nDecoyShotTick"?: number;
	readonly "m_nDetailLayerMask"?: number;
	readonly "m_nDetailLayerMaskType"?: number;
	readonly "m_nEnablePhysics"?: number;
	readonly "m_nEntityId"?: number;
	readonly "m_nExplodeEffectIndex"?: bigint;
	readonly "m_nExplodeEffectTickBegin"?: number;
	readonly "m_nForceBone"?: number;
	readonly "m_nGlowRange"?: number;
	readonly "m_nGlowRangeMin"?: number;
	readonly "m_nHierarchyId"?: number;
	readonly "m_nInteractsAs"?: bigint;
	readonly "m_nInteractsExclude"?: bigint;
	readonly "m_nInteractsWith"?: bigint;
	readonly "m_nObjectCulling"?: number;
	readonly "m_nOwnerId"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nRenderFX"?: bigint;
	readonly "m_nRenderMode"?: bigint;
	readonly "m_nSolidType"?: bigint;
	readonly "m_nSubclassID"?: number;
	readonly "m_nSurroundType"?: bigint;
	readonly "m_nTargetDetailLayer"?: number;
	readonly "m_Transforms"?: number;
	readonly "m_triggerBloat"?: number;
	readonly "m_ubInterpolationFrame"?: number;
	readonly "m_usSolidFlags"?: number;
	readonly "m_Values"?: [number, number, number];
	readonly "m_vCapsuleCenter1"?: [number, number, number];
	readonly "m_vCapsuleCenter2"?: [number, number, number];
	readonly "m_vecExplodeEffectOrigin"?: [number, number, number];
	readonly "m_vecForce"?: [number, number, number];
	readonly "m_vecMaxs"?: [number, number, number];
	readonly "m_vecMins"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMaxs"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMins"?: [number, number, number];
	readonly "m_vecX"?: number;
	readonly "m_vecY"?: number;
	readonly "m_vecZ"?: number;
	readonly "m_vInitialPosition"?: [number, number, number];
	readonly "m_vInitialVelocity"?: [number, number, number];
	readonly "m_vLookTargetPosition"?: [number, number, number];
}

interface _CEnvDetailControllerOwn {
	readonly "m_flFadeEndDist"?: number;
	readonly "m_flFadeStartDist"?: number;
}

interface _CEnvVolumetricFogControllerOwn {
	readonly "m_bActive"?: boolean;
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bEnableIndirect"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bIsMaster"?: boolean;
	readonly "m_bStartDisabled"?: boolean;
	readonly "m_fEffects"?: number;
	readonly "m_fFirstVolumeSliceThickness"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_flAnisotropy"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flDefaultAnisotropy"?: number;
	readonly "m_flDefaultDrawDistance"?: number;
	readonly "m_flDefaultScattering"?: number;
	readonly "m_flDrawDistance"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flFadeInEnd"?: number;
	readonly "m_flFadeInStart"?: number;
	readonly "m_flFadeSpeed"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flIndirectStrength"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flScattering"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_flStartAnisoTime"?: number;
	readonly "m_flStartAnisotropy"?: number;
	readonly "m_flStartDrawDistance"?: number;
	readonly "m_flStartDrawDistanceTime"?: number;
	readonly "m_flStartScattering"?: number;
	readonly "m_flStartScatterTime"?: number;
	readonly "m_fNoiseSpeed"?: number;
	readonly "m_fNoiseStrength"?: number;
	readonly "m_fWindSpeed"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hFogIndirectTexture"?: bigint;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nForceRefreshCount"?: number;
	readonly "m_nIndirectTextureDimX"?: number;
	readonly "m_nIndirectTextureDimY"?: number;
	readonly "m_nIndirectTextureDimZ"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nSubclassID"?: number;
	readonly "m_nVolumeDepth"?: number;
	readonly "m_TintColor"?: number;
	readonly "m_ubInterpolationFrame"?: number;
	readonly "m_vBoxMaxs"?: [number, number, number];
	readonly "m_vBoxMins"?: [number, number, number];
	readonly "m_vNoiseScale"?: [number, number, number];
	readonly "m_vWindDirection"?: [number, number, number];
}

interface _CEnvWindControllerOwn {
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bIsMaster"?: boolean;
	readonly "m_fDirectionVariation"?: number;
	readonly "m_fEffects"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flGustDuration"?: number;
	readonly "m_flInitialWindSpeed"?: number;
	readonly "m_flMaxGustDelay"?: number;
	readonly "m_flMinGustDelay"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_flStartTime"?: number;
	readonly "m_fSpeedVariation"?: number;
	readonly "m_fTurbulence"?: number;
	readonly "m_fVolumeHalfExtentXY"?: number;
	readonly "m_fVolumeHalfExtentZ"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_iGustDirChange"?: number;
	readonly "m_iInitialWindDir"?: number;
	readonly "m_iMaxGust"?: number;
	readonly "m_iMaxWind"?: number;
	readonly "m_iMinGust"?: number;
	readonly "m_iMinWind"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_iWindSeed"?: number;
	readonly "m_location"?: [number, number, number];
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nClipmapLevels"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nSubclassID"?: number;
	readonly "m_nVolumeResolutionXY"?: number;
	readonly "m_nVolumeResolutionZ"?: number;
	readonly "m_ubInterpolationFrame"?: number;
	readonly "m_windRadius"?: number;
}

interface _CFogControllerOwn {
	readonly "blend"?: boolean;
	readonly "blendtobackground"?: number;
	readonly "colorPrimary"?: number;
	readonly "colorPrimaryLerpTo"?: number;
	readonly "colorSecondary"?: number;
	readonly "colorSecondaryLerpTo"?: number;
	readonly "dirPrimary"?: [number, number, number];
	readonly "duration"?: number;
	readonly "enable"?: boolean;
	readonly "end"?: number;
	readonly "endLerpTo"?: number;
	readonly "exponent"?: number;
	readonly "farz"?: number;
	readonly "HDRColorScale"?: number;
	readonly "lerptime"?: number;
	readonly "locallightscale"?: number;
	readonly "maxdensity"?: number;
	readonly "maxdensityLerpTo"?: number;
	readonly "scattering"?: number;
	readonly "skyboxFogFactor"?: number;
	readonly "skyboxFogFactorLerpTo"?: number;
	readonly "start"?: number;
	readonly "startLerpTo"?: number;
}

interface _CInfernoOwn {
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bEligibleForScreenHighlight"?: boolean;
	readonly "m_bFireIsBurning"?: boolean;
	readonly "m_bFlashing"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bInPostEffectTime"?: boolean;
	readonly "m_bNoInterpolate"?: boolean;
	readonly "m_bRenderToCubemaps"?: boolean;
	readonly "m_BurnNormal"?: [number, number, number];
	readonly "m_bvDisabledHitGroups"?: number;
	readonly "m_clrRender"?: number;
	readonly "m_CollisionGroup"?: number;
	readonly "m_fadeMaxDist"?: number;
	readonly "m_fadeMinDist"?: number;
	readonly "m_fEffects"?: number;
	readonly "m_fireCount"?: number;
	readonly "m_fireParentPositions"?: [number, number, number];
	readonly "m_firePositions"?: [number, number, number];
	readonly "m_flAnimTime"?: number;
	readonly "m_flCapsuleRadius"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flFadeScale"?: number;
	readonly "m_flGlowBackfaceMult"?: number;
	readonly "m_flGlowStartTime"?: number;
	readonly "m_flGlowTime"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flShadowStrength"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_glowColorOverride"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_ID"?: number;
	readonly "m_iGlowTeam"?: number;
	readonly "m_iGlowType"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nCollisionFunctionMask"?: number;
	readonly "m_nCollisionGroup"?: number;
	readonly "m_nDetailLayerMask"?: number;
	readonly "m_nDetailLayerMaskType"?: number;
	readonly "m_nEnablePhysics"?: number;
	readonly "m_nEntityId"?: number;
	readonly "m_nFireEffectTickBegin"?: number;
	readonly "m_nFireLifetime"?: number;
	readonly "m_nGlowRange"?: number;
	readonly "m_nGlowRangeMin"?: number;
	readonly "m_nHierarchyId"?: number;
	readonly "m_nInfernoType"?: number;
	readonly "m_nInteractsAs"?: bigint;
	readonly "m_nInteractsExclude"?: bigint;
	readonly "m_nInteractsWith"?: bigint;
	readonly "m_nObjectCulling"?: number;
	readonly "m_nOwnerId"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nRenderFX"?: bigint;
	readonly "m_nRenderMode"?: bigint;
	readonly "m_nSolidType"?: bigint;
	readonly "m_nSubclassID"?: number;
	readonly "m_nSurroundType"?: bigint;
	readonly "m_nTargetDetailLayer"?: number;
	readonly "m_triggerBloat"?: number;
	readonly "m_ubInterpolationFrame"?: number;
	readonly "m_usSolidFlags"?: number;
	readonly "m_Values"?: [number, number, number];
	readonly "m_vCapsuleCenter1"?: [number, number, number];
	readonly "m_vCapsuleCenter2"?: [number, number, number];
	readonly "m_vecMaxs"?: [number, number, number];
	readonly "m_vecMins"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMaxs"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMins"?: [number, number, number];
}

interface _CKnifeOwn {
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bAnimGraphUpdateEnabled"?: boolean;
	readonly "m_bBurstMode"?: boolean;
	readonly "m_bClientSideRagdoll"?: boolean;
	readonly "m_bDroppedNearBuyZone"?: boolean;
	readonly "m_bEligibleForScreenHighlight"?: boolean;
	readonly "m_bFirstAttack"?: boolean;
	readonly "m_bFlashing"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bInitialized"?: boolean;
	readonly "m_bInitiallyPopulateInterpHistory"?: boolean;
	readonly "m_bInReload"?: boolean;
	readonly "m_bInspectPending"?: boolean;
	readonly "m_bInspectShouldLoop"?: boolean;
	readonly "m_bIsHauledBack"?: boolean;
	readonly "m_bNoInterpolate"?: boolean;
	readonly "m_bRagdollClientSide"?: boolean;
	readonly "m_bRagdollEnabled"?: boolean;
	readonly "m_bRenderToCubemaps"?: boolean;
	readonly "m_bSetBonus"?: boolean;
	readonly "m_bSilencerOn"?: boolean;
	readonly "m_bvDisabledHitGroups"?: number;
	readonly "m_bWasActiveWeaponWhenDropped"?: boolean;
	readonly "m_clrRender"?: number;
	readonly "m_CollisionGroup"?: number;
	readonly "m_fAccuracyPenalty"?: number;
	readonly "m_fadeMaxDist"?: number;
	readonly "m_fadeMinDist"?: number;
	readonly "m_fEffects"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_fLastShotTime"?: number;
	readonly "m_flCapsuleRadius"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flDroppedAtTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flFadeScale"?: number;
	readonly "m_flFallbackWear"?: number;
	readonly "m_flGlowBackfaceMult"?: number;
	readonly "m_flGlowStartTime"?: number;
	readonly "m_flGlowTime"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flInitialValue"?: number;
	readonly "m_flInspectCancelCompleteTime"?: number;
	readonly "m_flLastShakeTime"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flNextPrimaryAttackTickRatio"?: number;
	readonly "m_flNextSecondaryAttackTickRatio"?: number;
	readonly "m_flPostponeFireReadyFrac"?: number;
	readonly "m_flRecoilIndex"?: number;
	readonly "m_flShadowStrength"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_flTimeSilencerSwitchComplete"?: number;
	readonly "m_flWatTickOffset"?: number;
	readonly "m_flWeaponActionPlaybackRate"?: number;
	readonly "m_flWeaponGameplayAnimStateTimestamp"?: number;
	readonly "m_glowColorOverride"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hOuter"?: number;
	readonly "m_hOwner"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_hPrevOwner"?: number;
	readonly "m_iAccountID"?: number;
	readonly "m_iAttributeDefinitionIndex"?: number;
	readonly "m_iClip1"?: number;
	readonly "m_iClip2"?: number;
	readonly "m_ID"?: number;
	readonly "m_iEntityLevel"?: number;
	readonly "m_iEntityQuality"?: number;
	readonly "m_iGlowTeam"?: number;
	readonly "m_iGlowType"?: number;
	readonly "m_iInventoryPosition"?: number;
	readonly "m_iIronSightMode"?: number;
	readonly "m_iItemDefinitionIndex"?: number;
	readonly "m_iItemIDHigh"?: number;
	readonly "m_iItemIDLow"?: number;
	readonly "m_iMostRecentTeamNumber"?: number;
	readonly "m_iOriginalTeamNumber"?: number;
	readonly "m_iRawValue32"?: number;
	readonly "m_iReapplyProvisionParity"?: number;
	readonly "m_iRecoilIndex"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_iWeaponGameplayAnimState"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nCollisionFunctionMask"?: number;
	readonly "m_nCollisionGroup"?: number;
	readonly "m_nDetailLayerMask"?: number;
	readonly "m_nDetailLayerMaskType"?: number;
	readonly "m_nDropTick"?: number;
	readonly "m_nEnablePhysics"?: number;
	readonly "m_nEntityId"?: number;
	readonly "m_nextPrevOwnerUseTime"?: number;
	readonly "m_nFallbackPaintKit"?: number;
	readonly "m_nFallbackSeed"?: number;
	readonly "m_nFallbackStatTrak"?: number;
	readonly "m_nForceBone"?: number;
	readonly "m_nGlowRange"?: number;
	readonly "m_nGlowRangeMin"?: number;
	readonly "m_nHierarchyId"?: number;
	readonly "m_nInteractsAs"?: bigint;
	readonly "m_nInteractsExclude"?: bigint;
	readonly "m_nInteractsWith"?: bigint;
	readonly "m_nNextPrimaryAttackTick"?: number;
	readonly "m_nNextSecondaryAttackTick"?: number;
	readonly "m_nNextThinkTick"?: number;
	readonly "m_nObjectCulling"?: number;
	readonly "m_nOwnerId"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nPostponeFireReadyTicks"?: number;
	readonly "m_nRefundableCurrency"?: number;
	readonly "m_nRenderFX"?: bigint;
	readonly "m_nRenderMode"?: bigint;
	readonly "m_nSolidType"?: bigint;
	readonly "m_nSubclassID"?: number;
	readonly "m_nSurroundType"?: bigint;
	readonly "m_nTargetDetailLayer"?: number;
	readonly "m_OriginalOwnerXuidHigh"?: number;
	readonly "m_OriginalOwnerXuidLow"?: number;
	readonly "m_pReserveAmmo"?: number;
	readonly "m_ProviderType"?: number;
	readonly "m_szCustomName"?: string;
	readonly "m_Transforms"?: number;
	readonly "m_triggerBloat"?: number;
	readonly "m_ubInterpolationFrame"?: number;
	readonly "m_usSolidFlags"?: number;
	readonly "m_Values"?: [number, number, number];
	readonly "m_vCapsuleCenter1"?: [number, number, number];
	readonly "m_vCapsuleCenter2"?: [number, number, number];
	readonly "m_vecForce"?: [number, number, number];
	readonly "m_vecMaxs"?: [number, number, number];
	readonly "m_vecMins"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMaxs"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMins"?: [number, number, number];
	readonly "m_vLookTargetPosition"?: [number, number, number];
	readonly "m_weaponMode"?: bigint;
}

interface _CMapVetoPickControllerOwn {
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_fEffects"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nAccountIDs"?: number;
	readonly "m_nBloodType"?: number;
	readonly "m_nCurrentPhase"?: number;
	readonly "m_nDraftType"?: number;
	readonly "m_nMapId0"?: number;
	readonly "m_nMapId1"?: number;
	readonly "m_nMapId2"?: number;
	readonly "m_nMapId3"?: number;
	readonly "m_nMapId4"?: number;
	readonly "m_nMapId5"?: number;
	readonly "m_nPhaseDurationTicks"?: number;
	readonly "m_nPhaseStartTick"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nStartingSide0"?: number;
	readonly "m_nSubclassID"?: number;
	readonly "m_nTeamWinningCoinToss"?: number;
	readonly "m_nTeamWithFirstChoice"?: number;
	readonly "m_nVoteMapIdsList"?: number;
	readonly "m_ubInterpolationFrame"?: number;
}

interface _CMolotovProjectileOwn {
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bAnimGraphUpdateEnabled"?: boolean;
	readonly "m_bClientSideRagdoll"?: boolean;
	readonly "m_bEligibleForScreenHighlight"?: boolean;
	readonly "m_bFlashing"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bInitiallyPopulateInterpHistory"?: boolean;
	readonly "m_bIsIncGrenade"?: boolean;
	readonly "m_bIsLive"?: boolean;
	readonly "m_bNoInterpolate"?: boolean;
	readonly "m_bRagdollClientSide"?: boolean;
	readonly "m_bRagdollEnabled"?: boolean;
	readonly "m_bRenderToCubemaps"?: boolean;
	readonly "m_bvDisabledHitGroups"?: number;
	readonly "m_clrRender"?: number;
	readonly "m_CollisionGroup"?: number;
	readonly "m_DmgRadius"?: number;
	readonly "m_fadeMaxDist"?: number;
	readonly "m_fadeMinDist"?: number;
	readonly "m_fEffects"?: number;
	readonly "m_fFlags"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_flCapsuleRadius"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flDamage"?: number;
	readonly "m_flDetonateTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flFadeScale"?: number;
	readonly "m_flGlowBackfaceMult"?: number;
	readonly "m_flGlowStartTime"?: number;
	readonly "m_flGlowTime"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flShadowStrength"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_glowColorOverride"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hOwner"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_hThrower"?: number;
	readonly "m_ID"?: number;
	readonly "m_iGlowTeam"?: number;
	readonly "m_iGlowType"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nBounces"?: number;
	readonly "m_nCollisionFunctionMask"?: number;
	readonly "m_nCollisionGroup"?: number;
	readonly "m_nDetailLayerMask"?: number;
	readonly "m_nDetailLayerMaskType"?: number;
	readonly "m_nEnablePhysics"?: number;
	readonly "m_nEntityId"?: number;
	readonly "m_nExplodeEffectIndex"?: bigint;
	readonly "m_nExplodeEffectTickBegin"?: number;
	readonly "m_nForceBone"?: number;
	readonly "m_nGlowRange"?: number;
	readonly "m_nGlowRangeMin"?: number;
	readonly "m_nHierarchyId"?: number;
	readonly "m_nInteractsAs"?: bigint;
	readonly "m_nInteractsExclude"?: bigint;
	readonly "m_nInteractsWith"?: bigint;
	readonly "m_nObjectCulling"?: number;
	readonly "m_nOwnerId"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nRenderFX"?: bigint;
	readonly "m_nRenderMode"?: bigint;
	readonly "m_nSolidType"?: bigint;
	readonly "m_nSubclassID"?: number;
	readonly "m_nSurroundType"?: bigint;
	readonly "m_nTargetDetailLayer"?: number;
	readonly "m_Transforms"?: number;
	readonly "m_triggerBloat"?: number;
	readonly "m_ubInterpolationFrame"?: number;
	readonly "m_usSolidFlags"?: number;
	readonly "m_Values"?: [number, number, number];
	readonly "m_vCapsuleCenter1"?: [number, number, number];
	readonly "m_vCapsuleCenter2"?: [number, number, number];
	readonly "m_vecExplodeEffectOrigin"?: [number, number, number];
	readonly "m_vecForce"?: [number, number, number];
	readonly "m_vecMaxs"?: [number, number, number];
	readonly "m_vecMins"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMaxs"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMins"?: [number, number, number];
	readonly "m_vecX"?: number;
	readonly "m_vecY"?: number;
	readonly "m_vecZ"?: number;
	readonly "m_vInitialPosition"?: [number, number, number];
	readonly "m_vInitialVelocity"?: [number, number, number];
	readonly "m_vLookTargetPosition"?: [number, number, number];
}

interface _CPlantedC4Own {
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bAnimGraphUpdateEnabled"?: boolean;
	readonly "m_bBeingDefused"?: boolean;
	readonly "m_bBombDefused"?: boolean;
	readonly "m_bBombTicking"?: boolean;
	readonly "m_bCannotBeDefused"?: boolean;
	readonly "m_bClientSideRagdoll"?: boolean;
	readonly "m_bEligibleForScreenHighlight"?: boolean;
	readonly "m_bFlashing"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bHasExploded"?: boolean;
	readonly "m_bInitialized"?: boolean;
	readonly "m_bInitiallyPopulateInterpHistory"?: boolean;
	readonly "m_bNoInterpolate"?: boolean;
	readonly "m_bRagdollClientSide"?: boolean;
	readonly "m_bRagdollEnabled"?: boolean;
	readonly "m_bRenderToCubemaps"?: boolean;
	readonly "m_bSetBonus"?: boolean;
	readonly "m_bSpotted"?: boolean;
	readonly "m_bSpottedByMask"?: number;
	readonly "m_bvDisabledHitGroups"?: number;
	readonly "m_clrRender"?: number;
	readonly "m_CollisionGroup"?: number;
	readonly "m_fadeMaxDist"?: number;
	readonly "m_fadeMinDist"?: number;
	readonly "m_fEffects"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_flC4Blow"?: number;
	readonly "m_flCapsuleRadius"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flDefuseCountDown"?: number;
	readonly "m_flDefuseLength"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flFadeScale"?: number;
	readonly "m_flGlowBackfaceMult"?: number;
	readonly "m_flGlowStartTime"?: number;
	readonly "m_flGlowTime"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flInitialValue"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flShadowStrength"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_flTimerLength"?: number;
	readonly "m_glowColorOverride"?: number;
	readonly "m_hBombDefuser"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hOuter"?: number;
	readonly "m_hOwner"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_iAccountID"?: number;
	readonly "m_iAttributeDefinitionIndex"?: number;
	readonly "m_ID"?: number;
	readonly "m_iEntityLevel"?: number;
	readonly "m_iEntityQuality"?: number;
	readonly "m_iGlowTeam"?: number;
	readonly "m_iGlowType"?: number;
	readonly "m_iInventoryPosition"?: number;
	readonly "m_iItemDefinitionIndex"?: number;
	readonly "m_iItemIDHigh"?: number;
	readonly "m_iItemIDLow"?: number;
	readonly "m_iRawValue32"?: number;
	readonly "m_iReapplyProvisionParity"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nBombSite"?: number;
	readonly "m_nCollisionFunctionMask"?: number;
	readonly "m_nCollisionGroup"?: number;
	readonly "m_nDetailLayerMask"?: number;
	readonly "m_nDetailLayerMaskType"?: number;
	readonly "m_nEnablePhysics"?: number;
	readonly "m_nEntityId"?: number;
	readonly "m_nForceBone"?: number;
	readonly "m_nGlowRange"?: number;
	readonly "m_nGlowRangeMin"?: number;
	readonly "m_nHierarchyId"?: number;
	readonly "m_nInteractsAs"?: bigint;
	readonly "m_nInteractsExclude"?: bigint;
	readonly "m_nInteractsWith"?: bigint;
	readonly "m_nObjectCulling"?: number;
	readonly "m_nOwnerId"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nRefundableCurrency"?: number;
	readonly "m_nRenderFX"?: bigint;
	readonly "m_nRenderMode"?: bigint;
	readonly "m_nSolidType"?: bigint;
	readonly "m_nSourceSoundscapeHash"?: number;
	readonly "m_nSubclassID"?: number;
	readonly "m_nSurroundType"?: bigint;
	readonly "m_nTargetDetailLayer"?: number;
	readonly "m_ProviderType"?: number;
	readonly "m_szCustomName"?: string;
	readonly "m_Transforms"?: number;
	readonly "m_triggerBloat"?: number;
	readonly "m_ubInterpolationFrame"?: number;
	readonly "m_usSolidFlags"?: number;
	readonly "m_Values"?: [number, number, number];
	readonly "m_vCapsuleCenter1"?: [number, number, number];
	readonly "m_vCapsuleCenter2"?: [number, number, number];
	readonly "m_vecForce"?: [number, number, number];
	readonly "m_vecMaxs"?: [number, number, number];
	readonly "m_vecMins"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMaxs"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMins"?: [number, number, number];
}

interface _CPlayer_CameraServicesOwn {
	readonly "localBits"?: number;
	readonly "localSound"?: [number, number, number];
	readonly "m_flCsViewPunchAngleTickRatio"?: number;
	readonly "m_hColorCorrectionCtrl"?: number;
	readonly "m_hCtrl"?: number;
	readonly "m_hTonemapController"?: number;
	readonly "m_hViewEntity"?: number;
	readonly "m_nCsViewPunchAngleTick"?: number;
	readonly "m_PostProcessingVolumes"?: number;
	readonly "m_vecCsViewPunchAngle"?: [number, number, number];
	readonly "soundEventHash"?: number;
	readonly "soundscapeEntityListIndex"?: number;
	readonly "soundscapeIndex"?: number;
}

interface _CPlayerPingOwn {
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bUrgent"?: boolean;
	readonly "m_fEffects"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_hPingedEntity"?: number;
	readonly "m_hPlayer"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_iType"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nSubclassID"?: number;
	readonly "m_szPlaceName"?: string;
	readonly "m_ubInterpolationFrame"?: number;
}

interface _CPlayerSprayDecalOwn {
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bEligibleForScreenHighlight"?: boolean;
	readonly "m_bFlashing"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bNoInterpolate"?: boolean;
	readonly "m_bRenderToCubemaps"?: boolean;
	readonly "m_bvDisabledHitGroups"?: number;
	readonly "m_clrRender"?: number;
	readonly "m_CollisionGroup"?: number;
	readonly "m_fadeMaxDist"?: number;
	readonly "m_fadeMinDist"?: number;
	readonly "m_fEffects"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_flCapsuleRadius"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flCreationTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flFadeScale"?: number;
	readonly "m_flGlowBackfaceMult"?: number;
	readonly "m_flGlowStartTime"?: number;
	readonly "m_flGlowTime"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flShadowStrength"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_glowColorOverride"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_ID"?: number;
	readonly "m_iGlowTeam"?: number;
	readonly "m_iGlowType"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nCollisionFunctionMask"?: number;
	readonly "m_nCollisionGroup"?: number;
	readonly "m_nDetailLayerMask"?: number;
	readonly "m_nDetailLayerMaskType"?: number;
	readonly "m_nEnablePhysics"?: number;
	readonly "m_nEntity"?: number;
	readonly "m_nEntityId"?: number;
	readonly "m_nGlowRange"?: number;
	readonly "m_nGlowRangeMin"?: number;
	readonly "m_nHierarchyId"?: number;
	readonly "m_nHitbox"?: number;
	readonly "m_nInteractsAs"?: bigint;
	readonly "m_nInteractsExclude"?: bigint;
	readonly "m_nInteractsWith"?: bigint;
	readonly "m_nObjectCulling"?: number;
	readonly "m_nOwnerId"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nPlayer"?: number;
	readonly "m_nRenderFX"?: bigint;
	readonly "m_nRenderMode"?: bigint;
	readonly "m_nSolidType"?: bigint;
	readonly "m_nSubclassID"?: number;
	readonly "m_nSurroundType"?: bigint;
	readonly "m_nTargetDetailLayer"?: number;
	readonly "m_nTintID"?: number;
	readonly "m_nUniqueID"?: number;
	readonly "m_nVersion"?: number;
	readonly "m_rtGcTime"?: number;
	readonly "m_triggerBloat"?: number;
	readonly "m_ubInterpolationFrame"?: number;
	readonly "m_ubSignature"?: number;
	readonly "m_unAccountID"?: number;
	readonly "m_unTraceID"?: number;
	readonly "m_usSolidFlags"?: number;
	readonly "m_Values"?: [number, number, number];
	readonly "m_vCapsuleCenter1"?: [number, number, number];
	readonly "m_vCapsuleCenter2"?: [number, number, number];
	readonly "m_vecEndPos"?: [number, number, number];
	readonly "m_vecLeft"?: [number, number, number];
	readonly "m_vecMaxs"?: [number, number, number];
	readonly "m_vecMins"?: [number, number, number];
	readonly "m_vecNormal"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMaxs"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMins"?: [number, number, number];
	readonly "m_vecStart"?: [number, number, number];
}

interface _CPlayerVisibilityOwn {
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bIsEnabled"?: boolean;
	readonly "m_bStartDisabled"?: boolean;
	readonly "m_fEffects"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flFadeTime"?: number;
	readonly "m_flFogDistanceMultiplier"?: number;
	readonly "m_flFogMaxDensityMultiplier"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_flVisibilityStrength"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nSubclassID"?: number;
	readonly "m_ubInterpolationFrame"?: number;
}

interface _CSmokeGrenadeProjectileOwn {
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bAnimGraphUpdateEnabled"?: boolean;
	readonly "m_bClientSideRagdoll"?: boolean;
	readonly "m_bDidSmokeEffect"?: boolean;
	readonly "m_bEligibleForScreenHighlight"?: boolean;
	readonly "m_bFlashing"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bInitiallyPopulateInterpHistory"?: boolean;
	readonly "m_bIsLive"?: boolean;
	readonly "m_bNoInterpolate"?: boolean;
	readonly "m_bRagdollClientSide"?: boolean;
	readonly "m_bRagdollEnabled"?: boolean;
	readonly "m_bRenderToCubemaps"?: boolean;
	readonly "m_bvDisabledHitGroups"?: number;
	readonly "m_clrRender"?: number;
	readonly "m_CollisionGroup"?: number;
	readonly "m_DmgRadius"?: number;
	readonly "m_fadeMaxDist"?: number;
	readonly "m_fadeMinDist"?: number;
	readonly "m_fEffects"?: number;
	readonly "m_fFlags"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_flCapsuleRadius"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flDamage"?: number;
	readonly "m_flDetonateTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flFadeScale"?: number;
	readonly "m_flGlowBackfaceMult"?: number;
	readonly "m_flGlowStartTime"?: number;
	readonly "m_flGlowTime"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flShadowStrength"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_glowColorOverride"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hOwner"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_hThrower"?: number;
	readonly "m_ID"?: number;
	readonly "m_iGlowTeam"?: number;
	readonly "m_iGlowType"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nBounces"?: number;
	readonly "m_nCollisionFunctionMask"?: number;
	readonly "m_nCollisionGroup"?: number;
	readonly "m_nDetailLayerMask"?: number;
	readonly "m_nDetailLayerMaskType"?: number;
	readonly "m_nEnablePhysics"?: number;
	readonly "m_nEntityId"?: number;
	readonly "m_nExplodeEffectIndex"?: bigint;
	readonly "m_nExplodeEffectTickBegin"?: number;
	readonly "m_nForceBone"?: number;
	readonly "m_nGlowRange"?: number;
	readonly "m_nGlowRangeMin"?: number;
	readonly "m_nHierarchyId"?: number;
	readonly "m_nInteractsAs"?: bigint;
	readonly "m_nInteractsExclude"?: bigint;
	readonly "m_nInteractsWith"?: bigint;
	readonly "m_nObjectCulling"?: number;
	readonly "m_nOwnerId"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nRandomSeed"?: number;
	readonly "m_nRenderFX"?: bigint;
	readonly "m_nRenderMode"?: bigint;
	readonly "m_nSmokeEffectTickBegin"?: number;
	readonly "m_nSolidType"?: bigint;
	readonly "m_nSubclassID"?: number;
	readonly "m_nSurroundType"?: bigint;
	readonly "m_nTargetDetailLayer"?: number;
	readonly "m_nVoxelFrameDataSize"?: number;
	readonly "m_nVoxelUpdate"?: number;
	readonly "m_Transforms"?: number;
	readonly "m_triggerBloat"?: number;
	readonly "m_ubInterpolationFrame"?: number;
	readonly "m_usSolidFlags"?: number;
	readonly "m_Values"?: [number, number, number];
	readonly "m_vCapsuleCenter1"?: [number, number, number];
	readonly "m_vCapsuleCenter2"?: [number, number, number];
	readonly "m_vecExplodeEffectOrigin"?: [number, number, number];
	readonly "m_vecForce"?: [number, number, number];
	readonly "m_vecMaxs"?: [number, number, number];
	readonly "m_vecMins"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMaxs"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMins"?: [number, number, number];
	readonly "m_vecX"?: number;
	readonly "m_vecY"?: number;
	readonly "m_vecZ"?: number;
	readonly "m_vInitialPosition"?: [number, number, number];
	readonly "m_vInitialVelocity"?: [number, number, number];
	readonly "m_vLookTargetPosition"?: [number, number, number];
	readonly "m_VoxelFrameData"?: number;
	readonly "m_vSmokeColor"?: [number, number, number];
	readonly "m_vSmokeDetonationPos"?: [number, number, number];
}

interface _CTeamOwn {
	readonly "m_aPawns"?: number;
	readonly "m_aPlayers"?: number;
	readonly "m_iScore"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_szTeamname"?: string;
}

interface _CTonemapController2Own {
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_fEffects"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_flAutoExposureMax"?: number;
	readonly "m_flAutoExposureMin"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flExposureAdaptationSpeedDown"?: number;
	readonly "m_flExposureAdaptationSpeedUp"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_flTonemapEVSmoothingRange"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nSubclassID"?: number;
	readonly "m_ubInterpolationFrame"?: number;
}

interface _CVoteControllerOwn {
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bIsYesNoVote"?: boolean;
	readonly "m_fEffects"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_iActiveIssueIndex"?: number;
	readonly "m_iOnlyTeamToVote"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nPotentialVotes"?: number;
	readonly "m_nSubclassID"?: number;
	readonly "m_nVoteOptionCount"?: number;
	readonly "m_ubInterpolationFrame"?: number;
}

interface _CWeaponCZ75aOwn {
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bAnimGraphUpdateEnabled"?: boolean;
	readonly "m_bBurstMode"?: boolean;
	readonly "m_bClientSideRagdoll"?: boolean;
	readonly "m_bDroppedNearBuyZone"?: boolean;
	readonly "m_bEligibleForScreenHighlight"?: boolean;
	readonly "m_bFlashing"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bInitialized"?: boolean;
	readonly "m_bInitiallyPopulateInterpHistory"?: boolean;
	readonly "m_bInReload"?: boolean;
	readonly "m_bInspectPending"?: boolean;
	readonly "m_bInspectShouldLoop"?: boolean;
	readonly "m_bIsHauledBack"?: boolean;
	readonly "m_bMagazineRemoved"?: boolean;
	readonly "m_bNeedsBoltAction"?: boolean;
	readonly "m_bNoInterpolate"?: boolean;
	readonly "m_bRagdollClientSide"?: boolean;
	readonly "m_bRagdollEnabled"?: boolean;
	readonly "m_bRenderToCubemaps"?: boolean;
	readonly "m_bSetBonus"?: boolean;
	readonly "m_bSilencerOn"?: boolean;
	readonly "m_bvDisabledHitGroups"?: number;
	readonly "m_bWasActiveWeaponWhenDropped"?: boolean;
	readonly "m_clrRender"?: number;
	readonly "m_CollisionGroup"?: number;
	readonly "m_fAccuracyPenalty"?: number;
	readonly "m_fadeMaxDist"?: number;
	readonly "m_fadeMinDist"?: number;
	readonly "m_fEffects"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_fLastShotTime"?: number;
	readonly "m_flCapsuleRadius"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flDroppedAtTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flFadeScale"?: number;
	readonly "m_flFallbackWear"?: number;
	readonly "m_flGlowBackfaceMult"?: number;
	readonly "m_flGlowStartTime"?: number;
	readonly "m_flGlowTime"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flInitialValue"?: number;
	readonly "m_flInspectCancelCompleteTime"?: number;
	readonly "m_flLastShakeTime"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flNextPrimaryAttackTickRatio"?: number;
	readonly "m_flNextSecondaryAttackTickRatio"?: number;
	readonly "m_flPostponeFireReadyFrac"?: number;
	readonly "m_flRecoilIndex"?: number;
	readonly "m_flShadowStrength"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_flTimeSilencerSwitchComplete"?: number;
	readonly "m_flWatTickOffset"?: number;
	readonly "m_flWeaponActionPlaybackRate"?: number;
	readonly "m_flWeaponGameplayAnimStateTimestamp"?: number;
	readonly "m_glowColorOverride"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hOuter"?: number;
	readonly "m_hOwner"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_hPrevOwner"?: number;
	readonly "m_iAccountID"?: number;
	readonly "m_iAttributeDefinitionIndex"?: number;
	readonly "m_iBurstShotsRemaining"?: number;
	readonly "m_iClip1"?: number;
	readonly "m_iClip2"?: number;
	readonly "m_ID"?: number;
	readonly "m_iEntityLevel"?: number;
	readonly "m_iEntityQuality"?: number;
	readonly "m_iGlowTeam"?: number;
	readonly "m_iGlowType"?: number;
	readonly "m_iInventoryPosition"?: number;
	readonly "m_iIronSightMode"?: number;
	readonly "m_iItemDefinitionIndex"?: number;
	readonly "m_iItemIDHigh"?: number;
	readonly "m_iItemIDLow"?: number;
	readonly "m_iMostRecentTeamNumber"?: number;
	readonly "m_iOriginalTeamNumber"?: number;
	readonly "m_iRawValue32"?: number;
	readonly "m_iReapplyProvisionParity"?: number;
	readonly "m_iRecoilIndex"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_iWeaponGameplayAnimState"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nCollisionFunctionMask"?: number;
	readonly "m_nCollisionGroup"?: number;
	readonly "m_nDetailLayerMask"?: number;
	readonly "m_nDetailLayerMaskType"?: number;
	readonly "m_nDropTick"?: number;
	readonly "m_nEnablePhysics"?: number;
	readonly "m_nEntityId"?: number;
	readonly "m_nextPrevOwnerUseTime"?: number;
	readonly "m_nFallbackPaintKit"?: number;
	readonly "m_nFallbackSeed"?: number;
	readonly "m_nFallbackStatTrak"?: number;
	readonly "m_nForceBone"?: number;
	readonly "m_nGlowRange"?: number;
	readonly "m_nGlowRangeMin"?: number;
	readonly "m_nHierarchyId"?: number;
	readonly "m_nInteractsAs"?: bigint;
	readonly "m_nInteractsExclude"?: bigint;
	readonly "m_nInteractsWith"?: bigint;
	readonly "m_nNextPrimaryAttackTick"?: number;
	readonly "m_nNextSecondaryAttackTick"?: number;
	readonly "m_nNextThinkTick"?: number;
	readonly "m_nObjectCulling"?: number;
	readonly "m_nOwnerId"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nPostponeFireReadyTicks"?: number;
	readonly "m_nRefundableCurrency"?: number;
	readonly "m_nRenderFX"?: bigint;
	readonly "m_nRenderMode"?: bigint;
	readonly "m_nRevolverCylinderIdx"?: number;
	readonly "m_nSolidType"?: bigint;
	readonly "m_nSubclassID"?: number;
	readonly "m_nSurroundType"?: bigint;
	readonly "m_nTargetDetailLayer"?: number;
	readonly "m_OriginalOwnerXuidHigh"?: number;
	readonly "m_OriginalOwnerXuidLow"?: number;
	readonly "m_pReserveAmmo"?: number;
	readonly "m_ProviderType"?: number;
	readonly "m_szCustomName"?: string;
	readonly "m_Transforms"?: number;
	readonly "m_triggerBloat"?: number;
	readonly "m_ubInterpolationFrame"?: number;
	readonly "m_usSolidFlags"?: number;
	readonly "m_Values"?: [number, number, number];
	readonly "m_vCapsuleCenter1"?: [number, number, number];
	readonly "m_vCapsuleCenter2"?: [number, number, number];
	readonly "m_vecForce"?: [number, number, number];
	readonly "m_vecMaxs"?: [number, number, number];
	readonly "m_vecMins"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMaxs"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMins"?: [number, number, number];
	readonly "m_vLookTargetPosition"?: [number, number, number];
	readonly "m_weaponMode"?: bigint;
	readonly "m_zoomLevel"?: number;
}

interface _CWeaponTaserOwn {
	readonly "m_bAnimatedEveryTick"?: boolean;
	readonly "m_bAnimGraphUpdateEnabled"?: boolean;
	readonly "m_bBurstMode"?: boolean;
	readonly "m_bClientSideRagdoll"?: boolean;
	readonly "m_bDroppedNearBuyZone"?: boolean;
	readonly "m_bEligibleForScreenHighlight"?: boolean;
	readonly "m_bFlashing"?: boolean;
	readonly "m_bGravityDisabled"?: boolean;
	readonly "m_bInitialized"?: boolean;
	readonly "m_bInitiallyPopulateInterpHistory"?: boolean;
	readonly "m_bInReload"?: boolean;
	readonly "m_bInspectPending"?: boolean;
	readonly "m_bInspectShouldLoop"?: boolean;
	readonly "m_bIsHauledBack"?: boolean;
	readonly "m_bNeedsBoltAction"?: boolean;
	readonly "m_bNoInterpolate"?: boolean;
	readonly "m_bRagdollClientSide"?: boolean;
	readonly "m_bRagdollEnabled"?: boolean;
	readonly "m_bRenderToCubemaps"?: boolean;
	readonly "m_bSetBonus"?: boolean;
	readonly "m_bSilencerOn"?: boolean;
	readonly "m_bvDisabledHitGroups"?: number;
	readonly "m_bWasActiveWeaponWhenDropped"?: boolean;
	readonly "m_clrRender"?: number;
	readonly "m_CollisionGroup"?: number;
	readonly "m_fAccuracyPenalty"?: number;
	readonly "m_fadeMaxDist"?: number;
	readonly "m_fadeMinDist"?: number;
	readonly "m_fEffects"?: number;
	readonly "m_fFireTime"?: number;
	readonly "m_flAnimTime"?: number;
	readonly "m_fLastShotTime"?: number;
	readonly "m_flCapsuleRadius"?: number;
	readonly "m_flCreateTime"?: number;
	readonly "m_flDroppedAtTime"?: number;
	readonly "m_flElasticity"?: number;
	readonly "m_flFadeScale"?: number;
	readonly "m_flFallbackWear"?: number;
	readonly "m_flGlowBackfaceMult"?: number;
	readonly "m_flGlowStartTime"?: number;
	readonly "m_flGlowTime"?: number;
	readonly "m_flGravityScale"?: number;
	readonly "m_flInitialValue"?: number;
	readonly "m_flInspectCancelCompleteTime"?: number;
	readonly "m_flLastShakeTime"?: number;
	readonly "m_flNavIgnoreUntilTime"?: number;
	readonly "m_flNextPrimaryAttackTickRatio"?: number;
	readonly "m_flNextSecondaryAttackTickRatio"?: number;
	readonly "m_flPostponeFireReadyFrac"?: number;
	readonly "m_flRecoilIndex"?: number;
	readonly "m_flShadowStrength"?: number;
	readonly "m_flSimulationTime"?: number;
	readonly "m_flTimeSilencerSwitchComplete"?: number;
	readonly "m_flWatTickOffset"?: number;
	readonly "m_flWeaponActionPlaybackRate"?: number;
	readonly "m_flWeaponGameplayAnimStateTimestamp"?: number;
	readonly "m_glowColorOverride"?: number;
	readonly "m_hEffectEntity"?: number;
	readonly "m_hOuter"?: number;
	readonly "m_hOwner"?: number;
	readonly "m_hOwnerEntity"?: number;
	readonly "m_hPrevOwner"?: number;
	readonly "m_iAccountID"?: number;
	readonly "m_iAttributeDefinitionIndex"?: number;
	readonly "m_iBurstShotsRemaining"?: number;
	readonly "m_iClip1"?: number;
	readonly "m_iClip2"?: number;
	readonly "m_ID"?: number;
	readonly "m_iEntityLevel"?: number;
	readonly "m_iEntityQuality"?: number;
	readonly "m_iGlowTeam"?: number;
	readonly "m_iGlowType"?: number;
	readonly "m_iInventoryPosition"?: number;
	readonly "m_iIronSightMode"?: number;
	readonly "m_iItemDefinitionIndex"?: number;
	readonly "m_iItemIDHigh"?: number;
	readonly "m_iItemIDLow"?: number;
	readonly "m_iMostRecentTeamNumber"?: number;
	readonly "m_iOriginalTeamNumber"?: number;
	readonly "m_iRawValue32"?: number;
	readonly "m_iReapplyProvisionParity"?: number;
	readonly "m_iRecoilIndex"?: number;
	readonly "m_iTeamNum"?: number;
	readonly "m_iWeaponGameplayAnimState"?: number;
	readonly "m_MoveCollide"?: bigint;
	readonly "m_MoveType"?: bigint;
	readonly "m_nBloodType"?: number;
	readonly "m_nCollisionFunctionMask"?: number;
	readonly "m_nCollisionGroup"?: number;
	readonly "m_nDetailLayerMask"?: number;
	readonly "m_nDetailLayerMaskType"?: number;
	readonly "m_nDropTick"?: number;
	readonly "m_nEnablePhysics"?: number;
	readonly "m_nEntityId"?: number;
	readonly "m_nextPrevOwnerUseTime"?: number;
	readonly "m_nFallbackPaintKit"?: number;
	readonly "m_nFallbackSeed"?: number;
	readonly "m_nFallbackStatTrak"?: number;
	readonly "m_nForceBone"?: number;
	readonly "m_nGlowRange"?: number;
	readonly "m_nGlowRangeMin"?: number;
	readonly "m_nHierarchyId"?: number;
	readonly "m_nInteractsAs"?: bigint;
	readonly "m_nInteractsExclude"?: bigint;
	readonly "m_nInteractsWith"?: bigint;
	readonly "m_nNextPrimaryAttackTick"?: number;
	readonly "m_nNextSecondaryAttackTick"?: number;
	readonly "m_nNextThinkTick"?: number;
	readonly "m_nObjectCulling"?: number;
	readonly "m_nOwnerId"?: number;
	readonly "m_nPlatformType"?: number;
	readonly "m_nPostponeFireReadyTicks"?: number;
	readonly "m_nRefundableCurrency"?: number;
	readonly "m_nRenderFX"?: bigint;
	readonly "m_nRenderMode"?: bigint;
	readonly "m_nRevolverCylinderIdx"?: number;
	readonly "m_nSolidType"?: bigint;
	readonly "m_nSubclassID"?: number;
	readonly "m_nSurroundType"?: bigint;
	readonly "m_nTargetDetailLayer"?: number;
	readonly "m_OriginalOwnerXuidHigh"?: number;
	readonly "m_OriginalOwnerXuidLow"?: number;
	readonly "m_pReserveAmmo"?: number;
	readonly "m_ProviderType"?: number;
	readonly "m_szCustomName"?: string;
	readonly "m_Transforms"?: number;
	readonly "m_triggerBloat"?: number;
	readonly "m_ubInterpolationFrame"?: number;
	readonly "m_usSolidFlags"?: number;
	readonly "m_Values"?: [number, number, number];
	readonly "m_vCapsuleCenter1"?: [number, number, number];
	readonly "m_vCapsuleCenter2"?: [number, number, number];
	readonly "m_vecForce"?: [number, number, number];
	readonly "m_vecMaxs"?: [number, number, number];
	readonly "m_vecMins"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMaxs"?: [number, number, number];
	readonly "m_vecSpecifiedSurroundingMins"?: [number, number, number];
	readonly "m_vLookTargetPosition"?: [number, number, number];
	readonly "m_weaponMode"?: bigint;
	readonly "m_zoomLevel"?: number;
}

interface _ServerAuthoritativeWeaponSlot_tOwn {
	readonly "unClass"?: number;
	readonly "unItemDefIdx"?: number;
	readonly "unSlot"?: number;
}

interface _WeaponPurchaseCount_tOwn {
	readonly "m_nCount"?: number;
	readonly "m_nItemDefIndex"?: number;
}

export type ICAK47 = Prefixed<"CAK47",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICBaseCSGrenadeProjectile = Prefixed<"CBaseCSGrenadeProjectile",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CBaseCSGrenadeProjectileOwn
>;

export type ICBaseGrenade = Prefixed<"CBaseGrenade",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CBaseGrenadeOwn
>;

export type ICBasePlayerController = Prefixed<"CBasePlayerController",
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	_CBasePlayerControllerOwn
>;

export type ICBasePlayerPawn = Prefixed<"CBasePlayerPawn",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"CPlayer_CameraServices", _CPlayer_CameraServices> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	Prefixed<"ViewAngleServerChange_t", _ViewAngleServerChange_t> &
	_CBasePlayerPawnOwn
>;

export type ICBasePlayerWeapon = Prefixed<"CBasePlayerWeapon",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CBasePlayerWeaponOwn
>;

export type ICC4 = Prefixed<"CC4",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CC4Own
>;

export type ICCSGameModeRules_ArmsRace = Prefixed<"CCSGameModeRules_ArmsRace", _CCSGameModeRules_ArmsRaceOwn>;

export type ICCSGameModeRules_Deathmatch = Prefixed<"CCSGameModeRules_Deathmatch", _CCSGameModeRules_DeathmatchOwn>;

export type ICCSGameRules = Prefixed<"CCSGameRules", _CCSGameRulesOwn>;

export type ICCSGameRulesProxy = Prefixed<"CCSGameRulesProxy", Prefixed<"CCSGameRules", _CCSGameRules>>;

export type ICCSGO_TeamIntroCounterTerroristPosition = Prefixed<"CCSGO_TeamIntroCounterTerroristPosition",
	Prefixed<"CBodyComponentPoint", _CBodyComponentPoint> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	_CCSGO_TeamIntroCounterTerroristPositionOwn
>;

export type ICCSGO_TeamIntroTerroristPosition = Prefixed<"CCSGO_TeamIntroTerroristPosition",
	Prefixed<"CBodyComponentPoint", _CBodyComponentPoint> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	_CCSGO_TeamIntroCounterTerroristPositionOwn
>;

export type ICCSGO_TeamSelectCounterTerroristPosition = Prefixed<"CCSGO_TeamSelectCounterTerroristPosition",
	Prefixed<"CBodyComponentPoint", _CBodyComponentPoint> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	_CCSGO_TeamIntroCounterTerroristPositionOwn
>;

export type ICCSGO_TeamSelectTerroristPosition = Prefixed<"CCSGO_TeamSelectTerroristPosition",
	Prefixed<"CBodyComponentPoint", _CBodyComponentPoint> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	_CCSGO_TeamIntroCounterTerroristPositionOwn
>;

export type ICCSPlayer_ActionTrackingServices = Prefixed<"CCSPlayer_ActionTrackingServices",
	Prefixed<"WeaponPurchaseCount_t", _WeaponPurchaseCount_t> &
	_CCSPlayer_ActionTrackingServicesOwn
>;

export type ICCSPlayer_BulletServices = Prefixed<"CCSPlayer_BulletServices", _CCSPlayer_BulletServicesOwn>;

export type ICCSPlayer_BuyServices = Prefixed<"CCSPlayer_BuyServices",
	Prefixed<"SellbackPurchaseEntry_t", _SellbackPurchaseEntry_t> &
	_CCSPlayer_BuyServicesOwn
>;

export type ICCSPlayer_CameraServices = Prefixed<"CCSPlayer_CameraServices", _CCSPlayer_CameraServicesOwn>;

export type ICCSPlayer_HostageServices = Prefixed<"CCSPlayer_HostageServices", _CCSPlayer_HostageServicesOwn>;

export type ICCSPlayer_ItemServices = Prefixed<"CCSPlayer_ItemServices", _CCSPlayer_ItemServicesOwn>;

export type ICCSPlayer_MovementServices = Prefixed<"CCSPlayer_MovementServices", _CCSPlayer_MovementServicesOwn>;

export type ICCSPlayer_PingServices = Prefixed<"CCSPlayer_PingServices", _CCSPlayer_PingServicesOwn>;

export type ICCSPlayer_WeaponServices = Prefixed<"CCSPlayer_WeaponServices", _CCSPlayer_WeaponServicesOwn>;

export type ICCSPlayerController = Prefixed<"CCSPlayerController",
	Prefixed<"CCSPlayerController_ActionTrackingServices", _CCSPlayerController_ActionTrackingServices> &
	Prefixed<"CCSPlayerController_DamageServices", _CCSPlayerController_DamageServices> &
	Prefixed<"CCSPlayerController_InGameMoneyServices", _CCSPlayerController_InGameMoneyServices> &
	Prefixed<"CCSPlayerController_InventoryServices", _CCSPlayerController_InventoryServices> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	_CCSPlayerControllerOwn
>;

export type ICCSPlayerController_ActionTrackingServices = Prefixed<"CCSPlayerController_ActionTrackingServices",
	Prefixed<"CSPerRoundStats_t", _CSPerRoundStats_t> &
	_CCSPlayerController_ActionTrackingServicesOwn
>;

export type ICCSPlayerController_DamageServices = Prefixed<"CCSPlayerController_DamageServices",
	Prefixed<"CDamageRecord", _CDamageRecord> &
	_CCSPlayerController_DamageServicesOwn
>;

export type ICCSPlayerController_InGameMoneyServices = Prefixed<"CCSPlayerController_InGameMoneyServices", _CCSPlayerController_InGameMoneyServicesOwn>;

export type ICCSPlayerController_InventoryServices = Prefixed<"CCSPlayerController_InventoryServices",
	Prefixed<"ServerAuthoritativeWeaponSlot_t", _ServerAuthoritativeWeaponSlot_t> &
	_CCSPlayerController_InventoryServicesOwn
>;

export type ICCSPlayerPawn = Prefixed<"CCSPlayerPawn",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CCSPlayer_ActionTrackingServices", _CCSPlayer_ActionTrackingServices> &
	Prefixed<"CCSPlayer_BulletServices", _CCSPlayer_BulletServices> &
	Prefixed<"CCSPlayer_BuyServices", _CCSPlayer_BuyServices> &
	Prefixed<"CCSPlayer_CameraServices", _CCSPlayer_CameraServices> &
	Prefixed<"CCSPlayer_HostageServices", _CCSPlayer_HostageServices> &
	Prefixed<"CCSPlayer_ItemServices", _CCSPlayer_ItemServices> &
	Prefixed<"CCSPlayer_MovementServices", _CCSPlayer_MovementServices> &
	Prefixed<"CCSPlayer_PingServices", _CCSPlayer_PingServices> &
	Prefixed<"CCSPlayer_WeaponServices", _CCSPlayer_WeaponServices> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	Prefixed<"PredictedDamageTag_t", _PredictedDamageTag_t> &
	Prefixed<"ViewAngleServerChange_t", _ViewAngleServerChange_t> &
	_CCSPlayerPawnOwn
>;

export type ICCSPlayerPawnBase = Prefixed<"CCSPlayerPawnBase",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CCSPlayer_PingServices", _CCSPlayer_PingServices> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"CPlayer_CameraServices", _CPlayer_CameraServices> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	Prefixed<"ViewAngleServerChange_t", _ViewAngleServerChange_t> &
	_CCSPlayerPawnBaseOwn
>;

export type ICCSPlayerResource = Prefixed<"CCSPlayerResource", _CCSPlayerResourceOwn>;

export type ICCSTeam = Prefixed<"CCSTeam", _CCSTeamOwn>;

export type ICCSWeaponBaseGun = Prefixed<"CCSWeaponBaseGun",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICCSWeaponBaseShotgun = Prefixed<"CCSWeaponBaseShotgun",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CCSWeaponBaseShotgunOwn
>;

export type ICDEagle = Prefixed<"CDEagle",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICDecoyGrenade = Prefixed<"CDecoyGrenade",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CDecoyGrenadeOwn
>;

export type ICDecoyProjectile = Prefixed<"CDecoyProjectile",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CDecoyProjectileOwn
>;

export type ICEnvDetailController = Prefixed<"CEnvDetailController", _CEnvDetailControllerOwn>;

export type ICEnvVolumetricFogController = Prefixed<"CEnvVolumetricFogController",
	Prefixed<"CBodyComponentPoint", _CBodyComponentPoint> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	_CEnvVolumetricFogControllerOwn
>;

export type ICEnvWindController = Prefixed<"CEnvWindController",
	Prefixed<"CBodyComponentPoint", _CBodyComponentPoint> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	_CEnvWindControllerOwn
>;

export type ICFlashbang = Prefixed<"CFlashbang",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CDecoyGrenadeOwn
>;

export type ICFlashbangProjectile = Prefixed<"CFlashbangProjectile",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CBaseCSGrenadeProjectileOwn
>;

export type ICFogController = Prefixed<"CFogController", _CFogControllerOwn>;

export type ICHEGrenade = Prefixed<"CHEGrenade",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CDecoyGrenadeOwn
>;

export type ICHEGrenadeProjectile = Prefixed<"CHEGrenadeProjectile",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CBaseCSGrenadeProjectileOwn
>;

export type ICIncendiaryGrenade = Prefixed<"CIncendiaryGrenade",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CDecoyGrenadeOwn
>;

export type ICInferno = Prefixed<"CInferno",
	Prefixed<"CBodyComponentBaseModelEntity", _CBodyComponentBaseModelEntity> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CInfernoOwn
>;

export type ICKnife = Prefixed<"CKnife",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CKnifeOwn
>;

export type ICMapVetoPickController = Prefixed<"CMapVetoPickController",
	Prefixed<"CBodyComponentPoint", _CBodyComponentPoint> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	_CMapVetoPickControllerOwn
>;

export type ICMolotovGrenade = Prefixed<"CMolotovGrenade",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CDecoyGrenadeOwn
>;

export type ICMolotovProjectile = Prefixed<"CMolotovProjectile",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CMolotovProjectileOwn
>;

export type ICPlantedC4 = Prefixed<"CPlantedC4",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CPlantedC4Own
>;

export type ICPlayer_CameraServices = Prefixed<"CPlayer_CameraServices", _CPlayer_CameraServicesOwn>;

export type ICPlayerPing = Prefixed<"CPlayerPing",
	Prefixed<"CBodyComponentPoint", _CBodyComponentPoint> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	_CPlayerPingOwn
>;

export type ICPlayerSprayDecal = Prefixed<"CPlayerSprayDecal",
	Prefixed<"CBodyComponentPoint", _CBodyComponentPoint> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CPlayerSprayDecalOwn
>;

export type ICPlayerVisibility = Prefixed<"CPlayerVisibility",
	Prefixed<"CBodyComponentPoint", _CBodyComponentPoint> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	_CPlayerVisibilityOwn
>;

export type ICSmokeGrenade = Prefixed<"CSmokeGrenade",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CDecoyGrenadeOwn
>;

export type ICSmokeGrenadeProjectile = Prefixed<"CSmokeGrenadeProjectile",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CSmokeGrenadeProjectileOwn
>;

export type ICTeam = Prefixed<"CTeam", _CTeamOwn>;

export type ICTonemapController2 = Prefixed<"CTonemapController2",
	Prefixed<"CBodyComponentPoint", _CBodyComponentPoint> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	_CTonemapController2Own
>;

export type ICVoteController = Prefixed<"CVoteController",
	Prefixed<"CBodyComponentPoint", _CBodyComponentPoint> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	_CVoteControllerOwn
>;

export type ICWeaponAug = Prefixed<"CWeaponAug",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponAWP = Prefixed<"CWeaponAWP",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponBizon = Prefixed<"CWeaponBizon",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponCZ75a = Prefixed<"CWeaponCZ75a",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CWeaponCZ75aOwn
>;

export type ICWeaponElite = Prefixed<"CWeaponElite",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponFamas = Prefixed<"CWeaponFamas",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponFiveSeven = Prefixed<"CWeaponFiveSeven",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponG3SG1 = Prefixed<"CWeaponG3SG1",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponGalilAR = Prefixed<"CWeaponGalilAR",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponGlock = Prefixed<"CWeaponGlock",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponHKP2000 = Prefixed<"CWeaponHKP2000",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponM249 = Prefixed<"CWeaponM249",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponM4A1 = Prefixed<"CWeaponM4A1",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponM4A1Silencer = Prefixed<"CWeaponM4A1Silencer",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponMAC10 = Prefixed<"CWeaponMAC10",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponMag7 = Prefixed<"CWeaponMag7",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponMP5SD = Prefixed<"CWeaponMP5SD",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponMP7 = Prefixed<"CWeaponMP7",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponMP9 = Prefixed<"CWeaponMP9",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponNegev = Prefixed<"CWeaponNegev",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponNOVA = Prefixed<"CWeaponNOVA",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CCSWeaponBaseShotgunOwn
>;

export type ICWeaponP250 = Prefixed<"CWeaponP250",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponP90 = Prefixed<"CWeaponP90",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponRevolver = Prefixed<"CWeaponRevolver",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponSawedoff = Prefixed<"CWeaponSawedoff",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CCSWeaponBaseShotgunOwn
>;

export type ICWeaponSCAR20 = Prefixed<"CWeaponSCAR20",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponSG556 = Prefixed<"CWeaponSG556",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponSSG08 = Prefixed<"CWeaponSSG08",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponTaser = Prefixed<"CWeaponTaser",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CWeaponTaserOwn
>;

export type ICWeaponTec9 = Prefixed<"CWeaponTec9",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponUMP45 = Prefixed<"CWeaponUMP45",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponUSPSilencer = Prefixed<"CWeaponUSPSilencer",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CAK47Own
>;

export type ICWeaponXM1014 = Prefixed<"CWeaponXM1014",
	Prefixed<"CBodyComponentBaseAnimGraph", _CBodyComponentBaseAnimGraph> &
	Prefixed<"CDestructiblePartsComponent", _CDestructiblePartsComponent> &
	Prefixed<"CEconItemAttribute", _CEconItemAttribute> &
	Prefixed<"CEntityIdentity", _CEntityIdentity> &
	Prefixed<"EntityRenderAttribute_t", _EntityRenderAttribute_t> &
	_CCSWeaponBaseShotgunOwn
>;

export type IServerAuthoritativeWeaponSlot_t = Prefixed<"ServerAuthoritativeWeaponSlot_t", _ServerAuthoritativeWeaponSlot_tOwn>;

export type IWeaponPurchaseCount_t = Prefixed<"WeaponPurchaseCount_t", _WeaponPurchaseCount_tOwn>;

/** Maps entity className to its typed properties interface */
export interface EntityTypeMap {
	CAK47: ICAK47;
	CBaseCSGrenadeProjectile: ICBaseCSGrenadeProjectile;
	CBaseGrenade: ICBaseGrenade;
	CBasePlayerController: ICBasePlayerController;
	CBasePlayerPawn: ICBasePlayerPawn;
	CBasePlayerWeapon: ICBasePlayerWeapon;
	CC4: ICC4;
	CCSGameModeRules_ArmsRace: ICCSGameModeRules_ArmsRace;
	CCSGameModeRules_Deathmatch: ICCSGameModeRules_Deathmatch;
	CCSGameRules: ICCSGameRules;
	CCSGameRulesProxy: ICCSGameRulesProxy;
	CCSGO_TeamIntroCounterTerroristPosition: ICCSGO_TeamIntroCounterTerroristPosition;
	CCSGO_TeamIntroTerroristPosition: ICCSGO_TeamIntroTerroristPosition;
	CCSGO_TeamSelectCounterTerroristPosition: ICCSGO_TeamSelectCounterTerroristPosition;
	CCSGO_TeamSelectTerroristPosition: ICCSGO_TeamSelectTerroristPosition;
	CCSPlayer_ActionTrackingServices: ICCSPlayer_ActionTrackingServices;
	CCSPlayer_BulletServices: ICCSPlayer_BulletServices;
	CCSPlayer_BuyServices: ICCSPlayer_BuyServices;
	CCSPlayer_CameraServices: ICCSPlayer_CameraServices;
	CCSPlayer_HostageServices: ICCSPlayer_HostageServices;
	CCSPlayer_ItemServices: ICCSPlayer_ItemServices;
	CCSPlayer_MovementServices: ICCSPlayer_MovementServices;
	CCSPlayer_PingServices: ICCSPlayer_PingServices;
	CCSPlayer_WeaponServices: ICCSPlayer_WeaponServices;
	CCSPlayerController: ICCSPlayerController;
	CCSPlayerController_ActionTrackingServices: ICCSPlayerController_ActionTrackingServices;
	CCSPlayerController_DamageServices: ICCSPlayerController_DamageServices;
	CCSPlayerController_InGameMoneyServices: ICCSPlayerController_InGameMoneyServices;
	CCSPlayerController_InventoryServices: ICCSPlayerController_InventoryServices;
	CCSPlayerPawn: ICCSPlayerPawn;
	CCSPlayerPawnBase: ICCSPlayerPawnBase;
	CCSPlayerResource: ICCSPlayerResource;
	CCSTeam: ICCSTeam;
	CCSWeaponBaseGun: ICCSWeaponBaseGun;
	CCSWeaponBaseShotgun: ICCSWeaponBaseShotgun;
	CDEagle: ICDEagle;
	CDecoyGrenade: ICDecoyGrenade;
	CDecoyProjectile: ICDecoyProjectile;
	CEnvDetailController: ICEnvDetailController;
	CEnvVolumetricFogController: ICEnvVolumetricFogController;
	CEnvWindController: ICEnvWindController;
	CFlashbang: ICFlashbang;
	CFlashbangProjectile: ICFlashbangProjectile;
	CFogController: ICFogController;
	CHEGrenade: ICHEGrenade;
	CHEGrenadeProjectile: ICHEGrenadeProjectile;
	CIncendiaryGrenade: ICIncendiaryGrenade;
	CInferno: ICInferno;
	CKnife: ICKnife;
	CMapVetoPickController: ICMapVetoPickController;
	CMolotovGrenade: ICMolotovGrenade;
	CMolotovProjectile: ICMolotovProjectile;
	CPlantedC4: ICPlantedC4;
	CPlayer_CameraServices: ICPlayer_CameraServices;
	CPlayerPing: ICPlayerPing;
	CPlayerSprayDecal: ICPlayerSprayDecal;
	CPlayerVisibility: ICPlayerVisibility;
	CSmokeGrenade: ICSmokeGrenade;
	CSmokeGrenadeProjectile: ICSmokeGrenadeProjectile;
	CTeam: ICTeam;
	CTonemapController2: ICTonemapController2;
	CVoteController: ICVoteController;
	CWeaponAug: ICWeaponAug;
	CWeaponAWP: ICWeaponAWP;
	CWeaponBizon: ICWeaponBizon;
	CWeaponCZ75a: ICWeaponCZ75a;
	CWeaponElite: ICWeaponElite;
	CWeaponFamas: ICWeaponFamas;
	CWeaponFiveSeven: ICWeaponFiveSeven;
	CWeaponG3SG1: ICWeaponG3SG1;
	CWeaponGalilAR: ICWeaponGalilAR;
	CWeaponGlock: ICWeaponGlock;
	CWeaponHKP2000: ICWeaponHKP2000;
	CWeaponM249: ICWeaponM249;
	CWeaponM4A1: ICWeaponM4A1;
	CWeaponM4A1Silencer: ICWeaponM4A1Silencer;
	CWeaponMAC10: ICWeaponMAC10;
	CWeaponMag7: ICWeaponMag7;
	CWeaponMP5SD: ICWeaponMP5SD;
	CWeaponMP7: ICWeaponMP7;
	CWeaponMP9: ICWeaponMP9;
	CWeaponNegev: ICWeaponNegev;
	CWeaponNOVA: ICWeaponNOVA;
	CWeaponP250: ICWeaponP250;
	CWeaponP90: ICWeaponP90;
	CWeaponRevolver: ICWeaponRevolver;
	CWeaponSawedoff: ICWeaponSawedoff;
	CWeaponSCAR20: ICWeaponSCAR20;
	CWeaponSG556: ICWeaponSG556;
	CWeaponSSG08: ICWeaponSSG08;
	CWeaponTaser: ICWeaponTaser;
	CWeaponTec9: ICWeaponTec9;
	CWeaponUMP45: ICWeaponUMP45;
	CWeaponUSPSilencer: ICWeaponUSPSilencer;
	CWeaponXM1014: ICWeaponXM1014;
	ServerAuthoritativeWeaponSlot_t: IServerAuthoritativeWeaponSlot_t;
	WeaponPurchaseCount_t: IWeaponPurchaseCount_t;
}

/** Base entity shape used at runtime */
export interface BaseEntity {
	className: string;
	classId: number;
	entityType: number;
	properties: Record<string, unknown>;
}

type _TypedEntity<K extends keyof EntityTypeMap> = { className: K; classId: number; entityType: number; properties: Partial<EntityTypeMap[K]> };

/** Discriminated union of all known entity types */
export type TypedEntity = _TypedEntity<keyof EntityTypeMap> | BaseEntity;

/** All known entity class names */
export type KnownClassName = keyof EntityTypeMap;

/** Get typed properties for a known entity class name */
export type EntityProperties<T extends keyof EntityTypeMap> = Partial<EntityTypeMap[T]>;

/** Narrow a BaseEntity to a specific typed entity */
export function isEntityClass<T extends KnownClassName>(
	entity: BaseEntity | undefined,
	className: T
): entity is _TypedEntity<T> {
	return entity?.className === className;
}
