// Lighthouse CI (D008). `lhci autorun` checks the mobile preset: every page
// listed below must score at least 0.95 in all four categories. With
// LHCI_PRESET=desktop, `lhci collect` and `lhci upload` record the desktop
// preset once per page, for reference only.
const desktop = process.env.LHCI_PRESET === 'desktop'
const base = (process.env.BASE_PATH || '/').replace(/\/?$/, '/')
const port = 4322
// One page of each kind: home and a project page in both languages, the
// article list, an article with math (the KaTeX stylesheet and fonts) and a
// project page whose demo is screenshots.
const pages = [
  '',
  'zh/',
  'projects/matching-engine/',
  'zh/projects/matching-engine/',
  'projects/push-lab/',
  'articles/',
  'articles/low-pbo-easy-question/',
]

const categories = ['performance', 'accessibility', 'best-practices', 'seo']

module.exports = {
  ci: {
    collect: {
      startServerCommand: `npm run preview -- --port ${port} --ignore-lock`,
      startServerReadyPattern: `localhost:${port}`,
      url: pages.map((page) => `http://localhost:${port}${base}${page}`),
      numberOfRuns: desktop ? 1 : 3,
      settings: {
        // WebGL from SwiftShader on a runner without a GPU, whatever the
        // Chrome version, so the home page always takes the same path: one
        // still frame (D015). A string, because LHCI appends its own flags.
        chromeFlags: '--enable-unsafe-swiftshader',
        ...(desktop && { preset: 'desktop' }),
      },
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
