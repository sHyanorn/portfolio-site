// On narrow screens the site name and every navigation link stay on one
// line each; when they do not fit side by side, the links take a second row.
import { expect, test } from '@playwright/test'
import { BASE } from './site'

for (const width of [320, 360, 390])
  for (const path of [BASE, `${BASE}zh/`])
    test(`${width} ${path}: header items do not wrap`, async ({ page }) => {
      await page.setViewportSize({ width, height: 640 })
      await page.goto(path)
      await page.evaluate(() => document.fonts.ready)
      const lines = await page
        .locator('header :is(.name, .links a)')
        .evaluateAll((items) =>
          items.map((el) => {
            const range = document.createRange()
            range.selectNodeContents(el)
            const tops = [...range.getClientRects()].map((r) =>
              Math.round(r.top),
            )
            return [el.textContent!.trim(), new Set(tops).size] as const
          }),
        )
      expect(lines.length).toBeGreaterThanOrEqual(3)
      for (const [text, count] of lines) expect(count, text).toBe(1)
    })
