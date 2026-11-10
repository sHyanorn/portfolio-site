// A classic scrollbar takes its width from the page but not from the media
// queries, so at 1024 the column beside the headings is at its narrowest.
import { expect, test } from '@playwright/test'
import { pages } from './site'

test.use({ launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] } })

for (const p of pages.filter((p) => /(^|-)projects-/.test(p.name)))
  test(`1024 ${p.name}: the wide diagram shows`, async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 900 })
    await page.goto(p.path)
    const bar = await page.evaluate(
      () => innerWidth - document.documentElement.clientWidth,
    )
    expect(bar, 'scrollbar width').toBeGreaterThan(0)
    await expect(page.locator('.diagram svg.wide')).toBeVisible()
    await expect(page.locator('.diagram svg.narrow')).toBeHidden()
  })
