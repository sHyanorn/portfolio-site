# portfolio-site Specification

## 1. One-line summary

Aaron's personal website: a restrained design, an animated background written in raw WebGL and GLSL, and a dedicated page for each project explaining what was built, why it was built that way, and how well it works.

## 2. Pages

### Home
- One-line self-introduction and four focus tags: backend systems, security, recommender systems, quantitative research
- GLSL background: a subtle flowing gradient or noise field that responds slightly to the mouse
- Featured project cards that link to detail pages
- Contact details: email and GitHub

### Project detail page (one per project)
Fixed structure:

1. One-line summary and tags
2. Demo: live link, GIF or video
3. Key metrics (e.g. matching throughput, test coverage)
4. Problem and goals
5. Architecture diagram
6. Three to five key technical decisions (from each repository's DECISIONS.md)
7. Challenges and how they were solved
8. GitHub link

### Articles
- List page `/articles`: newest first; each entry shows the title, a one-sentence summary, the project, the date and the reading time
- Article page `/articles/<slug>`: one per project, on one finding that runs against expectation. It opens with the conclusion, then covers how it was found, the evidence and numbers, the limits, and when the conclusion does not hold
- Every number can be traced to a file in the project's repository
- Each article ends with one sentence: the implementation was AI-assisted, with Aaron setting the direction, making the decisions and reviewing the work. No other page mentions AI
- English only. In the Chinese version the interface is translated, the body stays in English with `lang="en"`, and the list marks articles as English
- Published on this site only, with a full-text RSS feed at `/rss.xml`

### About page
- Education (University of Melbourne)
- The combination of economics, finance and technology

## 3. Technical approach

- Astro + TypeScript with static output (D003); React only for two islands, the GLSL background and the language toggle
- Articles in MDX, rendered at build time (D005): Shiki highlighting with light and dark themes through CSS variables; math through remark-math and rehype-katex, only in articles marked `math: true`, which alone load the KaTeX stylesheet; reading time counted at 230 words per minute. Articles add no client JS
- Raw WebGL2, with shaders in `src/gl/shaders/*.glsl`
- English and Chinese: English by default, with a button that switches the whole site to Chinese and back
- Deploy to GitHub Pages or Vercel, with a custom domain (optional)

## 4. Design guidelines

- Fonts: system font stack (SF Pro and PingFang SC first)
- Color: mostly neutral grays with one accent color; dark mode supported
- Spacing: multiples of 8
- Motion: subtle fade-in and upward shift on entering the viewport, 300 to 500 ms
- Images: AVIF or WebP, lazy-loaded

## 5. Deliverables

- The live website
- Lighthouse report screenshots in the README
