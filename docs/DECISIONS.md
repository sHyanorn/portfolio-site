# Technical Decision Log

## D001 Raw WebGL instead of three.js
- Date: 2026-11-04
- Rationale: full control over the shaders and render loop; no 3D library in the bundle

## D002 Separate content from pages
- Date: 2026-11-04
- Rationale: each finished project only needs one new content file

## D003 Astro for static generation
- Date: 2026-11-09
- Decision: Astro with static output. React is used only for two islands: the GLSL background and the language toggle
- Rationale: content collections, MDX, RSS and Shiki highlighting are built in or official integrations; pages ship no JS unless they contain an island, which keeps the 150 KB budget easy to hold
- Alternatives: vite-plugin-ssg (every page hydrates React; MDX, RSS and highlighting are assembled by hand)

## D004 oxlint instead of ESLint
- Date: 2026-11-06
- Rationale: the same linter as vault-share (its D006), so the frontends of these projects share one lint setup; oxlint is the default of the current `create-vite` template
