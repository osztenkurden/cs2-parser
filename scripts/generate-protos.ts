/**
 * Proto Generation Pipeline
 * Fetches .proto files from SteamTracking/GameTracking-CS2 and generates TypeScript bindings.
 *
 * Usage:
 *   bun scripts/generate-protos.ts [--fetch-only] [--generate-only]
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PROTO_DIR = path.join(ROOT, 'src', 'proto');
const TS_PROTO_DIR = path.join(ROOT, 'src', 'ts-proto');
const GITHUB_API_URL = 'https://api.github.com/repos/SteamTracking/GameTracking-CS2/contents/Protobufs';
const RAW_BASE_URL = 'https://raw.githubusercontent.com/SteamTracking/GameTracking-CS2/master/Protobufs';

const args = process.argv.slice(2);
const fetchOnly = args.includes('--fetch-only');
const generateOnly = args.includes('--generate-only');

interface GitHubFileEntry {
	name: string;
	download_url: string;
	type: string;
}

async function fetchProtoList(): Promise<GitHubFileEntry[]> {
	console.log('Fetching proto file list from GitHub...');
	const response = await fetch(GITHUB_API_URL, {
		headers: { 'User-Agent': 'cs2parser-proto-gen' }
	});

	if (!response.ok) {
		// Try following redirect
		const body = (await response.json()) as { url?: string };
		if (body.url) {
			const redirect = await fetch(body.url, {
				headers: { 'User-Agent': 'cs2parser-proto-gen' }
			});
			if (!redirect.ok) throw new Error(`GitHub API error: ${redirect.status}`);
			return (await redirect.json()) as GitHubFileEntry[];
		}
		throw new Error(`GitHub API error: ${response.status}`);
	}

	return (await response.json()) as GitHubFileEntry[];
}

async function downloadProtos() {
	const files = await fetchProtoList();
	const protoFiles = files.filter(f => f.name.endsWith('.proto'));
	console.log(`Found ${protoFiles.length} proto files`);

	fs.mkdirSync(PROTO_DIR, { recursive: true });

	let downloaded = 0;
	for (const file of protoFiles) {
		const url = `${RAW_BASE_URL}/${file.name}`;
		const outPath = path.join(PROTO_DIR, file.name);

		const response = await fetch(url);
		if (!response.ok) {
			console.warn(`  Failed to download ${file.name}: ${response.status}`);
			continue;
		}
		const content = await response.text();
		fs.writeFileSync(outPath, content);
		downloaded++;
	}

	console.log(`Downloaded ${downloaded}/${protoFiles.length} proto files to ${PROTO_DIR}`);

	// Ensure google/protobuf/descriptor.proto exists
	const googleDir = path.join(PROTO_DIR, 'google', 'protobuf');
	if (!fs.existsSync(path.join(googleDir, 'descriptor.proto'))) {
		console.log('Downloading google/protobuf/descriptor.proto...');
		fs.mkdirSync(googleDir, { recursive: true });
		const descriptorUrl =
			'https://raw.githubusercontent.com/protocolbuffers/protobuf/main/src/google/protobuf/descriptor.proto';
		const resp = await fetch(descriptorUrl);
		if (resp.ok) {
			fs.writeFileSync(path.join(googleDir, 'descriptor.proto'), await resp.text());
			console.log('  Downloaded descriptor.proto');
		} else {
			console.warn('  Failed to download descriptor.proto - generation may fail for some files');
		}
	}
}

function generateTsProto() {
	fs.mkdirSync(TS_PROTO_DIR, { recursive: true });

	const protoFiles = fs.readdirSync(PROTO_DIR).filter(f => f.endsWith('.proto'));
	console.log(`Generating TypeScript for ${protoFiles.length} proto files...`);

	const tsProtoOpts = [
		'esModuleInterop=true',
		'importSuffix=.js',
		'noDefaultsForOptionals=true',
		'forceLong=string',
		'snakeToCamel=false',
		'enumsAsLiterals=true'
	]
		.map(opt => `--ts_proto_opt=${opt}`)
		.join(' ');

	const isWindows = process.platform === 'win32';
	const pluginPath = isWindows
		? path.join(ROOT, 'node_modules', '.bin', 'protoc-gen-ts_proto.cmd')
		: path.join(ROOT, 'node_modules', '.bin', 'protoc-gen-ts_proto');

	let succeeded = 0;
	let failed = 0;
	for (const file of protoFiles) {
		try {
			const cmd = `cd "${PROTO_DIR}" && protoc --plugin=protoc-gen-ts_proto="${pluginPath}" ${tsProtoOpts} --ts_proto_out="${TS_PROTO_DIR}" ./${file}`;
			execSync(cmd, { stdio: 'pipe' });
			succeeded++;
		} catch (e: any) {
			console.warn(`  Failed: ${file} - ${e.stderr?.toString().trim() || e.message}`);
			failed++;
		}
	}

	console.log(`Generated ${succeeded} TypeScript files (${failed} failed) in ${TS_PROTO_DIR}`);
}

async function main() {
	if (!generateOnly) {
		await downloadProtos();
	}
	if (fetchOnly) return;

	generateTsProto();
	console.log('Done!');
}

main().catch(e => {
	console.error(e);
	process.exit(1);
});
