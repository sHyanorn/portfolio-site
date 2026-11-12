# sHyanorn.github.io Specification

## 1. Summary

Aaron's personal website: a restrained design, an animated background written in raw WebGL and GLSL, and a dedicated page for each project explaining what was built, why it was built that way, and how well it works.

## 2. Pages

### Home
- A headline naming the direction of the work (algorithm engineering and server-side systems), a short introduction, and three areas (algorithms, server-side systems, backend systems), each with a sentence or two of evidence
- GLSL background: a subtle flowing gradient or noise field that responds slightly to the mouse
- Featured project cards that link to detail pages, and under them the earlier projects as text entries
- Contact details: email and GitHub

### Project detail page (one per project)
Fixed structure:

1. Summary and tags
2. Demo: live link, GIF or video; a GIF or screenshots when the project has no public demo
3. Key metrics (e.g. matching throughput, test coverage)
4. Problem and goals
5. Architecture diagram
6. Three to five key technical decisions (from each repository's DECISIONS.md); for a pre-registered study, rules from its registration and amendments
7. Challenges and how they were solved; for a study, its limits
8. GitHub link, and a link to the project's article when there is one

### Articles
- List page `/articles`: newest first; each entry shows the title, a one-sentence summary, its kind (a note or a paper), the project, the date and the reading time, and below them the project's technical report when it has one
- Article page `/articles/<slug>`: one per project, on one finding that runs against expectation. It opens with the conclusion, then covers how it was found, the evidence and numbers, the limits, and when the conclusion does not hold
- Every number can be traced to a file in the project's repository
- Names its kind and its project at the top, the project linked to its page; the project's technical report, when it has one, and the repository link sit below the body
- English only. In the Chinese version the interface is translated, the body stays in English with `lang="en"`, and the list marks articles as English
- Published on this site only, with a full-text RSS feed at `/rss.xml`

### About page
- Education (University of Melbourne)
- The combination of economics, finance and technology

## 3. Technical approach

- Astro + TypeScript with static output (D003); no UI framework: the GLSL background is a TypeScript module and the language toggle is a plain link
- Articles in MDX, rendered at build time (D005): Shiki highlighting with light and dark themes through CSS variables; math through remark-math and rehype-katex, only in articles marked `math: true`, which alone load the KaTeX stylesheet; reading time counted at 230 words per minute. Articles add no client JS
- Raw WebGL2, with shaders in `src/gl/shaders/*.glsl`
- Diagrams are SVG, rendered at build time or drawn by hand; Mermaid never runs in the browser, since its runtime alone exceeds the JS budget
- English and Chinese: English at the site root and Chinese under `/zh/`. The toggle links to the same page in the other language, and every page declares both versions with `hreflang`. Article bodies stay in English (see Articles). Project content files hold both languages for every field a page shows
- Deploy to GitHub Pages or Vercel, with a custom domain (optional)

## 4. Design guidelines

- Fonts: system font stack (SF Pro and PingFang SC first)
- Color: mostly neutral grays with one accent color; dark mode supported
- Spacing: multiples of 8
- Motion: subtle fade-in and upward shift on entering the viewport, 300 to 500 ms
- Images: AVIF or WebP, lazy-loaded

## 5. Deliverables

- The live website
- Screenshots and the live site's Lighthouse scores in the README (D019)
