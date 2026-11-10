// Every kind of link answers the pointer: text links change colour and
// screenshot links their border, with the site's 240 ms transition.
import { expect, test } from '@playwright/test'
import { BASE } from './site'

const cases = [
  [
    'project page, metrics source',
    'projects/matching-engine/',
    '.note a',
    'color',
  ],
  ['project page, article', 'projects/matching-engine/', '.article a', 'color'],
  ['project page, screenshot', 'projects/backtest-lab/', '.shots a', 'img'],
  ['article, project', 'articles/order-book-cpu/', '.facts a', 'color'],
  ['About, project', 'about/', '.projects a', 'color'],
  ['404 page', '404.html', 'main a', 'color'],
] as const

test.use({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'no-preference',
})

for (const [name, path, selector, what] of cases) {
  test(name, async ({ page }) => {
    await page.goto(BASE + path)
    const link = page.locator(selector).first()
    await link.scrollIntoViewIfNeeded()
    await page.waitForTimeout(1000)
    const read = () =>
      link.evaluate((a, what) => {
        const el = what === 'img' ? a.querySelector('img')! : a
        const s = getComputedStyle(el)
        return what === 'img' ? s.borderTopColor : s.color
      }, what)
    const before = await read()
    await link.hover()
    await page.waitForTimeout(450)
    expect(await read()).not.toBe(before)
  })
}
