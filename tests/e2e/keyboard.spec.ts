// Keyboard use on every page: the first Tab shows the skip link, which moves
// the next stop past the header; every stop is on screen once focused and
// draws a focus ring until the walk reaches the footer, and no element
// changes the tab order with a positive tabindex.
import { expect, test } from '@playwright/test'
import { pages } from './site'

for (const { name, path } of pages)
  test(`${name}: keyboard walk`, async ({ page }) => {
    await page.goto(path)
    expect(
      await page
        .locator('[tabindex]:not([tabindex^="-"])')
        .evaluateAll((els) => els.filter((el) => el.tabIndex > 0).length),
    ).toBe(0)

    await page.keyboard.press('Tab')
    const skip = page.locator('a.skip')
    await expect(skip).toBeFocused()
    await expect(skip).toBeInViewport({ ratio: 1 })
    await page.keyboard.press('Enter')
    await page.keyboard.press('Tab')
    expect(
      await page.evaluate(() => {
        const el = document.activeElement!
        const main = document.querySelector('main')!
        return (
          main.contains(el) ||
          !!(
            main.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING
          )
        )
      }),
      'the stop after the skip link is in or after main',
    ).toBe(true)

    await page.locator('a.skip').focus()
    let end = false
    for (let i = 0; i < 60; i++) {
      await page.keyboard.press('Tab')
      const stop = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null
        if (!el || el === document.body) return null
        const drawn = (s: CSSStyleDeclaration) =>
          s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2
        const r = el.getBoundingClientRect()
        return {
          id: `${el.tagName} ${el.getAttribute('href') ?? ''} ${el.textContent?.trim()}`,
          // A video's own controls draw their ring inside its shadow tree.
          ring:
            el.tagName === 'VIDEO' ||
            drawn(getComputedStyle(el)) ||
            drawn(getComputedStyle(el, '::after')),
          onScreen:
            r.width > 0 &&
            r.bottom > 0 &&
            r.top < innerHeight &&
            r.right > 0 &&
            r.left < innerWidth,
          last: el.matches('footer li:last-child a'),
        }
      })
      if (!stop) break
      expect(stop.ring, `${stop.id} draws a focus ring`).toBe(true)
      expect(stop.onScreen, `${stop.id} is on screen`).toBe(true)
      if ((end = stop.last)) break
    }
    expect(end, 'the walk reaches the footer').toBe(true)
  })
