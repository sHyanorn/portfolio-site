// Article pages name their project and link to it, the project page links
// back, the body stays English on Chinese pages, only pages with math load
// KaTeX's stylesheet (D005), and the lists and the feed describe the articles.
import { expect, test } from '@playwright/test'
import { BASE, pages } from './site'

const articles = pages.filter((p) => /^(zh-)?articles-.+/.test(p.name))

test('there are article pages', () => {
  expect(articles.length).toBeGreaterThan(0)
})

for (const p of articles) {
  const zh = p.name.startsWith('zh-')
  const prefix = zh ? `${BASE}zh/` : BASE

  test(`${p.name}: project, repository and language`, async ({ page }) => {
    await page.goto(p.path)
    const project = page.locator('.project a')
    const href = await project.getAttribute('href')
    expect(href).toMatch(new RegExp(`^${prefix}projects/[\\w-]+/$`))
    await expect(page.locator('article > footer a')).toHaveAttribute(
      'href',
      /^https:\/\/github\.com\//,
    )
    await expect(page.locator('.prose')).toHaveAttribute('lang', 'en')
    await expect(page.locator('h1')).toHaveAttribute('lang', 'en')
    await expect(page.locator('html')).toHaveAttribute(
      'lang',
      zh ? 'zh-CN' : 'en',
    )

    // The project page links back to this article.
    await page.goto(href!)
    await expect(
      page.locator(`article > footer a[href="${p.path}"]`),
    ).toHaveCount(1)
  })

  test(`${p.name}: KaTeX styles only with math`, async ({ page }) => {
    await page.goto(p.path)
    const math = await page.locator('.prose .katex').count()
    await expect(page.locator('link[href*="katex"]')).toHaveCount(math ? 1 : 0)
  })
}

for (const [path, zh] of [
  [`${BASE}articles/`, false],
  [`${BASE}zh/articles/`, true],
] as const)
  test(`${path}: every article, newest first`, async ({ page }) => {
    await page.goto(path)
    const items = page.locator('.list > li')
    const links = await items
      .locator('h2 a')
      .evaluateAll((as) => as.map((a) => a.getAttribute('href')))
    const own = articles
      .filter((p) => p.name.startsWith('zh-') === zh)
      .map((p) => p.path)
    expect(links.toSorted()).toEqual(own.toSorted())

    const dates = await items
      .locator('time')
      .evaluateAll((ts) => ts.map((t) => t.getAttribute('datetime')!))
    expect(dates).toEqual(dates.toSorted().toReversed())
    await expect(items.locator('.english')).toHaveCount(zh ? own.length : 0)
    await expect(page.locator('header a[aria-current="page"]')).toHaveAttribute(
      'href',
      path,
    )
  })

test('the article lists and the feed describe the articles', async ({
  page,
  request,
}) => {
  const en = "Aaron Yang's articles about the projects on this site."
  for (const [path, text] of [
    [`${BASE}articles/`, en],
    [`${BASE}zh/articles/`, 'Aaron Yang 关于本站项目的文章。'],
  ]) {
    await page.goto(path)
    await expect(page.locator('meta[name=description]')).toHaveAttribute(
      'content',
      text,
    )
  }
  const xml = await (await request.get(`${BASE}rss.xml`)).text()
  const channel = await page.evaluate(
    (source) =>
      new DOMParser()
        .parseFromString(source, 'application/xml')
        .querySelector('channel > description')?.textContent,
    xml,
  )
  expect(channel).toBe(en)
})
