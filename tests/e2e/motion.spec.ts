// With motion allowed, every element that animates in ends fully visible once
// it is scrolled into view, including blocks at the end of a page (D014).
import { expect, test } from '@playwright/test'
import { pages } from './site'

const viewports = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
]

for (const viewport of viewports) {
  test.describe(`${viewport.width}`, () => {
    test.use({ viewport, reducedMotion: 'no-preference' })

    for (const p of pages) {
      test(p.name, async ({ page }) => {
        await page.goto(p.path)
        const animated = page.locator('.rise, .reveal')
        for (let i = 0; i < (await animated.count()); i++) {
          const el = animated.nth(i)
          // Still below the fold: a scroll-driven entrance has not started.
          const waiting = await el.evaluate((node) =>
            node.classList.contains('reveal') &&
            node.getBoundingClientRect().top > innerHeight
              ? getComputedStyle(node).opacity
              : '0',
          )
          expect(waiting, 'hidden until scrolled to').toBe('0')
          await el.evaluate((node) => node.scrollIntoView({ block: 'center' }))
          await expect
            .poll(() =>
              el.evaluate((node) => {
                const { opacity, translate } = getComputedStyle(node)
                // A finished entrance holds its end value, which reads 0px.
                return `${opacity} ${translate === '0px' ? 'none' : translate}`
              }),
            )
            .toBe('1 none')
        }
      })
    }
  })
}
