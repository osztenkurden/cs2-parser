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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'generated');
const SNAPSHOT_PATH = path.join(OUTPUT_DIR, 'serializerSnapshot.json');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'entityTypes.ts');

// Decoder ID → TypeScript type mapping (matches constructorFields.ts numeric decoder IDs)
const DECODER_TS_TYPES: Record<string, string> = {
	BooleanDecoder: 'boolean',
	ComponentDecoder: 'boolean',
	StringDecoder: 'string',
	SignedDecoder: 'number',
	UnsignedDecoder: 'number',
	NoscaleDecoder: 'number',
	QuantalizedFloatDecoder: 'number',
	FloatCoordDecoder: 'number',
	FloatSimulationTimeDecoder: 'number',
	CentityHandleDecoder: 'number',
	AmmoDecoder: 'number',
	GameModeRulesDecoder: 'number',
	BaseDecoder: 'number',
	Unsigned64Decoder: 'bigint',
	Fixed64Decoder: 'bigint',
	VectorNoscaleDecoder: '[number, number, number]',
	VectorNormalDecoder: '[number, number, number]',
	VectorFloatCoordDecoder: '[number, number, number]',
	Qangle3Decoder: '[number, number, number]',
	QangleVarDecoder: '[number, number, number]',
	QanglePitchYawDecoder: '[number, number, number]',
	QanglePresDecoder: '[number, number, number]'
};

type FieldEntry = { propName: string; tsType: string };
type SerializerData = { name: string; fields: FieldEntry[] };

function collectFromDemo(demoPath: string): Map<string, SerializerData> {
	const parser = new DemoReader();
	const entityMap = new Map<string, SerializerData>();

	parser.parseDemo(demoPath, { entities: true });

	// propIdToName gives us: propId → "ClassName.SubSerializer.fieldName"
	// We group by top-level class name
	for (const [propId, fullPath] of Object.entries(parser.propIdToName)) {
		const dotIdx = fullPath.indexOf('.');
		if (dotIdx === -1) continue;
		const className = fullPath.substring(0, dotIdx);

		if (!entityMap.has(className)) {
			entityMap.set(className, { name: className, fields: [] });
		}

		// Find the entity with this className to determine the decoder type
		// We can't directly get the decoder from propIdToName, so use a default
		entityMap.get(className)!.fields.push({
			propName: fullPath,
			tsType: 'unknown' // Will be refined below
		});
	}

	// Now refine types by inspecting actual entity property values
	for (const [, entity] of parser.entities.entries()) {
		if (!entity) continue;
		const className = entity.className;
		const serializer = entityMap.get(className);
		if (!serializer) continue;

		for (const field of serializer.fields) {
			if (field.tsType !== 'unknown') continue;
			const value = entity.properties[field.propName];
			if (value === undefined) continue;
			field.tsType = inferTypeFromValue(value);
		}
	}

	// Any remaining 'unknown' fields get 'unknown'
	return entityMap;
}

function inferTypeFromValue(value: any): string {
	if (typeof value === 'boolean') return 'boolean';
	if (typeof value === 'number') return 'number';
	if (typeof value === 'string') return 'string';
	if (typeof value === 'bigint') return 'bigint';
	if (Array.isArray(value)) {
		if (value.length === 3 && typeof value[0] === 'number') return '[number, number, number]';
		return 'unknown[]';
	}
	return 'unknown';
}

function saveSnapshot(entityMap: Map<string, SerializerData>) {
	const data: Record<string, SerializerData> = {};
	for (const [key, val] of entityMap) {
		data[key] = val;
	}
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(data, null, 2));
	console.log(`Saved snapshot: ${SNAPSHOT_PATH} (${Object.keys(data).length} serializers)`);
}

function loadSnapshot(): Map<string, SerializerData> {
	const data = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf-8')) as Record<string, SerializerData>;
	return new Map(Object.entries(data));
}

function generateTypeScript(entityMap: Map<string, SerializerData>, demoName: string): string {
	const lines: string[] = [];
	lines.push('// AUTO-GENERATED - DO NOT EDIT');
	lines.push(`// Generated from demo: ${demoName} on ${new Date().toISOString().split('T')[0]}`);
	lines.push('');

	// Sort serializers by name
	const sorted = [...entityMap.entries()].sort((a, b) => a[0].localeCompare(b[0]));

	for (const [className, serializer] of sorted) {
		const interfaceName = `I${className}`;
		lines.push(`export interface ${interfaceName} {`);

		// Deduplicate and sort fields
		const seen = new Set<string>();
		const uniqueFields = serializer.fields.filter(f => {
			if (seen.has(f.propName)) return false;
			seen.add(f.propName);
			return true;
		}).sort((a, b) => a.propName.localeCompare(b.propName));

		for (const field of uniqueFields) {
			lines.push(`\treadonly "${field.propName}"?: ${field.tsType};`);
		}
		lines.push('}');
		lines.push('');
	}

	// Generate EntityTypeMap
	lines.push('/** Maps entity className to its typed properties interface */');
	lines.push('export interface EntityTypeMap {');
	for (const [className] of sorted) {
		lines.push(`\t${className}: I${className};`);
	}
	lines.push('}');
	lines.push('');

	// Base entity type (used at runtime, compatible with all entity classes)
	lines.push('/** Base entity shape used at runtime */');
	lines.push('export interface BaseEntity {');
	lines.push('\tclassName: string;');
	lines.push('\tclassId: number;');
	lines.push('\tentityType: number;');
	lines.push('\tproperties: Record<string, unknown>;');
	lines.push('}');
	lines.push('');

	// Generate discriminated union type
	lines.push('/** Discriminated union of all known entity types */');
	lines.push('export type TypedEntity =');
	for (const [className] of sorted) {
		lines.push(`\t| { className: "${className}"; classId: number; entityType: number; properties: Partial<I${className}> }`);
	}
	lines.push('\t| BaseEntity;');
	lines.push('');

	// Known class names
	lines.push('/** All known entity class names */');
	lines.push('export type KnownClassName = keyof EntityTypeMap;');
	lines.push('');

	// Helper type for getting entity by class
	lines.push('/** Get typed properties for a known entity class name */');
	lines.push('export type EntityProperties<T extends keyof EntityTypeMap> = Partial<EntityTypeMap[T]>;');
	lines.push('');

	// Typed entity accessor helper
	lines.push('/** Narrow a BaseEntity to a specific typed entity */');
	lines.push('export function isEntityClass<T extends KnownClassName>(');
	lines.push('\tentity: BaseEntity | undefined,');
	lines.push('\tclassName: T');
	lines.push('): entity is { className: T; classId: number; entityType: number; properties: Partial<EntityTypeMap[T]> } {');
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
	const entityMap = collectFromDemo(demoPath);
	saveSnapshot(entityMap);

	const output = generateTypeScript(entityMap, path.basename(demoPath));
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	fs.writeFileSync(OUTPUT_PATH, output);
	console.log(`Generated: ${OUTPUT_PATH} (${entityMap.size} interfaces)`);
} else if (useSnapshot) {
	if (!fs.existsSync(SNAPSHOT_PATH)) {
		console.error('No snapshot found. Run with --demo <path> first.');
		process.exit(1);
	}
	console.log('Loading snapshot...');
	const entityMap = loadSnapshot();
	const output = generateTypeScript(entityMap, 'snapshot');
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	fs.writeFileSync(OUTPUT_PATH, output);
	console.log(`Generated: ${OUTPUT_PATH} (${entityMap.size} interfaces)`);
} else {
	console.error('Usage:');
	console.error('  bun scripts/generate-entity-types.ts --demo <path-to-demo>');
	console.error('  bun scripts/generate-entity-types.ts --snapshot');
	process.exit(1);
}
