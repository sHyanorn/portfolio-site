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
- Amendment 2026-11-09: with React dropped (D003), the configuration is vault-share's without the `react` plugin, and warnings fail the lint

## D005 Articles in MDX, rendered at build time
- Date: 2026-11-09
- Decision: articles live in `src/content/articles/<slug>.mdx` with `title`, `project`, `date`, `summary` and `math` in the frontmatter. Code is highlighted by Shiki at build time, math is rendered by rehype-katex at build time, and reading time is computed at build time. The KaTeX stylesheet and fonts load only on articles with `math: true`
- Rationale: none of these needs work in the browser, so an article page ships no more JS than any other page
- Alternatives: Prism or highlight.js in the browser; MathJax or KaTeX auto-render in the browser (client JS for static content)
- Amendment 2026-11-09: since Astro 7, `.md` and `.mdx` go through Sätteri by default, which runs only its own mdast and hast plugins. The site keeps the unified pipeline: `@astrojs/markdown-remark` is installed and `markdown.processor` is `unified({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] })`, which MDX inherits, with `shikiConfig` at the top level of `markdown`. Source: docs.astro.build as of 2026-11-09, which documents Astro 7 ("Since Astro v7, Sätteri is the default Markdown processor"; `unified()` added in `@astrojs/markdown-remark` 7.2.0). A test build with Astro 7.4.7, `@astrojs/mdx` 8.1.3 and `@astrojs/markdown-remark` 7.3.6 rendered the math article and dual-theme code blocks with these settings

## D006 HTML whitespace follows HTML rules
- Date: 2026-11-09
- Decision: `compressHTML: true`, the behaviour before Astro 7, instead of Astro 7's default `'jsx'`
- Rationale: under `'jsx'`, whitespace that contains a line break is removed, so inline elements on separate lines render with no space between them. Prettier formats `.astro` files by HTML whitespace rules and moves inline elements onto separate lines, so the two together would drop spaces from the text

## D007 Site URL and base path from the environment
- Date: 2026-11-09
- Decision: `astro.config.ts` reads `site` from `SITE_URL` and `base` from `BASE_PATH`, falling back to the local root. The deploy workflow takes both from `actions/configure-pages`, which reports the origin and path GitHub Pages serves the site from. Internal links go through `withBase()` or Astro's locale helpers, and no page writes the base itself
- Rationale: renaming the repository to `sHyanorn.github.io` or adding a custom domain changes only the repository settings. CI builds under a non-root base, so a link that ignores the base fails the link check
- Borrowed: `site` and `base` from Astro's GitHub Pages guide, which writes both into the config; here they come from the Pages configuration instead

## D008 Automated checks
- Date: 2026-11-09
- Decision: CI runs on every push and pull request: oxlint, Prettier, `astro check` (TypeScript 6, the newest version it supports), Vitest, a build under the non-root base `/ci-base/`, the JS budget of 150 kB gzipped per page, and Playwright with axe on every page at 390, 768 and 1440 px in light and dark. The page checks require no axe violations, no content wider than its box outside a scroll container, a tabindex on every region that scrolls, and every internal link to resolve. Lighthouse CI then runs the mobile preset three times per page and requires 0.95 in all four categories; the desktop preset runs once per page for reference
- Borrowed: Lighthouse CI's `autorun` setup from its getting-started guide, keeping reports as a workflow artifact instead of public temporary storage; `@axe-core/playwright` with the WCAG 2.2 AA and best-practice tags

## D009 Deploy to GitHub Pages from Actions
- Date: 2026-11-09
- Decision: `deploy.yml` builds with `withastro/action` and publishes with `actions/deploy-pages`, and `actions/configure-pages` supplies `SITE_URL` and `BASE_PATH` (D007). Until launch the workflow runs only when started by hand, after a milestone is accepted; from launch it will run after CI passes on `main`
- Rationale: text awaiting review and unfinished pages stay off the public site until launch
- Borrowed: the workflow in Astro's GitHub Pages guide (`withastro/action@v6`, `actions/deploy-pages@v5`), with the `configure-pages` step added
