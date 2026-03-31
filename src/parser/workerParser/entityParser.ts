import type { CSVCMsg_PacketEntities } from '../../ts-proto/netmessages.js';
import { BitBuffer } from '../ubitreader.js';
import type { ClassInfo } from './classInfo.js';
import { constructorFieldHelper, Decoders, FieldTypeEnum, getInnerExt, type SerializerN } from './constructorFields.js';
import { generateEnum, type GetEnumType } from './helper.js';
import type { FieldPath } from './operations.js';
import { parsePaths } from './paths.js';
import { type emit } from './worker.js';

const NSERIALBITS = 17;

const EntityTypeEnum = generateEnum(
	{
		PlayerController: 0,
		Rules: 1,
		Projectile: 2,
		Team: 3,
		Normal: 4,
		C4: 5
	},
	'entityType'
);
export type EntityTypeEnum = GetEnumType<typeof EntityTypeEnum>;

export type Entity = {
	entityId: number;
	classId: number;
	entityType: EntityTypeEnum;
};

const getEntityType = (name: string) => {
	if (name === 'CCSPlayerController') return EntityTypeEnum.PlayerController;
	if (name === 'CCSGameRulesProxy') return EntityTypeEnum.Rules;
	if (name === 'CTeam') return EntityTypeEnum.Team;
	if (name === 'CC4') return EntityTypeEnum.C4;

	if (name.includes('Projectile') || name === 'CIncendiaryGrenade') return EntityTypeEnum.Projectile;

	return EntityTypeEnum.Normal;
};

// Reusable result object to avoid allocation per field
const _fieldResult = { decoder: 0 as any, propId: 0, hasInfo: false };

// Combined findField + getPropInfo + getDecoderFromField in one pass
const findFieldAndDecode = (fp: FieldPath, ser: SerializerN) => {
	let f = ser.fields[fp.path[0]];
	if (!f) throw 'Noo field';

	// Traverse to leaf field
	for (let depth = 1; depth <= fp.last; depth++) {
		f = getInnerExt(f!, fp.path[depth]!);
	}

	const field = f!;
	const type = field.type;

	if (type === FieldTypeEnum.Value) {
		const v = field.value as any;
		_fieldResult.decoder = v.decoder;
		_fieldResult.propId = v.prop_id;
		_fieldResult.hasInfo = true;
		return _fieldResult;
	}

	if (type === FieldTypeEnum.Vector) {
		_fieldResult.decoder = Decoders.UnsignedDecoder;
		const inner = getInnerExt(field, 0);
		if (inner.type === FieldTypeEnum.Value) {
			const v = inner.value as any;
			_fieldResult.propId = v.prop_id;
			_fieldResult.hasInfo = true;
		} else {
			_fieldResult.hasInfo = false;
		}
		return _fieldResult;
	}

	if (type === FieldTypeEnum.Pointer) {
		_fieldResult.decoder = (field.value as any).decoder;
		_fieldResult.hasInfo = false;
		return _fieldResult;
	}

	_fieldResult.decoder = Decoders.UnsignedDecoder;
	_fieldResult.hasInfo = false;
	return _fieldResult;
};

export class EntityParser {
	private paths: FieldPath[];
	private entities: { [EntityId: number]: number }; // Record<number, Entity>;
	private cachedBitBuffer = new BitBuffer(new Uint8Array(0));
	private cachedBitBuffer2 = new BitBuffer(new Uint8Array(0));
	public tick = 0;
	public directEntities:
		| { className: string; classId: number; entityType: number; properties: Record<string, unknown> }[]
		| null = null;
	public directPropIdToName: Record<number, string> | null = null;
	public onlyGameRules = false;
	constructor(
		private classInfo: ClassInfo,
		private enqueueEvent: emit
	) {
		const paths = [] as FieldPath[];
		for (let i = 0; i < 8192; i++) {
			paths.push({
				path: [0, 0, 0, 0, 0, 0, 0],
				last: 0
			});
		}
		this.paths = paths;
		this.entities = {};
	}

	decodeEntityUpdate = (reader: BitBuffer, entityId: number, nUpdates: number) => {
		let i = 0;
		const entityClassId = this.entities[entityId];

		if (entityClassId === undefined) {
			throw new Error(`No entiy with id ${entityId}`);
		}
		const cls = this.classInfo.classes[entityClassId];

		if (!cls) {
			throw 'No class';
		}

		const directEntities = this.directEntities;
		const directPropIdToName = this.directPropIdToName;
		while (i < nUpdates) {
			const path = this.paths[i]!;
			if (!path) break;

			const info = findFieldAndDecode(path, cls.serializer);
			const result = constructorFieldHelper.decode(reader, info.decoder);
			if (info.hasInfo) {
				if (directEntities) {
					const ent = directEntities[entityId];
					if (ent) {
						const name = directPropIdToName![info.propId];
						if (name !== undefined) ent.properties[name] = result;
					}
				} else if (this.classInfo.propIdToName[info.propId] !== undefined) {
					this.enqueueEvent('entityUpdated', { entityId, propId: info.propId, value: result });
				}
			}

			i++;
		}
		return i;
	};

	checkEntityType = (classId: number) => {
		const cls = this.classInfo.classes[classId];
		if (!cls) throw 'NO CLASS';
		return getEntityType(cls.name);
	};

	writeFp(fp_src: FieldPath, idx: number) {
		const target = this.paths[idx]!;
		target.last = fp_src.last;
		target.path[0] = fp_src.path[0];
		target.path[1] = fp_src.path[1];
		target.path[2] = fp_src.path[2];
		target.path[3] = fp_src.path[3];
		target.path[4] = fp_src.path[4];
		target.path[5] = fp_src.path[5];
		target.path[6] = fp_src.path[6];
	}

	createEntity = (reader: BitBuffer, entityId: number, baselines: Uint8Array[]) => {
		const classId = reader.ReadUBits(8);

		//serial
		reader.ReadUBits(NSERIALBITS);

		reader.ReadUVarInt32();
		const entityType = this.checkEntityType(classId);
		const cls = this.classInfo.classes[classId]!;

		// const entity: Entity = {
		// 	entityId,
		// 	classId,
		// 	entityType
		// };
		this.enqueueEvent('entityCreated', [entityId, classId, entityType, cls.name]);

		if (entityId > 100000) {
			throw 'Possible OOM';
		}

		this.entities[entityId] = classId;

		// For direct-write mode, also populate the DemoReader's entity immediately
		if (this.directEntities && (!this.onlyGameRules || entityType === EntityTypeEnum.Rules)) {
			this.directEntities[entityId] = {
				classId,
				entityType,
				className: cls.name,
				properties: {}
			};
		}

		if (baselines !== null) {
			const baseline = baselines[classId];
			if (baseline) {
				const baselineReader = this.cachedBitBuffer.setTo(baseline);
				this.updateEntity(baselineReader, entityId);
			}
		}
	};

	updateEntity = (reader: BitBuffer, entityId: number) => {
		const nUpdates = parsePaths(reader, this);
		this.decodeEntityUpdate(reader, entityId, nUpdates);
	};

	parseEntityPacket = (msg: CSVCMsg_PacketEntities, baseline: Uint8Array[]) => {
		const reader = this.cachedBitBuffer2.setTo(msg.entity_data!);

		let entityId = -1;
		const max = msg.updated_entries!;

		for (let i = 0; i < max; i++) {
			const base = reader.readUbitVar();
			entityId += 1 + base;

			const cmd = reader.ReadUBits(2);

			switch (cmd) {
				case 0b01:
				case 0b11: {
					this.entities[entityId] = undefined as any;
					if (this.directEntities) {
						this.directEntities[entityId] = undefined as any;
					}
					this.enqueueEvent('entityDeleted', entityId);
					break;
				}
				case 0b10: {
					this.createEntity(reader, entityId, baseline);
					this.updateEntity(reader, entityId);
					break;
				}
				case 0b00: {
					const hasPvsBits = msg.has_pvs_vis_bits_deprecated ?? 0;
					if (hasPvsBits > 0 && (reader.ReadUBits(2) & 0x01) === 1) {
						continue;
					}
					this.updateEntity(reader, entityId);
					break;
				}
				default: {
					throw 'WRONG COMMAND';
				}
			}
		}
	};
}
