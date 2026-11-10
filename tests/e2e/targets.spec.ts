// On a phone the header and footer links take a finger: 44 px tall where the
// row allows, and the contents list at least 24 px (WCAG 2.5.8). Measured by
// what a tap above and below each link's text lands on.
import { expect, test, type Page } from '@playwright/test'
import { BASE } from './site'

/** The shortest tap height, centred on the text, that lands on every link. */
const reach = (page: Page, selector: string, want: number) =>
  page.locator(selector).evaluateAll((links, want) => {
    const half = want / 2 - 1
    return links.filter((a) => {
      const r = a.getBoundingClientRect()
      const x = r.left + r.width / 2
      const y = r.top + r.height / 2
      return ![y - half, y + half].every(
        (at) => document.elementFromPoint(x, at)?.closest('a') === a,
      )
    }).length
  }, want)

for (const width of [320, 390, 1440]) {
  test(`${width}: header and footer links`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.goto(`${BASE}about/`)
    await page.locator('footer').scrollIntoViewIfNeeded()
    expect(await reach(page, 'footer a', 44), 'footer').toBe(0)
    await page.evaluate(() => scrollTo(0, 0))
    expect(
      await reach(page, 'header .links a', width < 360 ? 24 : 44),
      'header',
    ).toBe(0)
  })
}

test('1440: the contents list', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`${BASE}articles/order-book-cpu/`)
  expect(await reach(page, '.toc a', 24)).toBe(0)
})
