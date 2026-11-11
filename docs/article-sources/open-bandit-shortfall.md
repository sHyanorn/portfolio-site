# Sources: The Open Bandit shortfall was not shown on the two confirmatory campaigns

Article: `src/content/articles/open-bandit-shortfall.mdx`.

All paths are in github.com/sHyanorn/ope-checks at commit 7a097af, except those prefixed `push-lab:`, which are in github.com/sHyanorn/push-lab at commit 937ad77. `q` is the `quantities` object of a result file; `all.json`, `women.json`, `men.json` and `pooled.json` are in `obd/results/`, and `units.json`, `features.json`, `propensities.json`, `blocks.json`, `lengths.json`, `distances.json` and `prior.json` in `obd/posthoc/results/`. `<L>` is a block length in minutes.

| Number | Source |
|---|---|
| Men's estimate about 0.89 of the on-policy click rate | obd/PREREGISTRATION.md:5; README.md:7; men.json (`q["h3.ips"].estimate` 0.891) |
| The question: how much of the gap comes from the evaluation target | obd/PREREGISTRATION.md:7; README.md:7 |
| Pre-registered; All and Women's are the confirmatory campaigns | obd/PREREGISTRATION.md:63; README.md:9, 13 |
| The published prior is not the distribution the BTS log shows | all.json, women.json (`h1.label` "inconsistent"); README.md:24, 68 |
| Ratio 0.948 (0.867 to 1.033) on All, 1.004 (0.917 to 1.099) on Women's, 0.974 (0.915 to 1.036) pooled; no shortfall shown | all.json, women.json, pooled.json (`q["h3.ips"]`; `h3.ips`, pooled `h3.ips.label`); README.md:28-29 |
| No shortfall established, so the main question has no reading | obd/PREREGISTRATION.md:116; all.json, women.json, pooled.json (`h4.reading`); README.md:37, 71 |
| Rules committed before any outcome of All and Women's was computed | obd/PREREGISTRATION.md:58, 63; obd/AMENDMENTS.md:3; README.md:9-10 |
| Men's is the development campaign and enters no verdict | obd/PREREGISTRATION.md:62; README.md:13 |
| Everything made after the results were known is marked post hoc: the five analyses, the calculation on the direction of the bias and the check of the prior file | obd/posthoc/README.md:3, 379; README.md:81; README.md:92, 94 at commit 3b17cb9 |
| One week of logs from two policies on ZOZOTOWN, uniform random and BTS, in three campaigns; what the benchmark compares | obd/PREREGISTRATION.md:5, 12; README.md:7 |
| BTS target from the published Beta prior by Monte Carlo draws, no updates | obd/PREREGISTRATION.md:5, 72 |
| Full Men's campaign: IPS 0.891 of the on-policy value | men.json (`q["h3.ips"].estimate`); obd/PREREGISTRATION.md:24; README.md:77 |
| Two public computations arrive at the same figure | obd/PREREGISTRATION.md:5, 24, 56 (0.006011 against 0.006743); push-lab: README.md:55 |
| In one, the interval for IPS is 0.815 to 0.966 of the on-policy value and lies below it | obd/PREREGISTRATION.md:24; push-lab: README.md:55; results/ope_obd.json (`full.validation.IPS.ratio_to_on_policy`) |
| In the other, the interval for IPS is 0.005612 to 0.006472 against 0.006743 and lies below it | obd/PREREGISTRATION.md:56 |
| Both are bootstrap intervals; they resample impressions or rows | obd/PREREGISTRATION.md:5, 22; push-lab: README.md:55 |
| 30% to 37% of complete impressions show the same list as the impression before, in each of the six logs | units.json (`<campaign>.dependence.<log>.same_list_as_previous`, 0.299 to 0.370); obd/posthoc/README.md:46, 51-56 |
| Variance of the difference in click rate between adjacent ten-minute blocks 1.85 to 2.45 times that of independent impressions | units.json (`<campaign>.dependence.<log>.variance_ratio["10"].clicks`, 1.851 to 2.449); obd/posthoc/README.md:47, 51-56 |
| The ratio carries no interval and does not separate clustering from drift | obd/posthoc/README.md:61 |
| The registration resamples ten-minute blocks, the same blocks in both logs | obd/PREREGISTRATION.md:73 |
| That choice was made after seeing the Men's results, and the registration says so | obd/PREREGISTRATION.md:40, 64 |
| How much narrower the usual intervals are was measured on all three campaigns only afterwards | obd/posthoc/README.md:3, 13 |
| Standard deviation with blocks 1.31 to 1.47 times the one with rows or impressions (post hoc) | units.json (`<campaign>.h3.sd_of_blocks_over.<unit>.<ratio>`, 1.307 to 1.474); obd/posthoc/README.md:34-39, 41 |
| Men's intervals: 0.790 to 1.005 with blocks, 0.818 to 0.964 with rows, 0.816 to 0.968 with impressions | units.json (`men.h3.{blocks,rows,impressions}.ips.interval`); obd/posthoc/README.md:23 |
| On All and Women's the interval contains 1 under each unit; the unit changes the side of 1 only on Men's | units.json (`<campaign>.h3.<unit>.ips.interval`); obd/posthoc/README.md:25-28, 42 |
| Seven propositions | obd/PREREGISTRATION.md:80, 89, 97, 105, 136-138 |
| All and Women's confirmatory; pooled value with weights 0.54 and 0.46 for the two central propositions | obd/PREREGISTRATION.md:63, 65; pooled.json (`weights`) |
| Percentile intervals of 10,000 replicates over 1,008 ten-minute blocks from a registered random stream | obd/PREREGISTRATION.md:73, 75-76 |
| H1: distance between the prior and the hourly frequencies of the BTS log, against a noise floor from alternate blocks within the hour | obd/PREREGISTRATION.md:82-83 |
| H3: "low" only if the interval of the ratio lies below 1; otherwise "no shortfall shown" | obd/PREREGISTRATION.md:100 |
| H4 is the primary proposition; its target is the BTS log's own frequencies in the same period; the gap is read only where H3 found one | obd/PREREGISTRATION.md:105, 107-108, 116 |
| Table, H1: 0.526 and 0.136 (All), 0.527 and 0.115 (Women's); inconsistent | all.json, women.json (`h1.d`, `h1.d0`, `h1.label`); README.md:23-24 |
| Table, H3: ratios and labels | as in the opening paragraph; README.md:28-29 |
| Table, H4 aligned estimate: 1.031 (0.932 to 1.128), 1.062 (0.974 to 1.158), 1.045 (0.978 to 1.114) | all.json, women.json (`q["h4.rho.3"]`); pooled.json (`q["h4.rho"]`); README.md:33 |
| Table, H4 change: 0.083 (-0.019 to 0.182), 0.058 (-0.031 to 0.147), 0.072 (0.002 to 0.139); no change shown, no change shown, raises the estimate | all.json, women.json (`q["h4.d.3"]`, `h4.alignment`); pooled.json (`q["h4.d"]`, `h4.alignment.label`); README.md:35-36 |
| Table, H4 reading: shortfall not established; gap not read | all.json, women.json, pooled.json (`h4.reading`); README.md:37 |
| Distance 0.53 against a noise floor of 0.11 to 0.14; more than the rule asked for | all.json, women.json (`h1.d` 0.526 and 0.527; `h1.d0` 0.136 and 0.115); rule at obd/PREREGISTRATION.md:85; README.md:68 |
| First hour of the week on All: 0.180, 0.126 and 0.088 by position | all.json (`h1.first_hour`); README.md:68 |
| The deployed parameters and their updates: the public data cannot say | obd/PREREGISTRATION.md:143-144 |
| Pooled interval down to 0.915; with ten-minute blocks a shortfall of up to 8.5% is not excluded | pooled.json (`q["h3.ips"].interval[0]` 0.9146, so 1 - 0.9146 = 0.085); README.md:17, 28 |
| Development campaign: 0.891 (0.790 to 1.005), no verdict | men.json (`q["h3.ips"]`); README.md:70, 77 |
| Target from the same three-hour period | all.json, women.json (`h4.width` 3); pooled.json (`h4.widths`); README.md:32 |
| Aligned estimate not distinguishable from the on-policy value in any unit | all.json, women.json (`h4.level`); pooled.json (`h4.level.label`); README.md:34, 71 |
| Paired change positive in every unit and at every period width | all.json, women.json (`q["h4.d.1"]`, `["h4.d.3"]`, `["h4.d.6"]`, `["h4.d.24"]`, 0.013 to 0.083); pooled.json (`q["h4.d"]`); README.md:53-56, 71 |
| Its interval excludes 0 only in the pooled unit, 0.072 (0.002 to 0.139); no change shown on All and on Women's alone | same keys; `h4.alignment`; README.md:35-36, 53-56, 71 |
| The rule reads the gap only where H3 found one, and it found none | obd/PREREGISTRATION.md:116; README.md:71 |
| A way the aligned estimate can be too high: BTS learning from clicks of both buckets, or demand both buckets share | obd/PREREGISTRATION.md:151 |
| A calculation made after the results does not support the second case: under shared demand the aligned estimate is too low within a period, so the direction of its bias is not established | README.md:90, 94 at commit 3b17cb9 |
| H5: 0.099 (0.033 to 0.166) on All, 0.076 (0.022 to 0.130) on Women's; descriptive, cannot tell the two sources apart | all.json, women.json (`q["h5.after_minus_before"]`); obd/PREREGISTRATION.md:136, 151; README.md:38, 72 |
| H2 undetermined on both campaigns; the statistic should average 1 | all.json, women.json (`h2.label`); obd/PREREGISTRATION.md:91; README.md:27, 69 |
| 0.973 over 3 eligible cells on All, fewer than the rule needs; 0.967 over 7 on Women's | all.json, women.json (`h2.eligible_cells`, `q["h2.m"]`); obd/PREREGISTRATION.md:93; README.md:25-26, 69 |
| The two files write one value of each user feature differently; amendment made before any confirmatory result; matched in three of the four features on each campaign | obd/AMENDMENTS.md:3, 48-50; all.json, women.json (`h7.values_matched`, three pairs and one null); README.md:74 |
| The fourth feature compared as written; registered joint distances 0.360 and 0.236 cannot be read as a difference in the users | obd/AMENDMENTS.md:49; all.json, women.json (`q["h7.tv.joint"]`); README.md:74 |
| All five post hoc analyses were fixed after the results, are descriptive and change no registered label | obd/posthoc/README.md:3, and its Sections 1 to 6 at :11, 63, 95, 159, 213, 310 (Sections 4 and 5 are one item in the article); README.md:81 |
| For the block lengths and the distances, the settings and the reading were committed before the runs | obd/posthoc/README.md:161, 215, 312; README.md:86-88 |
| One-minute variance ratio of 1.2 to 1.5 for Men's lacks a small-sample factor; with it 1.18 and 1.20 | obd/PREREGISTRATION.md:38; units.json (`men.dependence.<log>.variance_ratio["1"].clicks` 1.176 and 1.202, `.clicks_without_factor` 1.523 and 1.230); obd/posthoc/README.md:47, 51-52, 59 |
| That figure entered no rule | reported in Section 3, obd/PREREGISTRATION.md:38; the rules, obd/PREREGISTRATION.md:85, 93, 100, 113-116, 136-137, do not use it |
| The factor changes the ten-minute ratios by less than 0.05 | units.json (`<campaign>.dependence.<log>.variance_ratio["10"].clicks` against `.clicks_without_factor`: differences of 0.001 to 0.042; the largest, 0.042, is on the Men's random log, 2.449 against 2.491) |
| One more rare value in the BTS log (30 and 14 rows), so the amendment's condition failed; the other value sits on exactly the rows the matched features mark | features.json (`<campaign>.values`, `.rows_marked`); obd/posthoc/README.md:65, 69-74, 76, 78-79 |
| With the two taken as one value: joint distance 0.007 and 0.009; change 0.001 (-0.003 to 0.005) and -0.001 (-0.014 to 0.005) | features.json (`<campaign>.h7["h7.tv.joint"].post_hoc`, `["h7.rho_change"].post_hoc`); obd/posthoc/README.md:86, 88, 90-91 |
| Registered: 0.360 and 0.236; -0.058 (-0.136 to 0.013) and -0.116 (-0.178 to -0.063) | all.json, women.json (`q["h7.tv.joint"]`, `q["h7.rho_change"]`); obd/posthoc/README.md:86, 88; README.md:74 |
| That the two values are one category is an inference from the rows they sit on | obd/posthoc/README.md:93; obd/AMENDMENTS.md:50 |
| Hours in which an eligible cell is shown at under a tenth of the rate its recorded propensities imply; on All they hold 0.033, where the statistic is 0.027 below 1 | propensities.json (`all.by_bound["0.001"].shortfall_in_low_hours["0.1"].mean` 0.033, `.m.estimate` 0.973); obd/posthoc/README.md:102, 109, 117, 127-129 (8, 1 and 3 such hours in the three cells of All) |
| Nearly all of that falls on 27 and 29 November, as on Women's | propensities.json (`<campaign>.by_bound["0.001"].shortfall_in_low_hours["0.1"].by_day[3]`, `[5]`: 0.031 of 0.033 on All, 0.021 of 0.022 on Women's); obd/posthoc/README.md:154-155 |
| The hours are picked by the statistic itself; on Men's, where it is at 1.005, the same selection finds 0.002 | propensities.json (`men.by_bound["0.001"]`: `.m.estimate` 1.005, `.shortfall_in_low_hours["0.1"].mean` 0.002); obd/posthoc/README.md:106, 117-118 |
| The cause is not identified | obd/posthoc/README.md:119 |
| Block length: clock blocks of 5 to 180 minutes; the interval of each H3 ratio contains 1 at every length on All, Women's and pooled | blocks.json (`minutes`; `<unit>.<L>.<ratio>.interval`); obd/posthoc/README.md:163, 183-188, 203 |
| From ten minutes upward the estimated standard deviation of the ratio is larger at every longer length on All, Women's and pooled; the rise is not tested against sampling error | blocks.json (`<unit>.<L>.<ratio>.sd_over_ten_minutes`; pooled IPS 1.00, 1.04, 1.09, 1.10, 1.31); obd/posthoc/README.md:196-201, 207-208 |
| Pooled interval 0.915 to 1.036 with ten-minute blocks and 0.897 to 1.056 with three-hour blocks, on 56 blocks; 8.5% becomes 10.3% | blocks.json (`pooled["10"].ips.interval`; `pooled["180"].ips.interval` 0.8968 and 1.0561, so 1 - 0.8968 = 0.103; `pooled["180"].blocks` 56); obd/posthoc/README.md:165, 187, 209 |
| On Men's the standard deviation stays within 3% of the one at ten minutes | blocks.json (`men.<L>.<ratio>.sd_over_ten_minutes`, 0.978 to 1.029); obd/posthoc/README.md:194-195, 206 |
| The interval of the aligned estimate contains 1 in every unit at every length | lengths.json (`<unit>.<L>["h4.rho"].interval`); obd/posthoc/README.md:239, 241, 243, 245, 298 |
| Lower end of the pooled paired change between 0.001 and 0.004; within two Monte Carlo standard errors of 0 at three of the six lengths | lengths.json (`pooled.<L>["h4.d"].interval[0]`, 0.0011 to 0.0040); obd/posthoc/README.md:228, 270, 300 |
| H5 difference above 0 with blocks of 5 to 20 minutes on both campaigns; on Women's the lower end of its interval at 0 with 30-minute blocks; interval contains 0 with 60-minute blocks on both and with three-hour blocks on Women's | lengths.json (`<campaign>.<L>["h5.after_minus_before"].interval`; Women's at 30 minutes: lower end -0.0012, less than two Monte Carlo standard errors from 0); obd/posthoc/README.md:228, 252-253, 301; README.md:87 |
| The analysis does not separate dependence beyond ten minutes from change over the week | obd/posthoc/README.md:175, 209 |
| Three distances that read no click, fixed before they were computed | obd/posthoc/README.md:312, 314 |
| Whole-week frequencies at 0.386 (All) and 0.413 (Women's) from the prior | distances.json (`<campaign>.bts.prior_to_week`); obd/posthoc/README.md:339, 341, 367 |
| Hourly frequencies at 0.410 and 0.394 from those of the whole week, 3.0 and 3.4 times the noise floor | distances.json (`<campaign>.bts.hours_to_week`, `.d0`); obd/posthoc/README.md:339, 341, 368 |
| In the random logs of the same two campaigns, whose policy is fixed, 0.52 and 0.53 of the noise floor | distances.json (`<campaign>.random.hours_to_week` over `.d0`: 0.52 on All, 0.53 on Women's); obd/posthoc/README.md:340, 342, 371 |
| By the thresholds of the registered rule, and without an interval, the hourly frequencies differ from those of the whole week | obd/posthoc/README.md:326, 328, 368, 375 |
| The distances bound the 0.53 of H1 and do not say how much of it is change | obd/posthoc/README.md:322, 330, 370; README.md:88 |
| First hour: three of the six distances from the prior at most the floor of that hour, three between the floor and twice the floor | distances.json (`<campaign>.bts.first_hour.distance`, `.floor`, All and Women's); obd/posthoc/README.md:354-356, 360-362, 372 |
| Block length and the H1 thresholds fixed with the Men's results in view | obd/PREREGISTRATION.md:64 |
| No user id; dependence beyond ten minutes not covered | obd/PREREGISTRATION.md:74, 152 |
| One week, one site | obd/PREREGISTRATION.md:5 |
| All is not a clean hold-out from the development campaign; the check of the prior file was made after the results and reads no click | obd/posthoc/README.md:379, 381, 391 |
| All 34 Beta parameter pairs of Men's among the 80 of All, identical and in the same order; none of the 46 of Women's; Women's shares no pair with Men's | prior.json (`pairs`; `shared.men.all.pairs` 34 and `.same_order` true; `shared.women.all.pairs` 0; `shared.women.men.pairs` 0); obd/posthoc/README.md:388-391 |
| Confirmatory campaigns run with IPS and SNIPS only | obd/PREREGISTRATION.md:99, 103; README.md:28-31 |
| One run of one commit; a first attempt cut off by a host restart before it wrote or printed anything, the same command run again at the same commit | README.md:17; obd/AMENDMENTS.md:56-58 |
| Men's ratio 0.891 with an interval down to 0.790 | men.json (`q["h3.ips"]`); README.md:70 |
| No claim about the recorded propensities or the users of the two logs | README.md:69, 74 |
| Commands | README.md:93, 95; obd/posthoc/README.md:6 |
| The first run downloads the archive and the prior file and verifies their checksums | README.md:98 |
| Every result file names the commit that produced it | README.md:11; `code_commit` in each result file |
