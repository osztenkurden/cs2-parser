# cs2parser

A fast, typed CS2 demo parser for Node.js and Bun.

Parses `.dem` files from Counter-Strike 2, providing typed access to entities, players, game events, and more.

## Install

```bash
npm install cs2parser
```

## Quick Start

```ts
import { createReadStream } from 'fs';
import { DemoReader, EntityMode } from 'cs2parser';

const parser = new DemoReader();

parser.gameEvents.on('player_death', event => {
  const attacker = event.attackerPlayer;
  const victim = event.player;
  if (attacker && victim) {
    console.log(`${attacker.name} killed ${victim.name} with ${event.weapon}`);
  }
});

parser.on('end', () => {
  for (const player of parser.playerControllers) {
    console.log(player.name, player.kills, player.deaths, player.position);
  }
});

await parser.parseDemo(createReadStream('path/to/demo.dem'), { entities: EntityMode.ALL });
```

## parseHeader

Static method that reads only the demo file header without parsing the full file. Fast and low-memory.

```ts
const header = DemoReader.parseHeader('path/to/demo.dem');
if (header) {
  console.log(header.map_name);       // e.g. "de_dust2"
  console.log(header.server_name);    // server name
  console.log(header.build_num);      // CS2 build number
  console.log(header.patch_version);  // patch version
  console.log(header.game);           // undefined on premier
}
```

Returns `null` if the file header cannot be read. Only reads the first 4 KB of the file.

## parseDemo

A single method with overloads for all input types. File paths stream by default.

```ts
// File path (streams by default )
await parser.parseDemo('demo.dem', { entities: EntityMode.ALL });

// File path sync (loads chunks consecutively into memory)
parser.parseDemo('demo.dem', { entities: EntityMode.ALL, stream: false });

// Readable stream
await parser.parseDemo(createReadStream('demo.dem'), { entities: EntityMode.ALL });

// Pre-loaded buffer (big memory usage)
parser.parseDemo(buffer, { entities: EntityMode.ALL });
```

### Entity Modes

| Mode | Entities | Round events | Speed |
| --- | --- | --- | --- |
| `EntityMode.NONE` | none | no | fastest |
| `EntityMode.ONLY_GAME_RULES` | game rules only | yes | ~20% faster than ALL |
| `EntityMode.ALL` | all | yes | full parsing |

`ONLY_GAME_RULES` parses the entity bitstream but only stores `CCSGameRulesProxy` properties. This enables synthetic `round_start`/`round_end` events without populating the full entities array.

| Input | Returns | Memory |
| --- | --- | --- |
| `string` path | `Promise<void>` | low |
| `string` path + `stream: false` | `Promise<void>` | low |
| `Readable` stream | `Promise<void>` | low |
| `Buffer` | `Promise<void>` | high |

### Parse Settings

Additional options can be passed to `parseDemo` to enable extra data:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `messages` | `boolean` | `false` | Emit `svc_UserMessage` events |
| `commands` | `boolean` | `false` | Emit `usercommand` events (decoded `CSGOUserCmdPB`) |

```ts
await parser.parseDemo('demo.dem', { entities: EntityMode.ALL, commands: true, messages: true });
```

## Players

`parser.players` returns `CMsgPlayerInfo[]` from the userinfo string table. Available even with `EntityMode.NONE` — useful when you only need names and Steam IDs.

```ts
parser.parseDemo('demo.dem'); // EntityMode.NONE by default

for (const player of parser.players) {
  console.log(player.name, player.steamid);
}
```

`parser.playerControllers` returns `Player[]` helper objects backed by entity data. Requires `EntityMode.ALL`.

```ts
await parser.parseDemo(createReadStream('demo.dem'), { entities: EntityMode.ALL });

for (const player of parser.playerControllers) {
  console.log(player.name, player.steamId, player.teamNumber);
  console.log('  k/d/a:', player.kills, player.deaths, player.assists);
  console.log('  money:', player.money, 'mvps:', player.mvps);
  console.log('  alive:', player.isAlive, 'health:', player.health, 'armor:', player.armor);
  console.log('  position:', player.position);
}
```

### Player Helper

The `Player` class wraps a `CCSPlayerController` entity. It links to the player's pawn entity for position, health, and combat state.

| Property | Type | Source |
| --- | --- | --- |
| `name` | `string` | Controller |
| `steamId` | `string` | Controller |
| `teamNumber` | `number` | Controller |
| `isAlive` | `boolean` | Controller |
| `money` | `number` | Controller |
| `kills` / `deaths` / `assists` | `number` | Controller (match totals) |
| `round_kills` / `round_deaths` / `round_damage` | `number` | Controller (current round) |
| `mvps` / `score` / `ping` | `number` | Controller |
| `health` / `armor` | `number` | Pawn |
| `position` | `Vector \| null` | Pawn (cell-based) |
| `eyeAngles` | `{pitch, yaw}` | Pawn |
| `hasDefuser` / `hasHelmet` / `isScoped` | `boolean` | Pawn |
| `pawn` | `PlayerPawn \| null` | Linked pawn entity |
| `team` | `Team \| null` | Linked team entity |

### PlayerPawn Helper

`parser.getPawn(entityId)` returns a `PlayerPawn` helper for a `CCSPlayerPawn` entity. The `controller` property navigates back to the owning `Player`.

| Property | Type |
| --- | --- |
| `health` / `armor` | `number` |
| `position` | `Vector \| null` |
| `eyeAngles` | `{pitch, yaw}` |
| `hasDefuser` / `hasHelmet` / `isScoped` | `boolean` |
| `controller` | `Player \| undefined` |

## Teams

```ts
for (const team of parser.teams) {
  console.log(team.teamName, team.clanName, team.score);
  console.log('  members:', team.members.map(p => p.name));
}
```

| Property | Type |
| --- | --- |
| `teamNumber` | `TeamNumber` (0=Unassigned, 1=Spectator, 2=T, 3=CT) |
| `teamName` | `string` |
| `clanName` | `string` |
| `score` / `scoreFirstHalf` / `scoreSecondHalf` | `number` |
| `members` | `Player[]` |

## Game Rules

```ts
const rules = parser.gameRules;
if (rules) {
  console.log(rules.roundsPlayed, rules.phase, rules.isWarmup);
}
```

| Property | Type |
| --- | --- |
| `isWarmup` / `isFreezePeriod` / `isGamePaused` | `boolean` |
| `roundsPlayed` | `number` |
| `phase` | `"first" \| "second" \| "halftime" \| "postgame"` |

## Game Events

Events are emitted at the end of each tick. Player references are auto-resolved.

```ts
parser.gameEvents.on('player_death', event => {
  event.player;          // Player | null (victim)
  event.attackerPlayer;  // Player | null
  event.assisterPlayer;  // Player | null
  event.weapon;          // string
  event.headshot;        // boolean
});

parser.gameEvents.on('round_end', event => {
  event.winner; // team number
  event.reason;
});

parser.gameEvents.on('bomb_planted', event => { ... });
parser.gameEvents.on('bomb_defused', event => { ... });
```

## Typed Entity Access

All entity classes have generated TypeScript interfaces. Use `getEntity` or `findEntities` for type-safe property access:

```ts
import { isEntityClass } from 'cs2parser';

// Get typed properties for a specific entity
const props = parser.getEntity(88, 'CCSPlayerPawn');
props?.['CCSPlayerPawn.m_iHealth'];    // number | undefined
props?.['CCSPlayerPawn.m_ArmorValue']; // number | undefined

// Find all entities of a class
const weapons = parser.findEntities('CAK47');
for (const { entityId, properties } of weapons) {
  console.log(entityId, properties['CAK47.m_iClip1']);
}

// Type guard for narrowing
const entity = parser.entities[306];
if (isEntityClass(entity, 'CCSGameRulesProxy')) {
  entity.properties['CCSGameRulesProxy.CCSGameRules.m_bWarmupPeriod']; // typed
}
```

## Events

```ts
parser.on('tickstart', tick => { });
parser.on('tickend', tick => { });
parser.on('header', header => { });
parser.on('end', ({ incomplete, error }) => { });
parser.on('progress', fraction => { });
parser.on('svc_ServerInfo', info => { });
parser.on('svc_UserMessage', msg => { });  // requires { messages: true }
parser.on('usercommand', cmd => { });      // requires { commands: true }
```

## Type Generation

Generate entity type interfaces from a demo file:

```bash
bun scripts/generate-entity-types.ts --demo path/to/demo.dem
bun scripts/generate-entity-types.ts --snapshot  # reuse saved snapshot
```

## Proto Generation

Fetch proto definitions from [SteamTracking/GameTracking-CS2](https://github.com/SteamTracking/GameTracking-CS2) and generate TypeScript bindings:

```bash
bun scripts/generate-protos.ts
```

## Performance

CPU: Apple M1

Demo: `demo.dem` (318 MB, 136,812 ticks)

## Entity Mode Comparison

| Mode | Throughput | Time | RSS | Heap | Entities |
| --- | --- | --- | --- | --- | --- |
| `EntityMode.NONE` | 527.8 MB/s | 0.6s | 133MB | 30MB | 0 |
| `EntityMode.ONLY_GAME_RULES` | 138.9 MB/s | 2.3s | 175MB | 32MB | 1 |
| `EntityMode.ALL` | 120.8 MB/s | 2.6s | 177MB | 32MB | 248 |

`ONLY_GAME_RULES` parses entities but only stores game rules — enables synthetic `round_start`/`round_end` events without full entity tracking overhead.

## Parse Method Comparison (EntityMode.ALL)

| Method | Throughput | Time | RSS | Heap |
| --- | --- | --- | --- | --- |
| `parseDemo(path)` | 119.2 MB/s | 2.7s | 144MB | 37MB |
| `parseDemo(path, {stream: false})` | 122.1 MB/s | 2.6s | 150MB | 38MB |
| `parseDemo(buffer)` | 119.2 MB/s | 2.7s | 488MB | 702MB |
| `parseDemo(stream)` | 122.8 MB/s | 2.6s | 137MB | 15MB |

## Acknowledgements

Creating this library wouldn't be possible without awesome work of:
 - [LaihoE](https://github.com/LaihoE), creator of [demoparser](https://github.com/LaihoE/demoparser)
 - [Saul](https://github.com/saul), creator of [demofile-net](https://github.com/saul/demofile-net)
 - [markus-wa](https://github.com/markus-wa), creator of [demoinfocs-golang](https://github.com/markus-wa/demoinfocs-golang)

Huge thanks to all of them, as they all have helped me in some way or the other during the past few years.