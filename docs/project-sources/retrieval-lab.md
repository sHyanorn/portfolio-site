# Sources: retrieval-lab

Content: `src/content/projects/retrieval-lab.json`. Figures: `scripts/figures.ts`.

All paths are in github.com/sHyanorn/retrieval-lab at commit 323634b.

| Number or claim | Source |
|---|---|
| Summary: BM25 and dense retrieval in Go, where BM25, exact dense search and fusion are each accepted against a number that … | README.md:3, 5; docs/SPEC.md:5, 10, 62; docs/BENCHMARKS.md:53-58, 102-107 |
| Tags: Go / Information retrieval / BM25 / Dense retrieval / BEIR | README.md:3, 5 |
| Demo, first figure, description: Dot chart of nDCG@10 on six BEIR test sets: Pyserini's published BM25, this project's BM25 and Bleve's own … | docs/BENCHMARKS.md:53-58, 83-88 |
| Demo, first figure, caption: nDCG@10 on six BEIR test sets. This project's BM25, Lucene's scoring computed from a Bleve index, equals … | README.md:5; docs/BENCHMARKS.md:40, 53-58, 78, 83-88 |
| Demo, second figure, description: Dot chart of nDCG@10 of BGE-base-en-v1.5 with exact search minus Pyserini's flat condition, with the … | docs/BENCHMARKS.md:102-107; docs/SPEC.md:41 |
| Demo, second figure, caption: nDCG@10 of BGE-base-en-v1.5 with exact search, minus Pyserini's flat condition: 0.0000 on ArguAna and … | docs/BENCHMARKS.md:102-107; README.md:5; docs/SPEC.md:41 |
| Demo, third figure, description: Chart of the lowest cosine between a document vector of this project and Pyserini's, on a scale of one minus … | docs/DECISIONS.md:73 (D010); docs/BENCHMARKS.md:118-119 |
| Demo, third figure, caption: How a document is encoded was read off Pyserini's own vectors, which it publishes without the command that … | docs/DECISIONS.md:72-73 (D010); docs/BENCHMARKS.md:118-119 |
| Words inside the figures: Figure 1: "BM25, nDCG@10 on six BEIR test sets" / "Pyserini, published" / "this project" / "Bleve's own BM25" … | as the three captions above |
| Metric: 6 of 6 / label: BEIR test sets on which BM25's nDCG@10 and Recall@100 equal Pyserini's published values to … | README.md:5; docs/BENCHMARKS.md:53-58; results/bm25-flat.sha256:1-6 |
| Metric: −0.243 to +0.148 / label: nDCG@10 of Bleve's own BM25 scorer minus the same anchors, with k1 and b set alike. … | README.md:5, 31; docs/BENCHMARKS.md:83, 86; docs/DECISIONS.md:60 (D008) |
| Metric: 0.0006 / label: the largest gap in nDCG@10 between BGE-base-en-v1.5 with exact search and Pyserini's flat … | README.md:5; docs/BENCHMARKS.md:102-107 |
| Metric: 28 / label: documents of SciFact and ArguAna whose vector had a cosine below 0.9999 to Pyserini's, the lowest … | docs/DECISIONS.md:73 (D010); docs/BENCHMARKS.md:118-119 |
| Metrics, note: The anchors are the four-decimal values in Pyserini's `beir.yaml` at one commit, and for fusion the numbers of its BEIR fusion page at that commit. The tolerance … | docs/DECISIONS.md:27 (D004), 85-86 (D012); docs/SPEC.md:10, 62 (the fusion page at the same Pyserini commit), 28 (BM25: before any BM25 result), 39 (BGE: with the first BGE results), 41; docs/BENCHMARKS.md:7 (`beir.yaml` at Pyserini d1b77315), 93, 124, 141, 145, 152-157, 188, 203, 212-217, 222, 227-232; README.md:5, 17, 29-30; docs/TASKS.md:24-31 |
| Metrics, report link: Benchmarks | docs/BENCHMARKS.md (the file's title) |
| Problem: Two implementations of one BM25 configuration still differ in details of tokenization and stemming, and can … | docs/DECISIONS.md:28 (D004); docs/SPEC.md:31 |
| Problem: This project builds its retrieval components in Go. BM25, exact dense search and fusion are each accepted against … | README.md:3; docs/SPEC.md:5, 9-10, 21, 31, 49 (HNSW: no pass threshold), 62 (fusion: its BEIR fusion page) |
| Problem: Done so far: the evaluation harness, BM25, dense retrieval with exact search and with recserve's HNSW graph, and fusion … | README.md:5; docs/TASKS.md:9-31; README.md:3 (cross-encoder reranking not implemented); docs/SPEC.md:5 (a pre-registered study); docs/PREREGISTRATION.md:1, 3; docs/STUDY.md:8, 14 (no results yet) |
| Architecture, labels: data: BEIR data / dataSub: six test sets, by SHA-256 / bm25: BM25 / bm25Sub: Bleve index, Lucene's scoring / … | README.md:5, 15; docs/BENCHMARKS.md:7, 36, 40, 93, 112; docs/DECISIONS.md:33 (D005), 78 (D011); docs/SPEC.md:17 (TREC run files) |
| Architecture, description: `scripts/data.sh` downloads the six BEIR datasets and checks them by SHA-256. `cmd/bm25` indexes the title … | README.md:5, 15; docs/BENCHMARKS.md:36, 40, 93, 112, 117-119; docs/DECISIONS.md:13 (D002), 20 (D003), 78 (D011); docs/SPEC.md:17; cmd/table/dense.go:51-63 |
| Decision: The anchors and the tolerance come first | docs/DECISIONS.md:27-28 (D004); docs/SPEC.md:28, 30 |
| Decision: Metrics in Go, checked against trec_eval | docs/DECISIONS.md:20-21 (D003) |
| Decision: Bleve holds the index; the scoring is Lucene's | docs/DECISIONS.md:33-39 (D005) |
| Decision: Document text and length, read off Pyserini's vectors | docs/DECISIONS.md:72-73 (D010) |
| Decision: CI checks the dense results by tolerance, not by checksum | docs/DECISIONS.md:85-86 (D012) |
| Challenge: Bleve's BM25 is not Lucene's, and varies between builds | docs/BENCHMARKS.md:78, 83, 86; docs/DECISIONS.md:59-60 (D008) |
| Challenge, link: Reported to Bleve: blevesearch/bleve#2415 / url: https://github.com/blevesearch/bleve/issues/2415 | the issue itself, opened by the owner (not in the repository) |
| Challenge: A logarithm one unit in the last place lower | docs/DECISIONS.md:21, 23 (D003) |
| Challenge: Twenty-eight documents with characters nobody sees | docs/DECISIONS.md:72-73 (D010), 68 (D009 limits) |
