# Sources: push-lab

Content: `src/content/projects/push-lab.json`.

All paths are in github.com/sHyanorn/push-lab at commit 5dfcc47.

| Number or claim | Source |
|---|---|
| Offline lab for push notification recommendation on public data; recall, ranking, volume, timing; every result labeled by how far it can be trusted | README.md:3; docs/SPEC.md:5 |
| Copy selection tested only in the simulator, which does not read the text | README.md:70; docs/SPEC.md:138 |
| Demo: two charts and the top of the report at shyanorn.github.io/push-lab/, light theme, captured from the published report | README.md:5-7; docs/DECISIONS.md:490-492 (D049) |
| Demo, first chart: DR bias against simulator truth along annoyance from 0 to 0.1; overrates two pushes a day, underrates fewer | README.md:28-32 |
| Demo, second chart: truth from −0.0065 to +0.0315, DR between −0.0049 and −0.0036; post hoc | README.md:30 |
| Demo, third image: no Tier B result; generated from committed results; no scripts | README.md:7, 18; docs/DECISIONS.md:491 (D049) |
| 0.891 (0.810 to 0.969) for IPS, 0.896 for DR on the full Men's campaign; no estimator passed | README.md:55; docs/DECISIONS.md:454, 456 (D046) |
| −2.3% (−2.4% to −2.2%) daily active share, one push a day against none, at the reference | README.md:39 |
| 23 of 24 sweep settings at which DR reverses the order of no pushes and one a day; post hoc | README.md:30 |
| 43 of 64 settings won at half volume, 19 lost, none won without annoyance | README.md:70 |
| Metrics note: Tier A is a measure of the estimators on real data; Tier C holds in the simulator with its sweep; 95% intervals; one model fit per setting | README.md:7, 12-16, 39; docs/SPEC.md:95 |
| Pipeline: two-tower recall with an ANN index, coarse and fine ranking, uplift models, delivery policy for send, slot and copy; 4 CPU cores | docs/SPEC.md:5, 11-12; README.md:77 |
| Notebook and static report | docs/SPEC.md:226-227 |
| Story registered as a hypothesis before the simulations; comparisons fixed in advance and reported as they came out | docs/SPEC.md:18-24 |
| No dataset links push sends to in-app use; simulation on video feed data; uplift trials are e-mail and ads | docs/SPEC.md:216-217 |
| Tiers A, B and C and what each rests on | docs/SPEC.md:89-93; README.md:12-16 |
| Diagram and description: download with checksums, Parquet, raw data not committed | README.md:82; docs/DECISIONS.md:77 (D003) |
| Diagram and description: two-tower and faiss recall, coarse rank top N by the two-tower score, LightGBM fine rank top-1 | docs/SPEC.md:143-155; docs/DECISIONS.md:104 (D008) |
| Diagram and description: delivery policy with gate, budget, slot and copy; run in the simulator; swept parameters | docs/SPEC.md:143-160 |
| Diagram and description: simulator response model fitted on KuaiRand random exposures | docs/SPEC.md:182 |
| Diagram and description: exploration logs fit the gate and feed the off-policy estimators; also checked on the Open Bandit Dataset | docs/DECISIONS.md:128 (D013); docs/SPEC.md:95 |
| Diagram and description: uplift methods on Hillstrom and Criteo, Tier A | docs/SPEC.md:45-46, 103 |
| Diagram and description: results in JSON; the report reads only them and labels every number with its tier | docs/DECISIONS.md:490 (D049); docs/SPEC.md:24 |
| Diagram paths | src/push_lab/data, recall, rank, uplift, sim, policy, ope, report |
| D002: no live traffic; three tiers; online effects about 0.1% to 0.5% of daily active users; offline estimates agree least on the longest horizon | docs/DECISIONS.md:73 |
| D009: Zhao et al. (2018); gate threshold and budget multiplier the same dual variable; fatigue can break a single multiplier | docs/DECISIONS.md:108 |
| D009: brute-force test on small instances, with a documented case where gains are not non-increasing | docs/SPEC.md:211 |
| D013: Hillstrom and Criteo models cannot score KuaiRand users; epsilon-greedy exploration over send, slot and template; overlap for the estimators; Tier A methods, Tier C gate | docs/DECISIONS.md:128 |
| D014: one profile for both would win by construction; simulator 22 April to 8 May; policy from 9 April to 21 April; shift and noise in the sweep | docs/DECISIONS.md:132-133, 249 (D025) |
| D049: reads `results/*.json`; README numbers between markers; one lookup and one formatter; no digits in templates; CI check; standard library, inline SVG, no scripts; published after CI passes | docs/DECISIONS.md:490-492 |
| Fine ranker: pre-registered C2; GAUC 0.545 against 0.598 on random exposures, opposite to the expected direction | docs/DECISIONS.md:197 (D020) |
| Fine ranker: same columns, types and feature order; wins on its own validation rows; 53% against 17.7% click rate; smoothed rates carry little signal, counts more | docs/DECISIONS.md:198 |
| Fine ranker: hyperparameters as registered; changes reported as separate variants | docs/DECISIONS.md:200 |
| Open Bandit: Tier B needs an estimator checked against a known answer on real logs | docs/DECISIONS.md:387 (D041) |
| Open Bandit: 46 clicks in the small random sample, 2,321 in the full campaign; 50 times the clicks | docs/DECISIONS.md:395 (D042), 412 (D043) |
| Open Bandit: small-sample passes; full campaign none passes, IPS 0.891, DR 0.896; no Tier B result | docs/DECISIONS.md:454, 456 (D046) |
| Open Bandit: deployed policy not the fixed prior; re-weighting moves IPS to 0.917 | docs/DECISIONS.md:418 (D043); README.md:55 |
| Open Bandit: rows are the three positions of an impression; resampling by impression | docs/DECISIONS.md:454 (D046) |
| Random streams: trailing zeros ignored; exploration coins keyed by seed, day and slot; open rate 0.13 to 0.38 in a synthetic run | docs/DECISIONS.md:292 (D032) |
| Random streams: purpose first and a closing 1; test of uncorrelated streams; bit-for-bit rerun of `sim.build` | docs/DECISIONS.md:293-294 |
