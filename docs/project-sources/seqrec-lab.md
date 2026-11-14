# Sources: seqrec-lab

Content: `src/content/projects/seqrec-lab.json`. Figures: `scripts/figures.ts`.

All paths are in github.com/sHyanorn/seqrec-lab at commit 45bf026.

| Number or claim | Source |
|---|---|
| Summary: A pre-registered study of Transformer sequential recommenders, SASRec, BERT4Rec and gSASRec, with equal tuning … | README.md:3, 11; docs/SPEC.md:7, 26-33, 92; docs/METHODS.md:140, 218; docs/RESULTS.md:10, 18, 200 (ten and six leave-one-out seeds, five on the temporal split), 79-80, 257-258 (ahead of gSASRec and BERT4Rec, rejected), 83, 260, 108, 278 (minimum-effect test against SASRec-BCE); docs/DECISIONS.md:653-657 (D047, RTX 4090) |
| Summary: MovieLens-1M's test targets had been read for anchor checks before its final runs. | docs/METHODS.md:392; docs/RESULTS.md:23 |
| Tags: Python / PyTorch / Sequential recommendation / Pre-registration / Equivalence testing | pyproject.toml; docs/SPEC.md:45; docs/METHODS.md:1-3, 173-175 |
| Demo, first figure: mean test NDCG@10 per arm on leave-one-out, both datasets; ten and six seeds; baselines once; BERT4Rec's runs 0.1138 to 0.1695 | docs/RESULTS.md:18, 33, 41-47, 200, 220-226 |
| Demo, second figure: sampled softmax and gBCE against full cross-entropy, relative differences with 95% intervals; H2b's ±2%; equivalence not shown; underpowered on MovieLens-1M | docs/RESULTS.md:24, 103-106, 273-276; docs/SPEC.md:33 |
| Demo, third figure: seconds to the target, seeds 1 to 5; target 0.95 of SASRec-CE's mean best validation NDCG@10; one RTX 4090 with a Ryzen 9 7950X host per dataset; H2a supported on MovieLens-1M on this kind of host, not on Video_Games | docs/RESULTS.md:17, 110-120, 199, 280-291; docs/METHODS.md:238, 240, 293 |
| Words inside the figures: "Test NDCG@10, leave-one-out, mean over seeds" / "Against full cross-entropy, relative difference in test NDCG@10" / "±2%" / "Seconds of training to the target quality, seeds 1 to 5" / "5 of 5", "4 of 5", "1 of 5", "0 of 5 reach it" | as the three figures above |
| Metric: +34.3%, +39.7% / SASRec-CE over SASRec-BCE; minimum-effect tests | docs/RESULTS.md:76, 83, 108, 254, 260, 278 |
| Metric: +19.5%, +22.8% / SASRec-CE over BERT4Rec; G3 confirmed and H1a on MovieLens-1M | docs/RESULTS.md:80, 82, 91, 96, 258 |
| Metric: −4.1% to −8.0% / sampled softmax and gBCE against full cross-entropy; equivalence not shown; intervals below −2% | docs/RESULTS.md:103-107, 273-277 |
| Metric: 164 / final runs, each reading the test data once; 31.4 GPU hours; 200 tuning runs read it zero times | docs/RESULTS.md:17, 19, 199, 201 (99 + 65 = 164; 2.88 + 28.50 = 31.38; 100 + 100 = 200, computed) |
| Metrics, note: log NDCG@10, relative differences, Welch intervals; Holm over the registered family size, pending and its reporting; one BERT4Rec seed and the underpowered label; anchor reads for four arms; Steam and MovieLens-20M | docs/METHODS.md:162, 170, 378-383; docs/RESULTS.md:7-8, 10, 18, 23-24, 32, 72, 200; docs/DECISIONS.md:338 (D033), 755-760 (D051) |
| Metrics, report link: Results | docs/RESULTS.md (the file's title) |
| Problem: BERT4Rec was reported to beat SASRec. Later work traced most of that gap to … | docs/SPEC.md:15-16 |
| Problem: seqrec-lab reimplements SASRec, BERT4Rec and gSASRec in plain PyTorch and compares five arms … | docs/SPEC.md:5-9, 26, 31, 45-48; docs/METHODS.md:3, 140, 166, 218; docs/DECISIONS.md:200-205 (D024) |
| Problem: On the two datasets with results, H1a … H1b … H2a … H2b … | docs/SPEC.md:27-33; docs/RESULTS.md:11, 91-92, 106-108, 119, 265-266, 276-278, 289; docs/METHODS.md:198, 206-207 |
| Problem: MovieLens-1M and Video_Games have their final runs and confirmatory analysis … | README.md:11; docs/RESULTS.md:10; docs/SPEC.md:35, 40; docs/TASKS.md:90-103 |
| Architecture, labels: datasets / models / tuning / rented GPU / final runs / test reads / export / registration / analysis | README.md:44-68; docs/SPEC.md:92; docs/METHODS.md:3, 135-141, 170-175, 218, 293, 394-404; docs/RESULTS.md:17, 199 |
| Architecture, description: `seqrec data prepare` downloads the four datasets, checks each file by SHA-256 … | README.md:44-68; src/seqrec/data/splits.py; src/seqrec/runner/tune.py; docs/METHODS.md:3, 135-141, 293, 394-404; docs/RESULTS.md:3, 17, 199 |
| Rule §7: A 2% effect, tested across runs | docs/METHODS.md:160-175, 210-220; docs/DECISIONS.md:100 (D010), 793 (D053), 907 (D062); docs/SPEC.md:16; docs/RESULTS.md:24, 205 |
| Rule §5: One tuning budget for every arm | docs/METHODS.md:107-115, 135-145; docs/DECISIONS.md:81, 86 (D009) |
| Rule §11: Test data read once | docs/METHODS.md:394-404; docs/RESULTS.md:19, 201 |
| Rule §3: Shuffled order as a control | docs/METHODS.md:50-53; docs/RESULTS.md:128-131, 298-300 |
| Limit: One seed set the power on MovieLens-1M | docs/RESULTS.md:24, 31-33; docs/DECISIONS.md:793 (D053), 811-812 (D055) |
| Limit: MovieLens-1M's test targets were read before | docs/METHODS.md:378-383, 392; docs/RESULTS.md:23; docs/DECISIONS.md:314, 319, 328-329 (D032), 338 (D033) |
| Limit: Times hold for one kind of host | docs/METHODS.md:293; docs/RESULTS.md:26, 120; docs/DECISIONS.md:731 (D048); docs/TASKS.md:70 |
