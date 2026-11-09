# Sources: local-ledger

Content: `src/content/projects/local-ledger.json`.

All paths are in github.com/sHyanorn/local-ledger at commit ae08641.

| Number or claim | Source |
|---|---|
| Desktop app for macOS and Windows; everything on the computer, encrypted; no network requests | README.md:3 |
| Import, rules, budgets, charts, Excel or PDF export; one master password; no recovery | README.md:3, 18-22 |
| No cloud sync, no bank connection | docs/SPEC.md:45-46 |
| Specification: encryption, Argon2id, hardening, typed IPC, auto-lock, four bank templates and a wizard, fuzzy duplicates, rules, budgets with alerts, charts, export, encrypted backup, dark mode | docs/SPEC.md:11-14, 20-35 |
| Specification tests: no Node.js in the renderer, invalid IPC rejected, plain SQLite cannot open, unreadable after locking | docs/SPEC.md:101-102 |
| Exports and imported CSV files unencrypted | README.md:22, 59; docs/SECURITY_DESIGN.md:18 |
| Malware as the same user: memory while unlocked, password at the next unlock | docs/SECURITY_DESIGN.md:15 |
| Unsigned releases warn at first launch; trust rests on the checksum and attestation check | README.md:29; docs/SECURITY_DESIGN.md:114 |
| Demo: three screenshots from the repository, light theme, made-up data | docs/screenshots/overview-light.png, transactions-light.png, reports-light.png; README.md:5-14 |
| Transfers between own accounts paired and left out of income and spending | README.md:20 |
| 0 network requests; net log read by the e2e suite and the package check | README.md:3; docs/DECISIONS.md:49 (D009) |
| 321 ms; Argon2id 64 MiB, t=3, p=4; worker thread | docs/DECISIONS.md:87-88 (D015) |
| 7 ms in the worker against 281 ms on the main thread | docs/DECISIONS.md:88 (D015) |
| Electron 45, 2.1 GHz Xeon, 4 cores | docs/DECISIONS.md:88 (D015) |
| At least 15 characters; NIST SP 800-63B-4; no attempt limit; Argon2id cost does the work | docs/DECISIONS.md:81-82 (D014) |
| Diagram: sandboxed page, no Node.js, `app://local-ledger`, CSP | docs/SECURITY_DESIGN.md:93; docs/SPEC.md:51-54 |
| Diagram: typed `window.ledger` API from preload; sender check and zod in every handler | docs/SPEC.md:53-55; docs/SECURITY_DESIGN.md:96 |
| Diagram: Argon2id in a worker unseals the data key in `vault.json`; `ledger-<generation>.db` encrypted page by page | docs/SECURITY_DESIGN.md:26-33, 41 |
| Diagram: file in only through the open dialog; export only where the save dialog picks, not encrypted; backup is the encrypted database with a sealed header | docs/SECURITY_DESIGN.md:70, 77, 85 |
| Diagram paths | src/renderer, src/preload, src/main, src/main/vault, src/main/import |
| D013: 32-byte data key sealed with AES-256-GCM; header binds generation and settings | docs/DECISIONS.md:71 |
| D013: wrong password fails before the database is touched | docs/DECISIONS.md:76 |
| D013: new key, copy re-encrypted, checked, next generation; `vault.json` rename the single commit point | docs/DECISIONS.md:73; docs/SECURITY_DESIGN.md:44 |
| D013: 20,000 rows in 7 ms | docs/DECISIONS.md:77 |
| D016: new view on unlock, lock and committed change; old renderer exits; strings and DOM; lock while locked; e2e asserts the exit | docs/DECISIONS.md:94-95 |
| D025: fingerprint of date, amount, description and occurrence, per account, YNAB's `import_id`; possible duplicates within 4 days, unselected; batch, undo | docs/DECISIONS.md:146 |
| D027: transfers in two accounts; same currency, opposite amounts, 4 days; automatic pairing rules; groups wait; a Transfer category breaks silently | docs/DECISIONS.md:155-156 |
| D009: `app://local-ledger`, GET only, no path outside the build; CSP on every response | docs/DECISIONS.md:48 |
| D009: windows, navigation, redirects, webviews, permissions refused; spellcheck dictionary download; net log | docs/DECISIONS.md:49 |
| Bank formats: no published columns; open-source parsers where two agree; sample files; accepted variations; not checked against real exports | docs/DECISIONS.md:140; README.md:50 |
| Bank formats: column wizard; `npm run csv:shape` | README.md:50, 52; docs/DECISIONS.md:142 |
| Preview: 50,000-row limit | docs/SECURITY_DESIGN.md:71 |
| Preview: rows in view and twenty each side; 35 px rows; memoized; 4 s to 0.2 s, 1 s to 15 ms; react-window and `content-visibility` | docs/DECISIONS.md:197-198 (D035) |
| Formulas: own writer with fflate; inline strings, no formula element; Text format; quote prefix by OWASP | docs/DECISIONS.md:169 (D030) |
| Formulas: LibreOffice checked, Excel and Numbers not tried; exceljs 193 packages; npm `xlsx` no longer updated there | docs/DECISIONS.md:170-171 (D030) |
