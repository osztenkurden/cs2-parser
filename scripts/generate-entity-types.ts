/**
 * Entity Type Generator
 * Parses a CS2 demo file and generates TypeScript interfaces for all entity classes.
 *
 * Usage:
 *   bun scripts/generate-entity-types.ts --demo <path-to-demo>
 *   bun scripts/generate-entity-types.ts --snapshot   (use saved snapshot)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import parsing internals
import { DemoReader } from '../src/parser/index.js';
import { EntityMode } from '../src/parser/workerParser/worker.js';
import type { Decoder } from '../src/parser/workerParser/constructorFields.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'generated');
const SNAPSHOT_PATH = path.join(OUTPUT_DIR, 'serializerSnapshot.json');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'entityTypes.ts');

// Decoder numeric ID → TypeScript type (matches constructorFields.ts D_* constants)
const DECODER_ID_TO_TS: Record<number, string> = {
	0: 'number',                    // D_QUANTALIZED_FLOAT
	1: '[number, number, number]',  // D_VECTOR_NORMAL
	2: '[number, number, number]',  // D_VECTOR_NOSCALE
	3: '[number, number, number]',  // D_VECTOR_FLOAT_COORD
	4: 'bigint',                    // D_UNSIGNED64
	5: 'number',                    // D_CENTITY_HANDLE
	6: 'number',                    // D_NOSCALE
	7: 'boolean',                   // D_BOOLEAN
	8: 'string',                    // D_STRING
	9: 'number',                    // D_SIGNED
	10: 'number',                   // D_UNSIGNED
	11: 'boolean',                  // D_COMPONENT
	12: 'number',                   // D_FLOAT_COORD
	13: 'number',                   // D_FLOAT_SIMULATION_TIME
	14: 'bigint',                   // D_FIXED64
	15: '[number, number, number]', // D_QANGLE_PITCH_YAW
	16: '[number, number, number]', // D_QANGLE3
	17: '[number, number, number]', // D_QANGLE_VAR
	18: 'number',                   // D_BASE
	19: 'number',                   // D_AMMO
	20: '[number, number, number]', // D_QANGLE_PRES
	21: 'number',                   // D_GAME_MODE_RULES
};

function decoderToTsType(decoder: Decoder): string {
	if (typeof decoder === 'object') return 'number'; // QuantalizedFloatDecoder
	return DECODER_ID_TO_TS[decoder] ?? 'unknown';
}

type SnapshotData = {
	// serializerName → { fieldName (without serializer prefix) → tsType }
	serializers: Record<string, Record<string, string>>;
	entities: Record<string, { serializers: string[]; ownFields: Record<string, string> }>;
};

function collectFromDemo(demoPath: string): SnapshotData {
	const parser = new DemoReader();
	parser.parseDemo(demoPath, { entities: EntityMode.ALL, stream: false });

	// Shared serializer map: serializerName → { fieldNameWithoutPrefix → tsType }
	const serializerMap = new Map<string, Map<string, string>>();
	// Per-entity: className → { serializers used, own fields }
	const entityMap = new Map<string, { serializers: Set<string>; ownFields: Map<string, string> }>();

	for (const [propIdStr, fullPath] of Object.entries(parser.propIdToName)) {
		const propId = Number(propIdStr);
		const decoder = parser.propIdToDecoder[propId];
		const tsType = decoder !== undefined ? decoderToTsType(decoder) : 'unknown';

		const dotIdx = fullPath.indexOf('.');
		if (dotIdx === -1) continue;

		const className = fullPath.substring(0, dotIdx);
		const suffix = fullPath.substring(dotIdx + 1);

		if (!entityMap.has(className)) {
			entityMap.set(className, { serializers: new Set(), ownFields: new Map() });
		}
		const entity = entityMap.get(className)!;

		// Determine if this is a serializer field (suffix has a segment starting with uppercase)
		const secondDotIdx = suffix.indexOf('.');
		if (secondDotIdx !== -1) {
			const firstSegment = suffix.substring(0, secondDotIdx);
			if (firstSegment[0]! >= 'A' && firstSegment[0]! <= 'Z') {
				const serializerName = firstSegment;
				entity.serializers.add(serializerName);

				if (!serializerMap.has(serializerName)) {
					serializerMap.set(serializerName, new Map());
				}
				const fields = serializerMap.get(serializerName)!;
				// Strip the serializer name prefix — store just the field part
				const fieldKey = suffix.substring(secondDotIdx + 1);
				if (!fields.has(fieldKey) || fields.get(fieldKey) === 'unknown') {
					fields.set(fieldKey, tsType);
				}
				continue;
			}
		}

		// Own field
		if (!entity.ownFields.has(suffix) || entity.ownFields.get(suffix) === 'unknown') {
			entity.ownFields.set(suffix, tsType);
		}
	}

	// Convert to serializable format
	const result: SnapshotData = { serializers: {}, entities: {} };
	for (const [name, fields] of serializerMap) {
		result.serializers[name] = Object.fromEntries([...fields.entries()].sort((a, b) => a[0].localeCompare(b[0])));
	}
	for (const [className, data] of entityMap) {
		result.entities[className] = {
			serializers: [...data.serializers].sort(),
			ownFields: Object.fromEntries([...data.ownFields.entries()].sort((a, b) => a[0].localeCompare(b[0])))
		};
	}
	return result;
}

function saveSnapshot(data: SnapshotData) {
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(data, null, 2));
	console.log(`Saved snapshot: ${SNAPSHOT_PATH} (${Object.keys(data.entities).length} entities, ${Object.keys(data.serializers).length} serializers)`);
}

function loadSnapshot(): SnapshotData {
	return JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf-8')) as SnapshotData;
}

function generateTypeScript(data: SnapshotData, demoName: string): string {
	const lines: string[] = [];
	lines.push('// AUTO-GENERATED - DO NOT EDIT');
	lines.push(`// Generated from demo: ${demoName} on ${new Date().toISOString().split('T')[0]}`);
	lines.push('');

	// Utility type
	lines.push('/** Prefixes all keys of T with "P." */');
	lines.push('type Prefixed<P extends string, T> = {');
	lines.push('\treadonly [K in keyof T as K extends string ? `${P}.${K}` : never]: T[K];');
	lines.push('};');
	lines.push('');

	// Shared serializer interfaces — field keys WITHOUT serializer prefix
	const sortedSerializers = Object.entries(data.serializers).sort((a, b) => a[0].localeCompare(b[0]));
	for (const [serName, fields] of sortedSerializers) {
		lines.push(`interface _${serName} {`);
		const sortedFields = Object.entries(fields).sort((a, b) => a[0].localeCompare(b[0]));
		for (const [fieldKey, tsType] of sortedFields) {
			lines.push(`\treadonly "${fieldKey}"?: ${tsType};`);
		}
		lines.push('}');
		lines.push('');
	}

	// Sort entities
	const sortedEntities = Object.entries(data.entities).sort((a, b) => a[0].localeCompare(b[0]));

	// Group entities with identical own-field sets to share interfaces
	const ownFieldGroups = new Map<string, string[]>(); // hash → [classNames]
	for (const [className, entityData] of sortedEntities) {
		const hash = JSON.stringify(entityData.ownFields);
		if (!ownFieldGroups.has(hash)) ownFieldGroups.set(hash, []);
		ownFieldGroups.get(hash)!.push(className);
	}

	// For groups with >1 entity, use the first entity's name as the shared interface name
	const classToOwnInterface = new Map<string, string>(); // className → interface name
	const emittedOwnInterfaces = new Set<string>();

	for (const [hash, classNames] of ownFieldGroups) {
		const ownFields = JSON.parse(hash) as Record<string, string>;
		if (Object.keys(ownFields).length === 0) continue;

		if (classNames.length > 1) {
			// Shared own-field interface — name it after first class in group
			const sharedName = `_${classNames[0]}Own`;
			for (const cn of classNames) {
				classToOwnInterface.set(cn, sharedName);
			}
			if (!emittedOwnInterfaces.has(sharedName)) {
				lines.push(`interface ${sharedName} {`);
				const sortedOwn = Object.entries(ownFields).sort((a, b) => a[0].localeCompare(b[0]));
				for (const [fieldName, tsType] of sortedOwn) {
					lines.push(`\treadonly "${fieldName}"?: ${tsType};`);
				}
				lines.push('}');
				lines.push('');
				emittedOwnInterfaces.add(sharedName);
			}
		} else {
			const cn = classNames[0]!;
			const ifaceName = `_${cn}Own`;
			classToOwnInterface.set(cn, ifaceName);
			lines.push(`interface ${ifaceName} {`);
			const sortedOwn = Object.entries(ownFields).sort((a, b) => a[0].localeCompare(b[0]));
			for (const [fieldName, tsType] of sortedOwn) {
				lines.push(`\treadonly "${fieldName}"?: ${tsType};`);
			}
			lines.push('}');
			lines.push('');
		}
	}

	// Entity type aliases — use nested Prefixed for serializers
	for (const [className, entityData] of sortedEntities) {
		const parts: string[] = [];
		for (const ser of entityData.serializers) {
			parts.push(`Prefixed<"${ser}", _${ser}>`);
		}
		const ownIface = classToOwnInterface.get(className);
		if (ownIface) {
			parts.push(ownIface);
		}

		const interfaceName = `I${className}`;
		if (parts.length === 0) {
			lines.push(`export interface ${interfaceName} {}`);
		} else if (parts.length === 1) {
			lines.push(`export type ${interfaceName} = Prefixed<"${className}", ${parts[0]}>;`);
		} else {
			lines.push(`export type ${interfaceName} = Prefixed<"${className}",`);
			lines.push(`\t${parts.join(' &\n\t')}`);
			lines.push('>;');
		}
		lines.push('');
	}

	// EntityTypeMap
	lines.push('/** Maps entity className to its typed properties interface */');
	lines.push('export interface EntityTypeMap {');
	for (const [className] of sortedEntities) {
		lines.push(`\t${className}: I${className};`);
	}
	lines.push('}');
	lines.push('');

	// BaseEntity
	lines.push('/** Base entity shape used at runtime */');
	lines.push('export interface BaseEntity {');
	lines.push('\tclassName: string;');
	lines.push('\tclassId: number;');
	lines.push('\tentityType: number;');
	lines.push('\tproperties: Record<string, unknown>;');
	lines.push('}');
	lines.push('');

	// TypedEntity
	lines.push('type _TypedEntity<K extends keyof EntityTypeMap> = { className: K; classId: number; entityType: number; properties: Partial<EntityTypeMap[K]> };');
	lines.push('');
	lines.push('/** Discriminated union of all known entity types */');
	lines.push('export type TypedEntity = _TypedEntity<keyof EntityTypeMap> | BaseEntity;');
	lines.push('');

	// Helper types
	lines.push('/** All known entity class names */');
	lines.push('export type KnownClassName = keyof EntityTypeMap;');
	lines.push('');
	lines.push('/** Get typed properties for a known entity class name */');
	lines.push('export type EntityProperties<T extends keyof EntityTypeMap> = Partial<EntityTypeMap[T]>;');
	lines.push('');

	// isEntityClass
	lines.push('/** Narrow a BaseEntity to a specific typed entity */');
	lines.push('export function isEntityClass<T extends KnownClassName>(');
	lines.push('\tentity: BaseEntity | undefined,');
	lines.push('\tclassName: T');
	lines.push('): entity is _TypedEntity<T> {');
	lines.push('\treturn entity?.className === className;');
	lines.push('}');
	lines.push('');

	return lines.join('\n');
}

// Main
const args = process.argv.slice(2);
const demoIdx = args.indexOf('--demo');
const useSnapshot = args.includes('--snapshot');

if (demoIdx !== -1 && args[demoIdx + 1]) {
	const demoPath = args[demoIdx + 1]!;
	console.log(`Parsing demo: ${demoPath}...`);
	const data = collectFromDemo(demoPath);
	saveSnapshot(data);

	const output = generateTypeScript(data, path.basename(demoPath));
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	fs.writeFileSync(OUTPUT_PATH, output);
	console.log(`Generated: ${OUTPUT_PATH} (${Object.keys(data.entities).length} entities, ${Object.keys(data.serializers).length} shared serializers)`);
} else if (useSnapshot) {
	if (!fs.existsSync(SNAPSHOT_PATH)) {
		console.error('No snapshot found. Run with --demo <path> first.');
		process.exit(1);
	}
	console.log('Loading snapshot...');
	const data = loadSnapshot();
	const output = generateTypeScript(data, 'snapshot');
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	fs.writeFileSync(OUTPUT_PATH, output);
	console.log(`Generated: ${OUTPUT_PATH} (${Object.keys(data.entities).length} entities, ${Object.keys(data.serializers).length} shared serializers)`);
} else {
	console.error('Usage:');
	console.error('  bun scripts/generate-entity-types.ts --demo <path-to-demo>');
	console.error('  bun scripts/generate-entity-types.ts --snapshot');
	process.exit(1);
}
