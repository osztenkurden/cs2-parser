# Examples

Runnable examples demonstrating cs2parser features. All examples expect a path to a `.dem` file as their first (or second) argument.

## header.ts

Reads only the demo file header using the static `DemoReader.parseHeader()` method. No full parse required — fast and low-memory.

```bash
bun examples/header.ts path/to/demo.dem
```

## serverinfo.ts

Reads server info from the first few packets using `DemoReader.parseServerInfo()`. Like `parseHeader`, this avoids a full parse.

```bash
bun examples/serverinfo.ts path/to/demo.dem
```

## stream.ts

Full-parse example that demonstrates all four input modes, game event handling, and player/team helpers.

Supports four modes:

| Mode | Description |
| --- | --- |
| `path-stream` | File path with default streaming |
| `path-chunked` | File path with `stream: false` (chunked reads) |
| `buffer` | Pre-loaded `Buffer` (high memory) |
| `stream` | Node.js `Readable` stream |

Listens for `player_death` and `round_end` events, then prints a final scoreboard with kills, deaths, assists, and positions.

```bash
bun examples/stream.ts path-stream path/to/demo.dem
```

Optionally compare output against a reference file for regression testing:

```bash
bun examples/stream.ts path-stream path/to/demo.dem --compare examples/stream_output.txt
```

## voicedata.ts

Demonstrates listening for low-level packet events: `svc_VoiceData`, `svc_UserMessage`, and `svc_UserCmds`. Requires enabling the corresponding parse options.

```bash
bun examples/voicedata.ts path/to/demo.dem
```

## stream_output.txt

Reference output for `stream.ts`, used with the `--compare` flag to verify parse correctness.
