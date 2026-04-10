import type { DemoReader } from '../parser/index.js';
import type { ICCSGameRulesProxy } from '../generated/entityTypes.js';

type RulesProps = Partial<ICCSGameRulesProxy>;
type RulesKey = keyof ICCSGameRulesProxy;

export const WinRoundReason = {
	INVALID: -1,
	STILL_IN_PROGRESS: 0,
	TARGET_BOMBED: 1,
	VIP_ESCAPED: 2,
	VIP_ASSASSINATED: 3,
	T_ESCAPED: 4,
	CT_PREVENT_ESCAPE: 5,
	ESCAPING_T_NEUTRALIZED: 6,
	BOMB_DEFUSED: 7,
	T_ELIMINATED: 8,
	CT_ELIMINATED: 9,
	ROUND_DRAW: 10,
	ALL_HOSTAGES_RESCUED: 11,
	TARGET_SAVED: 12,
	HOSTAGES_NOT_SAVED: 13,
	T_NOT_ESCAPED: 14,
	VIP_NOT_ESCAPED: 15,
	GAME_COMMENCING: 16,
	T_SURRENDER: 17,
	CT_SURRENDER: 18,
	T_PLANTED: 19,
	CT_REACHED_HOSTAGE: 20
} as const;

export type WinRoundReason = (typeof WinRoundReason)[keyof typeof WinRoundReason];

export class GameRules {
	constructor(
		private _parser: DemoReader,
		public readonly entityId: number
	) {}

	get entity() {
		return this._parser.entities[this.entityId];
	}

	private _prop<K extends RulesKey>(name: K): ICCSGameRulesProxy[K] | undefined {
		return (this.entity?.properties as RulesProps)?.[name];
	}

	get isWarmup(): boolean {
		return (this._prop('CCSGameRulesProxy.CCSGameRules.m_bWarmupPeriod') ?? false) as boolean;
	}

	get isFreezePeriod(): boolean {
		return (this._prop('CCSGameRulesProxy.CCSGameRules.m_bFreezePeriod') ?? false) as boolean;
	}

	get isGamePaused(): boolean {
		return (this._prop('CCSGameRulesProxy.CCSGameRules.m_bGamePaused') ?? false) as boolean;
	}

	get isTerroristTimeOutActive(): boolean {
		return (this._prop('CCSGameRulesProxy.CCSGameRules.m_bTerroristTimeOutActive') ?? false) as boolean;
	}

	get isCTTimeOutActive(): boolean {
		return (this._prop('CCSGameRulesProxy.CCSGameRules.m_bCTTimeOutActive') ?? false) as boolean;
	}

	get roundsPlayed(): number {
		return (this._prop('CCSGameRulesProxy.CCSGameRules.m_totalRoundsPlayed') ?? 0) as number;
	}

	get gamePhase(): number {
		return (this._prop('CCSGameRulesProxy.CCSGameRules.m_gamePhase') ?? 0) as number;
	}

	get phase(): string {
		const phases: Record<number, string> = {
			2: 'first',
			3: 'second',
			4: 'halftime',
			5: 'postgame'
		};
		return phases[this.gamePhase] ?? 'unknown';
	}

	get roundTime(): number {
		return (this._prop('CCSGameRulesProxy.CCSGameRules.m_iRoundTime') ?? 0) as number;
	}

	get roundStartTime(): number {
		return (this._prop('CCSGameRulesProxy.CCSGameRules.m_fRoundStartTime') ?? 0) as number;
	}

	get terroristTimeOutRemaining(): number {
		return (this._prop('CCSGameRulesProxy.CCSGameRules.m_flTerroristTimeOutRemaining') ?? 0) as number;
	}

	get ctTimeOutRemaining(): number {
		return (this._prop('CCSGameRulesProxy.CCSGameRules.m_flCTTimeOutRemaining') ?? 0) as number;
	}
}
