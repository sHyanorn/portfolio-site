# Sources: A low PBO can mean the search asked an easy question

Article: `src/content/articles/low-pbo-easy-question.mdx`.

All paths are in github.com/sHyanorn/backtest-lab at commit 024e743.

| Number | Source |
|---|---|
| PBO 0.05 and 0.12 (registered) | docs/DEMO.md:20, 43; results/demo/ma_crossover.json, results/demo/momentum.json |
| PBO 0.42 (64 settings) and 0.72 (17 settings) | docs/DEMO.md:44; results/posthoc/long_only.json (`pbo.long_only_half` 0.418 and 0.720) |
| 12,870 of 12,870 and 12,869 of 12,870 splits | docs/DEMO.md:42; results/posthoc/long_only.json (`cscv`) |
| Sharpe ranges 0.49–0.80, 0.02–0.51, 0.54–0.79, 0.01–0.53 | docs/DEMO.md:40-41 |
| Post hoc, exploratory | docs/DEMO.md:34; docs/DECISIONS.md:180-184 (D029) |
| SPY 1993 to October 2026; samples start January and August 1994; 1 bp fees, 5 bps slippage | docs/DEMO.md:3, 60; docs/DECISIONS.md:117 (D021) |
| Grids: 128 settings (8 × 8 × 2), 34 settings (17 × 2); S = 16 | docs/DECISIONS.md:118-121 (D021) |
| Momentum similar skill expected in advance | docs/DECISIONS.md:124 (D021) |
| Thresholds 0.10 / 0.30; null mean 0.488, 200 seeds, 89.5% above 0.30 | docs/DECISIONS.md:129 (D022) |
| PBO definition and estimator | docs/METHODS.md:179, 187-196 |
| High PBO with similar skill; dropping trials biases PBO | docs/METHODS.md:207, 210 |
| DSR 0.945 (threshold 0.95) and 0.988; borderline verdicts | docs/DEMO.md:11-12, 21, 48 |
| DSR about 1.00 within the half; 10.5 and 3.8 effective settings | docs/DEMO.md:46; results/posthoc/long_only.json (`long_only_half_dsr`) |
| Cash and shorting assumptions | docs/DECISIONS.md:74-78 (D015); README.md:88 |
| Fast 10, slow 200; lookback 273 | docs/DEMO.md:11-12 |
