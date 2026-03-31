# Benchmark Results

Demo: `14140.dem` (583 MB, 231,355 ticks)

## Entity Mode Comparison

| Mode | Time | RSS | Heap | Entities |
| --- | --- | --- | --- | --- |
| `EntityMode.NONE` | 2.8s | 255MB | 34MB | 0 |
| `EntityMode.ONLY_GAME_RULES` | 8.4s | 284MB | 26MB | 1 |
| `EntityMode.ALL` | 10.5s | 275MB | 26MB | 622 |

`ONLY_GAME_RULES` parses entities but only stores game rules — enables synthetic `round_start`/`round_end` events without full entity tracking overhead.

## Parse Method Comparison (EntityMode.ALL)

| Method | Time | RSS | Heap | Blocking |
| --- | --- | --- | --- | --- |
| `parseDemo(path)` | 10.3s | 290MB | 26MB | no |
| `parseDemo(path, {stream: false})` | 8.6s | 3964MB | 1732MB | yes |
| `parseDemo(buffer)` | 8.8s | 3965MB | 1732MB | yes |
| `parseDemo(stream)` | 10.2s | 281MB | 20MB | no |

Streaming uses ~13x less memory by never holding the full file in RAM.
