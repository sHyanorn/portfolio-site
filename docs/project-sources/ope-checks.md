# Sources: ope-checks

Content: `src/content/projects/ope-checks.json`.

All paths are in github.com/sHyanorn/ope-checks at commit 7a097af.

| Number or claim | Source |
|---|---|
| Pre-registered checks of published off-policy evaluation results | README.md:3; pyproject.toml:8 |
| The first study retests the Open Bandit benchmark | README.md:5, 7 |
| On the two confirmatory campaigns, with ten-minute blocks as resampling units, the standard estimate is not shown to fall short of the on-policy click rate | README.md:13, 17, 28-31, 70 |
| Tags: Python, off-policy evaluation, pre-registration | pyproject.toml:10; README.md:3, 9 |
| Tags: block bootstrap, Open Bandit Dataset | obd/PREREGISTRATION.md:73; README.md:5, 7, 17 |
| Demo: three figures, the registered estimates, the resampling units (post hoc) and the distances of H1, drawn from the result files | README.md:125 |
| Demo, first figure: fixed-prior IPS (H3) and the estimate with the target aligned to the BTS log in three-hour periods (H4), each over the on-policy click rate, on the confirmatory campaigns | README.md:28, 32-33; obd/PREREGISTRATION.md:99, 107-108, 112 |
| Demo, first figure: intervals from 10,000 replicates over ten-minute blocks | README.md:17; obd/PREREGISTRATION.md:73, 75 |
| Demo, first figure: the pooled unit is 0.54 times All plus 0.46 times Women's, not a third sample | obd/PREREGISTRATION.md:65; README.md:19; obd/results/pooled.json (`weights`) |
| Demo, first figure: fixed-prior IPS 0.948 (0.867 to 1.033) on All, 1.004 (0.917 to 1.099) on Women's, 0.974 (0.915 to 1.036) pooled | README.md:28; obd/results/all.json, women.json and pooled.json (`quantities["h3.ips"]`) |
| Demo, first figure: aligned estimate 1.031 (0.932 to 1.128), 1.062 (0.974 to 1.158), 1.045 (0.978 to 1.114) | README.md:33; obd/results/all.json and women.json (`quantities["h4.rho.3"]`); obd/results/pooled.json (`quantities["h4.rho"]`) |
| Demo, first figure: all six intervals contain 1; no shortfall is shown, so by the registered rule the gap is not read | README.md:28-29, 33, 37, 71; obd/PREREGISTRATION.md:116 |
| Demo, first figure: paired difference 0.072 (0.002 to 0.139) pooled, with an interval that contains 0 on All and on Women's | README.md:35; obd/results/pooled.json (`quantities["h4.d"]`); obd/results/all.json and women.json (`quantities["h4.d.3"]`) |
| Pooled lower end 0.915; a shortfall of up to 8.5% not excluded is 1 minus that end (first figure, first metric, first limit) | README.md:28; obd/results/pooled.json (`quantities["h3.ips"].interval`, lower end 0.9146) |
| Demo, second figure: post hoc; the IPS ratio with its 2.5th to 97.5th percentile interval when rows, impressions or ten-minute blocks are resampled | obd/posthoc/README.md:3, 9, 13-17; README.md:83 |
| Demo, second figure: the block intervals are the registered ones | obd/posthoc/README.md:17 |
| Demo, second figure: on All and Women's every interval contains 1 | obd/posthoc/README.md:25, 27, 42; README.md:83 |
| Demo, second figure: on Men's the intervals over rows and impressions end below 1, at 0.964 and 0.968, and the block interval ends at 1.005 | obd/posthoc/README.md:23, 42; obd/posthoc/results/units.json (`men.h3.rows.ips`, `men.h3.impressions.ips`, `men.h3.blocks.ips`) |
| Demo, second figure: Men's is the development campaign and enters no verdict | README.md:13; obd/PREREGISTRATION.md:62 |
| Demo, second figure: the block interval is the widest on every campaign | obd/posthoc/README.md:23, 25, 27, 34, 36, 38 |
| Demo, third figure: D, the row-weighted mean over hours and positions of the total variation distance between the published prior and the item frequencies of the BTS log | obd/PREREGISTRATION.md:82 |
| Demo, third figure: D0, the same statistic between alternate ten-minute blocks of each hour of that log | obd/PREREGISTRATION.md:83 |
| Demo, third figure: registered without intervals | README.md:23; obd/posthoc/README.md:326; obd/results/all.json and women.json (`h1`) |
| Demo, third figure: D0 is a floor, not a distance the prior should have; it holds noise and the policy's own change within the hour | obd/PREREGISTRATION.md:83-84, 155 |
| Demo, third figure: D 0.526 and D0 0.136 on All; D 0.527 and D0 0.115 on Women's | README.md:23; obd/results/all.json and women.json (`h1.d`, `h1.d0`) |
| Demo, third figure: first-hour distance by position, 0.180, 0.126 and 0.088 on All, 0.164, 0.098 and 0.105 on Women's, reported without a rule | README.md:68; obd/PREREGISTRATION.md:86; obd/results/all.json and women.json (`h1.first_hour`) |
| Demo, third figure: no noise floor registered for a single hour, and no other single hour reported | obd/PREREGISTRATION.md:83, 86; obd/posthoc/README.md:318 (a first-hour floor is post hoc) |
| 0.974 of the on-policy click rate: fixed-prior IPS pooled over All and Women's, interval 0.915 to 1.036 over ten-minute blocks; no shortfall shown | README.md:17, 28-29; obd/results/pooled.json (`quantities["h3.ips"]`, `h3.ips.label`) |
| 0.53: D 0.526 on All and 0.527 on Women's, against noise floors of 0.14 and 0.11 (0.136, 0.115) | README.md:23; obd/results/all.json and women.json (`h1.d`, `h1.d0`) |
| The prior is not the distribution the log shows: H1 is `inconsistent` on both campaigns | README.md:24, 68; obd/PREREGISTRATION.md:80, 85; obd/results/all.json and women.json (`h1.label`) |
| +0.072: paired change in the pooled estimate with the target aligned in three-hour periods, interval 0.002 to 0.139 | README.md:32, 35; obd/results/pooled.json (`quantities["h4.d"]`, `h4.widths`) |
| Its lower end is, post hoc, about two Monte Carlo standard errors from 0 | obd/posthoc/README.md:228, 270 (0.0020; 2.1); obd/posthoc/results/lengths.json (`pooled["10"]["h4.d"]`: `interval`, `sd`) |
| On All and on Women's alone the interval contains 0 | README.md:35-36; obd/results/all.json and women.json (`quantities["h4.d.3"]`, `h4.alignment`) |
| No shortfall was established, so the registered rule does not read the gap (third metric, third limit) | README.md:37, 71; obd/PREREGISTRATION.md:116 |
| 1.31 to 1.47 times: standard deviation of the H3 ratios with ten-minute blocks over the one with rows or impressions, on all three campaigns, post hoc | README.md:83; obd/posthoc/README.md:34-41; obd/posthoc/results/units.json (`all`, `men`, `women`: `h3.sd_of_blocks_over`) |
| Metrics note: registered results on All and Women's from one run of commit `11e9340` | README.md:17; obd/results/all.json, women.json and pooled.json (`code_commit`) |
| Metrics note: intervals are the 2.5th and 97.5th percentiles of 10,000 replicates that resample ten-minute blocks | README.md:17; obd/PREREGISTRATION.md:73, 75 |
| Metrics note: the block length was fixed with the Men's results in view, as the registration states | obd/PREREGISTRATION.md:40, 64 |
| Men's is the development campaign and enters no verdict; its IPS ratio is 0.891 (0.790 to 1.005), from that campaign's own result file (metrics note, first limit) | README.md:13, 70, 77; obd/results/men.json (`quantities["h3.ips"]`; `code_commit` `581b29d`) |
| Metrics note: the last figure is post hoc | README.md:81, 83 |
| The Open Bandit Dataset holds one week of logs from two policies on ZOZOTOWN, uniform random and BTS, in three campaigns | obd/PREREGISTRATION.md:5 |
| The benchmark estimates the BTS click rate from the random logs and compares it with that of the BTS logs; on Men's the estimate is about 0.89 of the on-policy value | obd/PREREGISTRATION.md:5; README.md:7 |
| The BTS target is computed from the published prior, which is not the policy deployed during the logged week | obd/PREREGISTRATION.md:5, 7, 72; README.md:7 |
| The study asks how much of the gap comes from that target, not why the two differ | obd/PREREGISTRATION.md:7 |
| Propositions, statistics and decision rules committed before any outcome of All and Women's was computed | README.md:9; obd/PREREGISTRATION.md:58 |
| The results on Men's were known | obd/PREREGISTRATION.md:18-20 |
| Men's is the development campaign, All and Women's the confirmatory ones; every verdict comes from one run on them | README.md:13, 17; obd/PREREGISTRATION.md:62-63 |
| Diagram: the registration holds the rules, before the confirmatory run | README.md:9; obd/PREREGISTRATION.md:63 |
| Diagram and description: `data.py` downloads the dataset archive and the prior file, verifies their SHA-256 and runs the stop checks, which read no click | README.md:98, 104; obd/data.py:44-60, 125-126 |
| Diagram and description: `tables.py` sums the rows of both logs by ten-minute block | README.md:105 |
| Diagram and description: `estimators.py` computes the fixed-prior target and H1 to H7 as functions of the tables; `verdicts.py` holds the decision rules | README.md:106-107 |
| Diagram and description: `run.py` draws 10,000 bootstrap replicates over blocks; a replicate rescales the block tables and calls the same estimators | README.md:108, 110; obd/PREREGISTRATION.md:73 |
| Diagram and description: one JSON file per campaign with every statistic, interval and label and the commit that produced it | README.md:11; obd/run.py:265-274 |
| Diagram and description: post hoc analyses in `obd/posthoc/` with result files of their own | README.md:81; obd/posthoc/README.md:9 |
| Diagram and description: figures drawn from the result files | README.md:125 |
| §4: Men's is the development campaign; code is written and checked on it; its results enter no verdict | obd/PREREGISTRATION.md:62 |
| §4: nothing computed from the files of All and Women's, beyond row counts and checks that read no click, until the code for every proposition had run on Men's and been committed | obd/PREREGISTRATION.md:58, 63, 162; README.md:98 |
| §4: the confirmatory results come from one run of that commit | obd/PREREGISTRATION.md:63; README.md:17 |
| §5: lists are reused across impressions for up to a few minutes and clicks cluster over a few minutes, so neither rows nor impressions are independent | obd/PREREGISTRATION.md:74 |
| §5: a replicate draws 1,008 ten-minute blocks with replacement; a block carries the rows of both logs that fall in it | obd/PREREGISTRATION.md:73 |
| H3: `low` if the interval of the ratio lies below 1, `high` if above, otherwise `no shortfall shown` | obd/PREREGISTRATION.md:100 |
| H3: IPS and SNIPS are `no shortfall shown` on All, on Women's and pooled | README.md:29, 31; obd/results/all.json and women.json (`h3`); obd/results/pooled.json (`h3.ips.label`, `h3.snips.label`) |
| H4: the primary proposition; the target is the BTS log's own frequencies in the same period | obd/PREREGISTRATION.md:105, 107-108 |
| H4: the gap is read only in a unit where H3 found IPS `low` | obd/PREREGISTRATION.md:116 |
| H4: every unit reads `shortfall not established; gap not read` | README.md:37; obd/results/all.json and women.json (`h4.reading`); obd/results/pooled.json (`h4.reading`) |
| A7: the files hash the user features, and one value of each feature is written differently in the two files | obd/AMENDMENTS.md:48, 50 |
| A7: fixed before any confirmatory outcome was computed | obd/AMENDMENTS.md:3 |
| A7: the two are treated as one value where exactly one value occurs only in each file | obd/AMENDMENTS.md:49 |
| A7: matched three of the four features on each confirmatory campaign; the fourth is compared as written | README.md:74; obd/results/all.json and women.json (`h7.values_matched`) |
| A7: the registered distances between the users of the two logs, 0.360 and 0.236, cannot be read as a difference in the users | README.md:74; obd/results/all.json and women.json (`quantities["h7.tv.joint"]`) |
| Not excluded: post hoc, with three-hour blocks the pooled interval is 0.897 to 1.056 | README.md:86; obd/posthoc/README.md:187; obd/posthoc/results/blocks.json (`pooled["180"].ips`) |
| Block length: it and the thresholds of H1 were fixed with the Men's results in view | obd/PREREGISTRATION.md:64 |
| Block length: no user id; dependence beyond a ten-minute block, such as visits of one user spread over the day, is not in the intervals | obd/PREREGISTRATION.md:74, 152 |
| Main question: the study set out to measure how much of the gap the evaluation target accounts for | obd/PREREGISTRATION.md:7; README.md:7 |
| Main question: the aligned estimate is not distinguishable from the on-policy value in any unit | README.md:34, 71 |
| Main question: the paired change excludes 0 only pooled, where the lower end of its interval is 0.002 | README.md:35, 71 |
| Public data: the Beta parameters in force at any time, the update interval and which version served a row are not in the data | obd/PREREGISTRATION.md:143-144 |
| Public data: whether the recorded propensities of the BTS log are internally consistent is undetermined on both campaigns | obd/PREREGISTRATION.md:89; README.md:27, 69 |
| Public data: All is not a clean hold-out from the development campaign | obd/PREREGISTRATION.md:150; obd/posthoc/README.md:391 |
| Public data: the check was made after the results and reads the prior file only, no click | obd/posthoc/README.md:379, 381 |
| Public data: all 34 Beta parameter pairs of Men's are among the 80 of All, in the same order, and none of the 46 of Women's | obd/posthoc/README.md:388-390; obd/posthoc/results/prior.json (`pairs`, `shared.men.all`, `shared.women.all`) |
| Coverage: a separately registered semi-synthetic study (`obd_coverage/`) keeps the rows of the logs and generates clicks from a known process, so that the coverage of a nominal 95% interval can be counted | at 6a276af: obd_coverage/README.md:3, 5; obd_coverage/PREREGISTRATION.md:3 |
| Coverage: dependence that reaches one or two minutes, at the strength solved from published statistics of the logs (scenario M) | at 6a276af: obd_coverage/README.md:13 |
| Coverage: in M, intervals of the IPS ratio on All and Women's cover 0.85 to 0.88 when rows or impressions are resampled (0.866 and 0.846 with rows, 0.880 and 0.860 with impressions) | at 6a276af: obd_coverage/README.md:65, 76, 97, 130; obd_coverage/results/coverage.json (`all.M.cells.ips_ratio` and `women.M.cells.ips_ratio`: `rows.coverage`, `impressions.coverage`) |
| Coverage: in M, 0.945 to 0.953 with clock blocks of 5 to 180 minutes | at 6a276af: obd_coverage/README.md:15, 65, 76; obd_coverage/results/coverage.json (`all.M.cells.ips_ratio` and `women.M.cells.ips_ratio`: `5` to `180`, `coverage`) |
| Coverage: M is an upper reading of short-range dependence; if part of the published variance ratio is a moving click rate, rows and impressions cover more | at 6a276af: obd_coverage/README.md:29, 130 |
| Coverage: with added groups of sessions that span an hour (scenario H), ten-minute blocks cover 0.907 on All and 0.850 on Women's | at 6a276af: obd_coverage/README.md:13, 67, 78, 99; obd_coverage/results/coverage.json (`all.H.cells.ips_ratio["10"].coverage`, `women.H.cells.ips_ratio["10"].coverage`) |
| Coverage: with groups that span a day (scenario U), no block length is adequate | at 6a276af: obd_coverage/README.md:13, 68, 79, 98; obd_coverage/results/coverage.json (`reading.by_campaign.all` and `women`: `3_shortest_adequate_block.U`; `reading.against_ten_minute_intervals.no_length_adequate_in_U`) |
| Coverage: H and U were tuned so that the true variance exceeds what ten-minute blocks see, so under-coverage by ten-minute blocks was expected there | at 6a276af: obd_coverage/README.md:124 |
| Coverage: on Women's the published widening of the intervals up to 180 minutes is more than M produces (1.365 against a 97.5th percentile of 1.239), so its ten-minute intervals are not shown to cover | at 6a276af: obd_coverage/README.md:107, 114, 119; obd_coverage/results/coverage.json (`women.M.sd_of_ips_ratio.over_ten_minutes["180"]`; `reading.by_campaign.women["5_published_widening_above_M"]`) |
| Coverage: the study does not show that the real logs have any of these structures | at 6a276af: obd_coverage/README.md:171 |
