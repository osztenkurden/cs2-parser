# Benchmark Results

CPU: Apple M1

Demo: `demo.dem` (318 MB, 136,812 ticks)

## Entity Mode Comparison

| Mode | Throughput | Time | RSS | Heap | Entities |
| --- | --- | --- | --- | --- | --- |
| `EntityMode.NONE` | 401.9 MB/s | 0.8s | 136MB | 22MB | 0 |
| `EntityMode.ONLY_GAME_RULES` | 131.7 MB/s | 2.4s | 165MB | 39MB | 1 |
| `EntityMode.ALL` | 107.9 MB/s | 2.9s | 183MB | 15MB | 248 |

`ONLY_GAME_RULES` parses entities but only stores game rules — enables synthetic `round_start`/`round_end` events without full entity tracking overhead.

## Parse Method Comparison (EntityMode.ALL)

| Method | Throughput | Time | RSS | Heap |
| --- | --- | --- | --- | --- |
| `parseDemo(path)` | 110.3 MB/s | 2.9s | 178MB | 15MB |
| `parseDemo(path, {stream: false})` | 109.1 MB/s | 2.9s | 213MB | 56MB |
| `parseDemo(buffer)` | 106.2 MB/s | 3.0s | 830MB | 1019MB |
| `parseDemo(stream)` | 108.9 MB/s | 2.9s | 183MB | 10MB |
