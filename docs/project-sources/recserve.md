# Sources: recserve

Content: `src/content/projects/recserve.json`. Figures: `scripts/figures.ts`.

All paths are in github.com/sHyanorn/recserve at commit c3c564a.

| Number or claim | Source |
|---|---|
| Summary: A recommendation serving system in Go: retrieval, features, ranking and rerank behind one HTTP API, with the … | README.md:3, 5; docs/DECISIONS.md:484 (D047 point 6), 486 (D047 point 8) |
| Tags: Go / Recommender systems / gRPC / Kafka / Kubernetes | README.md:3 (Go, recommendation serving), 5 (gRPC, Kafka), 49-56 (kind); go.mod |
| Demo, first figure, description: Chart of the kind check at 100 requests/s. Responses that failed or were degraded: as deployed, 0 of 15,000; … | docs/DECISIONS.md:486 (D047 point 8), 492 (D047 measured 4); docs/DECISIONS.md:388 (D041 point 1, the 30 s default) |
| Demo, first figure, caption: The kind check: 100 requests/s while the gateways roll, then the replicas, then the gateways swap bundles. As … | docs/DECISIONS.md:486 (D047 point 8), 492 (D047 measured 4); docs/DECISIONS.md:388 (D041 point 1) |
| Demo, second figure, description: Range chart, before and after the inner product moved to AVX2, three runs each, in ms. p99 at 200 requests/s: … | docs/BENCHMARKS.md:503-516 |
| Demo, second figure, caption: Before and after the inner product of exact search moved to AVX2: three runs each, alternating, and a bar … | docs/BENCHMARKS.md:505, 507-516; docs/DECISIONS.md:566 (D053, the inner product of exact search) |
| Demo, third figure, description: Bar chart of the ranker on the 680 held-out users, before MMR. Recall@10: 0.091 for the ranker, 0.026 for … | docs/DECISIONS.md:191 (D027 point 7) |
| Demo, third figure, caption: The logistic-regression ranker on the 680 held-out users, measured before MMR: recall@10 0.091 against 0.026 … | docs/DECISIONS.md:191 (D027 point 7) |
| Words inside the figures: Figure 1: "The kind check at 100 requests/s" / "responses failed or degraded" / "as deployed" / "0 of 15,000" … | as the three captions above |
| Metric: 0 of 15,000 / label: responses failed or degraded in kind at 100 requests/s, through rolling restarts of the … | docs/DECISIONS.md:486 (D047 point 8), 484 (point 6, 100 ms); docs/SPEC.md:82-85 (5 to 15 ms); docs/DECISIONS.md:367 (D039, the history budget becomes 5 ms) |
| Metric: 0.091 / label: recall@10 of the logistic-regression ranker on 680 held-out users, against 0.026 for retrieval … | docs/DECISIONS.md:191 (D027 point 7); README.md:120 |
| Metric: 4.27–4.64 ms / label: p99 at 400 requests/s after the inner product of exact search moved to AVX2, from … | docs/BENCHMARKS.md:505, 514, 516; docs/DECISIONS.md:566 (D053) |
| Metric: 0.2–0.3% / label: of responses fell back to the request's own items at 200 requests/s on Valkey and Kafka: … | README.md:109 (the earlier 3 ms, 5 ms now); docs/BENCHMARKS.md:441, 443 (the stage of history read and cache lookup), 453 (stage p99 2,902, 4,343 and 5,796 µs), 458 (fail on the median, above 3 ms), 459, 474 (0.22 to 0.31%, past the 3 ms budget); docs/DECISIONS.md:211 (D029 point 3, the fallback to `recent`), 363-364 (D039: four workers, the health check), 367 (D039, the budget becomes 5 ms); docs/SPEC.md:82 |
| Metrics, note: The latency and load figures come from cloud VMs with 4 vCPUs. The kind cluster is one node, which the … | docs/BENCHMARKS.md:352, 411, 439, 485, 137, 522-526, 528 (sweep, the 3 ms history budget), 719, 727, 731-736 (fault runs), 238 (F3, recovery within 5 s), 487, 289 (different VMs); docs/SPEC.md:43, 90; docs/DECISIONS.md:488, 494 (D047 measured, rationale), 367 (the history budget becomes 5 ms); README.md:102, 90 (sweep), 7 (fault runs), 86 (different VMs) |
| Metrics, report link: Benchmarks | docs/BENCHMARKS.md (the file's title) |
| Problem: recserve is the serving side of a recommender: a request passes multi-source retrieval, a point-in-time … | docs/SPEC.md:5; docs/TASKS.md:88-89 (the sister project's bundle is not loaded yet) |
| Problem: The goal is behaviour that a test can state. A response never mixes two bundle versions. With one replica of … | docs/SPEC.md:115 (each property is an executable test); docs/DECISIONS.md:422 (D042 point 1); docs/SPEC.md:128 (property 12), 96 (left out after five calls at the shard deadline, asked again once a second), 126 (property 10), 124 (property 8); docs/DECISIONS.md:410, 413, 415 (D041, M7 points 2, 5 and 7); README.md:115 |
| Problem: The scale is small and stated plainly. The catalog has 25.6k items, so neither approximate search nor … | docs/SPEC.md:41, 43; README.md:86; docs/BENCHMARKS.md:487-491, 719 (each set on one 4-vCPU VM) |
| Architecture, labels: bundle: model bundle / bundleSub: version is the digest of its files / gateway: gateway / gatewaySub: HTTP … | README.md:66 (digest), 3 and 71 (HTTP API, per-stage deadlines), 61-62 (replicas, failover, one hedge), 115 (ejection), 74 (ingest), 75-76 (Valkey, breaker); docs/SPEC.md:55 (keyed by user), 96 (ejection) |
| Architecture, description: The gateway (`cmd/gateway`) loads a model bundle, whose version is the digest of its files, and answers `POST … | README.md:5, 49, 60-63, 66-68, 71, 73-76, 115; docs/SPEC.md:49-66, 71, 83, 94, 96, 102; docs/DECISIONS.md:191 (candidates without the seen items), 422-423 (D042); internal/recommend/recommend.go:465-486 (seen items dropped before the ranker) |
| Decision: A deadline per stage, and a reason for every fallback | docs/DECISIONS.md:209-211, 213 (D029 points 1 to 3 and 5); docs/SPEC.md:94 |
| Decision: Failover at once, hedges on a budget | docs/DECISIONS.md:389-393 (D041 points 2 to 6, 2.5 ms in point 4), 398 (rationale), 407 (hedge delay, M6), 410-411, 413, 415 (outlier detection, M7); docs/SPEC.md:96 |
| Decision: A response never mixes two versions | docs/DECISIONS.md:422-423, 425 (D042 points 1, 2 and 4) |
| Decision: A ranker checked when its bundle loads | docs/DECISIONS.md:185-187, 189, 191-193 (D027 points 1 to 3, 5, 7 and 8, rationale) |
| Decision: kind checks behaviour, with budgets of 100 ms | docs/DECISIONS.md:484 (D047 point 6), 491 (measured 3), 493 (measured in M6), 494 (rationale), 495 (limits), 367 (D039, the history budget becomes 5 ms); docs/BENCHMARKS.md:588-591; README.md:82 |
| Challenge: Gateways that kept dialing the old address | docs/DECISIONS.md:388 (D041 point 1), 397 (D041 measured), 486 (D047 point 8) |
| Challenge: A hand-written HNSW that failed its latency criterion | docs/DECISIONS.md:46 (D007, pure Go), 99-100 (D016); docs/BENCHMARKS.md:79, 430 (fails as written, no threshold changed), 621, 631, 635-636; docs/DECISIONS.md:197, 202 (D028); README.md:98 |
| Challenge: A ranker whose weight on the vector score is negative | docs/DECISIONS.md:191 (D027 point 7); README.md:120, 96; docs/BENCHMARKS.md:98-105, 686, 692-694, 699; bench-results/m7/quality.md:1-13; internal/recommend/recommend.go:3, 486 (MMR in the pipeline) |
| Challenge: An idle Kafka that used two thirds of a CPU | docs/BENCHMARKS.md:497; docs/DECISIONS.md:364 (D039) |
