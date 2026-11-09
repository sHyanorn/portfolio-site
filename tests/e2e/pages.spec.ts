// Every page at three widths in light and dark: axe, horizontal overflow and
// scroll containers, with reduced motion so nothing is caught mid-animation.
// Each run writes its measurements to artifacts/audit/; SCREENSHOTS=1 also
// saves full-page screenshots to artifacts/screens/.
import { writeFileSync } from 'node:fs'
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { measureOverflow } from './overflow'
import { pages } from './site'

const screenshots = !!process.env.SCREENSHOTS
const viewports = [
  { width: 390, height: 844, mobile: true },
  { width: 768, height: 1024, mobile: true },
  { width: 1440, height: 900, mobile: false },
]
const AXE_TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'wcag22aa',
  'best-practice',
]

for (const { width, height, mobile } of viewports) {
  for (const colorScheme of ['light', 'dark'] as const) {
    test.describe(`${width} ${colorScheme}`, () => {
      test.use({
        viewport: { width, height },
        isMobile: mobile,
        hasTouch: mobile,
        deviceScaleFactor: screenshots ? 2 : 1,
        colorScheme,
        reducedMotion: 'reduce',
      })

      for (const p of pages) {
        test(p.name, async ({ page }) => {
          await page.goto(p.path)
          await page.evaluate(() => document.fonts.ready)

          const axe = await new AxeBuilder({ page })
            .withTags(AXE_TAGS)
            .analyze()
          const overflow = await page.evaluate(measureOverflow)
          const id = `${p.name}-${width}-${colorScheme}`
          writeFileSync(
            `artifacts/audit/${id}.json`,
            JSON.stringify({
              page: p.name,
              width,
              colorScheme,
              overflow,
              axe: axe.violations.map((v) => `${v.id} (${v.nodes.length})`),
            }),
          )
          if (screenshots)
            await page.screenshot({
              path: `artifacts/screens/${id}.png`,
              fullPage: true,
            })

          expect(axe.violations, 'axe violations').toEqual([])
          expect(overflow.page, 'page wider than the viewport').toBe(0)
          expect(
            overflow.rows.filter((r) => r.kind !== 'scroll'),
            'content wider than its box',
          ).toEqual([])
          expect(
            overflow.rows.filter(
              (r) => r.scrollWidth > r.clientWidth + 1 && !r.focusable,
            ),
            'scrolling regions the keyboard cannot reach',
          ).toEqual([])
        })
      }
    })
  }
}
