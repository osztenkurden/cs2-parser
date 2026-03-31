import type { CSVCMsg_CreateStringTable, CSVCMsg_UpdateStringTable } from '../ts-proto/netmessages.js';
import { CMsgPlayerInfo } from '../ts-proto/networkbasetypes.js';
import { BitBuffer } from './ubitreader.js';
import snappy from 'snappy';

export const parseStringTable = (
	data: Buffer,
	name: string,
	numEntries: number,
	udf: boolean,
	userDataSize: number,
	flags: number,
	varintBitCount: boolean,
	baselines: Uint8Array[]
) => {
	const bitreader = new BitBuffer(data);
	const players: CMsgPlayerInfo[] = [];
	let idx = -1;
	const keys: string[] = [];
	const items: { idx: number; key: string; value: any }[] = [];
	for (let i = 0; i < numEntries; i++) {
		let key = '';
		let value: Buffer | null = null;

		idx += 1;
		if (!bitreader.readBoolean()) {
			idx += bitreader.ReadUVarInt32() + 1;
		}

		/*
		  if (bitreader.readBoolean()) {
			idx++;
		  } else {
			idx += bitreader.readUbitVar() + 1;
		  }*/

		if (bitreader.readBoolean()) {
			if (bitreader.readBoolean()) {
				const position = bitreader.ReadUBits(5);
				const length = bitreader.ReadUBits(5);

				if (position >= keys.length) {
					key += bitreader.readString();
				} else {
					const someKey = keys[position];

					if (length > (someKey?.length ?? 0)) {
						key += someKey + bitreader.readString();
					} else {
						key += someKey?.substring(0, length) + bitreader.readString();
					}
				}
			} else {
				key += bitreader.readString();
			}

			if (keys.length >= 32) {
				keys.shift();
			}

			keys.push(key);

			if (bitreader.readBoolean()) {
				let bits = 0;
				let isCompressed = false;

				if (udf) {
					bits = userDataSize;
				} else {
					if ((flags & 0x1) !== 0) {
						isCompressed = bitreader.readBoolean();
					}
					if (varintBitCount) {
						bits = bitreader.readUbitVar() * 8;
					} else {
						bits = bitreader.ReadUBits(17) * 8;
					}
				}

				value = Buffer.allocUnsafe(bits % 8 === 0 ? bits / 8 : 0);

				bitreader.readBytes(value);

				if (isCompressed && value?.length) {
					value = snappy.uncompressSync(value) as Buffer;
				}
			} else {
			}

			if (name === 'userinfo' && value?.length) {
				const data = CMsgPlayerInfo.decode(value!);
				//players[data.userid! & 0xff] = data;
				players.push(data);
			}

			if (name === 'instancebaseline' && value?.length) {
				//this.baselines[key] = CMsgBasel;

				if (key.includes(':')) {
					// SHIT
				} else {
					const intKey = parseInt(key);

					if (value) {
						baselines[intKey] = value;
					}
				}
			}

			items.push({ idx, key, value });
		}
	}

	return {
		table: {
			data: items,
			name,
			user_data_size: userDataSize,
			user_data_fixed_size: udf,
			flags,
			using_varint_bitcounts: varintBitCount
		},
		players
	};
};

export type StringTableObject = ReturnType<typeof parseStringTable>;

export const createStringTable = (
	createTableMessage: CSVCMsg_CreateStringTable | undefined,
	baselines: Uint8Array[]
) => {
	if (
		!createTableMessage ||
		(createTableMessage.name !== 'instancebaseline' && createTableMessage.name !== 'userinfo')
	)
		return undefined;

	const data = createTableMessage.data_compressed
		? (snappy.uncompressSync(Buffer.from(createTableMessage.string_data!)) as Buffer)
		: Buffer.from(createTableMessage.string_data!);
	return parseStringTable(
		data,
		createTableMessage.name,
		createTableMessage.num_entries!,
		createTableMessage.user_data_fixed_size!,
		createTableMessage.user_data_size!,
		createTableMessage.flags!,
		createTableMessage.using_varint_bitcounts!,
		baselines
	);
};

// TODO Readd update string table

export const updateStringTable = (
	updateTableMessage: CSVCMsg_UpdateStringTable,
	savedTables: StringTableObject['table'][],
	baselines: Uint8Array[]
) => {
	const existing = savedTables[updateTableMessage.table_id!];

	if (!existing) {
		return null;
	}
	const updated = parseStringTable(
		Buffer.from(updateTableMessage.string_data!),
		existing.name,
		updateTableMessage.num_changed_entries!,
		existing.user_data_fixed_size,
		existing.user_data_size,
		existing.flags,
		existing.using_varint_bitcounts,
		baselines
	);

	return {
		tableId: updateTableMessage.table_id!,
		players: updated.players,
		table: updated.table
	};
};
