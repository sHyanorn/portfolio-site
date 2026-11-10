// The wide-screen layout (D020) at the widths where it changes: the header
// on the content edge or the page margin; the metrics, diagram and gallery
// of a project page; the 36em measure; and an article's contents list,
// centred body and left column that stays in view.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import { BASE, pages } from './site'

// The header's ends sit on the content's edges while the content fills the
// page; once the content is centred at its full width with more room beside
// it than the page margin, they sit on the page margin instead.
for (const width of [480, 600, 800, 1024, 1280, 1340, 1440, 1920, 2560])
  for (const path of [BASE, `${BASE}zh/`])
    test(`${width} ${path}: header on the content edge or page margin`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(path)
      // clamp(1rem, 3vw, 3rem) at a 16 px root size.
      const margin = Math.min(48, Math.max(16, 0.03 * width))
      const main = (await page.locator('main').boundingBox())!
      const centred = main.width > 1279.5
      const edge = centred ? Math.min(margin, main.x) : main.x
      const name = (await page.locator('header .name').boundingBox())!
      const last = (await page.locator('header .links a').last().boundingBox())!
      expect(name.x).toBeCloseTo(edge, 0)
      expect(width - (last.x + last.width)).toBeCloseTo(edge, 0)
    })

// Every metric's value and label fit inside its cell, in both languages, on
// each side of the widths where the columns change.
for (const width of [484, 520, 560, 576, 580, 1024, 1100, 1200, 1280, 1440])
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

// The wide diagram shows wherever the column is at least 664 px, including
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
// than the gap between sections, so they read as one set. A project whose
// demo is a video has none.
const CONTENT = 'src/content/projects'
const withShots = readdirSync(CONTENT)
  .filter((f) => f.endsWith('.json'))
  .filter(
    (f) => 'images' in JSON.parse(readFileSync(join(CONTENT, f), 'utf8')).demo,
  )
  .map((f) => f.replace('.json', ''))
for (const width of [768, 1440])
  for (const p of pages.filter((p) =>
    withShots.some((id) => p.name.endsWith(`projects-${id}`)),
  ))
    test(`${width} ${p.name}: the gallery keeps the screenshot gap`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(p.path)
      const gallery = page.locator('.gallery')
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
    test(`${p.name}: paragraphs and captions within 36em`, async ({ page }) => {
      await page.goto(p.path)
      // KaTeX keeps a MathML copy of each formula for screen readers, clipped
      // to 1 px. Its boxes still count in a range's rect, past the end of a
      // line when the formula sits there, so it is left out.
      await page.addStyleTag({ content: '.katex-mathml { display: none }' })
      const over = await page
        .locator('main p, main figcaption')
        .evaluateAll((ps) =>
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
      // An article with one section or none has no contents list.
      if (sections.length <= 1) {
        await expect(page.locator('.toc')).toHaveCount(0)
        return
      }
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

// An article's body sits in the middle of the page, and the column on its
// left stays in view while the body scrolls past.
for (const width of [1440, 1920])
  test.describe(`${width}x900 articles`, () => {
    test.use({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })

    for (const p of pages.filter((p) => /(^|-)articles-[^/]/.test(p.name)))
      test(`${p.name}: body centred, column in view`, async ({ page }) => {
        await page.goto(p.path)
        const prose = (await page.locator('.prose').boundingBox())!
        expect(prose.x + prose.width / 2).toBeCloseTo(width / 2, 0)

        const aside = page.locator('.aside')
        const top = await aside.evaluate((el) =>
          parseFloat(getComputedStyle(el).top),
        )
        const end = prose.y + prose.height - 900
        for (const y of [end / 2, end]) {
          await page.evaluate((y) => scrollTo(0, y), y)
          expect((await aside.boundingBox())!.y, `at ${y}`).toBeCloseTo(top, 0)
        }
      })
  })

// Captions and metric labels avoid a last line of one word or character.
for (const path of [BASE, `${BASE}zh/`, `${BASE}zh/projects/backtest-lab/`])
  test(`${path}: captions and terms wrap pretty`, async ({ page }) => {
    await page.goto(path)
    const styles = await page
      .locator('figcaption, dt')
      .evaluateAll((els) => els.map((e) => getComputedStyle(e).textWrapStyle))
    expect(styles.length).toBeGreaterThan(0)
    expect(new Set(styles)).toEqual(new Set(['pretty']))
  })
