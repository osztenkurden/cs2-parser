import type { DemoReader } from '../parser/index.js';
import type { CMsgPlayerInfo } from '../ts-proto/networkbasetypes.js';
import type { ICCSPlayerController } from '../generated/entityTypes.js';
import type { PlayerPawn, Vector } from './playerPawn.js';
import type { Team } from './team.js';

const PLAYER_ENTITY_HANDLE_MISSING = 2047;

type ControllerProps = Partial<ICCSPlayerController>;
type ControllerKey = keyof ICCSPlayerController;

export class Player {
	constructor(
		private _parser: DemoReader,
		public readonly entityId: number
	) {}

	get entity() {
		return this._parser.entities[this.entityId];
	}

	private _prop<K extends ControllerKey>(name: K): ICCSPlayerController[K] | undefined {
		return (this.entity?.properties as ControllerProps)?.[name];
	}

	// --- Identity ---

	get name(): string {
		return (this._prop('CCSPlayerController.m_iszPlayerName') ?? '') as string;
	}

	get steamId(): string {
		const raw = this._prop('CCSPlayerController.m_steamID');
		return raw !== undefined ? String(raw) : '';
	}

	get isConnected(): boolean {
		const connected = this._prop('CCSPlayerController.m_iConnected');
		return connected !== undefined && connected === 0;
	}

	get userInfo(): CMsgPlayerInfo | null {
		for (const info of this._parser.players) {
			if (info && String(info.steamid) === this.steamId) return info;
		}
		return null;
	}

	// --- Team ---

	get teamNumber(): number {
		return (this._prop('CCSPlayerController.m_iTeamNum') ?? 0) as number;
	}

	get team(): Team | null {
		const num = this.teamNumber;
		return this._parser.teams.find(t => t.teamNumber === num) ?? null;
	}

	// --- Pawn Link ---

	get pawnEntityId(): number | null {
		const handle = this._prop('CCSPlayerController.m_hPlayerPawn') as number | undefined;
		if (handle === undefined || (handle & 0x7ff) === PLAYER_ENTITY_HANDLE_MISSING) return null;
		return handle & 0x7ff;
	}

	get pawn(): PlayerPawn | null {
		const id = this.pawnEntityId;
		if (id === null) return null;
		return this._parser.getPawn(id);
	}

	// --- Alive State ---

	get isAlive(): boolean {
		return (this._prop('CCSPlayerController.m_bPawnIsAlive') ?? false) as boolean;
	}

	// --- Shortcuts delegating to pawn ---

	get health(): number {
		return this.pawn?.health ?? 0;
	}

	get position(): Vector | null {
		return this.pawn?.position ?? null;
	}

	get armor(): number {
		return this.pawn?.armor ?? 0;
	}

	get hasDefuser(): boolean {
		return this.pawn?.hasDefuser ?? false;
	}

	get hasHelmet(): boolean {
		return this.pawn?.hasHelmet ?? false;
	}

	get isScoped(): boolean {
		return this.pawn?.isScoped ?? false;
	}

	get isDefusing(): boolean {
		return this.pawn?.isDefusing ?? false;
	}

	get eyeAngles(): { pitch: number; yaw: number } {
		return this.pawn?.eyeAngles ?? { pitch: 0, yaw: 0 };
	}

	// --- Economy ---

	get money(): number {
		return (this._prop('CCSPlayerController.CCSPlayerController_InGameMoneyServices.m_iAccount') ?? 0) as number;
	}

	get totalCashSpent(): number {
		return (this._prop('CCSPlayerController.CCSPlayerController_InGameMoneyServices.m_iTotalCashSpent') ??
			0) as number;
	}

	get cashSpentThisRound(): number {
		return (this._prop('CCSPlayerController.CCSPlayerController_InGameMoneyServices.m_iCashSpentThisRound') ??
			0) as number;
	}

	// --- Match Totals ---

	get kills(): number {
		return (this._prop('CCSPlayerController.CCSPlayerController_ActionTrackingServices.m_iKills') ?? 0) as number;
	}

	get deaths(): number {
		return (this._prop('CCSPlayerController.CCSPlayerController_ActionTrackingServices.m_iDeaths') ?? 0) as number;
	}

	get assists(): number {
		return (this._prop('CCSPlayerController.CCSPlayerController_ActionTrackingServices.m_iAssists') ?? 0) as number;
	}

	get damage(): number {
		return (this._prop('CCSPlayerController.CCSPlayerController_ActionTrackingServices.m_iDamage') ?? 0) as number;
	}

	get headshotKills(): number {
		return (this._prop('CCSPlayerController.CCSPlayerController_ActionTrackingServices.m_iHeadShotKills') ??
			0) as number;
	}

	get utilityDamage(): number {
		return (this._prop('CCSPlayerController.CCSPlayerController_ActionTrackingServices.m_iUtilityDamage') ??
			0) as number;
	}

	get enemiesFlashed(): number {
		return (this._prop('CCSPlayerController.CCSPlayerController_ActionTrackingServices.m_iEnemiesFlashed') ??
			0) as number;
	}

	get enemy3Ks(): number {
		return (this._prop('CCSPlayerController.CCSPlayerController_ActionTrackingServices.m_iEnemy3Ks') ??
			0) as number;
	}

	get enemy4Ks(): number {
		return (this._prop('CCSPlayerController.CCSPlayerController_ActionTrackingServices.m_iEnemy4Ks') ??
			0) as number;
	}

	get enemy5Ks(): number {
		return (this._prop('CCSPlayerController.CCSPlayerController_ActionTrackingServices.m_iEnemy5Ks') ??
			0) as number;
	}

	get objective(): number {
		return (this._prop('CCSPlayerController.CCSPlayerController_ActionTrackingServices.m_iObjective') ??
			0) as number;
	}

	// --- Per-Round Stats ---

	get round_kills(): number {
		return (this._prop(
			'CCSPlayerController.CCSPlayerController_ActionTrackingServices.CSPerRoundStats_t.m_iKills'
		) ?? 0) as number;
	}

	get round_deaths(): number {
		return (this._prop(
			'CCSPlayerController.CCSPlayerController_ActionTrackingServices.CSPerRoundStats_t.m_iDeaths'
		) ?? 0) as number;
	}

	get round_assists(): number {
		return (this._prop(
			'CCSPlayerController.CCSPlayerController_ActionTrackingServices.CSPerRoundStats_t.m_iAssists'
		) ?? 0) as number;
	}

	get round_damage(): number {
		return (this._prop(
			'CCSPlayerController.CCSPlayerController_ActionTrackingServices.CSPerRoundStats_t.m_iDamage'
		) ?? 0) as number;
	}

	get round_headshotKills(): number {
		return (this._prop(
			'CCSPlayerController.CCSPlayerController_ActionTrackingServices.CSPerRoundStats_t.m_iHeadShotKills'
		) ?? 0) as number;
	}

	get round_equipmentValue(): number {
		return (this._prop(
			'CCSPlayerController.CCSPlayerController_ActionTrackingServices.CSPerRoundStats_t.m_iEquipmentValue'
		) ?? 0) as number;
	}

	get round_cashEarned(): number {
		return (this._prop(
			'CCSPlayerController.CCSPlayerController_ActionTrackingServices.CSPerRoundStats_t.m_iCashEarned'
		) ?? 0) as number;
	}

	get round_utilityDamage(): number {
		return (this._prop(
			'CCSPlayerController.CCSPlayerController_ActionTrackingServices.CSPerRoundStats_t.m_iUtilityDamage'
		) ?? 0) as number;
	}

	get round_enemiesFlashed(): number {
		return (this._prop(
			'CCSPlayerController.CCSPlayerController_ActionTrackingServices.CSPerRoundStats_t.m_iEnemiesFlashed'
		) ?? 0) as number;
	}

	get round_liveTime(): number {
		return (this._prop(
			'CCSPlayerController.CCSPlayerController_ActionTrackingServices.CSPerRoundStats_t.m_iLiveTime'
		) ?? 0) as number;
	}

	// --- General ---

	get mvps(): number {
		return (this._prop('CCSPlayerController.m_iMVPs') ?? 0) as number;
	}

	get score(): number {
		return (this._prop('CCSPlayerController.m_iScore') ?? 0) as number;
	}

	get ping(): number {
		return (this._prop('CCSPlayerController.m_iPing') ?? 0) as number;
	}

	get color(): number {
		return (this._prop('CCSPlayerController.m_iCompTeammateColor') ?? -1) as number;
	}

	get clanTag(): string {
		return (this._prop('CCSPlayerController.m_szClan') ?? '') as string;
	}
}
