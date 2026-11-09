import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { beforeAll, describe, expect, it } from 'vitest'
import { measure, type PageReport } from './js-budget'

const files: Record<string, string> = {
  'index.html':
    '<script type="module" src="/b/_astro/entry.js"></script>' +
    '<script>console.log("inline")</script>' +
    '<script type="application/ld+json">{"@type":"Person"}</script>',
  'about/index.html':
    '<link rel="stylesheet" href="/b/_astro/site.css">' +
    '<astro-island component-url="/b/_astro/island.js"></astro-island>',
  'plain/index.html': '<p>No scripts</p>',
  '_astro/entry.js':
    'import{x}from"./shared.js";import("./later.js");console.log(x)',
  '_astro/shared.js': 'export const x=1',
  '_astro/later.js': 'export const y="dynamic"',
  '_astro/island.js': 'import"./shared.js";export default 1',
}

const gz = (name: string) => gzipSync(files[name], { level: 9 }).length

describe('measure', () => {
  let reports: Record<string, PageReport>

  beforeAll(async () => {
    const dist = mkdtempSync(join(tmpdir(), 'js-budget-'))
    for (const [name, text] of Object.entries(files)) {
      mkdirSync(dirname(join(dist, name)), { recursive: true })
      writeFileSync(join(dist, name), text)
    }
    const list = await measure(dist, '/b/')
    reports = Object.fromEntries(list.map((r) => [r.page, r]))
  })

  it('follows static imports and skips dynamic ones', () => {
    expect(reports['index.html'].files).toEqual([
      '_astro/entry.js',
      '_astro/shared.js',
    ])
  })

  it('adds inline scripts and ignores data blocks', () => {
    const inline = gzipSync('console.log("inline")', { level: 9 }).length
    expect(reports['index.html'].bytes).toBe(
      gz('_astro/entry.js') + gz('_astro/shared.js') + inline,
    )
  })

  it('counts island code', () => {
    expect(reports['about/index.html'].files).toEqual([
      '_astro/island.js',
      '_astro/shared.js',
    ])
  })

  it('reports pages without scripts as zero', () => {
    expect(reports['plain/index.html']).toMatchObject({ files: [], bytes: 0 })
  })
})
