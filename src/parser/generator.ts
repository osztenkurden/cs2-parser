import { execSync } from "child_process";
import { DemoReader } from ".";
import fs from 'fs';
import path from 'path';

const demoPath = "F:/ADR/test_demo.dem";

if(process.argv.includes("--proto")){
    const fileNames = fs.readdirSync(path.join(__dirname, "..", "proto"));
    
    const getCommandForFile = (fileName:string) => `cd ../proto && protoc --plugin=protoc-gen-ts_proto=".\\..\\..\\node_modules\\.bin\\protoc-gen-ts_proto.cmd" --ts_proto_opt=forceLong=string --ts_proto_out=./../../src/ts-proto ./${fileName}`
    
    fileNames.forEach(fileName => execSync(getCommandForFile(fileName)))
}

function eventNameToInterfaceName(name: string) {
    const camelCased = name.replace(/(^\w|_\w)/g, g =>
      g.toUpperCase().replace("_", "")
    );
    return `IEvent${camelCased}`;
  }

const reader = new DemoReader();
const alreadyLoadedEvents = new Set<string>();

let listOfEvents = '';
let listOfListeners = '';


reader.on("gameEvent", (eventName: string, data) => {
    if(alreadyLoadedEvents.has(eventName)) return;
    alreadyLoadedEvents.add(eventName);
    listOfEvents += `export interface ${eventNameToInterfaceName(eventName)} {
${Object.entries(data).map(([key, value]) => `\t${key}: ${typeof value}`).join("\n")}
}\n\n`;

listOfListeners += `\t\ton(event: "${eventName}", listener: (event: ${eventNameToInterfaceName(eventName)}) => void): this;\n`
listOfListeners += `\t\tonce(event: "${eventName}", listener: (event: ${eventNameToInterfaceName(eventName)}) => void): this;\n`
})

reader.on("end", () => {
    
let tsEventFile = `
${listOfEvents};
declare module "./gameEvents" {
  export interface GameEvents {
${listOfListeners}
  }
}
`;
    fs.writeFileSync('./parser/eventTypes.ts', tsEventFile);
});

reader.parseStream(fs.createReadStream(demoPath));


/*
const demoReader = new DemoReader();

demoReader.on("gameEvent", (eventName, data) => {
    console.log(eventName, data);
})

demoReader.parseStream(fs.createReadStream(demoPath));*/