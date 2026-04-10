/**
 * Game Event Type Generator
 * Parses a CS2 demo file, extracts game event descriptors, and generates
 * TypeScript interfaces for all known game events.
 *
 * Usage:
 *   bun scripts/generate-event-types.ts [path-to-demo.dem]
 *
 * Output:
 *   src/parser/descriptors/eventTypes.ts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DemoReader } from '../src/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUTPUT_PATH = path.join(ROOT, 'src', 'parser', 'descriptors', 'eventTypes.ts');

const demoPath = process.argv[2];
if (!demoPath) {
	console.error('Usage: bun scripts/generate-event-types.ts <path-to-demo.dem>');
	process.exit(1);
}

const numberToType: Record<number, string> = {
	1: 'string',
	2: 'number',
	3: 'number',
	4: 'number',
	5: 'number',
	6: 'boolean',
	7: 'number',
	8: 'number',
	9: 'number'
};

const overwrites: Record<string, Record<string, string>> = {
	round_end: {
		reason: 'WinRoundReason'
	}
};

function eventNameToInterfaceName(name: string): string {
	const camelCased = name.replace(/(^\w|_\w)/g, g => g.toUpperCase().replace('_', ''));
	return `IEvent${camelCased}`;
}

const reader = new DemoReader();

let listOfEvents = '';
let interfaceContent = '';

reader.on('gameeventlist', () => {
	for (const descriptor of Object.values(reader.gameEvents._eventDescriptors)) {
		if (!descriptor.name) continue;

		let content = '';
		for (let i = 0; i < descriptor.keys.length; i++) {
			const desc = descriptor.keys[i]!;
			const valueType = overwrites[descriptor.name]?.[desc.name!] ?? numberToType[desc.type as number];
			content += `\t${desc.name!}: ${valueType};\n`;

			if (desc.name === 'userid' && descriptor.name !== 'player_connect') {
				content += `\tplayer?: Player | null;\n`;
			}
			if (desc.name === 'attacker') {
				content += `\tattackerPlayer?: Player | null;\n`;
			}
			if (desc.name === 'assister') {
				content += `\tassisterPlayer?: Player | null;\n`;
			}
		}

		interfaceContent += `\t${descriptor.name}: [${eventNameToInterfaceName(descriptor.name)}];\n`;
		listOfEvents += `export interface ${eventNameToInterfaceName(descriptor.name)} {\n${content.trimEnd()}\n}\n\n`;
	}
});

await reader.parseDemo(demoPath);

const tsEventFile = `import type { Player } from '../../helpers/player.js';
import type { WinRoundReason } from '../../helpers/gameRules.js';

${listOfEvents};

export interface _GameEventsArguments {
${interfaceContent}
}

export type EventWithName = {
	[K in keyof _GameEventsArguments]: _GameEventsArguments[K][0] & { event_name: K };
};

export interface GameEventsArguments extends _GameEventsArguments {
	gameEvent: [keyof _GameEventsArguments, EventWithName[keyof _GameEventsArguments]];
}
`;

fs.writeFileSync(OUTPUT_PATH, tsEventFile);
console.log(`Generated event types at ${path.relative(ROOT, OUTPUT_PATH)}`);
