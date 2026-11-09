// The built pages, as the e2e tests visit them. Run `npm run build` first.
import { readdirSync } from 'node:fs'
import { join, sep } from 'node:path'

export const PORT = 4321
export const BASE = (process.env.BASE_PATH || '/').replace(/\/?$/, '/')
export const DIST = 'dist'

export interface Page {
  /** Short name for reports and screenshot files, e.g. `home` or `articles-x`. */
  name: string
  /** Path under the site's base, e.g. `/ci-base/articles/x/`. */
  path: string
  file: string
}

export const pages: Page[] = readdirSync(DIST, {
  recursive: true,
  encoding: 'utf8',
})
  .filter((f) => f.endsWith('.html'))
  .sort()
  .map((f) => {
    const route = f
      .split(sep)
      .join('/')
      .replace(/(^|\/)index\.html$/, '$1')
    return {
      name: route.replace(/\.html$|\/$/g, '').replace(/\//g, '-') || 'home',
      path: BASE + route,
      file: join(DIST, f),
    }
  })
