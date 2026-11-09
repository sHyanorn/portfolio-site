// The feed parses as XML, holds every English article in full with absolute
// links under the base, RFC 822 dates and permalink guids, and every page
// links to it.
import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { BASE, pages } from './site'

const FEED = `${BASE}rss.xml`
const articles = pages.filter((p) => p.name.startsWith('articles-'))
const RFC_822 =
  /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4} \d{2}:\d{2}:\d{2} GMT$/

interface Item {
  title: string
  link: string
  guid: string
  permalink: string | null
  pubDate: string
  text: string
}

const normalize = (s: string) => s.replace(/\s+/g, ' ').trim()

test('the feed holds every article in full', async ({ page, request }) => {
  const xml = await (await request.get(FEED)).text()
  await page.goto(BASE)
  const feed = await page.evaluate((source) => {
    const doc = new DOMParser().parseFromString(source, 'application/xml')
    const content = 'http://purl.org/rss/1.0/modules/content/'
    const text = (el: Element, tag: string) =>
      el.getElementsByTagName(tag)[0]?.textContent ?? ''
    return {
      error: doc.getElementsByTagName('parsererror').length,
      link: text(doc.documentElement, 'link'),
      items: [...doc.getElementsByTagName('item')].map((item) => {
        // content:encoded holds HTML; its text is what a reader shows.
        const body = document.createElement('div')
        body.innerHTML =
          item.getElementsByTagNameNS(content, 'encoded')[0]?.textContent ?? ''
        return {
          title: text(item, 'title'),
          link: text(item, 'link'),
          guid: text(item, 'guid'),
          permalink: item
            .getElementsByTagName('guid')[0]
            ?.getAttribute('isPermaLink'),
          pubDate: text(item, 'pubDate'),
          text: body.textContent ?? '',
        }
      }),
    }
  }, xml)

  expect(feed.error, 'XML parse errors').toBe(0)
  expect(new URL(feed.link).pathname).toBe(BASE)
  expect(feed.items.map((i: Item) => new URL(i.link).pathname).sort()).toEqual(
    articles.map((p) => p.path).sort(),
  )

  for (const item of feed.items as Item[]) {
    const url = new URL(item.link)
    expect(url.protocol, item.link).toMatch(/^https?:$/)
    expect(item.guid).toBe(item.link)
    expect(item.permalink).toBe('true')
    expect(item.pubDate).toMatch(RFC_822)

    await page.goto(url.pathname)
    await expect(page.locator('h1')).toHaveText(item.title)
    const day = await page.locator('.meta time').getAttribute('datetime')
    expect(new Date(item.pubDate).toISOString().slice(0, 10)).toBe(day)
    // The whole body; on the page, math also has KaTeX's visual copy.
    const body = await page.locator('.prose').evaluate((el) => {
      const copy = el.cloneNode(true) as Element
      copy.querySelectorAll('.katex-html').forEach((n) => n.remove())
      return copy.textContent ?? ''
    })
    expect(normalize(item.text)).toBe(normalize(body))
  }
})

test('every page links to the feed', () => {
  for (const p of pages) {
    const href = readFileSync(p.file, 'utf8').match(
      /<link rel="alternate" type="application\/rss\+xml"[^>]*href="([^"]+)"/,
    )?.[1]
    expect(href && new URL(href).pathname, p.name).toBe(FEED)
  }
})
