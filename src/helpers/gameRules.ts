import type { DemoReader } from '../parser/index.js';
import type { ICCSGameRulesProxy } from '../generated/entityTypes.js';

type RulesProps = Partial<ICCSGameRulesProxy>;
type RulesKey = keyof ICCSGameRulesProxy;

export const WinRoundReason = {
	EXPLOSION: 1,
	DEFUSE: 7,
	T_ELIMINATED: 8,
	CT_ELIMINATED: 9,
	TIME: 12,
	T_SURRENDER: 17,
	CT_SURRENDER: 18
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
