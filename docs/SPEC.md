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

### About page
- Education (University of Melbourne)
- The combination of economics, finance and technology
- How I work with AI coding tools

## 3. Technical approach

- Vite + React + TypeScript with static generation (vite-plugin-ssg or Astro, to be decided in M0)
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
