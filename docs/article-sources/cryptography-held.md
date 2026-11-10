# Sources: The cryptography was the part that held

Article: `src/content/articles/cryptography-held.mdx`.

All paths are in github.com/sHyanorn/vault-share at commit d5f69e6.

| Number or claim | Source |
|---|---|
| 55 findings; five High (F1, F2, F3, F26, F47) | docs/security/FINDINGS.md:5-61 (table; rows 7, 8, 9, 32, 53) |
| How each finding was found: independent reviews of milestones M2 to M7 and adversarial re-checks of fixes (38 of 55), the OWASP Top 10:2025 pass, a production readiness review, a code review, two from a simplification review, one while fixing F43 | docs/security/FINDINGS.md:7-61 ("Found by" column) |
| Before and after tests for F26, F38, F39 | docs/security/FINDINGS.md:166-167, 215, 219 |
| Black-box and browser test scripts | docs/security/TEST_REPORT.md:29-31 |
| F1 details | docs/security/FINDINGS.md:63-65 |
| F2 details; retries could replace or delete acknowledged content | docs/security/FINDINGS.md:8, 67-69 |
| F3: 60-second write timeout, retries into F2 | docs/security/FINDINGS.md:71-73 |
| F26: 40 uploads, 18 → 341 MiB; six uploads, 64 MiB record, 360 MiB; one temp file and five 409s; streaming, ten uploads to ten records, 19 → 20 MiB; 5 GiB cap | docs/security/FINDINGS.md:165-167 |
| F47: from the production readiness review; a new database over existing storage; the startup cleanup deleted every object without a record; lost or replaced volume, a restore without the database, a second instance on the bucket; 300 blobs and 30 objects; no request triggers it; every shared file lost | docs/security/FINDINGS.md:53, 250 |
| F47 fix: start refused when the database is new and the storage holds content; first sweep an hour after the start; at most 100 objects a sweep (D032) | docs/security/FINDINGS.md:251; docs/DECISIONS.md:212 |
| F47 remaining: an existing database on another instance's storage still loses that content, 100 objects an hour; the bucket must belong to vaultd alone | docs/security/FINDINGS.md:252 |
| F38: attacker knows the password; 40 wrong codes, 7 to 20 checked, limit 5; at most 5 after the fix, on one ticket or over eight; six digits | docs/security/FINDINGS.md:213-215 |
| F39: 50 at once from 50 addresses, all checked, limit 20; 20 signatures, 11 to 14 checked, limit 5; 20 at once from one client, 19 or 20 checked, limit 5; exactly 20, 5 and 5 after the fix | docs/security/FINDINGS.md:217-219 |
| D002: Web Crypto and mature libraries | docs/DECISIONS.md:7-10 |
| D003: key in the fragment, which browsers do not send | docs/DECISIONS.md:12-14 |
| Severity follows the impact on the threat model | docs/security/FINDINGS.md:3 |
| D012: RFC 8188 `aes128gcm`, Firefox Send, §3.1 vector with 128-bit key, 256-bit file key, the listed differences | docs/DECISIONS.md:62, 67-68 |
| §3.2 vector runs only with its key id removed | web/src/crypto/vectors.test.ts:101-126 |
| F20: stored auth key, decryption still needs the link secret | docs/security/FINDINGS.md:141-143 |
| OWASP Top 10:2025 self-assessment | docs/security/TEST_REPORT.md:3 |
| F20 the only finding under A04:2025 Cryptographic Failures | docs/security/TEST_REPORT.md:12 |
| Scanners 0 issues on the source at a277b92; 4 Caddy advisories (F22) | docs/security/TEST_REPORT.md:27-35 |
| Compromised server, as with most web-based encryption tools; size and access times | README.md:61, 63 |
