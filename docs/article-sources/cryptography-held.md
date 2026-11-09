# Sources: The cryptography was the part that held

Article: `src/content/articles/cryptography-held.mdx`.

All paths are in github.com/sHyanorn/vault-share at commit 96159bb.

| Number or claim | Source |
|---|---|
| 46 findings; four High (F1, F2, F3, F26) | docs/security/FINDINGS.md:5-52 (table; rows 7, 8, 9, 32) |
| How each finding was found | docs/security/FINDINGS.md:5-52 ("Found by" column) |
| Before and after tests for F26, F38, F39 | docs/security/FINDINGS.md:157-158, 206, 210 |
| Black-box and browser test scripts | docs/security/TEST_REPORT.md:29-31 |
| F1 details | docs/security/FINDINGS.md:54-56 |
| F2 details | docs/security/FINDINGS.md:58-60 |
| F3: 60-second write timeout, retries into F2 | docs/security/FINDINGS.md:62-64 |
| F26: 40 uploads, 18 → 341 MiB; six uploads, 64 MiB record, 360 MiB; one temp file and five 409s; streaming, ten uploads to ten records, 19 → 20 MiB; 5 GiB cap | docs/security/FINDINGS.md:156-158 |
| F38: attacker knows the password; 40 wrong codes, 7 to 20 checked, limit 5; at most 5 after the fix; six digits | docs/security/FINDINGS.md:204-206 |
| F39: 50 at once from 50 addresses, all checked, limit 20; 20 signatures, 11 to 14 checked, limit 5; exactly 20 and 5 after the fix | docs/security/FINDINGS.md:208-210 |
| D002: Web Crypto and mature libraries | docs/DECISIONS.md:7-10 |
| D003: key in the fragment, which browsers do not send | docs/DECISIONS.md:12-14 |
| Severity follows the impact on the threat model | docs/security/FINDINGS.md:3 |
| D012: RFC 8188 `aes128gcm`, Firefox Send, §3.1 vector with 128-bit key, 256-bit file key, the listed differences | docs/DECISIONS.md:62, 67-68 |
| §3.2 vector runs only with its key id removed | web/src/crypto/vectors.test.ts:101-126 |
| F20: stored auth key, decryption still needs the link secret | docs/security/FINDINGS.md:132-134 |
| OWASP Top 10:2025 self-assessment | docs/security/TEST_REPORT.md:3 |
| Scanners 0 issues on the source at a277b92; 4 Caddy advisories (F22) | docs/security/TEST_REPORT.md:27-35 |
| Compromised server, size and access times | README.md:61, 63 |
