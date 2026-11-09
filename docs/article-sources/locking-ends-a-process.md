# Sources: Locking the vault means ending a process

Article: `src/content/articles/locking-ends-a-process.mdx`.

All paths are in github.com/sHyanorn/local-ledger at commit ae08641.

| Number or claim | Source |
|---|---|
| Page replaced on unlock, lock and committed password change; old renderer exits; separate processes per view | docs/DECISIONS.md:94-95 (D016) |
| Lock replaces the page even when already locked | docs/DECISIONS.md:94 (D016); docs/SECURITY_DESIGN.md:42 |
| SQLite3 Multiple Ciphers, SQLCipher format | docs/SECURITY_DESIGN.md:33 |
| Data key sealed under a key Argon2id derives from the master password | docs/SECURITY_DESIGN.md:26-27 |
| Strings immutable; password in input value, React state, main process after IPC; V8 copies | docs/SECURITY_DESIGN.md:62 |
| Buffers zeroed after use; only copy of the data key inside SQLite | docs/SECURITY_DESIGN.md:53 |
| Argon2id 64 MiB, t = 3, p = 4; worker ends after each derivation | docs/DECISIONS.md:87 (D015); docs/SECURITY_DESIGN.md:54 |
| 321 ms derive; 281 ms main thread vs 7 ms in worker; Electron 45, 2.1 GHz Xeon, 4 cores | docs/DECISIONS.md:88 (D015) |
| Auto-lock 1, 5, 15 or 30 minutes, default 5, cannot be turned off; screen lock, sleep, window close | docs/SECURITY_DESIGN.md:43 |
| PID helpers | tests/e2e/fixtures.ts:40-63 (`rendererPid`, `expectExited`) |
| Nine call sites of `expectExited`, and the scenarios they cover | tests/e2e/vault.spec.ts:66, 107, 122, 138, 169, 191, 334; tests/e2e/import.spec.ts:224; tests/e2e/transactions.spec.ts:247 |
| Heap snapshot tests of the main process: transactions with control string and marker, import and export text; none checks the password; cannot see Buffers or freed memory | tests/e2e/transactions.spec.ts:223-258; tests/e2e/import.spec.ts:182-232; tests/e2e/export.spec.ts:229-231; docs/SECURITY_DESIGN.md:57 |
| Freed memory not overwritten | docs/SECURITY_DESIGN.md:63 |
| Decrypted rows as strings in the main process | docs/SECURITY_DESIGN.md:64 |
| 16 MB SQLite page cache; secure memory option off | docs/SECURITY_DESIGN.md:65 |
| Swap and hibernation; pages not locked | docs/SECURITY_DESIGN.md:66 |
| Same-user malware out of scope; someone at the computer after the lock is in scope | docs/SECURITY_DESIGN.md:10, 15 |
| Failed password change keeps its page | docs/SECURITY_DESIGN.md:56; docs/DECISIONS.md:94 (D016) |
