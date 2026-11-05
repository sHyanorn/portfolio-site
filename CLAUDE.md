# CLAUDE.md

This repository is Aaron's personal portfolio website. It is also a portfolio piece in its own right, demonstrating front-end skill, design sense and GLSL.

## Read before starting

1. `docs/SPEC.md`
2. `docs/TASKS.md`
3. `docs/DECISIONS.md`

## Working practices

- For each milestone, write a plan first and wait for Aaron to confirm it; for visual changes, provide screenshots first
- One commit per task, using Conventional Commits in English
- All project content lives in `src/content/projects/*.json` (or MDX); pages only render it
- Everything committed to GitHub (code, comments, docs, commit messages) is in English and concise: say what changed and why, not the step-by-step process. Commit messages use Conventional Commits with a short subject and at most a brief body. Talk to Aaron in Chinese.

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
