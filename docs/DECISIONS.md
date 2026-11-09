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

## D010 Design tokens
- Date: 2026-11-09
- Decision: colours, type, spacing, widths, radii and motion are CSS custom properties in `src/styles/tokens.css`. Colours are Radix Colors slate for the neutrals and indigo for the one accent, written as `light-dark()` pairs, so dark mode follows the system setting. Text is slate 12, secondary text slate 11, separators and borders slate 6 to 8; links and focus rings are indigo 11, because slate 7 has 1.5:1 against the page in light mode, under the 3:1 that WCAG 1.4.11 asks of focus indicators. Type uses the system font stack with SF Pro and PingFang SC first, on a fluid scale with 16 to 17 px body text; Chinese text has a line height of 1.75 against 1.6 for English; spacing is in multiples of 8 px
- Rationale: each Radix step has a defined role and tested contrast: slate 11 on slate 1 is 5.8:1 in light mode and 9.1:1 in dark, indigo 11 is 5.9:1 and 9.2:1. `light-dark()` keeps both values of a colour on one line, with no script and no flash before the theme applies
- Alternatives: a theme toggle (needs a script before the first paint)
- Borrowed: the slate and indigo scales and their step roles from Radix Colors 3.0.0 (MIT); the `clamp()` type scale from Utopia's fluid type calculator (360 to 1280 px viewports, ratio 1.2 to 1.25); the monospace stack from GitHub Primer
- Amendment 2026-11-09: spacing that changes with the viewport interpolates continuously, as in Utopia's fluid space calculator, with both ends on the 8 px grid: the page gutter grows from 16 to 24 px between 400 and 600 px viewports, and the gap between project page sections from 64 to 96 px between 400 and 1200 px

## D011 English at the root, Chinese under /zh/
- Date: 2026-11-09
- Decision: Astro's i18n routing with locales `en` and `zh`, English as the default and unprefixed. Each route has a thin page file in `src/pages/` and one in `src/pages/zh/`, both rendering one component that reads `Astro.currentLocale`. `lang` and `hreflang` use `en` and `zh-CN`; every page has a canonical URL and links both versions and `x-default`, the English one. The language toggle links to the same page in the other language: `pagePath()` strips the base and the `zh/` prefix, and `getRelativeLocaleUrl()` builds the other version's URL. Interface text sits in one dictionary in `src/lib/i18n.ts` where each key holds both languages, so a missing translation fails the type check. The 404 page, which GitHub Pages serves for every missing path, carries both languages and no alternates
- Rationale: a reader who switches language stays on the same page, and search engines can pair the two versions
- Borrowed: the `i18n` configuration and `astro:i18n` helpers from Astro's internationalization guide; the head tags (canonical URL from `Astro.url` and `site`, Open Graph) from Astro's blog example

## D012 One bilingual JSON file per project
- Date: 2026-11-09
- Decision: each project is a JSON file in `src/content/projects/`, checked by a Zod schema in `src/content.config.ts` whose fields follow the eight sections of the project page (SPEC §2). Every field a page shows is an `{ en, zh }` pair and every object is strict, so a missing translation or a misspelt key fails the build. Text is plain, with backticks for inline code. The demo poster goes through Astro's image pipeline, which gives the video its size. Metrics and decisions link to the repository file they come from, at the commit the numbers were taken from. Articles name their project with `reference('projects')`, and since Astro 7 only logs a reference to a missing entry and still finishes the build, the articles collection arrives with a check that fails the build on one
- Rationale: a new project needs one content file and no page code (D002), and the two languages of each paragraph sit side by side for review
- Alternatives: one file per language (translations drift apart unnoticed); MDX (a free-form body the schema cannot hold to the eight sections)
- Borrowed: content collections with the `glob()` loader and the `image()` schema helper from Astro's content collections guide
- Amendment 2026-11-09: each project has an `order`, a positive integer that places it in project lists; `byOrder` in `src/lib/projects.ts` sorts by it and fails the build when two projects share one
- Amendment 2026-11-09: an article names its project by id, checked in the schema against the files in `src/content/projects/`, so a missing project fails the build without a separate check; `reference('projects')` would also log an error for each draft, whose project page has not arrived yet
- Amendment 2026-11-09: the metrics link names its report in both languages (`metrics.source.label`), since the report differs by project: a benchmark report for matching-engine, a security test report for vault-share

## D013 Project page template
- Date: 2026-11-09
- Decision: `/projects/<slug>/` and `/zh/projects/<slug>/` render one component, `ProjectPage.astro`, in the order of SPEC §2. A demo is an H.264 MP4 with native controls, muted, looping, `playsinline` and `preload="none"`: it never plays on its own and downloads nothing until played. Its poster is a PNG that Astro's image service turns into AVIF at build time, and its size gives the video its dimensions. matching-engine's 2.15 MB demo GIF became a 316 kB MP4 (libx264, CRF 22, yuv420p, `+faststart`) with a 29 kB poster. Each project's architecture diagram is inline SVG drawn by hand in `src/components/architecture/<slug>.astro`, coloured with the design tokens so it follows the theme and the language; a narrow screen gets a vertical layout. The paragraph under the diagram describes it in words and is its text alternative, so the SVG itself is hidden from assistive technology
- Rationale: the video is a seventh of the GIF and can be paused; a demo that moves on its own distracts from the text beside it. An SVG in the page can use the page's colours and fonts, which an `<img>` cannot
- Alternatives: the GIF (2.15 MB on every visit, no pause); Mermaid rendered at build time (a generic layout, and its colours do not follow the theme)
- Borrowed: the conversion settings from web.dev's "Replace animated GIFs with video" (libx264, yuv420p, a CRF in the low twenties), without its autoplay; the card whose title link covers the whole card from Inclusive Components ("Cards")
- Amendment 2026-11-09: the demo is at most as tall as the first screen leaves below the header and the page intro, `max(16rem, 100svh - 26rem)`, and the figure is centred at the width that keeps the aspect ratio, so the controls show without scrolling; an e2e test checks this at 1440×900 and 768×1024. A fixed 70svh still ends the video below the fold at 1440×900, where the intro takes the first 390 px
- Amendment 2026-11-09: a demo is either the video above or two to four screenshots, each with alt text and a caption, for a project that does not run in a browser (Electron) or whose output is a report. Screenshots stack in the column, the first at the same height limit and each later one no taller than the screen less 8rem, which leaves room for its caption, as AVIF in 358, 720 and 1440 px widths, the largest capped at the source width, each linking to its full-size copy; the first loads eagerly, since it is in the first screen. Projects that run in a browser are recorded with Playwright's `recordVideo` and converted with the settings above
- Amendment 2026-11-09: the limit `100svh - 26rem` leaves room for a summary of two lines at 1440 px. A project whose summary takes three lines needs a first demo image with an aspect ratio of at least 1.6, so that it still ends on the first screen at 1440×900; the formula stays, and the demo e2e test catches a project that breaks it

## D014 Entrances in CSS only
- Date: 2026-11-09
- Decision: two entrances, both in CSS and both off when the reader prefers reduced motion. On load, the first screen fades in from 10 px lower over 400 ms, its elements 90 ms apart. Blocks further down follow the scroll with `animation-timeline: view()`: each fades in from 16 px lower while its top crosses the bottom 96 px of the viewport, so a block can be half-faded only inside that strip. Browsers without scroll-driven animations show those blocks at once. The scroll-driven rule is written in longhands, because the CSS minifier folds a complete set into an `animation` shorthand with the timeline inside, which browsers reject. An e2e test checks that blocks below the fold start hidden and that every animated element ends fully visible once scrolled to
- Rationale: decoration runs no script, so pages still ship no JS. A range fixed in pixels gives every block the same short entrance whatever its height
- Alternatives: an IntersectionObserver that adds a class (a script on every page); the whole `entry` range (a block taller than the viewport stays partly transparent while it is read)
- Borrowed: the scroll-driven entry effect and its `@supports` guard from Chrome's guide to scroll-driven animations; the staggered first-screen fade from antfu.me
- Amendment 2026-11-09: slower and softer. One decelerating curve, `cubic-bezier(0, 0, 0.2, 1)`, now drives the entrances, the scroll reveal and the hover feedback; the previous `cubic-bezier(0.16, 1, 0.3, 1)` covered two thirds of its movement in the first sixth of its time, and the reveal was linear. The first screen fades in over 500 ms, the top of the SPEC range, instead of 400 ms; both entrances rise 8 px instead of 10 and 16; hover feedback takes 240 ms instead of 150 ms with the browser's default curve, while focus rings still appear at once; the canvas fades in over 1 s instead of 600 ms. The stagger stays at 90 ms. Nothing overshoots, and each element runs one animation at a time
- Borrowed (amendment): values read from the stylesheets of large product marketing sites in November 2026, where fades and rises take 0.4 to 0.5 s on `cubic-bezier(0, 0, 0.2, 1)`, elements rise 4 to 8 px, and colour changes on hover take 0.24 to 0.32 s

## D015 Home page background in raw WebGL2
- Date: 2026-11-09
- Decision: a backdrop one screen high (`100svh`) at the top of the home pages holds a canvas over CSS gradients. `src/gl/background.ts` gets a WebGL2 context and compiles and links the shaders in idle callbacks, asks `KHR_parallel_shader_compile` for completion before reading the link status, then draws one full-screen triangle; the canvas fades in after the first frame. The fragment shader draws soft colour fields: three Gaussian glows just above the top edge, two in the tint and a smaller one in the strong colour, drifting on Lissajous paths whose periods are primes from 31 to 53 s, faded into the page over the lower half and dithered by half an 8-bit step. Its three colours are tokens: the page background with indigo 3 and 4 in light mode, and indigo 2 and 3 in dark mode, where the glow stays faint on the near-black page; indigo 4 is the strongest step allowed. The backbuffer holds at most 200,000 pixels unless its scale reaches the floor of 0.5, below which the dither smears: a 1440 × 900 canvas draws 0.32 MP and a 1920 × 1080 one 0.52 MP. The loop draws at most 30 frames a second while the page is visible and the canvas is in view, advances at most 100 ms a frame, restarts its clock on resume and stops on the current frame after ten frames in a row later than 54 ms, which a steady 20 fps on a 60 or 120 Hz screen never reaches, whatever its exact refresh rate. A fine pointer moves the glows by up to 4% of the canvas. Reduced motion draws the first frame once, and again only on a theme change or a resize. A renderer whose name contains SwiftShader, llvmpipe, softpipe, Basic Render or Software gets the same still frame, so readers without a GPU see a still background; Lighthouse CI starts Chrome with `--enable-unsafe-swiftshader`, so whatever the runner's Chrome version it gets WebGL and measures this one path. Without WebGL2, on a failed link or while the context is lost, the CSS gradients stay: they draw the glows where they start and come within a few 8-bit levels of the first frame
- Rationale: one triangle covers the screen with three vertices and avoids the extra shading along the shared diagonal of a two-triangle quad. The fade into the page happens in the shader, before the dither: an 8-bit CSS mask over the canvas banded. The backdrop sits at `z-index: -1` in the root stacking context instead of under a parent with `isolation: isolate`, because the header that must stay above it lives in `Base.astro`, outside the home page's slot. Glows draw no pattern and cost three exponentials a pixel. With the page's CPU slowed four and six times, the loop keeps 30 frames a second (the `PERF=1` spec), so its JavaScript is cheap; Chrome's throttling leaves the GPU process at full speed, so the spec does not measure the cost of shading on a phone's GPU. Text over the background keeps its contrast: unit tests bound every pixel by the palette, and e2e tests read the pixels behind each text element at several points of the animation, in the still frame and over the fallback
- Alternatives: domain-warped simplex noise (its ripples read as a pattern and the dark page turned saturated blue); a pre-rendered image or video (bytes on every visit, fixed colours that ignore the theme); blurred elements animated in CSS (a large blur repaints on every frame)
- Borrowed: colour spots on independent sine paths from the mesh gradient in Paper Shaders (Apache-2.0), rewritten as Gaussian glows over a base colour, with no code copied; the backbuffer budget, scaled by the square root of budget over area, from Paper Shaders' `ShaderMount`; interleaved gradient noise for the dither from Jimenez, "Next Generation Post Processing in Call of Duty: Advanced Warfare" (2014); non-blocking compilation and `powerPreference` from MDN's "WebGL best practices", and context loss handling from MDN's `webglcontextlost` reference

## D016 Articles and the RSS feed
- Date: 2026-11-09
- Decision: `/articles/` lists published articles newest first, articles of one day by title, with the summary, the project, the date and the reading time; a draft (`draft: true`) is built nowhere and needs no project page yet. `/rss.xml` is a full-text feed from `@astrojs/rss`: each body is rendered with Astro's Container API, every link is absolute and includes the base, and math keeps only KaTeX's MathML, since feed readers load no stylesheet and would show the visual markup beside it. Every page links the feed in its head. Bodies stay in English on both language versions of the site, with `lang="en"`
- Rationale: a reader of the feed gets the whole article with no visit to the site, and the feed needs no client JS or build step beyond the pages
- Alternatives: summaries only in the feed (a reader has to leave the feed reader); KaTeX's HTML with an inline stylesheet (feed readers strip styles)
- Borrowed: the full-content recipe with the Container API from Astro's RSS guide

## D017 Home introduction and About page
- Date: 2026-11-09
- Decision: the home page opens with the name, a two-sentence introduction and the four focus areas of SPEC §2 as tags, above the project list. `/about/` and `/zh/about/` give education (The University of Melbourne, Bachelor of Commerce, 2024 to 2027, in progress) and one paragraph on where economics, finance and technology meet, and nothing else; contact details stay in the footer of every page. The text lives in the interface dictionary, so each string has both languages. The year range does not wrap. "About" follows "Articles" in the navigation
- Rationale: the introduction names only the projects on the site, so every claim on the first screen links to a page with its evidence; a short About page avoids duplicating the project pages

