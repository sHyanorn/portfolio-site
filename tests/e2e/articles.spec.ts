// Article pages name their project and link to it, the project page links
// back, the body stays English on Chinese pages, only pages with math load
// KaTeX's stylesheet (D005), and the lists and the feed describe the articles.
import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { t } from '../../src/lib/i18n'
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
    await expect(page.locator('article > footer .repo')).toHaveAttribute(
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

  test(`${p.name}: says what kind of article it is`, async ({ page }) => {
    await page.goto(p.path)
    await expect(page.locator('.facts .kind')).toHaveText(
      zh ? /^(短文|论文)$/ : /^(Note|Paper)$/,
    )
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
    await expect(items.locator('.meta > .kind:first-child')).toHaveText(
      own.map(() => (zh ? /^(短文|论文)$/ : /^(Note|Paper)$/)),
    )
    await expect(page.locator('header a[aria-current="page"]')).toHaveAttribute(
      'href',
      path,
    )
  })

test('the article lists and the feed describe the articles', async ({
  page,
  request,
}) => {
  const en = 'Articles about the projects on this site.'
  for (const [path, text] of [
    [`${BASE}articles/`, en],
    [`${BASE}zh/articles/`, '关于本站项目的文章。'],
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

// Built articles only, so a draft naming a project yet to come is skipped.
const reports = articles
  .filter((p) => !p.name.startsWith('zh-'))
  .map((p) => {
    const slug = p.name.replace(/^articles-/, '')
    const mdx = readFileSync(`src/content/articles/${slug}.mdx`, 'utf8')
    const project = /^project:\s*["']?([\w-]+)/m.exec(mdx)![1]
    const { report } = JSON.parse(
      readFileSync(`src/content/projects/${project}.json`, 'utf8'),
    )
    return {
      slug,
      report: report as { title: string; url: string } | undefined,
    }
  })
const reported = reports.flatMap(({ slug, report }) =>
  report ? [{ slug, report }] : [],
)

for (const { slug, report } of reports)
  if (!report)
    for (const lang of ['', 'zh/'])
      test(`${lang}${slug}: no report row`, async ({ page }) => {
        await page.goto(`${BASE}${lang}articles/${slug}/`)
        await expect(page.locator('main .report')).toHaveCount(0)
      })

test('an article links its project report', () => {
  expect(reported.length).toBeGreaterThan(0)
})

for (const { slug, report } of reported)
  for (const lang of ['en', 'zh'] as const) {
    const prefix = `${BASE}${lang === 'zh' ? 'zh/' : ''}articles/`
    for (const path of [prefix, `${prefix}${slug}/`])
      test(`${path}: links the report of ${slug}`, async ({ page }) => {
        await page.goto(path)
        const main = page.locator('main')
        const link = main.locator(`a[href="${report.url}"]`)
        await expect(link).toHaveCount(1)
        await expect(link).toHaveText(report.title)
        await expect(link).toHaveAttribute('lang', 'en')
        await expect(link).toBeVisible()
        await expect(main.getByText(report.title, { exact: true })).toHaveCount(
          1,
        )
        await expect(
          main.getByText(t(lang, 'report'), { exact: true }),
        ).toHaveCount(1)
        await expect(main).not.toContainText(
          t(lang === 'en' ? 'zh' : 'en', 'report'),
        )
        // The label stands right before the link, in the same row.
        await expect(link.locator('xpath=..')).toContainText(t(lang, 'report'))
        if (path === prefix)
          await expect(
            main.locator('.list > li', {
              has: page.locator(`h2 a[href="${prefix}${slug}/"]`),
            }),
          ).toContainText(report.title)
      })
  }
