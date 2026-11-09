# CLAUDE.md

This repository is Aaron Yang's personal website, with a hand-written WebGL2 and GLSL background.

## Read before starting

1. `docs/SPEC.md`
2. `docs/TASKS.md`
3. `docs/DECISIONS.md`

## Working practices

- Write a plan before starting each milestone; for visual changes, provide screenshots first
- One commit per task, using Conventional Commits in English
- All project content lives in `src/content/projects/*.json` (or MDX) and articles in `src/content/articles/*.mdx`; pages only render them
- Everything committed to GitHub (code, comments, docs, commit messages) is in English and concise: say what changed and why, not the step-by-step process. Commit messages use Conventional Commits with a short subject and at most a brief body.

## Common commands

```bash
npm run dev
npm run build && npm run preview
npm test
npm run lint && npm run typecheck
```

## Hard rules

- Initial-load JS is at most 150 KB (gzipped), and all four Lighthouse scores are 95 or higher
- GLSL effects must respect `prefers-reduced-motion`; show a static gradient when WebGL is not supported
- Pause the render loop when the page is not visible, to save power
- Accessibility: semantic markup, keyboard operability, sufficient color contrast
- No large UI component libraries; style with CSS Modules or native CSS variables
- No personal information other than real contact details
