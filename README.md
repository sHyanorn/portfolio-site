# portfolio-site

Personal website of Aaron Yang. Built with Astro and TypeScript, with a hand-written WebGL2 and GLSL background.

> Status: in development. See [docs/TASKS.md](docs/TASKS.md).

## Pages

- Home: an introduction, the four focus areas and the project list, over the WebGL2 background ([D015](docs/DECISIONS.md))
- `/projects/<slug>/`: one page per project, from `src/content/projects/<slug>.json` ([D012](docs/DECISIONS.md), [D013](docs/DECISIONS.md)); each project's numbers are traced to its repository in `docs/project-sources/<slug>.md`
- `/articles/` and `/articles/<slug>/`: one article per project, in MDX ([D005](docs/DECISIONS.md)), and the full-text feed at `/rss.xml` ([D016](docs/DECISIONS.md))
- `/about/` ([D017](docs/DECISIONS.md))

Every page but the 404 page also exists in Chinese under `/zh/` ([D011](docs/DECISIONS.md)).

## Development

Requires Node.js 22.23.4 or later.

```bash
npm install
npm run dev                            # http://localhost:4321
npm run build && npm run preview
npm test                               # unit tests
npm run lint && npm run typecheck && npm run format:check
npm run budget                         # JS each page loads, gzipped; limit 150 kB
npm run e2e                            # axe, overflow and links, on the built site
npm run screenshots && npm run audit   # screenshots, then the overflow and axe table
node scripts/copy-export.ts <project>…  # a project's text, one file per language, in artifacts/
```

`npm run screenshots` saves a full-page screenshot of every page to `artifacts/screens/`, and the home page background as `home-{390,1440}-{light,dark}-{t0,t10,t20,still,fallback}.png`: three points of the animation, the still frame and the CSS fallback. `BACKGROUND_TIMES=0,30,90` picks other points, in seconds. `PERF=1 npx playwright test tests/e2e/background-perf.spec.ts` prints what the background costs two phones with the CPU slowed 4 and 6 times.

`SITE_URL` and `BASE_PATH` set the origin and base path ([D007](docs/DECISIONS.md)). Deploys take both from the GitHub Pages settings, and local builds serve from the root. To check a build under a base path, set `BASE_PATH` for both the build and the checks:

```bash
export BASE_PATH=/portfolio-site
npm run build && npm run e2e
```

## Deploy

The Deploy workflow runs by hand ([D009](docs/DECISIONS.md)). Afterwards, `node scripts/check-live.mjs <site URL>` checks the live site: pages, links and assets under the base, the 404 page, trailing-slash redirects and the feed's links. New pages go in its `routes` list.

## License

MIT for code. Written content and images are all rights reserved.
