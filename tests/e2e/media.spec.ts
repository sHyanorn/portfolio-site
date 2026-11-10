// Under forced colours and in print the content keeps its meaning: the home
// background does not cover the page, the current page stands out in the
// navigation, and every block that enters on screen is there on paper.
import { expect, test } from '@playwright/test'
import sharp from 'sharp'
import { BASE, pages } from './site'

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`forced colours, ${colorScheme}`, () => {
    test.use({ viewport: { width: 1440, height: 900 }, colorScheme })

    test('the home background is the page colour', async ({ page }) => {
      await page.emulateMedia({ forcedColors: 'active' })
      await page.goto(BASE)
      await page.waitForTimeout(1500)
      const bg = await page.evaluate(
        () => getComputedStyle(document.body).backgroundColor,
      )
      // Everything but the background, out of the way.
      await page.addStyleTag({
        content:
          'body > :not(main), main > :not(.backdrop) { visibility: hidden }',
      })
      const { data, info } = await sharp(await page.screenshot())
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true })
      const [r, g, b] = bg.match(/\d+/g)!.map(Number)
      let off = 0
      for (let i = 0; i < data.length; i += info.channels)
        if (data[i] !== r || data[i + 1] !== g || data[i + 2] !== b) off++
      expect(off, `pixels other than ${bg}`).toBe(0)
    })

    test('the current page stands out in the navigation', async ({ page }) => {
      await page.emulateMedia({ forcedColors: 'active' })
      await page.goto(`${BASE}about/`)
      const look = (selector: string) =>
        page.locator(selector).evaluate((a) => {
          const s = getComputedStyle(a)
          return [
            s.color,
            s.textDecorationLine,
            s.borderBottomStyle,
            s.outlineStyle,
            s.fontWeight,
          ].join(' ')
        })
      expect(await look('header .links a[aria-current]')).not.toBe(
        await look('header .links a[href$="/articles/"]'),
      )
    })
  })
}

test.describe('print', () => {
  test.use({ reducedMotion: 'no-preference' })

  for (const p of pages.filter((p) => p.name !== '404')) {
    test(p.name, async ({ page }) => {
      await page.emulateMedia({ media: 'print' })
      await page.goto(p.path)
      const hidden = await page.evaluate(() =>
        [...document.querySelectorAll('.rise, .reveal')]
          .filter((b) => getComputedStyle(b).opacity !== '1')
          .map((b) => b.className),
      )
      expect(hidden).toEqual([])
    })
  }
})
