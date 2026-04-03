import type { CDemoClassInfo, CDemoSendTables } from '../../ts-proto/demo.js';
import { CSVCMsg_FlattenedSerializer, ProtoFlattenedSerializerField_t } from '../../ts-proto/netmessages.js';
import { BitBuffer } from '../ubitreader.js';
import {
	constructorFieldHelper,
	Decoders,
	FieldCategory,
	findFieldType,
	type Class,
	type ConstructorField,
	type Decoder,
	type Field,
	type SerializerN
} from './constructorFields.js';

const generateSerializableField = (
	field: ProtoFlattenedSerializerField_t,
	serializerMessage: CSVCMsg_FlattenedSerializer
) => {
	const name = serializerMessage.symbols.at(field.var_type_sym!)!;

	const serName =
		field.field_serializer_name_sym !== undefined
			? serializerMessage.symbols.at(field.field_serializer_name_sym)!
			: null;
	const encName = field.var_encoder_sym !== undefined ? serializerMessage.symbols.at(field.var_encoder_sym)! : '';
	const varName = serializerMessage.symbols.at(field.var_name_sym!)!;

	const ft = findFieldType(name);
	const varType = name;

	const f: ConstructorField = {
		fieldEnumType: null,
		bitcount: field.bit_count ?? 0,
		varName,
		varType,
		serializer_name: serName,
		encoder: encName,
		encodeFlags: field.encode_flags ?? 0,
		lowValue: field.low_value ?? 0,
		highValue: field.high_value ?? 0,
		fieldType: ft,
		decoder: Decoders.BaseDecoder,
		category: FieldCategory.Value
	};

	f.category = constructorFieldHelper.findCategory(f);
	f.decoder = constructorFieldHelper.findDecoder(f);

	return f;
};

const verifySerializerName = (serializerName: string) => {
	return (
		serializerName.includes('Player') ||
		serializerName.includes('Controller') ||
		serializerName.includes('Team') ||
		serializerName.includes('Weapon') ||
		serializerName.includes('AK') ||
		serializerName.includes('cell') ||
		serializerName.includes('vec') ||
		serializerName.includes('Projectile') ||
		serializerName.includes('Knife') ||
		serializerName.includes('CDEagle') ||
		serializerName.includes('Rules') ||
		serializerName.includes('C4') ||
		serializerName.includes('Grenade') ||
		serializerName.includes('Flash') ||
		serializerName.includes('Molo') ||
		serializerName.includes('Inc') ||
		serializerName.includes('Infer')
	);
};

export const parseClassInfo = (sendTables: CDemoSendTables, cDemoClassInfo: CDemoClassInfo) => {
	if (!sendTables.data) {
		throw 'NO SEND TABLES';
	}

	const reader = new BitBuffer(sendTables.data!);

	const size = reader.ReadUVarInt32();

	const msg = Buffer.allocUnsafe(size);
	reader.readBytes(msg);

	(sendTables as any) = null;

	const serializerMessage = CSVCMsg_FlattenedSerializer.decode(msg);

	const fields: ConstructorField[] = [];

	for (const field of serializerMessage.fields) {
		fields.push(generateSerializableField(field, serializerMessage));
	}

	const map: Record<string, SerializerN> = {};

	const propIdToName: Record<number, string> = {};
	const propIdToDecoder: Record<number, Decoder> = {};

	const classById: Class[] = [];

	const currentEntityId = { id: 1000 };

	for (const serializer of serializerMessage.serializers) {
		const serializerName = serializerMessage.symbols[serializer.serializer_name_sym!]!;

		const fieldsForThisSerializer = [] as Field[];

		for (let i = 0; i < serializer.fields_index.length; i++) {
			const fieldIndex = serializer.fields_index[i]!;

			const field = fields[fieldIndex];
			if (!field) continue;

			if (field.fieldEnumType === null) {
				field.fieldEnumType = constructorFieldHelper.createField(field, map);
			}

			const fieldType = field.fieldEnumType;

			if (fieldType !== null) {
				fieldsForThisSerializer[i] = fieldType.clone();
			}
		}

		const serializerValue: SerializerN = {
			name: serializerName,
			fields: fieldsForThisSerializer
		};
		if (verifySerializerName(serializerName)) {
			constructorFieldHelper.traverseFields(
				fieldsForThisSerializer,
				serializerName,
				propIdToName,
				currentEntityId,
				propIdToDecoder
			);
		}

		map[serializerName] = serializerValue;
	}

	for (const classT of cDemoClassInfo.classes) {
		const clsId = classT.class_id;
		const networkname = classT.network_name!;

		const serializer = map[networkname];
		if (serializer) {
			if (clsId === undefined) {
				continue;
			}

			classById[clsId] = {
				class_id: clsId!,
				name: networkname,
				serializer
			};
		}
	}

	return {
		classes: classById,
		propIdToName,
		propIdToDecoder
	};
};

export type ClassInfo = ReturnType<typeof parseClassInfo>;
