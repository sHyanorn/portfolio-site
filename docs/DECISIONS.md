# Technical Decision Log

## D001 Raw WebGL instead of three.js
- Date: 2026-11-04
- Rationale: shows GLSL and graphics-pipeline understanding directly; smaller bundle

## D002 Separate content from pages
- Date: 2026-11-04
- Rationale: each finished project only needs one new content file

## D003 Static generation approach
- Date: TBD, to be decided in M0

## D004 oxlint instead of ESLint
- Date: 2026-11-06
- Rationale: the same linter as vault-share (its D006), so every frontend in the portfolio shares one lint setup; oxlint is the default of the current `create-vite` template
