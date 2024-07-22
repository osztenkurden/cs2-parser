import fs from 'fs';
import { DemoReader } from "./parser";

const demoPath = "F:/ADR/JUSTY.dem";

const demoReader = new DemoReader();

/*
demoReader.gameEvents.once("player_death", (event) => {
  console.log(`${demoReader.players[event.attacker]?.name} -- [${event.weapon}]  --> ${demoReader.players[event.userid]?.name}`);
  //events.add(eventName);
})*/

//demoReader.gameEvents.on("round_end", console.log)
if(process.argv[2] === "stream"){
  console.log("STREAM");
  demoReader.parseStream(fs.createReadStream(demoPath));
} else {
  console.log("BUFFER");
  demoReader.parseDemo(demoPath);
}

