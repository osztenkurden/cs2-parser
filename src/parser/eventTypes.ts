
export interface IEventHltvVersioninfo {
	version: number
}

export interface IEventItemEquip {
	userid: number
	item: string
	defindex: number
	canzoom: boolean
	hassilencer: boolean
	issilenced: boolean
	hastracers: boolean
	weptype: number
	ispainted: boolean
}

export interface IEventCsPreRestart {

}

export interface IEventBuytimeEnded {

}

export interface IEventRoundPrestart {

}

export interface IEventPlayerSpawn {
	userid: number
	userid_pawn: number
}

export interface IEventItemPickup {
	userid: number
	item: string
	silent: boolean
	defindex: number
}

export interface IEventBombPickup {
	userid_pawn: number
}

export interface IEventRoundStart {
	timelimit: number
	fraglimit: number
	objective: string
}

export interface IEventRoundPoststart {

}

export interface IEventBeginNewMatch {

}

export interface IEventCsRoundStartBeep {

}

export interface IEventCsRoundFinalBeep {

}

export interface IEventRoundFreezeEnd {

}

export interface IEventRoundAnnounceMatchStart {

}

export interface IEventPlayerFootstep {
	userid: number
	userid_pawn: number
}

export interface IEventPlayerJump {
	userid: number
}

export interface IEventWeaponFire {
	userid: number
	userid_pawn: number
	weapon: string
	silenced: boolean
}

export interface IEventOtherDeath {
	otherid: number
	othertype: string
	attacker: number
	weapon: string
	weapon_itemid: string
	weapon_fauxitemid: string
	weapon_originalowner_xuid: string
	headshot: boolean
	penetrated: number
	noscope: boolean
	thrusmoke: boolean
	attackerblind: boolean
}

export interface IEventWeaponReload {
	userid: number
	userid_pawn: number
}

export interface IEventSmokegrenadeDetonate {
	userid: number
	userid_pawn: number
	entityid: number
	x: number
	y: number
	z: number
}

export interface IEventPlayerHurt {
	userid: number
	userid_pawn: number
	attacker: number
	attacker_pawn: number
	health: number
	armor: number
	weapon: string
	dmg_health: number
	dmg_armor: number
	hitgroup: number
}

export interface IEventPlayerDeath {
	userid: number
	userid_pawn: number
	attacker: number
	attacker_pawn: number
	assister: number
	assister_pawn: number
	assistedflash: boolean
	weapon: string
	weapon_itemid: string
	weapon_fauxitemid: string
	weapon_originalowner_xuid: string
	headshot: boolean
	dominated: number
	revenge: number
	wipe: number
	penetrated: number
	noreplay: boolean
	noscope: boolean
	thrusmoke: boolean
	attackerblind: boolean
	distance: number
	dmg_health: number
	dmg_armor: number
	hitgroup: number
}

export interface IEventHegrenadeDetonate {
	userid: number
	userid_pawn: number
	entityid: number
	x: number
	y: number
	z: number
}

export interface IEventFlashbangDetonate {
	userid: number
	userid_pawn: number
	entityid: number
	x: number
	y: number
	z: number
}

export interface IEventPlayerBlind {
	userid: number
	attacker: number
	entityid: number
	blind_duration: number
}

export interface IEventBombDropped {
	userid: number
	userid_pawn: number
	entindex: number
}

export interface IEventSmokegrenadeExpired {
	userid: number
	userid_pawn: number
	entityid: number
	x: number
	y: number
	z: number
}

export interface IEventBombBeginplant {
	userid: number
	userid_pawn: number
	site: number
}

export interface IEventBombPlanted {
	userid: number
	userid_pawn: number
	site: number
}

export interface IEventRoundTimeWarning {

}

export interface IEventRoundMvp {
	userid: number
	reason: number
	value: number
	musickitmvps: number
	nomusic: number
	musickitid: number
}

export interface IEventCsWinPanelRound {
	show_timer_defend: boolean
	show_timer_attack: boolean
	timer_time: number
	final_event: number
	funfact_token: string
	funfact_player: number
	funfact_data1: number
	funfact_data2: number
	funfact_data3: number
}

export interface IEventRoundEnd {
	winner: number
	reason: number
	message: string
	legacy: number
	player_count: number
	nomusic: number
}

export interface IEventRoundOfficiallyEnded {

}

export interface IEventWeaponZoom {
	userid: number
	userid_pawn: number
}

export interface IEventBombBegindefuse {
	userid: number
	userid_pawn: number
	haskit: boolean
}

export interface IEventBombDefused {
	userid: number
	userid_pawn: number
	site: number
}

export interface IEventInfernoStartburn {
	entityid: number
	x: number
	y: number
	z: number
}

export interface IEventInfernoExpire {
	entityid: number
	x: number
	y: number
	z: number
}

export interface IEventBombExploded {
	userid: number
	userid_pawn: number
	site: number
}

export interface IEventPlayerDisconnect {
	userid: number
	reason: number
	name: string
	networkid: string
	xuid: string
	PlayerID: number
}

export interface IEventCsWinPanelMatch {

}

;
declare module "./gameEvents" {
  export interface GameEvents {
		on(event: "hltv_versioninfo", listener: (event: IEventHltvVersioninfo) => void): this;
		once(event: "hltv_versioninfo", listener: (event: IEventHltvVersioninfo) => void): this;
		on(event: "item_equip", listener: (event: IEventItemEquip) => void): this;
		once(event: "item_equip", listener: (event: IEventItemEquip) => void): this;
		on(event: "cs_pre_restart", listener: (event: IEventCsPreRestart) => void): this;
		once(event: "cs_pre_restart", listener: (event: IEventCsPreRestart) => void): this;
		on(event: "buytime_ended", listener: (event: IEventBuytimeEnded) => void): this;
		once(event: "buytime_ended", listener: (event: IEventBuytimeEnded) => void): this;
		on(event: "round_prestart", listener: (event: IEventRoundPrestart) => void): this;
		once(event: "round_prestart", listener: (event: IEventRoundPrestart) => void): this;
		on(event: "player_spawn", listener: (event: IEventPlayerSpawn) => void): this;
		once(event: "player_spawn", listener: (event: IEventPlayerSpawn) => void): this;
		on(event: "item_pickup", listener: (event: IEventItemPickup) => void): this;
		once(event: "item_pickup", listener: (event: IEventItemPickup) => void): this;
		on(event: "bomb_pickup", listener: (event: IEventBombPickup) => void): this;
		once(event: "bomb_pickup", listener: (event: IEventBombPickup) => void): this;
		on(event: "round_start", listener: (event: IEventRoundStart) => void): this;
		once(event: "round_start", listener: (event: IEventRoundStart) => void): this;
		on(event: "round_poststart", listener: (event: IEventRoundPoststart) => void): this;
		once(event: "round_poststart", listener: (event: IEventRoundPoststart) => void): this;
		on(event: "begin_new_match", listener: (event: IEventBeginNewMatch) => void): this;
		once(event: "begin_new_match", listener: (event: IEventBeginNewMatch) => void): this;
		on(event: "cs_round_start_beep", listener: (event: IEventCsRoundStartBeep) => void): this;
		once(event: "cs_round_start_beep", listener: (event: IEventCsRoundStartBeep) => void): this;
		on(event: "cs_round_final_beep", listener: (event: IEventCsRoundFinalBeep) => void): this;
		once(event: "cs_round_final_beep", listener: (event: IEventCsRoundFinalBeep) => void): this;
		on(event: "round_freeze_end", listener: (event: IEventRoundFreezeEnd) => void): this;
		once(event: "round_freeze_end", listener: (event: IEventRoundFreezeEnd) => void): this;
		on(event: "round_announce_match_start", listener: (event: IEventRoundAnnounceMatchStart) => void): this;
		once(event: "round_announce_match_start", listener: (event: IEventRoundAnnounceMatchStart) => void): this;
		on(event: "player_footstep", listener: (event: IEventPlayerFootstep) => void): this;
		once(event: "player_footstep", listener: (event: IEventPlayerFootstep) => void): this;
		on(event: "player_jump", listener: (event: IEventPlayerJump) => void): this;
		once(event: "player_jump", listener: (event: IEventPlayerJump) => void): this;
		on(event: "weapon_fire", listener: (event: IEventWeaponFire) => void): this;
		once(event: "weapon_fire", listener: (event: IEventWeaponFire) => void): this;
		on(event: "other_death", listener: (event: IEventOtherDeath) => void): this;
		once(event: "other_death", listener: (event: IEventOtherDeath) => void): this;
		on(event: "weapon_reload", listener: (event: IEventWeaponReload) => void): this;
		once(event: "weapon_reload", listener: (event: IEventWeaponReload) => void): this;
		on(event: "smokegrenade_detonate", listener: (event: IEventSmokegrenadeDetonate) => void): this;
		once(event: "smokegrenade_detonate", listener: (event: IEventSmokegrenadeDetonate) => void): this;
		on(event: "player_hurt", listener: (event: IEventPlayerHurt) => void): this;
		once(event: "player_hurt", listener: (event: IEventPlayerHurt) => void): this;
		on(event: "player_death", listener: (event: IEventPlayerDeath) => void): this;
		once(event: "player_death", listener: (event: IEventPlayerDeath) => void): this;
		on(event: "hegrenade_detonate", listener: (event: IEventHegrenadeDetonate) => void): this;
		once(event: "hegrenade_detonate", listener: (event: IEventHegrenadeDetonate) => void): this;
		on(event: "flashbang_detonate", listener: (event: IEventFlashbangDetonate) => void): this;
		once(event: "flashbang_detonate", listener: (event: IEventFlashbangDetonate) => void): this;
		on(event: "player_blind", listener: (event: IEventPlayerBlind) => void): this;
		once(event: "player_blind", listener: (event: IEventPlayerBlind) => void): this;
		on(event: "bomb_dropped", listener: (event: IEventBombDropped) => void): this;
		once(event: "bomb_dropped", listener: (event: IEventBombDropped) => void): this;
		on(event: "smokegrenade_expired", listener: (event: IEventSmokegrenadeExpired) => void): this;
		once(event: "smokegrenade_expired", listener: (event: IEventSmokegrenadeExpired) => void): this;
		on(event: "bomb_beginplant", listener: (event: IEventBombBeginplant) => void): this;
		once(event: "bomb_beginplant", listener: (event: IEventBombBeginplant) => void): this;
		on(event: "bomb_planted", listener: (event: IEventBombPlanted) => void): this;
		once(event: "bomb_planted", listener: (event: IEventBombPlanted) => void): this;
		on(event: "round_time_warning", listener: (event: IEventRoundTimeWarning) => void): this;
		once(event: "round_time_warning", listener: (event: IEventRoundTimeWarning) => void): this;
		on(event: "round_mvp", listener: (event: IEventRoundMvp) => void): this;
		once(event: "round_mvp", listener: (event: IEventRoundMvp) => void): this;
		on(event: "cs_win_panel_round", listener: (event: IEventCsWinPanelRound) => void): this;
		once(event: "cs_win_panel_round", listener: (event: IEventCsWinPanelRound) => void): this;
		on(event: "round_end", listener: (event: IEventRoundEnd) => void): this;
		once(event: "round_end", listener: (event: IEventRoundEnd) => void): this;
		on(event: "round_officially_ended", listener: (event: IEventRoundOfficiallyEnded) => void): this;
		once(event: "round_officially_ended", listener: (event: IEventRoundOfficiallyEnded) => void): this;
		on(event: "weapon_zoom", listener: (event: IEventWeaponZoom) => void): this;
		once(event: "weapon_zoom", listener: (event: IEventWeaponZoom) => void): this;
		on(event: "bomb_begindefuse", listener: (event: IEventBombBegindefuse) => void): this;
		once(event: "bomb_begindefuse", listener: (event: IEventBombBegindefuse) => void): this;
		on(event: "bomb_defused", listener: (event: IEventBombDefused) => void): this;
		once(event: "bomb_defused", listener: (event: IEventBombDefused) => void): this;
		on(event: "inferno_startburn", listener: (event: IEventInfernoStartburn) => void): this;
		once(event: "inferno_startburn", listener: (event: IEventInfernoStartburn) => void): this;
		on(event: "inferno_expire", listener: (event: IEventInfernoExpire) => void): this;
		once(event: "inferno_expire", listener: (event: IEventInfernoExpire) => void): this;
		on(event: "bomb_exploded", listener: (event: IEventBombExploded) => void): this;
		once(event: "bomb_exploded", listener: (event: IEventBombExploded) => void): this;
		on(event: "player_disconnect", listener: (event: IEventPlayerDisconnect) => void): this;
		once(event: "player_disconnect", listener: (event: IEventPlayerDisconnect) => void): this;
		on(event: "cs_win_panel_match", listener: (event: IEventCsWinPanelMatch) => void): this;
		once(event: "cs_win_panel_match", listener: (event: IEventCsWinPanelMatch) => void): this;

  }
}
