import { DemoReader } from './src/index.js';

const header = DemoReader.parseHeader('C:\\repos\\demofile-net\\demos\\14140.dem');

console.log(header?.server_start_tick);
