# portfolio-site

Personal website of Aaron Yang. Built with Astro and TypeScript, with a hand-written WebGL2 and GLSL background.

> Status: in development. See [docs/TASKS.md](docs/TASKS.md).

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
```

`npm run screenshots` saves a full-page screenshot of every page to `artifacts/screens/`, and the home page background as `home-{390,1440}-{light,dark}-{t0,t10,t20,still,fallback}.png`: three points of the animation, the still frame and the CSS fallback. `BACKGROUND_TIMES=0,30,90` picks other points, in seconds. `PERF=1 npx playwright test tests/e2e/background-perf.spec.ts` prints what the background costs two phones with the CPU slowed 4 and 6 times.

`SITE_URL` and `BASE_PATH` set the origin and base path ([D007](docs/DECISIONS.md)). Deploys take both from the GitHub Pages settings, and local builds serve from the root. To check a build under a base path, set `BASE_PATH` for both the build and the checks:

```bash
export BASE_PATH=/portfolio-site
npm run build && npm run e2e
```

## License

MIT for code. Written content and images are all rights reserved.
