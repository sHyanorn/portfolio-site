// The home pages: every project in the order its content file gives, and
// the card pictures' sizes, loading and theme.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import { BASE } from './site'

const CONTENT = 'src/content/projects'
const titles = readdirSync(CONTENT)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join(CONTENT, f), 'utf8')))
  .sort((a, b) => a.order - b.order)
  .map((p) => p.title as string)

for (const path of [BASE, `${BASE}zh/`])
  test(`${path}: project cards follow their order`, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator('#projects h3')).toHaveText(titles)
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
