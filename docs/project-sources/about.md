# Sources: home and About

Content: `src/content/site/home.json` and `src/content/site/about.json`. Each row covers one fact from the English text. The Chinese text states the same facts.

Repositories at: matching-engine 1d50110, vault-share 96159bb, backtest-lab 024e743, local-ledger ae08641, push-lab 5dfcc47. `site:` is this repository. `site:…@b5c04e0` is the last commit with the earlier text.

## Home

The intro's two sentences, then one sentence for each area.

| Number or claim | Source |
|---|---|
| Commerce student at the University of Melbourne | site:docs/DECISIONS.md:116 (D017); site:src/lib/i18n.ts:38; site:src/lib/i18n.ts@b5c04e0:35, 47 |
| Each project below has tests in its repository | matching-engine cmd/engine/kill_test.go:197, README.md:75; vault-share docs/security/TEST_REPORT.md:376-380; backtest-lab README.md:59-66; local-ledger README.md:66-67; push-lab README.md:81 |
| Each project below has a decision log in its repository | docs/DECISIONS.md:1 in all five repositories |
| Backend: Go limit order book | matching-engine README.md:3; docs/DECISIONS.md:5-8 (D001) |
| Backend: write-ahead command log | matching-engine README.md:3, 42; docs/DECISIONS.md:101-103 (D017) |
| Backend: open-loop load testing | matching-engine docs/DECISIONS.md:179-181 (D030); docs/BENCHMARKS.md:28 |
| Backend: 5.05M to 6.95M commands/s in the matching core | matching-engine docs/BENCHMARKS.md:13-18 (README.md:13 rounds these to 5.0M to 6.9M) |
| Backend: p99 1.76 ms at 10k requests/s, from order to trade push | matching-engine docs/BENCHMARKS.md:29, 38 |
| Security: end-to-end encryption | vault-share README.md:3 |
| Security: on Web Crypto | vault-share docs/DECISIONS.md:7-9 (D002); web/src/crypto/ece.ts:118, 263, 321 |
| Security: OWASP Top 10:2025 self-assessment | vault-share docs/security/TEST_REPORT.md:3; README.md:55 |
| Security: sandboxed Electron app | local-ledger docs/DECISIONS.md:3 (D001), 53-55 (D010); docs/SPEC.md:51 |
| Security: on a SQLCipher 4 format database | local-ledger docs/SPEC.md:59, 66 (SQLCipher-compatible, SQLCipher v4 scheme, through better-sqlite3-multiple-ciphers); README.md:18 |
| Quant: walk-forward analysis, purged cross-validation, PBO, deflated Sharpe ratio | backtest-lab README.md:3; docs/SPEC.md:5 |
| Quant: thresholds fixed before any run on real data | backtest-lab docs/DECISIONS.md:134 (D022); README.md:38 |
| Recommender: two-tower recall | push-lab docs/SPEC.md:11, 37-38 |
| Recommender: gradient-boosted ranking (LightGBM) | push-lab docs/SPEC.md:12, 42; docs/DECISIONS.md:102-104 (D008) |
| Recommender: uplift models | push-lab docs/SPEC.md:12, 45-46 |
| Recommender: off-policy evaluation | push-lab docs/SPEC.md:13, 63-65 |
| Recommender: results labelled by evidence tier | push-lab README.md:3, 12-16; docs/SPEC.md:87-93; docs/DECISIONS.md:73 (D002) |

## About

### Education

Taken from the site's own earlier text and D017.

| Number or claim | Source |
|---|---|
| The University of Melbourne | site:docs/SPEC.md:36; site:docs/DECISIONS.md:116 (D017); site:src/lib/i18n.ts@b5c04e0:52 |
| Bachelor of Commerce | site:docs/DECISIONS.md:116 (D017); site:src/lib/i18n.ts@b5c04e0:56 |
| 2024 to 2027 | site:docs/DECISIONS.md:116 (D017); site:src/lib/i18n.ts@b5c04e0:56 |
| In progress | site:docs/DECISIONS.md:116 (D017); site:src/lib/i18n.ts@b5c04e0:56 |
| Based in Melbourne, Australia | Aaron, 2026-11-09. No repository source. site:docs/DECISIONS.md:118 (the D017 amendment) records only that About shows the city |

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

### Security engineering

Rows 1 to 16 are in vault-share; the rest are in local-ledger.

| Number or claim | Source |
|---|---|
| Encrypted in the browser before upload | vault-share README.md:3 |
| Web Crypto | vault-share docs/DECISIONS.md:7-9 (D002); web/src/crypto/ece.ts:118, 263, 321 |
| RFC 8188 `aes128gcm` record format | vault-share docs/DECISIONS.md:62 (D012) |
| 64 KiB records | vault-share docs/DECISIONS.md:63 (rs always 65536); README.md:18 |
| AES-256-GCM | vault-share docs/DECISIONS.md:63 (D012); README.md:18 |
| Key in the URL fragment, which browsers never send | vault-share README.md:3, 21; docs/DECISIONS.md:12-14 (D003) |
| File password: the secret is wrapped under a key that Argon2id derives from the password | vault-share docs/DECISIONS.md:112 (D019); README.md:31 |
| Accounts: an Argon2id master key, from which HKDF derives the auth secret and the wrapping key | vault-share docs/DECISIONS.md:161 (D026); README.md:41 |
| The server never sees the password | vault-share docs/DECISIONS.md:161, 164 (D026), 112 (D019: the server does not know a password exists); README.md:31, 41 |
| Download counts decremented in one conditional SQL UPDATE. Concurrent requests cannot over-issue, which rests on that statement's own condition | vault-share docs/DECISIONS.md:79 (D014); server/internal/store/store.go:263-271 |
| Stateless challenges carrying an HMAC-SHA256 tag | vault-share docs/DECISIONS.md:80 (D014); docs/security/FINDINGS.md:14 (F8) |
| Threat model | vault-share docs/security/THREAT_MODEL.md:1-3; README.md:55 |
| Self-assessment against the OWASP Top 10:2025 | vault-share docs/security/TEST_REPORT.md:3 |
| 170 black-box checks; 30 browser checks | vault-share docs/security/TEST_REPORT.md:376-377 |
| 46 findings; 4 High (F1, F2, F3, F26) | vault-share docs/security/FINDINGS.md:7-52; 7-9, 32 |
| 44 fixed, F20 in documentation; 2 accepted (F22, F40) | vault-share docs/security/FINDINGS.md:5-52 (rows 26; 28, 46) |
| Sandboxed renderer | local-ledger docs/DECISIONS.md:53-55 (D010); docs/SECURITY_DESIGN.md:93; docs/SPEC.md:51 |
| No Node.js in the renderer | local-ledger docs/SECURITY_DESIGN.md:11, 93 |
| Custom protocol `app://local-ledger` with a CSP on every response | local-ledger docs/DECISIONS.md:48 (D009); docs/SECURITY_DESIGN.md:93 |
| Typed IPC validated with zod | local-ledger docs/SPEC.md:53-55; docs/SECURITY_DESIGN.md:96; docs/DECISIONS.md:100, 102 (D017) |
| No network requests | local-ledger README.md:3 |
| Checked by reading a Chromium net log in the e2e suite | local-ledger docs/DECISIONS.md:49 (D009); docs/SECURITY_DESIGN.md:94 |
| The renderer process is replaced on every lock | local-ledger docs/DECISIONS.md:94-95 (D016) |

### Quantitative research

All paths are in backtest-lab.

| Number or claim | Source |
|---|---|
| Daily, multi-asset, long and short | docs/SPEC.md:37 |
| Weights decided at the close of t, traded at the open of t+1 | docs/DECISIONS.md:63 (D013) |
| Returns net of fees and slippage (1 bp and 5 bps per side) | docs/DECISIONS.md:70 (D014); README.md:9 |
| Every trial is recorded | docs/SPEC.md:41; docs/METHODS.md:12 |
| Every check runs on the stored trials | docs/REPORT.md:3 |
| Walk-forward analysis, purged cross-validation, PBO, DSR | README.md:3, 30-33 |
| Data range, grids and costs fixed before any strategy ran on real data | docs/DECISIONS.md:117-121 (D021); README.md:9 |
| Pass thresholds fixed before any real-data run | docs/DECISIONS.md:134 (D022); README.md:38 |
| Post hoc analyses live in `backtest_lab.validation.posthoc` and are labelled post hoc | docs/DECISIONS.md:183 (D029); README.md:23 |
| Registered results are frozen; CI checks them against `SHA256SUMS` | docs/DECISIONS.md:201 (D032); .github/workflows/ci.yml:16-20 |
| Prices from yfinance | docs/SPEC.md:31; docs/DECISIONS.md:23-25 (D006) |
| Macro series from FRED | docs/SPEC.md:32; docs/DECISIONS.md:27-29 (D007) |
| Stored as Parquet, queried with DuckDB | docs/SPEC.md:33 |
| Weekly GitHub Actions update | docs/SPEC.md:35; docs/DECISIONS.md:53-55 (D012); .github/workflows/data.yml:3-4 |

### Recommender systems

All paths are in push-lab.

| Number or claim | Source |
|---|---|
| Push notification pipeline built on public data | README.md:3; docs/SPEC.md:5 |
| Two-tower recall with a faiss (HNSW) index | docs/SPEC.md:38, 148; docs/DECISIONS.md:98-100 (D007) |
| Coarse ranking by the two-tower score | docs/SPEC.md:41; docs/DECISIONS.md:102-104 (D008) |
| LightGBM fine ranking | docs/SPEC.md:42; docs/DECISIONS.md:102-104 (D008) |
| Uplift models | docs/SPEC.md:45-46, 55 |
| The delivery policy decides whether to send, the slot and the copy | docs/SPEC.md:35, 53-62, 159-160 |
| Off-policy estimators include IPS and DR | docs/SPEC.md:64; docs/DECISIONS.md:396 (D042: IPS and DR are primary) |
| Checked against a known answer on the Open Bandit Dataset | docs/SPEC.md:65; docs/DECISIONS.md:387 (D041), 396 (D042) |
| On the full campaign no estimator passed (IPS 0.891, DR 0.896 of the on-policy value) | docs/DECISIONS.md:454, 456 (D046); README.md:55 |
| No Tier B result; 0 Tier B claims | README.md:15, 18; docs/SPEC.md:95; docs/DECISIONS.md:456 (D046) |
| Simulator response model fitted on KuaiRand random exposures | docs/SPEC.md:50, 182 |
| No public dataset links push sends to later behaviour | docs/METHODS.md:267; docs/SPEC.md:216; docs/DECISIONS.md:87 |
| Tiers: A randomized real data, B validated off-policy estimate, C simulator with a sweep | README.md:12-16; docs/SPEC.md:89-93; docs/DECISIONS.md:73 (D002) |
| Comparisons are pre-registered before the simulations run and reported as they come out | docs/SPEC.md:18; docs/DECISIONS.md:195 (D020), 404 (D043) |
| A pre-registered ranking result went the other way: fine ranker click GAUC 0.545 against the two-tower score's 0.598 (C2) | docs/DECISIONS.md:197 (D020); README.md:55 |

### Tools

Where each tool appears: site project tags first, then the repositories.

| Number or claim | Source |
|---|---|
| Go | site:src/content/projects/matching-engine.json:9, vault-share.json:9; matching-engine docs/DECISIONS.md:5-8 (D001); vault-share README.md:7 |
| Python | site:src/content/projects/backtest-lab.json:10, push-lab.json:9; backtest-lab docs/DECISIONS.md:3 (D001); push-lab docs/DECISIONS.md:67 (D001) |
| TypeScript | site:src/content/projects/local-ledger.json:10; local-ledger docs/DECISIONS.md:3 (D001); vault-share README.md:7 |
| React | site:src/content/projects/vault-share.json:10, local-ledger.json:11, backtest-lab.json:26; vault-share README.md:7; backtest-lab docs/DECISIONS.md:3 (D001) |
| FastAPI | site:src/content/projects/backtest-lab.json:22; backtest-lab docs/SPEC.md:14; pyproject.toml:11 |
| Electron | site:src/content/projects/local-ledger.json:9; local-ledger docs/DECISIONS.md:3 (D001); package.json:46 |
| SQLite | site:src/content/projects/vault-share.json:102; vault-share README.md:7; backtest-lab docs/DECISIONS.md:97-100 (D018) |
| SQLCipher 4 format | site:src/content/projects/local-ledger.json:12; local-ledger README.md:18; docs/SPEC.md:59, 66 (SQLCipher-compatible, SQLCipher v4 scheme, through better-sqlite3-multiple-ciphers) |
| DuckDB | site:src/content/projects/backtest-lab.json:155; backtest-lab docs/SPEC.md:33; pyproject.toml:10 |
| Parquet | site:src/content/projects/backtest-lab.json:155, push-lab.json:109; backtest-lab docs/SPEC.md:33; push-lab docs/SPEC.md:32, 143 |
| Web Crypto | site:src/content/projects/vault-share.json:12; vault-share docs/DECISIONS.md:7-9 (D002) |
| Argon2id | vault-share README.md:31, 41; local-ledger README.md:18; docs/DECISIONS.md:85-87 (D015) |
| LightGBM | push-lab docs/SPEC.md:42; docs/DECISIONS.md:102 (D008); pyproject.toml:12 |
| faiss | site:src/content/projects/push-lab.json:111; push-lab docs/SPEC.md:38; docs/DECISIONS.md:98-100 (D007); pyproject.toml:11 |
| GitHub Actions | site:src/content/projects/backtest-lab.json:143; backtest-lab docs/SPEC.md:35; .github/workflows/data.yml:3-4 |
| This site: Astro | site:docs/SPEC.md:41; site:docs/DECISIONS.md:11-16 (D003); site:README.md:3 |
| This site: hand-written WebGL2 and GLSL | site:docs/SPEC.md:43; site:docs/DECISIONS.md:3-5 (D001), 100-102 (D015); site:src/gl/shaders/background.frag.glsl; site:README.md:3 |
