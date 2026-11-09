// Lighthouse CI (D008). `lhci autorun` checks the mobile preset: every page
// listed below must score at least 0.95 in all four categories. With
// LHCI_PRESET=desktop, `lhci collect` and `lhci upload` record the desktop
// preset once per page, for reference only.
const desktop = process.env.LHCI_PRESET === 'desktop'
const base = (process.env.BASE_PATH || '/').replace(/\/?$/, '/')
const port = 4322
const pages = [
  '',
  'zh/',
  'projects/matching-engine/',
  'zh/projects/matching-engine/',
]

const categories = ['performance', 'accessibility', 'best-practices', 'seo']

module.exports = {
  ci: {
    collect: {
      startServerCommand: `npm run preview -- --port ${port} --ignore-lock`,
      startServerReadyPattern: `localhost:${port}`,
      url: pages.map((page) => `http://localhost:${port}${base}${page}`),
      numberOfRuns: desktop ? 1 : 3,
      settings: desktop ? { preset: 'desktop' } : {},
    },
    assert: {
      assertions: Object.fromEntries(
        categories.map((c) => [
          `categories:${c}`,
          ['error', { minScore: 0.95 }],
        ]),
      ),
    },
    upload: {
      target: 'filesystem',
      outputDir: `.lighthouseci/${desktop ? 'desktop' : 'mobile'}`,
    },
  },
}
