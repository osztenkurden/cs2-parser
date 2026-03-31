import { $ } from 'bun';
import path from 'path';
import { Glob } from 'bun';

const glob = new Glob('[0-9][0-9][0-9][0-9][0-9].dem');
const dir = 'C:\\repos\\demofile-net\\demos';
const allx = glob.scanSync(dir);
// const all = [...allx];
const all = ['14140.dem']; //[...allx];
for (const file of all) {
	// console.log('TESTING FILE', file);
	await $`bun tester2.ts ${path.join(dir, file)}`.catch(e => {});
	// process.exit(0);
}
console.log(all);
