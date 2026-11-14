# Sources: matching-engine

Content: `src/content/projects/matching-engine.json`.

Paths are in github.com/sHyanorn/matching-engine at commit d13e727, except in the rows marked 7de38f0, which are at commit 7de38f01f92154e861bc62858c6a6eac1e6bf7b6.

The Chinese text writes rates and counts in 万 (10k = 1 万, 1M = 100 万); every such figure is one of the numbers below.

| Number | Source |
|---|---|
| Demo at 2,000 requests per second | README.md:5 |
| 6.25M to 8.88M commands/s in the matching core on one symbol, measured on a noisy VM (± up to 36%) | 7de38f0: docs/BENCHMARKS.md:15-20, 22; README.md:15; bench-results/core-reuse/benchstat.txt:29-34 |
| p99 1.76 ms at 10k/s, order to trade push | docs/BENCHMARKS.md:29, 38 |
| 124 MiB with 1M resting orders | 7de38f0: README.md:18; docs/BENCHMARKS.md:24 (123.7 MiB); bench-results/core-reuse/benchstat.txt:79 |
| 93% of statements | README.md:16 at d13e727; `make cover` (Makefile:21-24) at 0f656b0 with Go 1.27.4 printed totals of 93.1% and 93.2% in two runs; 7de38f0: README.md:19, and `make cover` at 7de38f0 printed a total of 93.6% |
| Note: the latency figure from one 4 vCPU cloud VM with Go 1.24.7, the throughput and memory figures from a second 4 vCPU cloud VM with Go 1.27.4, at earlier commits; the load generator and the engine share the first VM; the project now builds with Go 1.27.4 | 7de38f0: README.md:11; docs/BENCHMARKS.md:3, 5, 7, 11, 24; docs/DECISIONS.md:234; bench-results/core-reuse/env.txt:1, 7; bench-results/e2e-review/default/env.txt:1-2 |
| Note: the end-to-end runs predate later changes to the engine, its API code and matching core included, and the repository holds no end-to-end run on the first VM after them | 7de38f0: docs/BENCHMARKS.md:5, 149; bench-results/e2e-review/default/env.txt:1 (98ad32a); `git log 98ad32a..7de38f0 -- internal` |
| Targets: more than 1 million operations per second; p99 under 5 ms at 50,000 orders per second; memory with 1 million resting orders | docs/SPEC.md:139-141 |
| Core target held with 6 to 9 times to spare | 7de38f0: docs/BENCHMARKS.md:22 |
| 50,000 orders/s is about 71k requests/s; p99 under 5 ms up to 15k requests/s | docs/BENCHMARKS.md:49; the first 4 vCPU VM: 7de38f0: docs/BENCHMARKS.md:3, 5, 79 |
| At 50k requests/s, near saturation, p99 41 ms, a figure that depends on the machine | README.md:14; docs/BENCHMARKS.md:44, 56, 58 |
| 503 at once when the queue is full | README.md:40; docs/DECISIONS.md:148 (D024) |
| D004: a red-black tree, a skip list and a sorted slice ran the same model tests and benchmarks | bench-results/d004/README.md:12-14; docs/DECISIONS.md:28 (D004) |
| 250 ns vs 405 ns at 10000 levels; lookup steps from 18 to 517 | docs/DECISIONS.md:27 (D004) |
| Skip list writes 26% to 101% slower | docs/DECISIONS.md:28 (D004) |
| Write before apply; fsync every 10 ms; process crash test | docs/DECISIONS.md:105-106 (D017) |
| Machine crash: one interval plus commands taken while an fsync was in progress | docs/DECISIONS.md:194 (D031) |
| fsync before every reply: p99 up by 1 to 10 ms up to 30k/s | docs/BENCHMARKS.md:62, 76 |
| Request i due at t0 + i/rate; 64 keep-alive connections | docs/DECISIONS.md:187 (D030); docs/BENCHMARKS.md:28 |
| Profile at 25k/s before the optimizations | docs/BENCHMARKS.md:82 |
| About 19% in system calls; 14% decoding, 9% of the profile in the key check; matching goroutine about 10% | docs/BENCHMARKS.md:86, 106 (9.2%) |
| Key check 5.79 µs and 79 allocations to 0.51 µs and 0 | docs/BENCHMARKS.md:105 |
| CPU per request fell 5% to 8% | docs/BENCHMARKS.md:106 |
| `Book.Apply` 1.4% to 2% of the engine's CPU in the profiles before and after the optimizations; the book's own order index and node reuse came later; the end-to-end figures were not measured again | 7de38f0: docs/BENCHMARKS.md:112, 145, 149; docs/DECISIONS.md:238 (D038), 244 (D039); bench-results/m5-opt/cpu-before.pprof and cpu-after.pprof (1.97% and 1.41%) |
| fsync every 10 ms, 0.8 ms on average, tens of milliseconds at times | docs/BENCHMARKS.md:109 |
| Redis, Kafka and PostgreSQL flush on a background thread | docs/DECISIONS.md:195 (D031) |
| At 10k/s p99 5.32 to 3.82 ms, the run with the median p99 | docs/BENCHMARKS.md:111, 30 |
| At 25k/s p99 of the runs 20.0, 36.4 and 215 ms to 19.6, 19.8 and 28.7 ms | docs/BENCHMARKS.md:112 |
| Optimization sweeps at earlier commits on a slower VM of the first VM's type | 7de38f0: docs/BENCHMARKS.md:3, 82, 120 |
| seq without gaps; pushes, replies and `matching_engine_trades_total` agree in number; pushes and replies agree by a sum of 64-bit hashes | docs/DECISIONS.md:224 (D036) |
| Valid run: 99% of the target rate, no failed request, every trade pushed once and in order | docs/BENCHMARKS.md:30 |
| Compared with Liquibook, CppTrader and geseq on one 4 vCPU VM in ten rounds, one engine after another, every run's reports checked against a published hash; faster than CppTrader in 46 of 50 paired runs, median ratio 1.28 to 1.60 per scenario; one engine's runs vary by up to 2.09 times; the core takes messages in runs and CppTrader's adapter one per call; no geseq run passes the probe-time rule | 7de38f0: README.md:16; docs/BENCHMARKS.md:7, 28, 30, 31, 37-41, 44, 45, 47-49; bench-results/harness/env.txt:1-3; bench-results/harness/summary.txt:28-38 |
