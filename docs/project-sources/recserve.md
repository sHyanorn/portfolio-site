# Sources: recserve

Content: `src/content/projects/recserve.json`. Figures: `scripts/figures.ts`.

All paths are in github.com/sHyanorn/recserve at commit 77069ac.

| Number or claim | Source |
|---|---|
| Summary: A recommendation serving system in Go: retrieval, features, ranking and rerank behind one HTTP API, with the … | README.md:3, 5; docs/DECISIONS.md:459 (D047 point 6), 461 (D047 point 8) |
| Tags: Go / Recommender systems / gRPC / Kafka / Kubernetes | README.md:3 (Go, recommendation serving), 5 (gRPC, Kafka), 45-52 (kind); go.mod |
| Demo, first figure, description: Chart of the kind check at 100 requests/s. Responses that failed or were degraded: as deployed, 0 of 15,000; … | docs/DECISIONS.md:461 (D047 point 8), 467 (D047 measured 4); docs/DECISIONS.md:374 (D041 point 1, the 30 s default) |
| Demo, first figure, caption: The kind check: 100 requests/s while the gateways roll, then the replicas, then the gateways swap bundles. As … | docs/DECISIONS.md:461 (D047 point 8), 467 (D047 measured 4); docs/DECISIONS.md:374 (D041 point 1) |
| Demo, second figure, description: Range chart, before and after the inner product moved to AVX2, three runs each, in ms. p99 at 200 requests/s: … | docs/BENCHMARKS.md:414-427 |
| Demo, second figure, caption: Before and after the inner product of exact search moved to AVX2: three runs each, alternating, and a bar … | docs/BENCHMARKS.md:416, 418-427; docs/DECISIONS.md:539 (D053, the inner product of exact search) |
| Demo, third figure, description: Bar chart of the ranker on the 680 held-out users, before MMR. Recall@10: 0.091 for the ranker, 0.026 for … | docs/DECISIONS.md:189 (D027 point 7) |
| Demo, third figure, caption: The logistic-regression ranker on the 680 held-out users, measured before MMR: recall@10 0.091 against 0.026 … | docs/DECISIONS.md:189 (D027 point 7) |
| Words inside the figures: Figure 1: "The kind check at 100 requests/s" / "responses failed or degraded" / "as deployed" / "0 of 15,000" … | as the three captions above |
| Metric: 0 of 15,000 / label: responses failed or degraded in kind at 100 requests/s, through rolling restarts of the … | docs/DECISIONS.md:461 (D047 point 8), 459 (point 6) |
| Metric: 0.091 / label: recall@10 of the logistic-regression ranker on 680 held-out users, against 0.026 for retrieval … | docs/DECISIONS.md:189 (D027 point 7); README.md:97 |
| Metric: 4.27–4.64 ms / label: p99 at 400 requests/s after the inner product of exact search moved to AVX2, from … | docs/BENCHMARKS.md:416, 425, 427; docs/DECISIONS.md:539 (D053) |
| Metric: 0.2–0.3% / label: of responses fell back to the request's own items at 200 requests/s on Valkey and Kafka: … | README.md:87; docs/BENCHMARKS.md:362, 379 (2,902, 4,343 and 5,796 µs), 395 (0.22 to 0.31%); docs/DECISIONS.md:209 (D029 point 3, the fallback to `recent`), 350-351 (D039: four workers, the health check) |
| Metrics, note: The latency and load figures come from cloud VMs with 4 vCPUs. The kind cluster is one node, which the … | docs/BENCHMARKS.md:273, 332, 360, 402; docs/SPEC.md:43; docs/DECISIONS.md:463, 468 (D047 measured, rationale); README.md:80, 5; docs/TASKS.md:73, 77 |
| Metrics, report link: Benchmarks | docs/BENCHMARKS.md (the file's title) |
| Problem: recserve is the serving side of a recommender: a request passes multi-source retrieval, a point-in-time … | docs/SPEC.md:5; docs/TASKS.md:88-89 (the sister project's bundle is not loaded yet) |
| Problem: The goal is behaviour that a test can state. A response never mixes two bundle versions. With one replica of … | docs/SPEC.md:115 (each property is an executable test); docs/DECISIONS.md:397 (D042 point 1); docs/SPEC.md:128 (property 12), 126 (property 10), 124 (property 8) |
| Problem: The scale is small and stated plainly. The catalog has 25.6k items, so neither approximate search nor … | docs/SPEC.md:41, 43 |
| Architecture, labels: bundle: model bundle / bundleSub: version is the digest of its files / gateway: gateway / gatewaySub: HTTP … | README.md:62 (digest), 3 and 67 (HTTP API, per-stage deadlines), 57-58 (replicas, failover, one hedge), 70 (ingest), 71-72 (Valkey, breaker); docs/SPEC.md:55 (keyed by user) |
| Architecture, description: The gateway (`cmd/gateway`) loads a model bundle, whose version is the digest of its files, and answers `POST … | README.md:5, 45, 56-59, 62-64, 67, 69-72; docs/SPEC.md:49-66, 71, 83, 94, 102; docs/DECISIONS.md:189 (candidates without the seen items), 397-398 (D042); internal/recommend/recommend.go:465-486 (seen items dropped before the ranker) |
| Decision: A deadline per stage, and a reason for every fallback | docs/DECISIONS.md:207-209, 211 (D029 points 1 to 3 and 5); docs/SPEC.md:94 |
| Decision: Failover at once, hedges on a budget | docs/DECISIONS.md:375-379 (D041 points 2 to 6), 384 (rationale) |
| Decision: A response never mixes two versions | docs/DECISIONS.md:397-398, 400 (D042 points 1, 2 and 4) |
| Decision: A ranker checked when its bundle loads | docs/DECISIONS.md:183-185, 187, 189-191 (D027 points 1 to 3, 5, 7 and 8, rationale) |
| Decision: kind checks behaviour, with budgets of 100 ms | docs/DECISIONS.md:459 (D047 point 6), 466 (measured 3), 468 (rationale), 469 (limits) |
| Challenge: Gateways that kept dialing the old address | docs/DECISIONS.md:374 (D041 point 1), 383 (D041 measured), 461 (D047 point 8) |
| Challenge: A hand-written HNSW that failed its latency criterion | docs/DECISIONS.md:44 (D007, pure Go), 97-98 (D016); docs/BENCHMARKS.md:77, 351, 353; docs/DECISIONS.md:195, 200 (D028) |
| Challenge: A ranker whose weight on the vector score is negative | docs/DECISIONS.md:189 (D027 point 7); README.md:97 |
| Challenge: An idle Kafka that used two thirds of a CPU | docs/BENCHMARKS.md:408; docs/DECISIONS.md:351 (D039) |
