// Share and search metadata: every page has an absolute 1200×630 share image
// under the base, project pages their own, article pages their project's and
// other pages the site's in their language; articles are shared as articles;
// the sitemap lists every page with its other language.
import { expect, test, type Page as Tab } from '@playwright/test'
import { BASE, pages } from './site'

const ROOT = new URL(BASE, process.env.SITE_URL || 'http://localhost:4321').href
const localized = pages.filter((p) => p.name !== '404')
const meta = (page: Tab, key: string) =>
  page
    .locator(`meta[property="${key}"], meta[name="${key}"]`)
    .getAttribute('content')

for (const p of pages)
  test(`${p.name}: share image and metadata`, async ({ page, request }) => {
    await page.goto(p.path)
    const image = (await meta(page, 'og:image'))!
    expect(image.startsWith(ROOT), image).toBe(true)
    expect(await meta(page, 'og:image:width')).toBe('1200')
    expect(await meta(page, 'og:image:height')).toBe('630')
    expect(await meta(page, 'twitter:card')).toBe('summary_large_image')

    const res = await request.get(new URL(image).pathname)
    expect(res.status(), image).toBe(200)
    const png = await res.body()
    expect(png.subarray(1, 4).toString(), `${image} is a PNG`).toBe('PNG')
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630])

    for (const href of await page
      .locator('link[rel=canonical], link[rel=alternate][hreflang]')
      .evaluateAll((links) => links.map((l) => l.getAttribute('href')!)))
      expect(href.startsWith(ROOT), href).toBe(true)

    const article = /articles\/[^/]+\/$/.test(p.path)
    expect(await meta(page, 'og:type')).toBe(article ? 'article' : 'website')
    if (!article) {
      await expect(page.locator('meta[property^="article:"]')).toHaveCount(0)
      // Pages without an image of their own use the site's, in their language.
      const site = p.path.startsWith(`${BASE}zh/`) ? 'site-zh' : 'site'
      if (p.path.includes('/projects/'))
        expect(image).not.toMatch(/\/site(-zh)?\.png$/)
      else expect(image).toBe(`${ROOT}og/${site}.png`)
      return
    }
    const date = await page.locator('.meta time').getAttribute('datetime')
    expect(await meta(page, 'article:published_time')).toBe(
      new Date(date!).toISOString(),
    )
    await page.locator('.project a').click()
    expect(await meta(page, 'og:image')).toBe(image)
  })

test('the sitemap lists every page with its other language', async ({
  request,
}) => {
  const index = await (await request.get(`${BASE}sitemap-index.xml`)).text()
  const maps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  expect(maps.length).toBeGreaterThan(0)
  const urls = new Map<string, Record<string, string>>()
  for (const map of maps) {
    expect(map.startsWith(ROOT), map).toBe(true)
    const xml = await (await request.get(new URL(map).pathname)).text()
    for (const [, body] of xml.matchAll(/<url>(.*?)<\/url>/g)) {
      const loc = body.match(/<loc>([^<]+)<\/loc>/)![1]
      const links = Object.fromEntries(
        [...body.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [
          m[1],
          m[2],
        ]),
      )
      urls.set(loc, links)
    }
  }
  expect([...urls.keys()].sort()).toEqual(
    localized.map((p) => new URL(p.path, ROOT).href).sort(),
  )
  const ZH = `${ROOT}zh/`
  for (const [loc, links] of urls) {
    const en = loc.startsWith(ZH) ? ROOT + loc.slice(ZH.length) : loc
    expect(links, loc).toEqual({ en, 'zh-CN': ZH + en.slice(ROOT.length) })
  }
})
