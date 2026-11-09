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
- Amendment 2026-11-09: still applies with Astro (D003); the React islands and any client TypeScript use the same oxlint setup as vault-share

## D005 Articles in MDX, rendered at build time
- Date: 2026-11-09
- Decision: articles live in `src/content/articles/<slug>.mdx` with `title`, `project`, `date`, `summary` and `math` in the frontmatter. Code is highlighted by Shiki at build time, math is rendered by rehype-katex at build time, and reading time is computed at build time. The KaTeX stylesheet and fonts load only on articles with `math: true`
- Rationale: none of these needs work in the browser, so an article page ships no more JS than any other page
- Alternatives: Prism or highlight.js in the browser; MathJax or KaTeX auto-render in the browser (client JS for static content)
