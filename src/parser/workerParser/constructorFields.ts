import type { BitBuffer } from '../ubitreader.js';
import { generateEnum, type GetEnumType } from './helper.js';
import type { FieldPath } from './operations.js';
import { decodeQfloat, getQuantalizedFloat, qfMapper } from './utils.js';

// const PLAYER_ENTITY_HANDLE_MISSING = 2047;
// const SPECTATOR_TEAM_NUM = 1;
// const BUTTONS_BASEID = 100000;
// const NORMAL_PROP_BASEID = 1000;
// const WEAPON_SKIN_NAME = 420420420;
// const WEAPON_ORIGINGAL_OWNER_ID = 6942000;
const MY_WEAPONS_OFFSET = 500000;
// const GRENADE_AMMO_ID = 1111111;
// const INVENTORY_ID = 100000000;
// const IS_ALIVE_ID = 100000001;
// const GAME_TIME_ID = 100000002;
// const ENTITY_ID_ID = 100000003;
// const VELOCITY_X_ID = 100000004;
// const VELOCITY_Y_ID = 100000005;
// const VELOCITY_Z_ID = 100000006;
// const VELOCITY_ID = 100000007;
// const USERID_ID = 100000008;
// const AGENT_SKIN_ID = 100000009;
// const WEAPON_NAME_ID = 100000010;
// const YAW_ID = 100000111;
// const PITCH_ID = 100000012;
// const TICK_ID = 100000013;
// const STEAMID_ID = 100000014;
// const NAME_ID = 100000015;
// const PLAYER_X_ID = 100000016;
// const PLAYER_Y_ID = 100000017;
// const PLAYER_Z_ID = 100000018;
// const WEAPON_STICKERS_ID = 100000019;
// const INVENTORY_AS_IDS_ID = 100000020;

const WEAPON_SKIN_ID = 10000000;
// const WEAPON_PAINT_SEED = 10000001;
// const WEAPON_FLOAT = 10000002;
const ITEM_PURCHASE_COUNT = 200000000;
const ITEM_PURCHASE_DEF_IDX = 300000000;
const ITEM_PURCHASE_COST = 400000000;
const ITEM_PURCHASE_HANDLE = 500000000;
const ITEM_PURCHASE_NEW_DEF_IDX = 600000000;
const FLATTENED_VEC_MAX_LEN = 100000;
type FieldType = {
	baseType: string;
	genericType: FieldType | null;
	pointer: boolean;
	count: number | null;
	elementType: FieldType | null;
};

export const fieldTypeMap: Record<string, FieldType> = {};

const isPointerFromName = (name: string) => {
	switch (name) {
		case 'CBodyComponent':
		case 'CLightComponent':
		case 'CPhysicsComponent':
		case 'CRenderComponent':
		case 'CPlayerLocalData':
			return true;
		default:
			return false;
	}
};

const isPointer = (field: ConstructorField) => {
	if (field.fieldType.pointer) return true;

	return isPointerFromName(field.fieldType.baseType);
};

const isArray = (field: ConstructorField) => {
	if (field.fieldType.count !== null) {
		if (field.fieldType.baseType !== 'char') {
			return true;
		}
	}
	return false;
};

const isVector = (field: ConstructorField) => {
	if (field.serializer_name !== null) return true;
	if (field.fieldType.baseType === 'CUtlVector') return true;
	if (field.fieldType.baseType === 'CNetworkUtlVectorBase') return true;

	return false;
};

const getBaseFieldType = (baseName: string, count: number | null): FieldType => {
	const isFieldTypePointer = baseName.includes('*') || isPointerFromName(baseName);
	const baseNameElements = baseName.split('[');
	const baseNameFirst = baseNameElements[0]!;

	let elType: null | FieldType = null;

	if (count !== null) {
		elType = getBaseFieldType(baseNameFirst, null);
	}

	const ft: FieldType = {
		baseType: baseNameFirst,
		genericType: null,
		pointer: isFieldTypePointer,
		count,
		elementType: elType
	};

	fieldTypeMap[baseName] = ft;
	return ft;
};

const clearName = (name: string) => {
	const splitNames = name.split('< ');
	const baseNameFirstPart = splitNames.shift()!;

	const splitNames2 = baseNameFirstPart.split(' >');
	return splitNames2[0]!;
};

export const findFieldType = (name: string): FieldType => {
	const splitNames = name.split('< ');

	const baseName = splitNames.shift()!;

	let count = null as null | number;

	const bracketPos = name.indexOf('[');
	if (bracketPos !== -1) {
		const c = name.slice(bracketPos + 1);

		const elementCountIt = c.split(']');
		count = parseInt(elementCountIt[0]!);
	}

	if (!baseName) {
		throw 'No Base Name Found';
	}

	const ft = getBaseFieldType(baseName, count);
	let lastType = ft;
	let genericName;
	while ((genericName = splitNames.shift())) {
		const baseGenericName = clearName(genericName);
		const genericType = getBaseFieldType(baseGenericName, null);
		lastType.genericType = genericType;
		lastType = genericType;
	}

	return ft;
};

// Numeric decoder IDs for fast switch/jump-table dispatch
const D_QUANTALIZED_FLOAT = 0;
const D_VECTOR_NORMAL = 1;
const D_VECTOR_NOSCALE = 2;
const D_VECTOR_FLOAT_COORD = 3;
const D_UNSIGNED64 = 4;
const D_CENTITY_HANDLE = 5;
const D_NOSCALE = 6;
const D_BOOLEAN = 7;
const D_STRING = 8;
const D_SIGNED = 9;
const D_UNSIGNED = 10;
const D_COMPONENT = 11;
const D_FLOAT_COORD = 12;
const D_FLOAT_SIMULATION_TIME = 13;
const D_FIXED64 = 14;
const D_QANGLE_PITCH_YAW = 15;
const D_QANGLE3 = 16;
const D_QANGLE_VAR = 17;
const D_BASE = 18;
const D_AMMO = 19;
const D_QANGLE_PRES = 20;
const D_GAME_MODE_RULES = 21;

export type QuantalizedFloatDecoder = { type: typeof D_QUANTALIZED_FLOAT; decoder: number };
export type Decoder = number | QuantalizedFloatDecoder;

export const Decoders = {
	QuantalizedFloatDecoder: { type: D_QUANTALIZED_FLOAT, decoder: 0 } as QuantalizedFloatDecoder,
	VectorNormalDecoder: D_VECTOR_NORMAL,
	VectorNoscaleDecoder: D_VECTOR_NOSCALE,
	VectorFloatCoordDecoder: D_VECTOR_FLOAT_COORD,
	Unsigned64Decoder: D_UNSIGNED64,
	CentityHandleDecoder: D_CENTITY_HANDLE,
	NoscaleDecoder: D_NOSCALE,
	BooleanDecoder: D_BOOLEAN,
	StringDecoder: D_STRING,
	SignedDecoder: D_SIGNED,
	UnsignedDecoder: D_UNSIGNED,
	ComponentDecoder: D_COMPONENT,
	FloatCoordDecoder: D_FLOAT_COORD,
	FloatSimulationTimeDecoder: D_FLOAT_SIMULATION_TIME,
	Fixed64Decoder: D_FIXED64,
	QanglePitchYawDecoder: D_QANGLE_PITCH_YAW,
	Qangle3Decoder: D_QANGLE3,
	QangleVarDecoder: D_QANGLE_VAR,
	BaseDecoder: D_BASE,
	AmmoDecoder: D_AMMO,
	QanglePresDecoder: D_QANGLE_PRES,
	GameModeRulesDecoder: D_GAME_MODE_RULES
};

const decoderMap: { [K in string]?: Decoder } = {
	bool: Decoders.BooleanDecoder,
	char: Decoders.StringDecoder,
	int16: Decoders.SignedDecoder,
	int32: Decoders.SignedDecoder,
	int64: Decoders.SignedDecoder,
	int8: Decoders.SignedDecoder,
	uint16: Decoders.UnsignedDecoder,
	uint32: Decoders.UnsignedDecoder,
	uint8: Decoders.UnsignedDecoder,
	color32: Decoders.UnsignedDecoder,
	GameTime_t: Decoders.NoscaleDecoder,
	CBodyComponent: Decoders.ComponentDecoder,
	CGameSceneNodeHandle: Decoders.UnsignedDecoder,
	Color: Decoders.UnsignedDecoder,
	CPhysicsComponent: Decoders.ComponentDecoder,
	CRenderComponent: Decoders.ComponentDecoder,
	CUtlString: Decoders.StringDecoder,
	CUtlStringToken: Decoders.UnsignedDecoder,
	CUtlSymbolLarge: Decoders.StringDecoder,
	Quaternion: Decoders.NoscaleDecoder,
	CTransform: Decoders.NoscaleDecoder,
	HSequence: Decoders.Unsigned64Decoder,
	AttachmentHandle_t: Decoders.Unsigned64Decoder,
	CEntityIndex: Decoders.Unsigned64Decoder,
	MoveCollide_t: Decoders.Unsigned64Decoder,
	MoveType_t: Decoders.Unsigned64Decoder,
	RenderMode_t: Decoders.Unsigned64Decoder,
	RenderFx_t: Decoders.Unsigned64Decoder,
	SolidType_t: Decoders.Unsigned64Decoder,
	SurroundingBoundsType_t: Decoders.Unsigned64Decoder,
	ModelConfigHandle_t: Decoders.Unsigned64Decoder,
	NPC_STATE: Decoders.Unsigned64Decoder,
	StanceType_t: Decoders.Unsigned64Decoder,
	AbilityPathType_t: Decoders.Unsigned64Decoder,
	WeaponState_t: Decoders.Unsigned64Decoder,
	DoorState_t: Decoders.Unsigned64Decoder,
	RagdollBlendDirection: Decoders.Unsigned64Decoder,
	BeamType_t: Decoders.Unsigned64Decoder,
	BeamClipStyle_t: Decoders.Unsigned64Decoder,
	EntityDisolveType_t: Decoders.Unsigned64Decoder,
	tablet_skin_state_t: Decoders.Unsigned64Decoder,
	CStrongHandle: Decoders.Unsigned64Decoder,
	CSWeaponMode: Decoders.Unsigned64Decoder,
	ESurvivalSpawnTileState: Decoders.Unsigned64Decoder,
	SpawnStage_t: Decoders.Unsigned64Decoder,
	ESurvivalGameRuleDecision_t: Decoders.Unsigned64Decoder,
	RelativeDamagedDirection_t: Decoders.Unsigned64Decoder,
	CSPlayerState: Decoders.Unsigned64Decoder,
	MedalRank_t: Decoders.Unsigned64Decoder,
	CSPlayerBlockingUseAction_t: Decoders.Unsigned64Decoder,
	MoveMountingAmount_t: Decoders.Unsigned64Decoder,
	'QuestProgress::Reason': Decoders.Unsigned64Decoder
};

export const FieldTypeEnum = generateEnum(
	{
		Array: 0,
		Vector: 1,
		Serializer: 2,
		Pointer: 3,
		Value: 4,
		None: 5
	} as const,
	'fieldType'
);
type FieldTypeEnum = GetEnumType<typeof FieldTypeEnum>;
// type FieldTypeEnumKeys = GetEnum<typeof FieldTypeEnum>;

export const FieldCategory = generateEnum(
	{
		Pointer: 0,
		Vector: 1,
		Array: 2,
		Value: 3
	},
	'fieldCategory'
);
export type FieldCategory = GetEnumType<typeof FieldCategory>;

type ArrayField = {
	field_enum: Field;
	length: number;
};

type VectorField = {
	field_enum: Field;
	decoder: Decoder;
};

type SerializerField = {
	serializer: SerializerN;
};

type PointerField = {
	serializer: SerializerN;
	decoder: Decoder;
};

const initPointerField = (serializer: SerializerN): PointerField => {
	const decoder = serializer.name === 'CCSGameModeRules' ? Decoders.GameModeRulesDecoder : Decoders.BooleanDecoder;
	return {
		serializer,
		decoder
	};
};

type ValueField = {
	decoder: Decoder;
	name: string;
	prop_id: number;
};
export const FieldTypeName = {
	[FieldTypeEnum.Array]: 'Array',
	[FieldTypeEnum.None]: 'None',
	[FieldTypeEnum.Value]: 'Value',
	[FieldTypeEnum.Pointer]: 'Pointer',
	[FieldTypeEnum.Vector]: 'Vector',
	[FieldTypeEnum.Serializer]: 'Serializer'
} satisfies Record<FieldTypeEnum, string>;
export class Field<const T extends FieldTypeEnum = FieldTypeEnum> {
	type: T;
	value: FieldValue<T>;

	constructor(type: T, value: FieldValue<T>) {
		this.type = type;
		this.value = value;
	}

	clone(): Field<T> {
		switch (this.type) {
			case FieldTypeEnum.Value:
			case FieldTypeEnum.None:
			case FieldTypeEnum.Array:
			case FieldTypeEnum.Vector:
				return new Field(this.type, { ...this.value });
			case FieldTypeEnum.Serializer: {
				const value = this.value as SerializerField;
				return new Field(FieldTypeEnum['Serializer'], {
					serializer: {
						name: value.serializer.name,
						fields: value.serializer.fields.map(field => field?.clone() ?? null)
					}
				}) as Field<T>;
			}
			case FieldTypeEnum.Pointer: {
				const value = this.value as PointerField;
				return new Field(FieldTypeEnum['Pointer'], {
					serializer: {
						name: value.serializer.name,
						fields: value.serializer.fields.map(field => field?.clone() ?? null)
					},
					decoder: value.decoder
				}) as Field<T>;
			}

			default:
				throw 'ILLEGAL PATH #5';
		}
	}

	_getName(): string {
		switch (this.type) {
			case FieldTypeEnum.Array:
				return getNameExt((this.value as ArrayField).field_enum);
			case FieldTypeEnum.Vector:
				return getNameExt((this.value as VectorField).field_enum);
			case FieldTypeEnum.Serializer: {
				return (this.value as SerializerField).serializer.name;
			}
			case FieldTypeEnum.Pointer: {
				return (this.value as PointerField).serializer.name;
			}

			case FieldTypeEnum.Value:
				return (this.value as ValueField).name;
			case FieldTypeEnum.None:
				return '';

			default:
				throw 'ILLEGAL PATH #5';
		}
	}

	_getInner(index: number) {
		switch (this.type) {
			case FieldTypeEnum.Array:
				return (this.value as ArrayField).field_enum;
			case FieldTypeEnum.Vector:
				return (this.value as VectorField).field_enum;
			case FieldTypeEnum.Serializer: {
				const result = (this.value as SerializerField).serializer.fields[index];
				if (!result) throw 'ILLEGAL PATH #1';

				return result;
			}
			case FieldTypeEnum.Pointer: {
				const result = (this.value as PointerField).serializer.fields[index];
				if (!result) throw 'ILLEGAL PATH #2';

				return result;
			}

			case FieldTypeEnum.Value:
			case FieldTypeEnum.None:
				throw 'ILLEGAL PATH #3';

			default:
				throw 'ILLEGAL PATH #4';
		}
	}
}

export const getNameExt = (field: Field): string => {
	switch (field.type) {
		case FieldTypeEnum.Array:
			return getNameExt((field.value as ArrayField).field_enum);
		case FieldTypeEnum.Vector:
			return getNameExt((field.value as VectorField).field_enum);
		case FieldTypeEnum.Serializer: {
			return (field.value as SerializerField).serializer.name;
		}
		case FieldTypeEnum.Pointer: {
			return (field.value as PointerField).serializer.name;
		}

		case FieldTypeEnum.Value:
			return (field.value as ValueField).name;
		case FieldTypeEnum.None:
			return '';

		default:
			throw 'ILLEGAL PATH #5';
	}
};

export const getInnerExt = (field: Field, index: number) => {
	switch (field.type) {
		case FieldTypeEnum.Array:
			return (field.value as ArrayField).field_enum;
		case FieldTypeEnum.Vector:
			return (field.value as VectorField).field_enum;
		case FieldTypeEnum.Serializer: {
			const result = (field.value as SerializerField).serializer.fields[index];
			if (!result) throw 'ILLEGAL PATH #1';

			return result;
		}
		case FieldTypeEnum.Pointer: {
			const result = (field.value as PointerField).serializer.fields[index];
			if (!result) throw 'ILLEGAL PATH #2x';

			return result;
		}

		case FieldTypeEnum.Value:
		case FieldTypeEnum.None:
			throw 'ILLEGAL PATH #3';

		default:
			throw 'ILLEGAL PATH #4';
	}
};

type FieldValue<T extends FieldTypeEnum> = T extends (typeof FieldTypeEnum)['Array']
	? ArrayField
	: T extends (typeof FieldTypeEnum)['Vector']
		? VectorField
		: T extends (typeof FieldTypeEnum)['Serializer']
			? SerializerField
			: T extends (typeof FieldTypeEnum)['Pointer']
				? PointerField
				: T extends (typeof FieldTypeEnum)['Value']
					? ValueField
					: 0;

export type SerializerN = {
	name: string;
	fields: (Field | null)[];
};

export type Class = {
	class_id: number;
	name: string;
	serializer: SerializerN;
};

export type FieldInfo = {
	decoder: Decoder;
	propId: number;
};

export const constructorFieldHelper = {
	findCategory: (field: ConstructorField) => {
		if (isPointer(field)) return FieldCategory.Pointer;
		if (isVector(field)) return FieldCategory.Vector;
		if (isArray(field)) return FieldCategory.Array;
		return FieldCategory.Value;
	},
	findVectorType: (field: ConstructorField, n: number): Decoder => {
		if (n === 3 && field.encoder === 'normal') {
			return Decoders.VectorNormalDecoder;
		}

		const floatType = constructorFieldHelper.findFloatDecoder(field);
		if (floatType === Decoders.NoscaleDecoder) {
			return Decoders.VectorNoscaleDecoder;
		}
		if (floatType === Decoders.FloatCoordDecoder) {
			return Decoders.VectorFloatCoordDecoder;
		}
		return Decoders.VectorNormalDecoder;
	},
	findFloatDecoder: (field: ConstructorField): Decoder => {
		if (field.varName === 'm_flSimulationTime' || field.varName === 'm_flAnimTime') {
			return Decoders.FloatSimulationTimeDecoder;
		}

		if (field.encoder === 'coord') {
			return Decoders.FloatCoordDecoder;
		}

		if (field.encoder === 'm_flSimulationTime') {
			return Decoders.FloatSimulationTimeDecoder;
		}

		if (field.bitcount <= 0 || field.bitcount >= 32) {
			return Decoders.NoscaleDecoder;
		}

		const qf = getQuantalizedFloat(field.bitcount, field.encodeFlags, field.lowValue, field.highValue);
		const idx = qfMapper.idx;
		qfMapper.map[idx] = qf;
		qfMapper.idx++;

		return { type: D_QUANTALIZED_FLOAT, decoder: idx } as QuantalizedFloatDecoder;
	},
	findUintDecoder: (field: ConstructorField): Decoder => {
		if (field.encoder === 'fixed64') return Decoders.Fixed64Decoder;
		return Decoders.Unsigned64Decoder;
	},
	findQAngleDecoder: (field: ConstructorField): Decoder => {
		if (field.encoder === 'm_angEyeAngles') {
			return Decoders.QanglePitchYawDecoder;
		}
		if (field.bitcount !== 0) {
			return Decoders.Qangle3Decoder;
		}

		return Decoders.QangleVarDecoder;
	},
	u32Tof32: (() => {
		const dataView = new DataView(new ArrayBuffer(4));

		return (input: number) => {
			dataView.setUint32(0, input);

			return dataView.getFloat32(0);
		};
	})(),
	decode: (reader: BitBuffer, decoder: Decoder) => {
		if (typeof decoder === 'object') {
			return decodeQfloat(reader, decoder.decoder);
		}
		switch (decoder) {
			case D_NOSCALE:
				return constructorFieldHelper.u32Tof32(reader.ReadUBits(32));
			case D_FLOAT_SIMULATION_TIME:
				return reader.ReadUVarInt32() * (1 / 30);
			case D_UNSIGNED:
				return reader.ReadUVarInt32();
			case D_QANGLE3:
				return reader.decodeQangleAll3();
			case D_SIGNED:
				return reader.readVarInt32();
			case D_VECTOR_NOSCALE:
				return reader.decodeVectorNoScale();
			case D_BOOLEAN:
				return reader.readBoolean();
			case D_BASE:
				return reader.ReadUVarInt32();
			case D_CENTITY_HANDLE:
				return reader.ReadUVarInt32();
			case D_COMPONENT:
				return reader.readBoolean();
			case D_FLOAT_COORD:
				return reader.readBitCoord();
			case D_STRING:
				return reader.readString();
			case D_QANGLE_PITCH_YAW:
				return reader.decodeQanglePitchYaw();
			case D_QANGLE_VAR:
				return reader.decodeQangleVariant();
			case D_VECTOR_NORMAL:
				return reader.decodeNormalVec();
			case D_UNSIGNED64:
				return reader.readUVarInt64();
			case D_FIXED64:
				return reader.decudeUint64();
			case D_VECTOR_FLOAT_COORD:
				return reader.decodeVectorFloatCoord();
			case D_AMMO:
				return reader.decodeAmmo();
			case D_QANGLE_PRES:
				return reader.decodeQangleVariantPres();
			case D_GAME_MODE_RULES:
				return reader.ReadUBits(7);
			default:
				throw Error('unknown decoder');
		}
	},
	getPropInfo: (field: Field, path: FieldPath): FieldInfo | null => {
		// TODO MEMOIZE THE FIELD INFO
		let info: null | FieldInfo = null;
		switch (field.type) {
			case FieldTypeEnum.Value: {
				info = {
					decoder: (field.value as ValueField).decoder,
					propId: (field.value as ValueField).prop_id
				};
				break;
			}
			case FieldTypeEnum.Vector: {
				const v = getInnerExt(field, 0);

				switch (v.type) {
					case FieldTypeEnum.Value: {
						info = {
							decoder: (v.value as ValueField).decoder,
							propId: (v.value as ValueField).prop_id
						};
						break;
					}
				}
				break;
			}
		}

		if (!info) return null;

		if (info.propId === MY_WEAPONS_OFFSET) {
			if (path.last !== -1) {
				info.propId = MY_WEAPONS_OFFSET + path.path[2] + 1;
			}
		}

		if (info.propId === WEAPON_SKIN_ID) {
			info.propId = WEAPON_SKIN_ID + path.path[1];
		}

		if (path.path[1] !== -1) {
			if (info.propId >= ITEM_PURCHASE_COUNT && info.propId < ITEM_PURCHASE_COUNT + FLATTENED_VEC_MAX_LEN) {
				info.propId = ITEM_PURCHASE_COUNT + path.path[2];
			}
			if (info.propId >= ITEM_PURCHASE_DEF_IDX && info.propId < ITEM_PURCHASE_DEF_IDX + FLATTENED_VEC_MAX_LEN) {
				info.propId = ITEM_PURCHASE_DEF_IDX + path.path[2];
			}
			if (info.propId >= ITEM_PURCHASE_COST && info.propId < ITEM_PURCHASE_COST + FLATTENED_VEC_MAX_LEN) {
				info.propId = ITEM_PURCHASE_COST + path.path[2];
			}
			if (info.propId >= ITEM_PURCHASE_HANDLE && info.propId < ITEM_PURCHASE_HANDLE + FLATTENED_VEC_MAX_LEN) {
				info.propId = ITEM_PURCHASE_HANDLE + path.path[2];
			}
			if (
				info.propId >= ITEM_PURCHASE_NEW_DEF_IDX &&
				info.propId < ITEM_PURCHASE_NEW_DEF_IDX + FLATTENED_VEC_MAX_LEN
			) {
				info.propId = ITEM_PURCHASE_NEW_DEF_IDX + path.path[2];
			}
		}

		return info;
	},
	getDecoderFromField: (field: Field) => {
		switch (field.type) {
			case FieldTypeEnum.Value: {
				return (field.value as ValueField).decoder;
			}
			case FieldTypeEnum.Vector: {
				return Decoders.UnsignedDecoder;
			}
			case FieldTypeEnum.Pointer: {
				return (field.value as PointerField).decoder;
			}
			default:
				throw 'WRONG TYPE FIELD XXS';
		}
	},
	findDecoder: (field: ConstructorField): Decoder => {
		if (field.encoder === 'qangle_precise') return Decoders.QanglePresDecoder;
		// "m_OwnerOnlyPredNetFloatVariables
		if (field.varName === 'm_PredFloatVariables' || field.varName === 'm_OwnerOnlyPredNetFloatVariables') {
			return Decoders.NoscaleDecoder;
		}

		if (field.varName === 'm_OwnerOnlyPredNetVectorVariables' || field.varName === 'm_PredVectorVariables') {
			return Decoders.VectorNoscaleDecoder;
		}

		if (field.varName === 'm_pGameModeRules') {
			return Decoders.GameModeRulesDecoder;
		}
		if (field.varName === 'm_iClip1') {
			return Decoders.AmmoDecoder;
		}

		const decoder = decoderMap[field.fieldType.baseType];

		if (decoder) return decoder;

		if (field.fieldType.baseType === 'float32') {
			return constructorFieldHelper.findFloatDecoder(field);
		}

		if (field.fieldType.baseType === 'Vector' || field.fieldType.baseType === 'VectorWS') {
			return constructorFieldHelper.findVectorType(field, 3);
		}

		if (field.fieldType.baseType === 'Vector2D') {
			return constructorFieldHelper.findVectorType(field, 2);
		}

		if (field.fieldType.baseType === 'Vector4D') {
			return constructorFieldHelper.findVectorType(field, 4);
		}

		if (field.fieldType.baseType === 'uint64') {
			return constructorFieldHelper.findUintDecoder(field);
		}

		if (field.fieldType.baseType === 'QAngle') {
			return constructorFieldHelper.findQAngleDecoder(field);
		}

		if (field.fieldType.baseType === 'CHandle') {
			return Decoders.UnsignedDecoder;
		}

		if (field.fieldType.baseType === 'CNetworkedQuantizedFloat') {
			return constructorFieldHelper.findFloatDecoder(field);
		}

		if (field.fieldType.baseType === 'CStrongHandle') {
			return constructorFieldHelper.findUintDecoder(field);
		}

		if (field.fieldType.baseType === 'CEntityHandle') {
			return constructorFieldHelper.findUintDecoder(field);
		}

		return Decoders.UnsignedDecoder;
	},
	traverseFields: (
		fields: (Field | null)[],
		serializerName: string,
		map: Record<number, string>,
		currentEntityId: { id: number },
		decoderMap?: Record<number, Decoder>
	) => {
		for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
			if (!fields[fieldIndex]) {
				continue;
			}

			const field = fields[fieldIndex]!;

			switch (field.type) {
				case FieldTypeEnum.Value: {
					const value = field.value as ValueField;
					const result = `${serializerName}.${value.name}`;
					map[currentEntityId.id] = result;
					if (decoderMap) decoderMap[currentEntityId.id] = value.decoder;
					value.prop_id = currentEntityId.id;
					currentEntityId.id++;
					break;
				}
				case FieldTypeEnum.Serializer: {
					const value = field.value as SerializerField;
					const result = `${serializerName}.${value.serializer.name}`;

					constructorFieldHelper.traverseFields(value.serializer.fields, result, map, currentEntityId, decoderMap);
					break;
				}

				case FieldTypeEnum.Pointer: {
					const value = field.value as PointerField;
					const result = `${serializerName}.${value.serializer.name}`;

					constructorFieldHelper.traverseFields(value.serializer.fields, result, map, currentEntityId, decoderMap);
					break;
				}
				case FieldTypeEnum.Array: {
					const value = field.value as ArrayField;
					switch (value.field_enum.type) {
						case FieldTypeEnum.Value: {
							const innerValue = value.field_enum.value as ValueField;
							const result = `${serializerName}.${innerValue.name}`;

							map[currentEntityId.id] = result;
							if (decoderMap) decoderMap[currentEntityId.id] = innerValue.decoder;
							innerValue.prop_id = currentEntityId.id;
							currentEntityId.id++;
							break;
						}
						default:
							break;
					}
					break;
				}
				case FieldTypeEnum.Vector: {
					const inner = getInnerExt(field, 0);

					switch (inner.type) {
						case FieldTypeEnum.Serializer: {
							const value = inner.value as SerializerField;
							for (let idx = 0; idx < value.serializer.fields.length; idx++) {
								const innerField = value.serializer.fields[idx];
								if (!innerField) continue;

								switch (innerField.type) {
									case FieldTypeEnum.Value: {
										const innerFieldValue = innerField.value as ValueField;
										const result = `${serializerName}.${innerFieldValue.name}`;

										map[currentEntityId.id] = result;
										if (decoderMap) decoderMap[currentEntityId.id] = innerFieldValue.decoder;
										innerFieldValue.prop_id = currentEntityId.id;
										currentEntityId.id++;
										break;
									}
									default:
										break;
								}
							}
							constructorFieldHelper.traverseFields(
								value.serializer.fields,
								`${serializerName}.${value.serializer.name}`,
								map,
								currentEntityId,
								decoderMap
							);
							break;
						}
						case FieldTypeEnum.Value: {
							const value = inner.value as ValueField;
							const result = `${serializerName}.${value.name}`;

							map[currentEntityId.id] = result;
							if (decoderMap) decoderMap[currentEntityId.id] = value.decoder;
							value.prop_id = currentEntityId.id;
							currentEntityId.id++;
							break;
						}
						default:
							break;
					}
					break;
				}
				default:
					break;
			}
		}
	},

	createField: (field: ConstructorField, serializers: Record<string, SerializerN>): Field => {
		let elementField: Field | null = null;
		if (field.serializer_name) {
			const serializer = serializers[field.serializer_name];
			if (!serializer) {
				throw 'NO SERIALIZER FOUND';
			}

			if (field.category === FieldCategory.Pointer) {
				elementField = new Field(FieldTypeEnum.Pointer, initPointerField(serializer));
			} else {
				elementField = new Field(FieldTypeEnum.Serializer, { serializer });
			}
		} else {
			elementField = new Field(FieldTypeEnum.Value, {
				decoder: field.decoder,
				prop_id: 0,
				name: field.varName
			});
		}

		if (field.category === FieldCategory.Array) {
			elementField = new Field(FieldTypeEnum.Array, {
				field_enum: elementField,
				length: field.fieldType.count ?? 0
			});
		} else if (field.category === FieldCategory.Vector) {
			elementField = new Field(FieldTypeEnum.Vector, {
				field_enum: elementField,
				decoder: Decoders.UnsignedDecoder
			});
		}

		return elementField;
	}
};

export type ConstructorField = {
	varName: string;
	varType: string;
	serializer_name: string | null;
	encoder: string;
	encodeFlags: number;
	bitcount: number;
	lowValue: number;
	highValue: number;
	fieldType: FieldType;

	decoder: Decoder;
	category: FieldCategory;
	fieldEnumType: Field | null;
};
