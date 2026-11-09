# Sources: vault-share

Content: `src/content/projects/vault-share.json`.

All paths are in github.com/sHyanorn/vault-share at commit 96159bb.

| Number or claim | Source |
|---|---|
| Browser encrypts before upload; key only after the `#`, which browsers never send; server cannot read contents or names | README.md:3 |
| Go with chi and SQLite, React, Caddy for TLS; ciphertext on local disk or in an S3-compatible bucket | README.md:7 |
| Web Crypto | docs/DECISIONS.md:7-9 (D002) |
| Demo: a file shared for one download, the link and the delete link, one download, the link gone | README.md:5; docs/demo.gif (frames 47 to 60 show "1 download" and the delete link; the last frames show the file gone) |
| 0 of 16 requests carried the fragment, the secret, the file or metadata key, the file name or a slice of the plaintext; raw, hex, base64 at every alignment, percent- and form-encoded; bodies captured; auth key once in the create request | docs/security/TEST_REPORT.md:178 |
| 46 findings; 4 High (F1, F2, F3, F26); 2 accepted (F22, F40); the other 44 fixed, F20 in documentation | docs/security/FINDINGS.md:5-52 (rows 7, 8, 9, 32; 28, 46) |
| 170 black-box checks on the Compose stack; 30 browser checks | docs/security/TEST_REPORT.md:376-377 |
| 143 Go tests with `-race`; 107 Vitest tests | docs/security/TEST_REPORT.md:379-380; at 96159bb `go test -race ./...` (Go 1.27.3) passes 143 and skips the 2 S3 tests that need `VAULT_TEST_S3_ENDPOINT` (server/internal/blob/s3_test.go:35), and `npx vitest run` in web/ passes 107 |
| Self-assessment against the OWASP Top 10:2025 on instances the tester operated | docs/security/TEST_REPORT.md:3 |
| Nine categories pass; A09 partial, nothing alerts | docs/security/TEST_REPORT.md:7-18 |
| Expiry of 1 hour, 1 day or 7 days; 1 to 100 downloads; burn after reading | docs/SPEC.md:22-23; README.md:3 |
| Goals: 1 GB files in streamed chunks, not loaded into memory at once; password the server never sees; accounts; threat model and OWASP Top 10 self-assessment with a report | docs/SPEC.md:28, 24, 32-33, 14, 182-183; README.md:3 (accounts) |
| 64 KiB records | README.md:18; docs/DECISIONS.md:63 (rs always 65536) |
| Constant-memory streaming; upload as one Blob, which browsers may keep in memory; a file near 1 GB heavy on low-memory devices | docs/DECISIONS.md:86-88 (D015) |
| Compromised server can send key-stealing JavaScript; server sees size and upload and download times | README.md:61, 63 |
| Diagram: keys derived from the 16-byte secret; ciphertext, encrypted name and auth key up; file id and delete token back; `/f/id#secret`; challenge, signature, one-time token, one download; decrypt while streaming to disk | README.md:16-28 |
| Caddy proxies every request to vaultd | docs/DECISIONS.md:45 (D009); Caddyfile:30-32 |
| SQLite keeps the encrypted names, token hashes and auth keys | README.md:33; docs/SPEC.md:101-112 |
| D012: RFC 8188 `aes128gcm`, 256-bit key, Firefox Send | docs/DECISIONS.md:62, 67 |
| D012: records of 65536 bytes, AES-256-GCM, last record marked; changed, reordered or cut files fail | docs/DECISIONS.md:63; README.md:32 |
| D012: §3.1 vector with a 128-bit key runs unchanged | docs/DECISIONS.md:67; web/src/crypto/vectors.test.ts:62-72 |
| D012: rejects another `rs` or a key id; empty file still ends with a last record | docs/DECISIONS.md:68 |
| D014: count taken at token issue in one conditional UPDATE; token valid 5 minutes, one use | docs/DECISIONS.md:79 |
| D014: Firefox Send counted at stream end without atomicity; an interrupted download uses a count | docs/DECISIONS.md:81-82 |
| D014: stateless 32-byte challenges with an HMAC tag under a startup key; nothing to evict | docs/DECISIONS.md:80; docs/security/FINDINGS.md:83-84 (F8) |
| D019: 16-byte secret wrapped with AES-256-GCM; Argon2id 64 MiB, 2 passes; server unchanged and unaware | docs/DECISIONS.md:112 |
| D019: Firefox Send re-keyed with PBKDF2 at 100 iterations, link still carried the file key | docs/DECISIONS.md:113 |
| D019: offline guessing at Argon2id cost; at least 8 characters (F21) | docs/DECISIONS.md:114-115; docs/security/FINDINGS.md:137-138 |
| D026: password stays in the browser; Argon2id master key; HKDF auth secret hashed again with Argon2id; wrapping key seals a random 256-bit account key | docs/DECISIONS.md:161; README.md:41 |
| D026: entries bound to the file id with secret, link key and delete token; server lists, browser opens the names | docs/DECISIONS.md:162; README.md:42 |
| D026: split follows Bitwarden; forgotten password loses the account, links keep working | docs/DECISIONS.md:165-166; README.md:46 |
| D024: no public instance; recorded GIF and one command | docs/DECISIONS.md:145 |
| D024: malware and phishing, answered only by deleting links; Firefox Send shut down in 2020; quota filling and CPU saturation without upstream protection | docs/DECISIONS.md:146 |
| Four High findings all about uploads | docs/security/FINDINGS.md:7-9, 32 |
| F3: 60-second write timeout cut the reply, client retried into F2; deadlines extended for the transfer | docs/security/FINDINGS.md:63-64; docs/DECISIONS.md:122 (deadline from the size) |
| F2: second upload with the owner token overwrote, or with a bad body deleted, the stored blob; existing content never replaced | docs/security/FINDINGS.md:59-60 |
| F26: one upload at a time; 40 uploads 18 to 341 MiB on S3; streamed, ten uploads to ten records 19 to 20 MiB | docs/security/FINDINGS.md:157-158; README.md:52 |
| F38: 40 wrong codes on one ticket, 7 to 20 checked, ticket allows 5; at most 5 after the fix; the ticket gives up an attempt in the statement that checks its count | docs/security/FINDINGS.md:205-206; docs/DECISIONS.md:190 |
| F39: asked before, told after; 20 signatures at once, 11 to 14 checked, 5 lock the client; admit before the check; exactly 5 after the fix | docs/security/FINDINGS.md:209-210; docs/DECISIONS.md:172 |
| F42: refusals for attempts in flight answered as a 15-minute lockout; now 503 `busy` with `Retry-After: 5` | docs/security/FINDINGS.md:221-222 |
| F20: specification said only a verifier is stored; the key itself is, as in Firefox Send; a database copy spends download counts but cannot decrypt; documents corrected | docs/security/FINDINGS.md:133-134 |
