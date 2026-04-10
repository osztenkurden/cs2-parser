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

## parseServerInfo

Static method that reads server info from the first few packets without parsing the full demo. Fast and low-memory.

```ts
const info = DemoReader.parseServerInfo('path/to/demo.dem');
if (info) {
  console.log(info.map_name);      // e.g. "de_dust2"
  console.log(info.server_name);   // server name
  console.log(info.max_clients);   // max player slots
  console.log(info.game_dir);      // e.g. "csgo"
}
```

Returns `null` if server info cannot be found. Only reads the first 16 KB of the file.

## parseDemo

A single method with overloads for all input types. File paths stream by default.

```ts
// File path (streams by default )
await parser.parseDemo('demo.dem', { entities: EntityMode.ALL });

// File path sync (loads chunks consecutively into memory)
await parser.parseDemo('demo.dem', { entities: EntityMode.ALL, stream: false });

// Readable stream
await parser.parseDemo(createReadStream('demo.dem'), { entities: EntityMode.ALL });

// Pre-loaded buffer (big memory usage)
await parser.parseDemo(buffer, { entities: EntityMode.ALL });
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

## Reader State

`DemoReader` exposes a handful of live properties that update during parsing. They're useful inside game-event handlers or low-level listeners.

| Member | Type | Description |
| --- | --- | --- |
| `header` | `CDemoFileHeader \| null` | Populated after the first `'header'` event |
| `entities` | `TypedEntity[]` | Sparse array indexed by entity ID. `undefined` slots mean the entity was deleted or never existed |
| `currentTick` | `number` | Tick currently being processed (`-1` before the first frame) |
| `currentTime` | `number` | `currentTick * tickInterval` — requires `'serverinfo'` to have arrived |
| `gameEvents` | `GameEvents` | Typed emitter for in-game events (see [Game Events](#game-events)) |
| `players` | `CMsgPlayerInfo[]` | Userinfo rows from the string table, sparse-indexed by `userid & 0xff` |
| `playerControllers` | `Player[]` | All live `CCSPlayerController` entities wrapped as `Player` (requires `EntityMode.ALL`) |
| `teams` | `Team[]` | All live `CCSTeam` entities (requires `EntityMode.ALL`) |
| `gameRules` | `GameRules \| null` | Wrapper around the current `CCSGameRulesProxy` entity |

### Cancelling a parse

```ts
const parser = new DemoReader();

parser.on('tickend', () => {
  if (parser.currentTick >= 1000) parser.cancel();
});

await parser.parseDemo('demo.dem', { entities: EntityMode.ALL });
```

`cancel()` aborts an in-flight parse. It destroys the underlying stream (if any), emits a `'cancel'` event, and then an `'end'` event with `{ incomplete: true }`. Calling `cancel()` or `parseDemo()` on a reader that has already ended throws.

## Players

### Basic player info — `parser.players`

`parser.players` returns `CMsgPlayerInfo[]` from the userinfo string table. This is the fastest way to get the roster of a demo: names and Steam IDs are available without parsing entities, so it works even with the default `EntityMode.NONE`.

The array is **sparse** — each entry lives at index `player.userid & 0xff`, so empty slots read as `undefined`. That's the same slot index used by game events, which makes it the natural way to look up the attacker or victim of a kill by raw userid.

```ts
await parser.parseDemo('demo.dem'); // EntityMode.NONE — no entity parsing

// Iterate — guard against sparse holes, or call .filter(Boolean) first.
for (const player of parser.players) {
  if (!player) continue;
  console.log(player.name, player.steamid);
}
```

Each `CMsgPlayerInfo` is a plain object decoded from the demo's `userinfo` string table:

| Field | Type | Description |
| --- | --- | --- |
| `name` | `string \| undefined` | Display name |
| `steamid` | `string \| undefined` | SteamID64 as a decimal string. Bots share `"0"` |
| `xuid` | `string \| undefined` | Xbox user id (usually equal to `steamid`) |
| `userid` | `number \| undefined` | In-game user id (the slot index is `userid & 0xff`) |
| `fakeplayer` | `boolean \| undefined` | `true` for bots |
| `ishltv` | `boolean \| undefined` | `true` for the HLTV/GOTV observer slot |

`parser.players` is populated from `createstringtable` / `updatestringtable` events as soon as the userinfo table arrives, so it's usable inside `'end'` and also during parsing (e.g. once the first `round_start` fires).

#### Looking up players during a game event

Game events like `player_death` expose `userid` / `attacker` / `assister` fields which are slot indices into `parser.players`. You can index the array directly to pull out the corresponding `CMsgPlayerInfo` — no entity parsing required.

```ts
const parser = new DemoReader();

parser.gameEvents.on('player_death', event => {
  const attacker = parser.players[event.attacker];
  const victim   = parser.players[event.userid];
  const assister = parser.players[event.assister];

  if (!attacker || !victim) return;

  console.log(
    `${attacker.name} (${attacker.steamid}) killed ${victim.name} with ${event.weapon}` +
    (event.headshot ? ' (HS)' : '') +
    (assister ? `, assisted by ${assister.name}` : '')
  );
});

// Runs with EntityMode.NONE — no entity parsing needed for names + steamids.
await parser.parseDemo('demo.dem');
```

This pattern is the fast path when you only need to log kills, build a scoreboard, or group events by player identity — anything that doesn't require live entity state like position, health, or money. For those, use `event.attackerPlayer` / `event.player` (the auto-resolved `Player` helpers), which require `EntityMode.ALL`.

### Entity-backed helpers — `parser.playerControllers`

`parser.playerControllers` returns `Player[]` helper objects backed by live entity data. This requires `EntityMode.ALL` because it reads `CCSPlayerController` and `CCSPlayerPawn` properties.

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

### Player lookups

Several `DemoReader` methods resolve a `Player` helper from different identifiers. All require `EntityMode.ALL`.

```ts
// By controller entity ID (e.g. from event.userid_pawn lookups or parser.entities)
const p1 = parser.getPlayer(88);

// From a CMsgPlayerInfo (e.g. an element of parser.players)
const p2 = parser.getPlayerByInfo(parser.players[0]);

// By Steam account ID — the lower 32 bits of SteamID64,
// i.e. the trailing number in SteamID3 form: [U:1:918429678] -> 918429678
const p3 = parser.getByAccountId(918429678);
```

`getPlayerByInfo` returns `null` for bots (they share `steamid === '0'` so cannot be uniquely matched), for disconnected players, and before a controller has been assigned. `getByAccountId` is O(1) on cached entries, with a linear-scan fallback.

### Player Helper

The `Player` class wraps a `CCSPlayerController` entity. It links to the player's pawn entity for position, health, and combat state. Pawn-backed getters return `0`/`false`/`null` defaults while the player has no pawn (e.g. dead, spectating, or disconnected).

**Identity**

| Property | Type | Source |
| --- | --- | --- |
| `entityId` | `number` (readonly) | Controller entity index |
| `entity` | `TypedEntity \| undefined` | Raw controller entity |
| `name` | `string` | Controller |
| `steamId` | `string` | Controller (empty if not yet set) |
| `isConnected` | `boolean` | Controller (`m_iConnected === 0`) |
| `clanTag` | `string` | Controller |
| `color` | `number` | Comp teammate color (`-1` if unset) |
| `userInfo` | `CMsgPlayerInfo \| null` | Matching entry from `parser.players` |

**Team**

| Property | Type | Source |
| --- | --- | --- |
| `teamNumber` | `number` | Controller |
| `team` | `Team \| null` | Linked team entity |

**Pawn link**

| Property | Type | Source |
| --- | --- | --- |
| `pawnEntityId` | `number \| null` | Decoded from `m_hPlayerPawn` handle |
| `pawn` | `PlayerPawn \| null` | Linked pawn entity |
| `isAlive` | `boolean` | Controller (`m_bPawnIsAlive`) |

**Pawn shortcuts** (delegate to `pawn`, return a safe default if there's no pawn)

| Property | Type |
| --- | --- |
| `health` / `armor` | `number` |
| `position` | `Vector \| null` |
| `eyeAngles` | `{ pitch: number; yaw: number }` |
| `hasDefuser` / `hasHelmet` | `boolean` |
| `isScoped` / `isDefusing` | `boolean` |

**Economy**

| Property | Type |
| --- | --- |
| `money` | `number` |
| `totalCashSpent` | `number` |
| `cashSpentThisRound` | `number` |

**Match totals** (from `CCSPlayerController_ActionTrackingServices`)

| Property | Type |
| --- | --- |
| `kills` / `deaths` / `assists` | `number` |
| `damage` | `number` |
| `headshotKills` | `number` |
| `utilityDamage` | `number` |
| `enemiesFlashed` | `number` |
| `enemy3Ks` / `enemy4Ks` / `enemy5Ks` | `number` |
| `objective` | `number` |

**Per-round stats** (from `CSPerRoundStats_t`, reset between rounds)

| Property | Type |
| --- | --- |
| `round_kills` / `round_deaths` / `round_assists` | `number` |
| `round_damage` | `number` |
| `round_headshotKills` | `number` |
| `round_equipmentValue` | `number` |
| `round_cashEarned` | `number` |
| `round_utilityDamage` | `number` |
| `round_enemiesFlashed` | `number` |
| `round_liveTime` | `number` |

**General**

| Property | Type |
| --- | --- |
| `mvps` / `score` / `ping` | `number` |

### PlayerPawn Helper

`parser.getPawn(entityId)` returns a `PlayerPawn` helper for a `CCSPlayerPawn` entity. The `controller` property navigates back to the owning `Player`.

| Property | Type | Description |
| --- | --- | --- |
| `entityId` | `number` | Pawn entity index |
| `entity` | `TypedEntity \| undefined` | Raw pawn entity |
| `health` / `maxHealth` | `number` | `maxHealth` defaults to `100` |
| `armor` | `number` | |
| `lifeState` | `number` | Raw life state flags |
| `isAlive` | `boolean` | `lifeState === 0` |
| `position` | `Vector` | Computed from cell + vec coords |
| `eyeAngles` | `{ pitch: number; yaw: number }` | |
| `hasDefuser` / `hasHelmet` | `boolean` | From `CCSPlayer_ItemServices` |
| `isScoped` / `isWalking` / `isDefusing` | `boolean` | |
| `flags` | `number` | Raw `m_fFlags` bitmask |
| `ownerEntityHandle` | `number` | Raw `m_hOwnerEntity` handle |
| `controller` | `Player \| undefined` | Owning controller, linked by `pawnEntityId` |

`Vector` is re-exported from the package root: `import type { Vector } from 'cs2parser'`.

## Teams

```ts
import { TeamNumber } from 'cs2parser';

for (const team of parser.teams) {
  if (team.teamNumber < TeamNumber.Terrorist) continue; // skip Unassigned/Spectator
  console.log(team.teamName, team.clanName, team.score);
  console.log('  members:', team.members.map(p => p.name));
}
```

`TeamNumber` is a const object you can import from the package root:

```ts
TeamNumber.Unassigned        // 0
TeamNumber.Spectator         // 1
TeamNumber.Terrorist         // 2
TeamNumber.CounterTerrorist  // 3
```

| Property | Type |
| --- | --- |
| `entityId` | `number` |
| `entity` | `TypedEntity \| undefined` |
| `teamNumber` | `TeamNumber` |
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

`parser.gameRules` is `null` until the first `CCSGameRulesProxy` entity appears. Available with `EntityMode.ALL` or `EntityMode.ONLY_GAME_RULES`.

| Property | Type | Description |
| --- | --- | --- |
| `entityId` | `number` | Proxy entity index |
| `entity` | `TypedEntity \| undefined` | Raw proxy entity |
| `isWarmup` | `boolean` | |
| `isFreezePeriod` | `boolean` | |
| `isGamePaused` | `boolean` | |
| `isTerroristTimeOutActive` | `boolean` | |
| `isCTTimeOutActive` | `boolean` | |
| `roundsPlayed` | `number` | |
| `gamePhase` | `number` | Raw phase number from the game rules proxy |
| `phase` | `"first" \| "second" \| "halftime" \| "postgame" \| "unknown"` | Human-readable mapping of `gamePhase` |
| `roundTime` | `number` | Current round length in seconds |
| `roundStartTime` | `number` | Server time at which the current round started |
| `terroristTimeOutRemaining` | `number` | Seconds remaining in the T timeout |
| `ctTimeOutRemaining` | `number` | Seconds remaining in the CT timeout |

### WinRoundReason

`WinRoundReason` is a const object with the round-end reason codes emitted on synthetic `round_end` events. Import from the package root:

```ts
import { WinRoundReason } from 'cs2parser';

parser.gameEvents.on('round_end', event => {
  if (event.reason === WinRoundReason.DEFUSE) console.log('CTs defused the bomb');
});
```

| Name | Value |
| --- | --- |
| `EXPLOSION` | `1` |
| `DEFUSE` | `7` |
| `T_ELIMINATED` | `8` |
| `CT_ELIMINATED` | `9` |
| `TIME` | `12` |
| `T_SURRENDER` | `17` |
| `CT_SURRENDER` | `18` |

## Game Events

Events are emitted at the end of each tick. Player references are auto-resolved — any `userid` / `attacker` / `assister` field is matched to a `Player` helper and exposed as `player`, `attackerPlayer`, `assisterPlayer`.

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
  event.reason; // WinRoundReason
});

parser.gameEvents.on('bomb_planted', event => { ... });
parser.gameEvents.on('bomb_defused', event => { ... });

// Catch-all listener — fires once per emitted event with the event name
parser.gameEvents.on('gameEvent', (name, event) => {
  console.log(name, event);
});
```

`round_start` and `round_end` are emitted as **synthetic** events derived from `CCSGameRules.m_nRoundStartCount` / `m_nRoundEndCount` whenever `EntityMode.ALL` or `EntityMode.ONLY_GAME_RULES` is active — the raw network versions are suppressed in those modes to avoid duplicates. With `EntityMode.NONE`, only the raw events fire.

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

## Low-level Events

`DemoReader` is an `EventEmitter`. These events let you hook into the parse pipeline itself — tick boundaries, header/server info, entity lifecycle, and raw network messages.

```ts
// Parse lifecycle
parser.on('header', header => { });          // CDemoFileHeader — fires once
parser.on('serverinfo', info => { });        // CSVCMsg_ServerInfo — fires once
parser.on('tickstart', tick => { });         // number
parser.on('tickend', tick => { });           // number
parser.on('progress', fraction => { });      // 0..1, ~every 5000 frames
parser.on('end', ({ incomplete, error }) => { });
parser.on('cancel', () => { });              // fires on parser.cancel()
parser.on('error', ({ error }) => { });      // fatal parse error
parser.on('debug', msg => { });              // diagnostic strings

// String tables — populate parser.players
parser.on('createstringtable', table => { });
parser.on('updatestringtable', update => { });
parser.on('clearallstringtables', () => { });

// Entity lifecycle (requires EntityMode.ALL / ONLY_GAME_RULES)
parser.on('entitycreated', ([entityId, classId, entityType, className]) => { });
parser.on('entityupdated', ({ entityId, propId, value }) => { });
parser.on('entitydeleted', entityId => { });

// Raw game events (prefer parser.gameEvents for typed access)
parser.on('gameeventlist', list => { });
parser.on('gameevent', event => { });

// Opt-in network messages
parser.on('svc_UserMessage', msg => { });    // requires { messages: true }
parser.on('usercommand', cmd => { });        // requires { commands: true }
```

Any message key from `SVC_Messages` / `ECstrike15UserMessages` can be opted-in through `parseDemo` settings and listened to by name — `messages: true` and `commands: true` shown above are the most common.

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

## Examples

The [`examples/`](examples/) directory contains runnable scripts covering header parsing, server info extraction, full demo parsing with all input modes, and low-level packet events. See [`examples/README.md`](examples/README.md) for details.

## Acknowledgements

Creating this library wouldn't be possible without awesome work of:
 - [LaihoE](https://github.com/LaihoE), creator of [demoparser](https://github.com/LaihoE/demoparser)
 - [Saul](https://github.com/saul), creator of [demofile-net](https://github.com/saul/demofile-net)
 - [markus-wa](https://github.com/markus-wa), creator of [demoinfocs-golang](https://github.com/markus-wa/demoinfocs-golang)

Huge thanks to all of them, as they all have helped me in some way or the other during the past few years.