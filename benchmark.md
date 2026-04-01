# Benchmark Results

CPU: Apple M1
Demo: `demo.dem` (318 MB, 136,812 ticks)

## Entity Mode Comparison

| Mode | Throughput | Time | RSS | Heap | Entities |
| --- | --- | --- | --- | --- | --- |
| `EntityMode.NONE` | 405.6 MB/s | 0.8s | 137MB | 30MB | 0 |
| `EntityMode.ONLY_GAME_RULES` | 128.3 MB/s | 2.5s | 160MB | 29MB | 1 |
| `EntityMode.ALL` | 110.7 MB/s | 2.9s | 162MB | 35MB | 248 |

`ONLY_GAME_RULES` parses entities but only stores game rules — enables synthetic `round_start`/`round_end` events without full entity tracking overhead.

## Parse Method Comparison (EntityMode.ALL)

| Method | Throughput | Time | RSS | Heap | Blocking |
| --- | --- | --- | --- | --- | --- |
| `parseDemo(path)` | 108.4 MB/s | 2.9s | 183MB | 16MB | no |
| `parseDemo(path, {stream: false})` | 116.9 MB/s | 2.7s | 576MB | 28MB | yes |
| `parseDemo(buffer)` | 116.0 MB/s | 2.7s | 2142MB | 964MB | yes |
| `parseDemo(stream)` | 110.0 MB/s | 2.9s | 182MB | 20MB | no |
