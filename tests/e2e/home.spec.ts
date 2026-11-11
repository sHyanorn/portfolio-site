// The home pages: every project in the order its content file gives, the
// earlier ones apart, and the card pictures' sizes, loading and theme.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import { BASE } from './site'

const CONTENT = 'src/content/projects'
const projects = readdirSync(CONTENT)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join(CONTENT, f), 'utf8')))
  .sort((a, b) => a.order - b.order)
const titles = (early: boolean) =>
  projects.filter((p) => !!p.early === early).map((p) => p.title as string)

for (const path of [BASE, `${BASE}zh/`])
  test(`${path}: project cards follow their order`, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator('#projects h3')).toHaveText(titles(false))
  })

// Earlier projects have no card: each is a title, a summary and tags under
// the cards, and its page is one link away.
for (const path of [BASE, `${BASE}zh/`])
  test(`${path}: earlier projects follow the cards`, async ({ page }) => {
    await page.goto(path)
    expect(titles(true).length).toBeGreaterThan(0)
    const links = page.locator('#projects ~ .earlier h3 a')
    await expect(links).toHaveText(titles(true))
    await expect(page.locator('.earlier img')).toHaveCount(0)
    for (const [i, title] of titles(true).entries())
      await expect(links.nth(i)).toHaveAttribute(
        'href',
        `${path}projects/${title}/`,
      )
  })

// A card picture offers its source width when that is under the largest
// size, so a wide card never enlarges a smaller candidate (the img's width
// attribute is the source width).
for (const path of [BASE, `${BASE}zh/`])
  test(`${path}: card pictures offer up to their source width`, async ({
    page,
  }) => {
    await page.goto(path)
    const rows = await page
      .locator('#projects .thumb img')
      .evaluateAll((imgs) =>
        imgs.map((img) => {
          const widths = img
            .getAttribute('srcset')!
            .split(',')
            .map((c) => parseInt(c.trim().split(/\s+/)[1]!))
          return [
            img.getAttribute('src'),
            Math.max(...widths),
            Number(img.getAttribute('width')),
          ]
        }),
      )
    expect(rows.length).toBeGreaterThan(0)
    for (const [src, largest, source] of rows)
      expect(largest, String(src)).toBe(Math.min(source as number, 1080))
  })

// Every card picture loads lazily; an eager first one measured no better in
// Lighthouse.
for (const path of [BASE, `${BASE}zh/`])
  test(`${path}: card pictures load lazily`, async ({ page }) => {
    await page.goto(path)
    const loading = await page
      .locator('#projects .thumb img')
      .evaluateAll((imgs) => imgs.map((img) => img.getAttribute('loading')))
    expect(loading.length).toBeGreaterThan(0)
    for (const value of loading) expect(value).toBe('lazy')
  })

// A card whose picture has a dark copy shows that copy under the dark theme,
// and the light one otherwise; only the copy shown loads.
for (const colorScheme of ['light', 'dark'] as const)
  test(`${colorScheme}: card pictures follow the theme`, async ({ page }) => {
    await page.emulateMedia({ colorScheme })
    await page.goto(BASE)
    const thumbs = page.locator('#projects .thumb:has(img.dark)')
    expect(await thumbs.count(), 'cards with a dark copy').toBeGreaterThan(0)
    const other = colorScheme === 'dark' ? 'light' : 'dark'
    for (const thumb of await thumbs.all()) {
      await thumb.scrollIntoViewIfNeeded()
      const shown = thumb.locator(`img.${colorScheme}`)
      await expect(shown).toBeVisible()
      await expect(thumb.locator(`img.${other}`)).toBeHidden()
      await expect
        .poll(() => shown.evaluate((img: HTMLImageElement) => img.complete))
        .toBe(true)
      expect(
        await thumb
          .locator(`img.${other}`)
          .evaluate((img: HTMLImageElement) => img.currentSrc),
        `the ${other} copy does not load`,
      ).toBe('')
    }
  })

// An area whose work has no project page yet links to its repository
// (D022); every area's work has a page now, so no area has a link.
for (const path of [BASE, `${BASE}zh/`])
  test(`${path}: three areas, none with a repository link`, async ({
    page,
  }) => {
    await page.goto(path)
    await expect(page.locator('.areas dt')).toHaveCount(3)
    await expect(page.locator('.areas dd a')).toHaveCount(0)
  })

// Two cards a row under the first, so five projects fill three rows.
test('five cards: the first takes a row, the others pair up', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(BASE)
  const cards = page.locator('#projects .card')
  await expect(cards).toHaveCount(5)
  await expect(cards.first()).toHaveClass(/featured/)
  const tops = await cards.evaluateAll((els) =>
    els.map((el) => Math.round(el.getBoundingClientRect().top)),
  )
  expect(tops[1]).toBe(tops[2])
  expect(tops[3]).toBe(tops[4])
  expect(new Set(tops).size).toBe(3)
})
