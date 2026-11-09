# Sources: The order book was 2% of the CPU

Article: `src/content/articles/order-book-cpu.mdx`.

All paths are in github.com/sHyanorn/matching-engine at commit 1097d29.

| Number | Source |
|---|---|
| 144 to 198 ns per command; 5.05M to 6.95M commands/s; 1M resting orders | docs/BENCHMARKS.md:13-18 |
| 39 µs (50k/s) and 95 µs (10k/s) engine CPU per request | docs/BENCHMARKS.md:38, 44 |
| Fixed costs shared by more requests | docs/BENCHMARKS.md:50 |
| About 2 cores at 50k/s | docs/BENCHMARKS.md:49 |
| Profile at 25k/s: 19% syscalls, 14% decoding, 9% key check, ~10% GC, ~10% matching goroutine | docs/BENCHMARKS.md:76, 80 |
| Profiles from the slower VM | docs/BENCHMARKS.md:76; bench-results/m5-opt/cpu-before.pprof and cpu-after.pprof, whose `Time` headers (2026-11-05 10:17 UTC) fall between the slower-VM sweeps (78c4715, 10:16:40) and the report (f61a60d, 10:21:12) |
| Valid run: 99% of rate sent, no failed request, every trade pushed once in order | docs/BENCHMARKS.md:30 |
| `Book.Apply` 1.4% to 2% of the engine's CPU across the profiles before and after both changes; 0.6 allocations per command; pooling not done | docs/BENCHMARKS.md:76, 109, 113 |
| One goroutine per symbol (D003) | docs/DECISIONS.md:19 |
| Three prototypes: red-black tree, skip list, sorted slice; same model tests and benchmarks | bench-results/d004/README.md:12-13, 30; docs/DECISIONS.md:26 (D004) |
| D004 prototypes on a separate VM of the same type | bench-results/d004/README.md:5 |
| 250 ns vs 405 ns at 10,000 levels | docs/DECISIONS.md:26 (D004); bench-results/d004/README.md |
| Skip list writes 26% to 101% slower | docs/DECISIONS.md:27 (D004) |
| Lookup steps 18 to 517 | docs/DECISIONS.md:26 (D004) |
| Open-loop method, due time t0 + i/rate; three runs per rate on a fresh engine | docs/DECISIONS.md:179, 181 (D030); docs/BENCHMARKS.md:28, 30 |
| Optimizations measured on a slower VM of the same type | docs/BENCHMARKS.md:3, 52, 84 |
| Key check 5.79 µs, 79 allocs → 0.51 µs, 0 allocs | docs/BENCHMARKS.md:99; bench-results/m5-opt/checkkeys.txt |
| 9.2% → 1.1% of profile; CPU per request −5% to −8%; 30k/s sustainable | docs/BENCHMARKS.md:100-101 |
| fsync every 10 ms, 0.8 ms average, tens of milliseconds at times | docs/BENCHMARKS.md:103; docs/DECISIONS.md:188 (D031) |
| 10k/s p90 0.91 → 0.57 ms, p99 5.32 → 3.82 ms | docs/BENCHMARKS.md:105 |
| CPU per request up to +3% | docs/BENCHMARKS.md:107 |
| 25k/s p99 20.0, 36.4, 215 → 19.6, 19.8, 28.7 ms | docs/BENCHMARKS.md:106 |
| Crash window: one interval plus an fsync in progress | docs/DECISIONS.md:187 (D031) |
| p99 1.76 ms at 10k/s, 41.1 ms at 50k/s in the headline end-to-end runs | docs/BENCHMARKS.md:5, 38, 44 |
| 64 keep-alive connections | docs/BENCHMARKS.md:28 |
| One symbol per run | docs/BENCHMARKS.md:30 |
| One 4 vCPU VM; the load generator and the engine share the 4 vCPUs | docs/BENCHMARKS.md:5 |
| A 1 ms sleep loop records pauses | docs/BENCHMARKS.md:31 |
| Pauses up to 53 ms | docs/BENCHMARKS.md:41, 51 |
| Stall about 128 ms on the slower VM | bench-results/m5-e2e/after-fsync/rate-10000-3.json (`latency_us.hiccup.max` 128,483) |
| Spec target 5 ms at 50,000 orders/s (~71k requests/s); under 5 ms up to 15k/s | docs/BENCHMARKS.md:49 |
| Replay 534 ns per command, 3.5× `Book.Apply`; a day at 10k/s ≈ 8 minutes; page cache | docs/BENCHMARKS.md:119-120 |
| Book ≈ 30% of replay | derived: 1 / 3.5 ≈ 0.29 |
| docs/BENCHMARKS.md:51 at 1097d29 placed the 128 ms stall on the headline VM | Corrected in 1d50110: it was the slower VM |
