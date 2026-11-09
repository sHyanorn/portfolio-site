# Sources: matching-engine

Content: `src/content/projects/matching-engine.json`.

All paths are in github.com/sHyanorn/matching-engine at commit 1d50110.

The Chinese text writes rates and counts in 万 (10k = 1 万, 1M = 100 万); every such figure is one of the numbers below.

| Number | Source |
|---|---|
| Demo at 2,000 requests per second | README.md:5 |
| 5.05M to 6.95M commands/s in the matching core | docs/BENCHMARKS.md:13-18 (README.md:13 rounds them to 5.0M to 6.9M) |
| p99 1.76 ms at 10k/s, order to trade push | docs/BENCHMARKS.md:29, 38 |
| p99 41.1 ms at 50k/s | docs/BENCHMARKS.md:44 |
| 128 MiB with 1M resting orders | README.md:15; docs/BENCHMARKS.md:22 (127.7 MiB, 1,000,000 orders) |
| 92% of statements | README.md:16; `make cover` (Makefile:21-24) at 1d50110 with Go 1.27.3 prints a total of 92.1% |
| One 4 vCPU cloud VM; the load generator and the engine share the 4 vCPUs | README.md:9; docs/BENCHMARKS.md:5 |
| Targets: more than 1 million operations per second; p99 under 5 ms at 50,000 orders per second; memory with 1 million resting orders | docs/SPEC.md:139-141 |
| Core target held with 5 to 7 times to spare | docs/BENCHMARKS.md:20 |
| 50,000 orders/s is about 71k requests/s; p99 under 5 ms up to 15k requests/s | docs/BENCHMARKS.md:49 |
| 503 at once when the queue is full | README.md:40; docs/DECISIONS.md:145 (D024) |
| 250 ns vs 405 ns at 10000 levels; lookup steps from 18 to 517 | docs/DECISIONS.md:26 (D004) |
| Skip list writes 26% to 101% slower | docs/DECISIONS.md:27 (D004) |
| Write before apply; fsync every 10 ms; process crash test | docs/DECISIONS.md:103-104 (D017) |
| Machine crash: one interval plus commands taken while an fsync was in progress | docs/DECISIONS.md:187 (D031) |
| fsync before every reply: p99 up by 1 to 10 ms up to 30k/s | docs/BENCHMARKS.md:56, 70 |
| Request i due at t0 + i/rate; 64 keep-alive connections | docs/DECISIONS.md:181 (D030); docs/BENCHMARKS.md:28 |
| Profile at 25k/s before the optimizations | docs/BENCHMARKS.md:76 |
| About 19% in system calls; 14% decoding, 9% of the profile in the key check; matching goroutine about 10% | docs/BENCHMARKS.md:80, 100 (9.2%) |
| Key check 5.79 µs and 79 allocations to 0.51 µs and 0 | docs/BENCHMARKS.md:99 |
| CPU per request fell 5% to 8% | docs/BENCHMARKS.md:100 |
| `Book.Apply` 1.4% to 2% of the engine's CPU; nodes not pooled | docs/BENCHMARKS.md:113 |
| fsync every 10 ms, 0.8 ms on average, tens of milliseconds at times | docs/BENCHMARKS.md:103 |
| Redis, Kafka and PostgreSQL flush on a background thread | docs/DECISIONS.md:188 (D031) |
| At 10k/s p99 5.32 to 3.82 ms, the run with the median p99 | docs/BENCHMARKS.md:105, 30 |
| At 25k/s p99 of the runs 20.0, 36.4 and 215 ms to 19.6, 19.8 and 28.7 ms | docs/BENCHMARKS.md:106 |
| Optimization sweeps at earlier commits on a slower VM of the same type | docs/BENCHMARKS.md:52, 84 |
| seq without gaps; pushes, replies and `matching_engine_trades_total` agree in number; pushes and replies agree by a sum of 64-bit hashes | docs/DECISIONS.md:217 (D036) |
| Valid run: 99% of the target rate, no failed request, every trade pushed once and in order | docs/BENCHMARKS.md:30 |
