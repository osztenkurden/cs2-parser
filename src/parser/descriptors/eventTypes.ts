import type { Player } from '../../helpers/player.js';
import type { WinRoundReason } from '../../helpers/gameRules.js';

export interface IEventHltvVersioninfo {
	version: number;
}

export interface IEventItemEquip {
	userid: number;
	item: string;
	defindex: number;
	canzoom: boolean;
	hassilencer: boolean;
	issilenced: boolean;
	hastracers: boolean;
	weptype: number;
	ispainted: boolean;
	player?: Player | null;
}

export interface IEventCsPreRestart {}

export interface IEventBuytimeEnded {}

export interface IEventRoundPrestart {}

export interface IEventPlayerSpawn {
	userid: number;
	userid_pawn: number;
	player?: Player | null;
}

export interface IEventItemPickup {
	userid: number;
	item: string;
	silent: boolean;
	defindex: number;
	player?: Player | null;
}

export interface IEventBombPickup {
	userid_pawn: number;
}

export interface IEventRoundStart {
	timelimit: number;
	fraglimit: number;
	objective: string;
}

export interface IEventRoundPoststart {}

export interface IEventBeginNewMatch {}

export interface IEventCsRoundStartBeep {}

export interface IEventCsRoundFinalBeep {}

export interface IEventRoundFreezeEnd {}

export interface IEventRoundAnnounceMatchStart {}

export interface IEventPlayerFootstep {
	userid: number;
	userid_pawn: number;
	player?: Player | null;
}

export interface IEventPlayerJump {
	userid: number;
	player?: Player | null;
}

export interface IEventWeaponFire {
	userid: number;
	userid_pawn: number;
	weapon: string;
	silenced: boolean;
	player?: Player | null;
}

export interface IEventOtherDeath {
	otherid: number;
	othertype: string;
	attacker: number;
	weapon: string;
	weapon_itemid: string;
	weapon_fauxitemid: string;
	weapon_originalowner_xuid: string;
	headshot: boolean;
	penetrated: number;
	noscope: boolean;
	thrusmoke: boolean;
	attackerblind: boolean;
	attackerPlayer?: Player | null;
}

export interface IEventWeaponReload {
	userid: number;
	userid_pawn: number;
	player?: Player | null;
}

export interface IEventSmokegrenadeDetonate {
	userid: number;
	userid_pawn: number;
	entityid: number;
	x: number;
	y: number;
	z: number;
	player?: Player | null;
}

export interface IEventPlayerHurt {
	userid: number;
	userid_pawn: number;
	attacker: number;
	attacker_pawn: number;
	health: number;
	armor: number;
	weapon: string;
	dmg_health: number;
	dmg_armor: number;
	hitgroup: number;
	player?: Player | null;
	attackerPlayer?: Player | null;
}

export interface IEventPlayerDeath {
	userid: number;
	userid_pawn: number;
	attacker: number;
	attacker_pawn: number;
	assister: number;
	assister_pawn: number;
	assistedflash: boolean;
	weapon: string;
	weapon_itemid: string;
	weapon_fauxitemid: string;
	weapon_originalowner_xuid: string;
	headshot: boolean;
	dominated: number;
	revenge: number;
	wipe: number;
	penetrated: number;
	noreplay: boolean;
	noscope: boolean;
	thrusmoke: boolean;
	attackerblind: boolean;
	distance: number;
	dmg_health: number;
	dmg_armor: number;
	hitgroup: number;
	player?: Player | null;
	attackerPlayer?: Player | null;
	assisterPlayer?: Player | null;
}

export interface IEventHegrenadeDetonate {
	userid: number;
	userid_pawn: number;
	entityid: number;
	x: number;
	y: number;
	z: number;
	player?: Player | null;
}

export interface IEventFlashbangDetonate {
	userid: number;
	userid_pawn: number;
	entityid: number;
	x: number;
	y: number;
	z: number;
	player?: Player | null;
}

export interface IEventPlayerBlind {
	userid: number;
	attacker: number;
	entityid: number;
	blind_duration: number;
	player?: Player | null;
	attackerPlayer?: Player | null;
}

export interface IEventBombDropped {
	userid: number;
	userid_pawn: number;
	entindex: number;
	player?: Player | null;
}

export interface IEventSmokegrenadeExpired {
	userid: number;
	userid_pawn: number;
	entityid: number;
	x: number;
	y: number;
	z: number;
	player?: Player | null;
}

export interface IEventBombBeginplant {
	userid: number;
	userid_pawn: number;
	site: number;
	player?: Player | null;
}

export interface IEventBombPlanted {
	userid: number;
	userid_pawn: number;
	site: number;
	player?: Player | null;
}

export interface IEventRoundTimeWarning {}

export interface IEventRoundMvp {
	userid: number;
	reason: number;
	value: number;
	musickitmvps: number;
	nomusic: number;
	musickitid: number;
	player?: Player | null;
}

export interface IEventCsWinPanelRound {
	show_timer_defend: boolean;
	show_timer_attack: boolean;
	timer_time: number;
	final_event: number;
	funfact_token: string;
	funfact_player: number;
	funfact_data1: number;
	funfact_data2: number;
	funfact_data3: number;
}

export interface IEventRoundEnd {
	winner: number;
	reason: WinRoundReason;
	message: string;
	legacy: number;
	player_count: number;
	nomusic: number;
}

export interface IEventRoundOfficiallyEnded {}

export interface IEventWeaponZoom {
	userid: number;
	userid_pawn: number;
	player?: Player | null;
}

export interface IEventBombBegindefuse {
	userid: number;
	userid_pawn: number;
	haskit: boolean;
	player?: Player | null;
}

export interface IEventBombDefused {
	userid: number;
	userid_pawn: number;
	site: number;
	player?: Player | null;
}

export interface IEventInfernoStartburn {
	entityid: number;
	x: number;
	y: number;
	z: number;
}

export interface IEventInfernoExpire {
	entityid: number;
	x: number;
	y: number;
	z: number;
}

export interface IEventBombExploded {
	userid: number;
	userid_pawn: number;
	site: number;
	player?: Player | null;
}

export interface IEventPlayerDisconnect {
	userid: number;
	reason: number;
	name: string;
	networkid: string;
	xuid: string;
	PlayerID: number;
	player?: Player | null;
}

export interface IEventCsWinPanelMatch {}

export interface GameEventsArguments {
	hltv_versioninfo: IEventHltvVersioninfo;
	item_equip: IEventItemEquip;
	cs_pre_restart: IEventCsPreRestart;
	buytime_ended: IEventBuytimeEnded;
	round_prestart: IEventRoundPrestart;
	player_spawn: IEventPlayerSpawn;
	item_pickup: IEventItemPickup;
	bomb_pickup: IEventBombPickup;
	round_start: IEventRoundStart;
	round_poststart: IEventRoundPoststart;
	begin_new_match: IEventBeginNewMatch;
	cs_round_start_beep: IEventCsRoundStartBeep;
	cs_round_final_beep: IEventCsRoundFinalBeep;
	round_freeze_end: IEventRoundFreezeEnd;
	round_announce_match_start: IEventRoundAnnounceMatchStart;
	player_footstep: IEventPlayerFootstep;
	player_jump: IEventPlayerJump;
	weapon_fire: IEventWeaponFire;
	other_death: IEventOtherDeath;
	weapon_reload: IEventWeaponReload;
	smokegrenade_detonate: IEventSmokegrenadeDetonate;
	player_hurt: IEventPlayerHurt;
	player_death: IEventPlayerDeath;
	hegrenade_detonate: IEventHegrenadeDetonate;
	flashbang_detonate: IEventFlashbangDetonate;
	player_blind: IEventPlayerBlind;
	bomb_dropped: IEventBombDropped;
	smokegrenade_expired: IEventSmokegrenadeExpired;
	bomb_beginplant: IEventBombBeginplant;
	bomb_planted: IEventBombPlanted;
	round_time_warning: IEventRoundTimeWarning;
	round_mvp: IEventRoundMvp;
	cs_win_panel_round: IEventCsWinPanelRound;
	round_end: IEventRoundEnd;
	round_officially_ended: IEventRoundOfficiallyEnded;
	weapon_zoom: IEventWeaponZoom;
	bomb_begindefuse: IEventBombBegindefuse;
	bomb_defused: IEventBombDefused;
	inferno_startburn: IEventInfernoStartburn;
	inferno_expire: IEventInfernoExpire;
	bomb_exploded: IEventBombExploded;
	player_disconnect: IEventPlayerDisconnect;
	cs_win_panel_match: IEventCsWinPanelMatch;
}
