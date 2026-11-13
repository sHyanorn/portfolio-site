// The header stays at the top of the viewport (D020): its links work from
// the foot of a page, a link to a place in the page stops 2rem below it, and
// the sticky columns of project pages and articles stay clear of it.
import { expect, test, type Page } from '@playwright/test'
import { BASE } from './site'

const viewports = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]

const scrollTo = (page: Page, top: number) =>
  page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), top)

/** The header's bottom edge, once the header is checked to be on screen. */
async function headerBottom(page: Page): Promise<number> {
  const header = page.locator('body > header')
  await expect(header).toBeInViewport({ ratio: 1 })
  return header.evaluate((el) => el.getBoundingClientRect().bottom)
}

for (const viewport of viewports) {
  test.describe(`${viewport.width}`, () => {
    test.use({ viewport })

    test('the links work from the foot of the page', async ({ page }) => {
      await page.goto(BASE)
      await scrollTo(page, 1e6)
      await headerBottom(page)
      await page.locator('header a[href$="/about/"]').click()
      await expect(page).toHaveURL(new RegExp(`${BASE}about/$`))
    })

    test('the Projects link stops below the header', async ({ page }) => {
      await page.goto(BASE)
      // Scroll-driven animations never finish; the load clock does.
      await page.locator('#projects').evaluate((el) =>
        Promise.all(
          el
            .getAnimations({ subtree: true })
            .filter((a) => a.timeline === document.timeline)
            .map((a) => a.finished),
        ),
      )
      const scrolled = page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            addEventListener('scrollend', () => resolve(), { once: true }),
          ),
      )
      await page.locator('header a[href$="#projects"]').click()
      await scrolled
      const top = await page
        .locator('#projects h2')
        .evaluate((h) => h.getBoundingClientRect().top)
      const gap = top - (await headerBottom(page))
      expect(gap).toBeGreaterThan(28)
      expect(gap).toBeLessThan(36)
    })
  })
}

// From 64rem a project page's section headings and an article's side column
// stick as the page scrolls.
for (const [name, path, sticky] of [
  ['project page', 'projects/matching-engine/', '.row h2'],
  ['article', 'articles/low-pbo-easy-question/', '.aside'],
] as const)
  test(`${name}: the sticky column stays below the header`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(BASE + path)
    const height = await page.evaluate(
      () => document.documentElement.scrollHeight,
    )
    let stuck = 0
    for (let y = 600; y < height - 900; y += 300) {
      await scrollTo(page, y)
      const bottom = await headerBottom(page)
      const tops = await page.locator(sticky).evaluateAll((els) =>
        els
          // Above its own `top`, an element is being pushed off by the end
          // of its container, which is how a sticky column leaves.
          .filter(
            (el) =>
              el.getBoundingClientRect().top >=
              parseFloat(getComputedStyle(el).top) - 0.5,
          )
          .map((el) => el.getBoundingClientRect())
          .filter((r) => r.bottom > 0 && r.top < innerHeight)
          .map((r) => r.top),
      )
      for (const top of tops) {
        expect(top, `at ${y}`).toBeGreaterThanOrEqual(bottom)
        if (top < bottom + 40) stuck++
      }
    }
    expect(stuck, 'the column was seen stuck').toBeGreaterThan(0)
  })
