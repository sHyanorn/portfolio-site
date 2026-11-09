# Sources: backtest-lab

Content: `src/content/projects/backtest-lab.json`.

All paths are in github.com/sHyanorn/backtest-lab at commit 024e743.

| Number or claim | Source |
|---|---|
| Parameter search, then walk-forward analysis, purged cross-validation, PBO and DSR judge the winner | README.md:3 |
| Eight checks; red, yellow or green verdict and one plain sentence each; credibility report the dashboard renders | docs/REPORT.md:3, 33-44; docs/SPEC.md:43 |
| Grid search records every trial, which multiple-testing corrections need | docs/SPEC.md:41 |
| yfinance and FRED, Parquet and DuckDB, quality checks, weekly GitHub Actions update; daily multi-asset engine, long and short, costs and slippage; React dashboard | docs/SPEC.md:30-44 |
| Formulas written in the methods document before implementation | docs/SPEC.md:69 |
| SPY only; stocks chosen because they exist today; cash earns nothing, no borrow fee; latest revised macro vintage | README.md:87-89 |
| Passing the checks against beating the market, answered apart | README.md:23 |
| Demo: three images of the dashboard built from `web/` at 024e743, the first two views also served at shyanorn.github.io/backtest-lab (README.md:5) | docs/images/dashboard.png (from the README, README.md:17); the random-signal Checks section and the moving-average Post hoc section captured at 1200 px wide, scale 1.5, light theme, as web/scripts/screenshot.mjs does |
| Random control: six checks fail, PBO 0.299 and PSR borderline | docs/DEMO.md:13-24 |
| Moving average borderline overall, DSR 0.945 against 0.95 | README.md:13; docs/DEMO.md:11, 21 |
| 6 of 8 checks failed; best random setting Sharpe 0.23 | README.md:15; docs/DEMO.md:13 |
| PBO 0.05 whole grid, 0.42 in the long-only half (64 settings), post hoc | docs/DEMO.md:43-44; results/posthoc/long_only.json |
| Every in-sample winner long only (12,870 of 12,870); Sharpe ranges 0.49 to 0.80 and 0.02 to 0.51 | docs/DEMO.md:40-42 |
| Deepest SPY drawdowns in the post hoc panel | docs/DEMO.md:64-68 |
| 89.5% of 200 null searches above 0.30; mean 0.488; red line fixed before real data | docs/DECISIONS.md:129, 134 (D022) |
| Sharpe 0.80 against 0.64; volatility 12.5% against 18.7% | README.md:13, 21; docs/DEMO.md:11, 55 |
| SPY January 1993 to October 2026; fixed before any strategy ran on real data; 1 bp fees and 5 bps slippage per side | README.md:9; docs/DEMO.md:3; docs/DECISIONS.md:117 |
| Post hoc figures labelled, no confirmatory weight | docs/DEMO.md:34; docs/DECISIONS.md:183 (D029) |
| Diagram: weekly workflow fetches, checks, caches; nothing committed | docs/DECISIONS.md:55 (D012); .github/workflows/data.yml |
| Diagram: Parquet and DuckDB | docs/SPEC.md:33, 76 |
| Diagram: engine fills at the next open, net of costs | docs/DECISIONS.md:63, 70 (D013, D014); src/backtest_lab/engine |
| Diagram: validation runs the grid search and the checks on stored trials and writes the report | docs/REPORT.md:3; src/backtest_lab/validation |
| Diagram: registered reports produced once, frozen, SHA-256 sums checked in CI | docs/DECISIONS.md:201 (D032); .github/workflows/ci.yml:17, 20 |
| Diagram: Pages build reads only the committed reports | docs/DECISIONS.md:194 (D031) |
| Diagram: local custom sweep to FastAPI on 127.0.0.1, same report and components | docs/DECISIONS.md:82, 195 (D016, D031); web/vite.config.ts:13 |
| D021: SPY 1993-01-29 to 2026-10-30, default costs; grids of 128, 34 and 100; check settings fixed | docs/DECISIONS.md:117-121 |
| D021: buy and hold a reference only; zero risk-free rate and equity premium; configuration unchanged after the results | docs/DECISIONS.md:122-124 |
| D022: thresholds fixed before any real-data run; null mean 0.488, 89.5% above 0.30; green from the paper's 1/10; overall the worst | docs/DECISIONS.md:129, 133-134 |
| D013: target at close t, traded at open t+1; overnight and intraday legs; costs at the open | docs/DECISIONS.md:63 |
| D013: no fill before t+1, one-day information interval; same day's adjustment factor; scale-invariant signals | docs/DECISIONS.md:65-66 |
| D029: conclusions from the registered results; post hoc analyses in their own module and directory, labelled; selection after seeing results | docs/DECISIONS.md:182-184 |
| D030: four chart forms on d3-scale and d3-shape; CSS variables; sizes 176, 71, 45, 23 and 16 kB; keyboard focus, readout, data table | docs/DECISIONS.md:188-190 |
| Sweep sat flat: benchmark dates kept, NaN rows, indicators NaN for a window, flat for up to `slow` or `lookback` days; now traded tickers' dates; demo unaffected | docs/DECISIONS.md:241-242 (D039) |
| Stale opens: 159 of 8,497 bars; 21.7% against 0.4% in 2016 and 2017; fill at the signal's close | docs/DEMO.md:72 |
| Stale opens: warning without changing data | docs/DECISIONS.md:235 (D038) |
| Stale opens: 30 seeds, lows or highs; verdicts unchanged; control red in every variant | docs/DEMO.md:74 |
| PBO definitions: logit at most 0 against r̄ < N/2; differ at rank N/2 for even N; methods statement holds for odd N only | docs/DECISIONS.md:219 (D035) |
| PBO definitions: 607, 1,590, 3,853 against 585, 1,393, 3,748 of 12,870; 0.045, 0.108, 0.291; verdicts the same | docs/DECISIONS.md:220 (D035) |
