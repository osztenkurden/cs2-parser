import type { DemoReader } from '../parser/index.js';
import type { ICCSPlayerPawn } from '../generated/entityTypes.js';
import type { Player } from './player.js';

const CELL_BITS = 9;
const MAX_COORD = 1 << 14;

export interface Vector {
	readonly x: number;
	readonly y: number;
	readonly z: number;
}

type PawnProps = Partial<ICCSPlayerPawn>;
type PawnKey = keyof ICCSPlayerPawn;

export class PlayerPawn {
	constructor(
		private _parser: DemoReader,
		public readonly entityId: number
	) {}

	get entity() {
		return this._parser.entities[this.entityId];
	}

	private _prop<K extends PawnKey>(name: K): ICCSPlayerPawn[K] | undefined {
		return (this.entity?.properties as PawnProps)?.[name];
	}

	get position(): Vector {
		const cellX = (this._prop('CCSPlayerPawn.CBodyComponentBaseAnimGraph.m_cellX') ?? 0) as number;
		const cellY = (this._prop('CCSPlayerPawn.CBodyComponentBaseAnimGraph.m_cellY') ?? 0) as number;
		const cellZ = (this._prop('CCSPlayerPawn.CBodyComponentBaseAnimGraph.m_cellZ') ?? 0) as number;
		const vecX = (this._prop('CCSPlayerPawn.CBodyComponentBaseAnimGraph.m_vecX') ?? 0) as number;
		const vecY = (this._prop('CCSPlayerPawn.CBodyComponentBaseAnimGraph.m_vecY') ?? 0) as number;
		const vecZ = (this._prop('CCSPlayerPawn.CBodyComponentBaseAnimGraph.m_vecZ') ?? 0) as number;
		return {
			x: cellX * (1 << CELL_BITS) - MAX_COORD + vecX,
			y: cellY * (1 << CELL_BITS) - MAX_COORD + vecY,
			z: cellZ * (1 << CELL_BITS) - MAX_COORD + vecZ
		};
	}

	get health(): number {
		return (this._prop('CCSPlayerPawn.m_iHealth') ?? 0) as number;
	}

	get maxHealth(): number {
		return (this._prop('CCSPlayerPawn.m_iMaxHealth') ?? 100) as number;
	}

	get armor(): number {
		return (this._prop('CCSPlayerPawn.m_ArmorValue') ?? 0) as number;
	}

	get lifeState(): number {
		return (this._prop('CCSPlayerPawn.m_lifeState') ?? 0) as number;
	}

	get isAlive(): boolean {
		return this.lifeState === 0;
	}

	get hasDefuser(): boolean {
		return (this._prop('CCSPlayerPawn.CCSPlayer_ItemServices.m_bHasDefuser') ?? false) as boolean;
	}

	get hasHelmet(): boolean {
		return (this._prop('CCSPlayerPawn.CCSPlayer_ItemServices.m_bHasHelmet') ?? false) as boolean;
	}

	get isScoped(): boolean {
		return (this._prop('CCSPlayerPawn.m_bIsScoped') ?? false) as boolean;
	}

	get isWalking(): boolean {
		return (this._prop('CCSPlayerPawn.m_bIsWalking') ?? false) as boolean;
	}

	get isDefusing(): boolean {
		return (this._prop('CCSPlayerPawn.m_bIsDefusing') ?? false) as boolean;
	}

	get eyeAngles(): { pitch: number; yaw: number } {
		const raw = this._prop('CCSPlayerPawn.m_angEyeAngles');
		if (Array.isArray(raw)) return { pitch: raw[0] ?? 0, yaw: raw[1] ?? 0 };
		return { pitch: 0, yaw: 0 };
	}

	get flags(): number {
		return (this._prop('CCSPlayerPawn.m_fFlags') ?? 0) as number;
	}

	get controller(): Player | undefined {
		return this._parser.playerControllers.find(player => player.pawnEntityId === this.entityId);
	}

	get ownerEntityHandle(): number {
		return (this._prop('CCSPlayerPawn.m_hOwnerEntity') ?? 0) as number;
	}
}
