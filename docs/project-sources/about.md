# Sources: home and About

Content: `src/content/site/home.json` and `src/content/site/about.json`. Each row covers one fact from the English text. The Chinese text states the same facts.

Repositories at: matching-engine 1d50110, vault-share d5f69e6, backtest-lab 024e743, local-ledger ae08641, push-lab 937ad77, ope-checks 7a097af, recserve 7221f1c, retrieval-lab e0ae490. `site:` is this repository. `site:…@b5c04e0` is the last commit with the earlier text.

## Home

The intro's two sentences, then the three areas.

| Number or claim | Source |
|---|---|
| Commerce student at the University of Melbourne | site:docs/DECISIONS.md:124 (D017); site:src/lib/i18n.ts:39; site:src/lib/i18n.ts@b5c04e0:35, 47 |
| Each project below has tests in its repository | matching-engine cmd/engine/kill_test.go:197, README.md:75; vault-share docs/security/TEST_REPORT.md:377-381; backtest-lab README.md:59-66; local-ledger README.md:66-67; push-lab README.md:81; ope-checks README.md:112, .github/workflows/ci.yml:20 |
| Each project below has a decision log or a pre-registration in its repository | docs/DECISIONS.md:1 in matching-engine, vault-share, backtest-lab, local-ledger and push-lab; ope-checks obd/PREREGISTRATION.md:1, README.md:9 |
| Algorithms: two-tower recall | push-lab docs/SPEC.md:11, 37-38 |
| Algorithms: gradient-boosted ranking (LightGBM) | push-lab docs/SPEC.md:12, 42; docs/DECISIONS.md:106-108 (D008) |
| Algorithms: uplift models | push-lab docs/SPEC.md:12, 45-46 |
| Algorithms: off-policy evaluation | push-lab docs/SPEC.md:13, 63-65 |
| Algorithms: results labelled by evidence tier | push-lab README.md:3, 12-16; docs/SPEC.md:87-93; docs/DECISIONS.md:77 (D002) |
| Algorithms: a pre-registered recheck of the Open Bandit benchmark | ope-checks README.md:3, 7, 9 |
| Algorithms: the IPS estimate pooled over the two confirmatory campaigns is 0.974 of the on-policy click rate (0.915 to 1.036 over ten-minute blocks) | ope-checks README.md:13, 17, 28; obd/results/pooled.json (`quantities["h3.ips"]`) |
| Algorithms: no shortfall shown | ope-checks README.md:29; obd/results/pooled.json (`h3.ips.label`) |
| Server-side: a recommendation serving system in Go, with retrieval, features, ranking and rerank behind one HTTP API | recserve README.md:3 |
| Server-side: the item vectors on gRPC shard replicas | recserve README.md:5, 50 |
| Server-side: in kind at 100 requests/s | recserve docs/DECISIONS.md:456 (D047), 458, 461 |
| Server-side: through rolling restarts of the gateways and of the replicas and a bundle swap, no response failed or was degraded | recserve README.md:66; docs/DECISIONS.md:456 (D047); docs/SPEC.md:171; docs/TASKS.md:64 |
| Server-side: stage budgets of 100 ms | recserve docs/DECISIONS.md:454 (D047); README.md:79 |
| Backend: Go limit order book | matching-engine README.md:3; docs/DECISIONS.md:5-8 (D001) |
| Backend: write-ahead command log | matching-engine README.md:3, 42; docs/DECISIONS.md:101-103 (D017) |
| Backend: open-loop load testing | matching-engine docs/DECISIONS.md:179-181 (D030); docs/BENCHMARKS.md:28 |
| Backend: 5.05M to 6.95M commands/s in the matching core | matching-engine docs/BENCHMARKS.md:13-18 (README.md:13 rounds these to 5.0M to 6.9M) |
| Backend: p99 1.76 ms at 10k requests/s, from order to trade push | matching-engine docs/BENCHMARKS.md:29, 38 |

## About

### Education

Taken from the site's own earlier text and D017.

| Number or claim | Source |
|---|---|
| The University of Melbourne | site:docs/SPEC.md:36; site:docs/DECISIONS.md:124 (D017); site:src/lib/i18n.ts@b5c04e0:52 |
| Bachelor of Commerce | site:docs/DECISIONS.md:124 (D017); site:src/lib/i18n.ts@b5c04e0:56 |
| 2024 to 2027 | site:docs/DECISIONS.md:124 (D017); site:src/lib/i18n.ts@b5c04e0:56 |
| In progress | site:docs/DECISIONS.md:124 (D017); site:src/lib/i18n.ts@b5c04e0:56 |
| Based in Melbourne, Australia | Aaron, 2026-11-09. No repository source. site:docs/DECISIONS.md:126 (the D017 amendment) records only that About shows the city |

### Algorithms

Items 1 to 4. All paths are in push-lab.

| Number or claim | Source |
|---|---|
| Push notification pipeline built on public data | README.md:3; docs/SPEC.md:5 |
| Two-tower recall with a faiss (HNSW) index | docs/SPEC.md:38, 148; docs/DECISIONS.md:102-104 (D007) |
| Coarse ranking by the two-tower score | docs/SPEC.md:41; docs/DECISIONS.md:106-108 (D008) |
| LightGBM fine ranking | docs/SPEC.md:42; docs/DECISIONS.md:106-108 (D008) |
| Uplift models | docs/SPEC.md:45-46, 55 |
| The delivery policy decides whether to send, the slot and the copy | docs/SPEC.md:35, 53-62, 159-160 |
| Off-policy estimators include IPS and DR | docs/SPEC.md:64; docs/DECISIONS.md:400 (D042: IPS and DR are primary) |
| Checked against a known answer on the Open Bandit Dataset | docs/SPEC.md:65; docs/DECISIONS.md:391 (D041), 400 (D042) |
| On the full campaign no estimator passed with the registered intervals over impressions (IPS 0.891, DR 0.897 of the on-policy value) | docs/DECISIONS.md:458, 460 (D046); README.md:55 |
| No Tier B result; 0 Tier B claims | README.md:15, 18; docs/SPEC.md:95; docs/DECISIONS.md:460 (D046) |
| Post hoc, over ten-minute blocks, the intervals of IPS (0.789 to 1.004) and DR (0.796 to 1.006) contain the known value | README.md:55; docs/DECISIONS.md:620-621 (D063) |
| The registered verdict stands | README.md:55; docs/DECISIONS.md:617, 625 (D063) |
| Simulator response model fitted on KuaiRand random exposures | docs/SPEC.md:50, 182 |
| No public dataset links push sends to later behaviour | docs/METHODS.md:267; docs/SPEC.md:216; docs/DECISIONS.md:91 |
| Tiers: A randomized real data, B validated off-policy estimate, C simulator with a sweep | README.md:12-16; docs/SPEC.md:89-93; docs/DECISIONS.md:77 (D002) |
| Comparisons are pre-registered before the simulations run and reported as they come out | docs/SPEC.md:18; docs/DECISIONS.md:199 (D020), 408 (D043) |
| A pre-registered ranking result went the other way: fine ranker click GAUC 0.545 against the two-tower score's 0.598 (C2) | docs/DECISIONS.md:201 (D020); README.md:55 |

Items 5 to 7. All paths are in ope-checks.

| Number or claim | Source |
|---|---|
| A pre-registered recheck of the Open Bandit benchmark | README.md:3, 7 |
| Propositions, statistics and decision rules committed before any outcome of the confirmatory campaigns was computed | README.md:9; obd/PREREGISTRATION.md:58 |
| One campaign to develop on (Men's) and two for the verdicts (All, Women's) | README.md:13; obd/PREREGISTRATION.md:62-63 |
| On the two confirmatory campaigns the published prior is not the distribution the BTS log shows: H1 is `inconsistent` | README.md:24, 68; obd/PREREGISTRATION.md:85; obd/results/all.json and women.json (`h1.label`) |
| Distance 0.53 (0.526 on All, 0.527 on Women's) against a noise floor of 0.11 to 0.14 (0.136, 0.115) | README.md:23; obd/results/all.json and women.json (`h1.d`, `h1.d0`) |
| The IPS estimate pooled over them is 0.974 of the on-policy click rate (0.915 to 1.036 over ten-minute blocks) | README.md:17, 28; obd/results/pooled.json (`quantities["h3.ips"]`) |
| No shortfall is shown | README.md:29, 70; obd/results/pooled.json (`h3.ips.label`) |
| One of up to 8.5% is not excluded: 1 minus the lower end of the interval, 0.915 | README.md:28; obd/results/pooled.json (`quantities["h3.ips"].interval`, lower end 0.9146) |
| Post hoc, on all three campaigns: the standard deviation of the ratio with ten-minute blocks is 1.31 to 1.47 times the one with rows or impressions | README.md:83; obd/posthoc/README.md:34-41; obd/posthoc/results/units.json (`all`, `men`, `women`: `h3.sd_of_blocks_over`) |

Item 8. All paths are in retrieval-lab.

| Number or claim | Source |
|---|---|
| BM25 retrieval in Go | README.md:3, 5 |
| Lucene's scoring computed from a Bleve index | README.md:5; docs/DECISIONS.md:31-33 (D005); docs/BENCHMARKS.md:33 |
| Six BEIR test sets | README.md:3; docs/BENCHMARKS.md:11-16 |
| nDCG@10 and Recall@100 equal Pyserini's published BM25 numbers to all four decimals | README.md:5; docs/BENCHMARKS.md:7-16, 46-51 |
| The run files reproduce byte for byte from committed checksums | README.md:5, 15; results/bm25-flat.sha256:1-6 |

### Server-side systems

All paths are in recserve.

| Number or claim | Source |
|---|---|
| A recommendation serving system in Go: retrieval, features, ranking and rerank behind one HTTP API | README.md:3; docs/SPEC.md:5 |
| The user encoder and the ranker run through ONNX Runtime | README.md:56; docs/DECISIONS.md:170 (D026), 182, 187 (D027); the ranker's bundle at 2b5312b: docs/DECISIONS.md:188 (D027) |
| Item vectors split into shards on replicas over gRPC | README.md:5, 50; docs/DECISIONS.md:353 (D040) |
| A search goes to the next replica when one fails and to a second when the first is slow, at most one hedge per search | README.md:51; docs/DECISIONS.md:371-372 (D041) |
| With one replica of every shard lost, every response equals the one with all replicas healthy | docs/SPEC.md:126; docs/DECISIONS.md:377 (D041) |
| Model bundles swapped while serving | README.md:17, 59; docs/DECISIONS.md:228 (D031) |
| Every replica prepares the new version | README.md:52; docs/DECISIONS.md:393 (D042) |
| Activation is atomic | README.md:59; docs/DECISIONS.md:228 (D031), 392 (D042) |
| A version is the digest of its files, checked by the gateway and by every replica | README.md:55; docs/DECISIONS.md:439 (D046) |
| Events through Kafka to an ingest consumer that applies them idempotently | README.md:60; docs/DECISIONS.md:282 (D035); docs/SPEC.md:122 |
| User histories and the result cache on Valkey | README.md:5, 61 |
| A circuit breaker keeps the gateway answering while Valkey is down | README.md:5, 62; docs/DECISIONS.md:314 (D037); docs/SPEC.md:124 |
| Deployed in kind | README.md:38-45, 66; docs/DECISIONS.md:446, 458 (D047) |
| Replicas as a StatefulSet | README.md:66; docs/DECISIONS.md:451 (D047) |
| Gateways with an HPA | README.md:66; docs/DECISIONS.md:452 (D047) |
| Pod Security `restricted` | README.md:66; docs/DECISIONS.md:450 (D047) |
| A NetworkPolicy whose enforcement CI checks | README.md:66; docs/DECISIONS.md:457 (D047); .github/workflows/ci.yml:98-102 |
| At 100 requests/s | docs/DECISIONS.md:456, 461 (D047) |
| Through rolling restarts of the gateways and of the replicas and a bundle swap, no response failed or was degraded | README.md:66; docs/DECISIONS.md:456 (D047); docs/SPEC.md:171; docs/TASKS.md:64 |
| Stage budgets of 100 ms | docs/DECISIONS.md:454 (D047); README.md:79 |
| On one node | docs/DECISIONS.md:458, 464 (D047); README.md:79 |

### Backend systems

All paths are in matching-engine.

| Number or claim | Source |
|---|---|
| Limit order book matching engine in Go | README.md:3; docs/DECISIONS.md:5-8 (D001) |
| Price-time priority | README.md:3; docs/SPEC.md:5 |
| REST and WebSocket APIs | README.md:3, 24 |
| One bounded queue per symbol | README.md:25-26, 40 |
| When the queue is full, new orders and cancels get 503; queries and subscriptions wait for room | README.md:40; docs/DECISIONS.md:121 (D020), 145 (D024) |
| Each batch goes to the command log before it is applied | docs/DECISIONS.md:103 (D017); README.md:42 |
| fsync every 10 ms | docs/DECISIONS.md:103 (D017); README.md:42 |
| A helper goroutine runs the fsync beside the matching goroutine | docs/DECISIONS.md:187 (D031); docs/BENCHMARKS.md:103 |
| A crash test kills the engine under load and checks each acknowledged command after restart. There is one such test, `TestKillUnderLoad` | docs/DECISIONS.md:104 (D017); README.md:42; cmd/engine/kill_test.go:190-197 |
| Price levels kept in a red-black tree | docs/DECISIONS.md:25 (D004); README.md:41 |
| Chosen by benchmark over a skip list and a sorted slice | docs/DECISIONS.md:26-27 (D004); bench-results/d004/README.md:30-34 |
| 250 ns against 405 ns at 10,000 levels: red-black tree against skip list, removing one level and adding one near the top | docs/DECISIONS.md:26 (D004); bench-results/d004/README.md:33 (249.5 / 404.7 ns) |
| Open loop: request i is due at t0 + i/rate whatever the replies | docs/DECISIONS.md:181 (D030); docs/BENCHMARKS.md:28 |
| Latency counts from the due time, so a stall is charged to every request it delayed | docs/BENCHMARKS.md:28; docs/DECISIONS.md:182 (D030) |
| A run is valid only if every trade is pushed once and in order | docs/BENCHMARKS.md:30; docs/DECISIONS.md:181 (D030) |
| Checked by gap-free `seq` and by summing a 64-bit hash of each trade | docs/DECISIONS.md:217 (D036) |
| CPU profile: HTTP and decoding take most of the time; the matching goroutine, book included, takes about 10% | docs/BENCHMARKS.md:76, 80 |
| `Book.Apply` is 1.4% to 2% of engine CPU, so its nodes are not pooled | docs/BENCHMARKS.md:113 |
| JSON key check: 5.79 µs and 79 allocations before, 0.51 µs and 0 after | docs/BENCHMARKS.md:97, 99 |

### Earlier projects

| Number or claim | Source |
|---|---|
| Each entry is the project's own summary, with its tags on the home page | site:src/content/projects/vault-share.json, backtest-lab.json and local-ledger.json (`summary`, `tags`), traced in site:docs/project-sources/vault-share.md, backtest-lab.md and local-ledger.md |

### Tools

Where each tool appears: site project tags first, then the repositories.

| Number or claim | Source |
|---|---|
| Go | site:src/content/projects/matching-engine.json:9, vault-share.json:10; matching-engine docs/DECISIONS.md:5-8 (D001); vault-share README.md:7 |
| Python | site:src/content/projects/backtest-lab.json:11, push-lab.json:9; backtest-lab docs/DECISIONS.md:3 (D001); push-lab docs/DECISIONS.md:71 (D001) |
| TypeScript | site:src/content/projects/local-ledger.json:11; local-ledger docs/DECISIONS.md:3 (D001); vault-share README.md:7 |
| gRPC | recserve README.md:5, 50; go.mod:15 |
| Kafka | recserve README.md:5, 60; go.mod:8 |
| Valkey | recserve README.md:5, 61; go.mod:11 |
| ONNX Runtime | recserve README.md:17, 56; go.mod:12 |
| Kubernetes | recserve README.md:38, 66; docs/DECISIONS.md:446, 458 (D047) |
| Prometheus | recserve README.md:38, 64; go.mod:6 |
| React | site:src/content/projects/vault-share.json:11, local-ledger.json:12, backtest-lab.json:27; vault-share README.md:7; backtest-lab docs/DECISIONS.md:3 (D001) |
| FastAPI | site:src/content/projects/backtest-lab.json:23; backtest-lab docs/SPEC.md:14; pyproject.toml:11 |
| Electron | site:src/content/projects/local-ledger.json:10; local-ledger docs/DECISIONS.md:3 (D001); package.json:46 |
| SQLite | site:src/content/projects/vault-share.json:103; vault-share README.md:7; backtest-lab docs/DECISIONS.md:97-100 (D018) |
| SQLCipher 4 format | site:src/content/projects/local-ledger.json:13; local-ledger README.md:18; docs/SPEC.md:59, 66 (SQLCipher-compatible, SQLCipher v4 scheme, through better-sqlite3-multiple-ciphers) |
| DuckDB | site:src/content/projects/backtest-lab.json:156; backtest-lab docs/SPEC.md:33; pyproject.toml:10 |
| Parquet | site:src/content/projects/backtest-lab.json:156, push-lab.json:109; backtest-lab docs/SPEC.md:33; push-lab docs/SPEC.md:32, 143 |
| Web Crypto | site:src/content/projects/vault-share.json:13; vault-share docs/DECISIONS.md:7-9 (D002) |
| Argon2id | vault-share README.md:31, 41; local-ledger README.md:18; docs/DECISIONS.md:85-87 (D015) |
| LightGBM | push-lab docs/SPEC.md:42; docs/DECISIONS.md:106 (D008); pyproject.toml:12 |
| faiss | site:src/content/projects/push-lab.json:111; push-lab docs/SPEC.md:38; docs/DECISIONS.md:102-104 (D007); pyproject.toml:11 |
| NumPy | ope-checks README.md:11, 17; pyproject.toml:13 |
| GitHub Actions | site:src/content/projects/backtest-lab.json:144; backtest-lab docs/SPEC.md:35; .github/workflows/data.yml:3-4 |
| This site: Astro | site:docs/SPEC.md:41; site:docs/DECISIONS.md:11-16 (D003); site:README.md:3 |
| This site: hand-written WebGL2 and GLSL | site:docs/SPEC.md:43; site:docs/DECISIONS.md:3-5 (D001), 108-110 (D015); site:src/gl/shaders/background.frag.glsl; site:README.md:3 |

### Where the work sits

| Number or claim | Source |
|---|---|
| Algorithm engineering and server-side systems, with backend development next to them | site:docs/SPEC.md:10; site:docs/DECISIONS.md:166 (D022); the three area sections above |
| Recommendation models and off-policy evaluation | push-lab docs/SPEC.md:11-13; ope-checks README.md:3 |
| Comparisons are registered before the results and reported as they came out | push-lab docs/SPEC.md:18; docs/DECISIONS.md:199 (D020); ope-checks README.md:9; obd/PREREGISTRATION.md:163 |
| A ranking result that went the other way | push-lab docs/DECISIONS.md:201 (D020) |
| A benchmark shortfall that the confirmatory campaigns did not show | ope-checks README.md:7, 28-29, 70 |
| A recommendation serving system checked under load through rolling restarts and a bundle swap | recserve README.md:66; docs/DECISIONS.md:456 (D047) |
| Every number on this site traces back to a project repository | site:docs/project-sources/, one file per project |
