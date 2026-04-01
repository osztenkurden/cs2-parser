# Benchmark Results

CPU: Apple M1
Demo: `demo.dem` (318 MB, 136,812 ticks)

## Entity Mode Comparison

| Mode | Throughput | Time | RSS | Heap | Entities |
| --- | --- | --- | --- | --- | --- |
| `EntityMode.NONE` | 385.6 MB/s | 0.8s | 135MB | 25MB | 0 |
| `EntityMode.ONLY_GAME_RULES` | 117.4 MB/s | 2.7s | 194MB | 39MB | 1 |
| `EntityMode.ALL` | 104.8 MB/s | 3.0s | 195MB | 30MB | 248 |

`ONLY_GAME_RULES` parses entities but only stores game rules — enables synthetic `round_start`/`round_end` events without full entity tracking overhead.

## Parse Method Comparison (EntityMode.ALL)

| Method | Throughput | Time | RSS | Heap | Blocking |
| --- | --- | --- | --- | --- | --- |
| `parseDemo(path)` | 106.5 MB/s | 3.0s | 196MB | 36MB | no |
| `parseDemo(path, {stream: false})` | 109.4 MB/s | 2.9s | 2186MB | 958MB | yes |
| `parseDemo(buffer)` | 112.0 MB/s | 2.8s | 2221MB | 956MB | yes |
| `parseDemo(stream)` | 107.2 MB/s | 3.0s | 1905MB | 36MB | no |
