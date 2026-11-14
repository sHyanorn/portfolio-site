# Sources: vault-share

Content: `src/content/projects/vault-share.json`.

All paths are in github.com/sHyanorn/vault-share at commit bc14051.

| Number or claim | Source |
|---|---|
| Browser encrypts before upload; key only after the `#`, which browsers never send; server cannot read contents or names | README.md:3 |
| Go with chi and SQLite, React, Caddy for TLS; ciphertext on local disk or in an S3-compatible bucket | README.md:7 |
| Web Crypto | docs/DECISIONS.md:7-9 (D002) |
| Demo: a file shared for one download, the link and the delete link, one download, the link gone | README.md:5; docs/demo.gif (frames 47 to 60 show "1 download" and the delete link; the last frames show the file gone) |
| 0 of 16 requests carried the fragment, the secret, the file or metadata key, the file name or a slice of the plaintext; raw, hex, base64 at every alignment, percent- and form-encoded; bodies captured; auth key once in the create request | docs/security/TEST_REPORT.md:178 |
| 68 findings, logged during development, a production readiness review and code review; 5 High (F1, F2, F3, F26, F47); 61 fixed, F20 and F62 in documentation; 3 accepted (F22, F40, F64); 4 open (F52 to F55), the highest Low | docs/security/FINDINGS.md:5-74 (rows 7, 8, 9, 32, 53; 26, 68; 28, 46, 70; 58-61; "Found by" column) |
| 171 black-box checks on the Compose stack; 30 browser checks | docs/security/TEST_REPORT.md:453, 455 (section 10, CI run 43536906405) |
| 173 Go tests with `-race`, S3 tests included; 113 Vitest tests | docs/security/TEST_REPORT.md:450, 452 (section 10, CI run 43536906405) |
| Self-assessment against the OWASP Top 10:2025 on instances the tester operated | docs/security/TEST_REPORT.md:3 |
| Nine categories pass; A09 partial, nothing alerts | docs/security/TEST_REPORT.md:7-18 |
| Expiry of 1 hour, 1 day or 7 days; 1 to 100 downloads; burn after reading | docs/SPEC.md:22-23; README.md:3 |
| Goals: 1 GiB files in streamed chunks, not loaded into memory at once; password the server never sees; accounts; threat model and OWASP Top 10 self-assessment with a report | docs/SPEC.md:28, 24, 32-33, 14, 198-199; README.md:3 (accounts) |
| 64 KiB records | README.md:18; docs/DECISIONS.md:65 (rs always 65536) |
| Constant-memory streaming; upload as one Blob, which browsers may keep in memory; a file near 1 GiB heavy on low-memory devices | docs/DECISIONS.md:89-91 (D015) |
| Download: Chromium-based browsers write the decrypted file straight to disk; other browsers hold it in browser storage until it is saved | README.md:67; docs/SPEC.md:68 |
| Compromised server can send key-stealing JavaScript, as with most web-based encryption tools; server sees size and upload and download times | README.md:61, 63 |
| Server can tell whether a file has a password; metadata padded to whole KiB, so a name's length shows only beyond about 900 bytes | docs/security/THREAT_MODEL.md:86-87; docs/DECISIONS.md:73, 119; docs/security/FINDINGS.md:330-332 (F63) |
| Monitoring and backups left to the operator; health check covers the database, the storage and free disk space, not the database's integrity; no alerts, no automatic backups | README.md:68; docs/DECISIONS.md:224-226 (D033) |
| Diagram: keys derived from the 16-byte secret; ciphertext, encrypted name and auth key up; file id and delete token back; `/f/id#secret`; challenge, signature, one-time token, one download; decrypt while downloading, straight to disk in Chromium-based browsers | README.md:16-28, 67 |
| Caddy proxies every request to vaultd | docs/DECISIONS.md:46 (D009); Caddyfile:39-41 |
| SQLite keeps the encrypted names, token hashes and auth keys | README.md:33; docs/SPEC.md:110-122 |
| D012: RFC 8188 `aes128gcm`, 256-bit key, Firefox Send | docs/DECISIONS.md:64, 69 |
| D012: records of 65536 bytes, AES-256-GCM, last record marked; changed, reordered or cut files fail | docs/DECISIONS.md:65; README.md:32 |
| D012: §3.1 vector with a 128-bit key runs unchanged | docs/DECISIONS.md:69; web/src/crypto/vectors.test.ts:62-72 |
| D012: rejects another `rs` or a key id; empty file still ends with a last record | docs/DECISIONS.md:70 |
| D014: count taken at token issue, a conditional UPDATE and the token insert in one transaction (F48); token valid 5 minutes, one use | docs/DECISIONS.md:82 |
| D014: Firefox Send counted at stream end without atomicity; an interrupted download uses a count | docs/DECISIONS.md:84-85 |
| D014: stateless 32-byte challenges with an HMAC tag under a startup key; nothing to evict | docs/DECISIONS.md:83; docs/security/FINDINGS.md:105-106 (F8) |
| D019: 16-byte secret wrapped with AES-256-GCM; Argon2id 64 MiB, 2 passes; server unchanged | docs/DECISIONS.md:115 |
| D019: server never sees the password but can tell whether one exists: metadata requested only after the right password; My files entry 206 bytes with a password, 148 without | docs/DECISIONS.md:119, 207; docs/security/THREAT_MODEL.md:87 |
| D019: Firefox Send re-keyed with PBKDF2 at 100 iterations, link still carried the file key | docs/DECISIONS.md:117 |
| D019: offline guessing at Argon2id cost; at least 8 characters (F21) | docs/DECISIONS.md:118, 120; docs/security/FINDINGS.md:159-160 |
| D026: password stays in the browser; Argon2id master key; HKDF auth secret hashed again with Argon2id; wrapping key seals a random 256-bit account key | docs/DECISIONS.md:167; README.md:41 |
| D026: entries bound to the file id with secret, link key and delete token; server lists, browser opens the names | docs/DECISIONS.md:168; README.md:42 |
| D026: split follows Bitwarden; forgotten password loses the account, links keep working | docs/DECISIONS.md:171-172; README.md:46 |
| D024: no public instance; recorded GIF and one command | docs/DECISIONS.md:151 |
| D024: malware and phishing, answered only by deleting links; Firefox Send shut down in 2020; quota filling and CPU saturation without upstream protection | docs/DECISIONS.md:152 |
| Four of the five High findings about uploads; the fifth, F47, from the production readiness review: a new database over existing storage made cleanup delete every stored file | docs/security/FINDINGS.md:7-9, 32, 53, 263 |
| F3: 60-second write timeout cut the reply, client retried into F2; deadlines extended for the transfer | docs/security/FINDINGS.md:85-86; docs/DECISIONS.md:127 (deadline from the size) |
| F2: second upload with the owner token overwrote, or with a bad body deleted, the stored blob; existing content never replaced | docs/security/FINDINGS.md:81-82 |
| F26: one upload at a time; 40 uploads 18 to 341 MiB on S3; streamed, ten uploads to ten records 19 to 20 MiB | docs/security/FINDINGS.md:179-180; README.md:52 |
| F38: 40 wrong codes on one ticket, 7 to 20 checked, ticket allows 5; at most 5 after the fix; the ticket gives up an attempt in the statement that checks its count | docs/security/FINDINGS.md:227-228; docs/DECISIONS.md:196 |
| F39: asked before, told after; 20 signatures at once, 11 to 14 checked, 5 lock the client; admit before the check; exactly 5 after the fix | docs/security/FINDINGS.md:231-232; docs/DECISIONS.md:178 |
| F42: refusals for attempts in flight answered as a 15-minute lockout; now 503 `busy` with `Retry-After: 5` | docs/security/FINDINGS.md:243-244 |
| F20: specification said only a verifier is stored; the key itself is, as in Firefox Send; a database copy spends download counts but cannot decrypt; documents corrected | docs/security/FINDINGS.md:155-156 |
| F56: second step locked per account, so anyone with the password could shut the owner out of every sign-in and change; now counted per client, per known browser and for all other browsers together, and a change confirmed while signed in counts against that sign-in alone | docs/security/FINDINGS.md:301-303; docs/DECISIONS.md:236, 238 (D035) |
