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
- Amendment 2026-11-09: React is dropped. The GLSL background is a TypeScript module loaded by an Astro `<script>`, and the language toggle is a link to the same page in the other language, with English at the site root and Chinese under `/zh/`. Neither needs a component model, and a minimal React 19.3 mount measured 223 KB minified and 67 KB gzipped, 45% of the 150 KB budget

## D004 oxlint instead of ESLint
- Date: 2026-11-06
- Rationale: the same linter as vault-share (its D006), so the frontends of these projects share one lint setup; oxlint is the default of the current `create-vite` template
- Amendment 2026-11-09: still applies with Astro (D003); the React islands and any client TypeScript use the same oxlint setup as vault-share

## D005 Articles in MDX, rendered at build time
- Date: 2026-11-09
- Decision: articles live in `src/content/articles/<slug>.mdx` with `title`, `project`, `date`, `summary` and `math` in the frontmatter. Code is highlighted by Shiki at build time, math is rendered by rehype-katex at build time, and reading time is computed at build time. The KaTeX stylesheet and fonts load only on articles with `math: true`
- Rationale: none of these needs work in the browser, so an article page ships no more JS than any other page
- Alternatives: Prism or highlight.js in the browser; MathJax or KaTeX auto-render in the browser (client JS for static content)
- Amendment 2026-11-09: since Astro 7, `.md` and `.mdx` go through Sätteri by default, which runs only its own mdast and hast plugins. The site keeps the unified pipeline: `@astrojs/markdown-remark` is installed and `markdown.processor` is `unified({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] })`, which MDX inherits, with `shikiConfig` at the top level of `markdown`. Source: docs.astro.build as of 2026-11-09, which documents Astro 7 ("Since Astro v7, Sätteri is the default Markdown processor"; `unified()` added in `@astrojs/markdown-remark` 7.2.0). A test build with Astro 7.4.7, `@astrojs/mdx` 8.1.3 and `@astrojs/markdown-remark` 7.3.6 rendered the math article and dual-theme code blocks with these settings
