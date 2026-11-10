// The wide-screen layout (D020): the header sits on the page margin, no
// paragraph runs wider than the 36em measure, and an article's contents
// list names each of its sections and links to it.
import { expect, test } from '@playwright/test'
import { BASE, pages } from './site'

for (const width of [1024, 1440, 1920, 2560])
  for (const path of [BASE, `${BASE}zh/`])
    test(`${width} ${path}: header on the page margin`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(path)
      // clamp(1rem, 3vw, 3rem) at a 16 px root size.
      const margin = Math.min(48, Math.max(16, 0.03 * width))
      const name = (await page.locator('header .name').boundingBox())!
      const last = (await page.locator('header .links a').last().boundingBox())!
      expect(name.x).toBeCloseTo(margin, 0)
      expect(width - (last.x + last.width)).toBeCloseTo(margin, 0)
    })

// Every metric's value and label fit inside its cell, in both languages, from
// the narrowest wide-screen width up.
for (const width of [1024, 1100, 1200, 1280, 1440])
  for (const p of pages.filter((p) => /(^|-)projects-/.test(p.name)))
    test(`${width} ${p.name}: metrics fit their cells`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(p.path)
      const over = await page.locator('.metrics div').evaluateAll((cells) =>
        cells.flatMap((cell) => {
          const box = cell.getBoundingClientRect()
          const pad = parseFloat(getComputedStyle(cell).paddingRight)
          return [...cell.children].flatMap((el) => {
            const range = document.createRange()
            range.selectNodeContents(el)
            const right = range.getBoundingClientRect().right
            return right > box.right - pad + 0.5
              ? [
                  `${el.textContent}: ${(right - box.right + pad).toFixed(1)} px`,
                ]
              : []
          })
        }),
      )
      expect(over).toEqual([])
    })

// The wide diagram shows wherever the column is at least 680 px, including
// the narrowest two-column widths; the narrow one is for phones.
for (const width of [768, 1024, 1056])
  for (const p of pages.filter((p) => /(^|-)projects-/.test(p.name)))
    test(`${width} ${p.name}: the wide diagram shows`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(p.path)
      await expect(page.locator('.diagram svg.wide')).toBeVisible()
      await expect(page.locator('.diagram svg.narrow')).toBeHidden()
    })

// Later screenshots follow the first at the gap between screenshots, closer
// than the gap between sections, so they read as one set.
for (const width of [768, 1440])
  for (const p of pages.filter((p) => /(^|-)projects-/.test(p.name)))
    test(`${width} ${p.name}: the gallery keeps the screenshot gap`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(p.path)
      const gallery = page.locator('.gallery')
      test.skip((await gallery.count()) === 0, 'one screenshot or a video')
      const hero = (await page.locator('.hero').boundingBox())!
      const top = (await gallery.boundingBox())!.y
      const gap = await gallery
        .locator('.shots')
        .evaluate((el) => parseFloat(getComputedStyle(el).rowGap))
      expect(top - (hero.y + hero.height)).toBeCloseTo(gap, 0)
    })

test.describe('1920x1080', () => {
  test.use({ viewport: { width: 1920, height: 1080 } })

  for (const p of pages)
    test(`${p.name}: paragraphs within 36em`, async ({ page }) => {
      await page.goto(p.path)
      const over = await page.locator('main p').evaluateAll((ps) =>
        ps
          .map((el) => {
            // The widest line, which a short paragraph's box can exceed.
            const range = document.createRange()
            range.selectNodeContents(el)
            const size = parseFloat(getComputedStyle(el).fontSize)
            return [
              el.textContent!.trim().slice(0, 40),
              range.getBoundingClientRect().width / size,
            ]
          })
          .filter(([, ems]) => (ems as number) > 36.01),
      )
      expect(over).toEqual([])
    })

  for (const p of pages.filter((p) => /(^|-)articles-/.test(p.name)))
    test(`${p.name}: contents list links every section`, async ({ page }) => {
      await page.goto(p.path)
      const sections = await page
        .locator('.prose h2')
        .evaluateAll((hs) => hs.map((h) => [`#${h.id}`, h.textContent]))
      const toc = page.locator('.toc a')
      await expect(toc.first()).toBeVisible()
      expect(
        await toc.evaluateAll((as) =>
          as.map((a) => [a.getAttribute('href'), a.textContent]),
        ),
      ).toEqual(sections)
      for (const [href] of sections)
        expect(href, 'section id').toMatch(/^#[\w-]+$/)
    })
})
