import type { DemoReader } from '../parser/index.js';
import type { ICCSTeam } from '../generated/entityTypes.js';
import type { Player } from './player.js';

export const TeamNumber = {
	Unassigned: 0,
	Spectators: 1,
	Terrorists: 2,
	CounterTerrorists: 3
} as const;

export type TeamNumber = (typeof TeamNumber)[keyof typeof TeamNumber];

type TeamProps = Partial<ICCSTeam>;
type TeamKey = keyof ICCSTeam;

export class Team {
	constructor(
		private _parser: DemoReader,
		public readonly entityId: number
	) {}

	get entity() {
		return this._parser.entities[this.entityId];
	}

	private _prop<K extends TeamKey>(name: K): ICCSTeam[K] | undefined {
		return (this.entity?.properties as TeamProps)?.[name];
	}

	get teamNumber(): TeamNumber {
		return (this._prop('CCSTeam.m_iTeamNum') ?? TeamNumber.Unassigned) as TeamNumber;
	}

	get teamName(): string {
		return (this._prop('CCSTeam.m_szTeamname') ?? '') as string;
	}

	get clanName(): string {
		return (this._prop('CCSTeam.m_szClanTeamname') ?? '') as string;
	}

	get score(): number {
		return (this._prop('CCSTeam.m_iScore') ?? 0) as number;
	}

	get scoreFirstHalf(): number {
		return (this._prop('CCSTeam.m_scoreFirstHalf') ?? 0) as number;
	}

	get scoreSecondHalf(): number {
		return (this._prop('CCSTeam.m_scoreSecondHalf') ?? 0) as number;
	}

	get members(): Player[] {
		const num = this.teamNumber;
		return this._parser.playerControllers.filter(p => p.teamNumber === num);
	}
}
