import { describe, test, expect } from 'bun:test';
import { DemoReader } from '../../src/index.js';
import fs from 'fs';

const demoPath = process.env.CS2_DEMO_PATH ?? 'tests/fixtures/demo.dem';
const demoAvailable = fs.existsSync(demoPath);

describe.skipIf(!demoAvailable)('parseHeader', () => {
	test('reads demo file header successfully', () => {
		const header = DemoReader.parseHeader(demoPath);
		expect(header).not.toBeNull();
	});

	test('header contains expected fields', () => {
		const header = DemoReader.parseHeader(demoPath);
		expect(header).not.toBeNull();
		if (!header) return;

		// Demo file header should have basic info
		expect(typeof header.demoFileStamp).toBe('string');
		expect(header.demoFileStamp.length).toBeGreaterThan(0);
	});
});
