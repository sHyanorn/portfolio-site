// Article pages name their project and link to it, the project page links
// back, the body stays English on Chinese pages, and only pages with math
// load KaTeX's stylesheet (D005).
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
