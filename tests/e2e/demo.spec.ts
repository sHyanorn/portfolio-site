// A project's demo video keeps its aspect ratio, sits in the middle of the
// column and ends on the first screen, so its controls show without scrolling.
import { expect, test } from '@playwright/test'
import { pages } from './site'

const viewports = [
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
]
const projects = pages.filter((p) =>
  p.name.replace(/^zh-/, '').startsWith('projects-'),
)

for (const viewport of viewports) {
  test.describe(`${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport, reducedMotion: 'reduce' })

    for (const p of projects) {
      test(p.name, async ({ page }) => {
        await page.goto(p.path)
        await page.evaluate(() => document.fonts.ready)
        const video = page.locator('.demo video')
        const box = (await video.boundingBox())!
        const column = (await page.locator('.project').boundingBox())!
        const width = Number(await video.getAttribute('width'))
        const height = Number(await video.getAttribute('height'))

        expect(box.y + box.height, 'video bottom').toBeLessThanOrEqual(
          viewport.height,
        )
        expect(box.width / box.height).toBeCloseTo(width / height, 2)
        const left = box.x - column.x
        const right = column.x + column.width - (box.x + box.width)
        expect(Math.abs(left - right), 'centred').toBeLessThanOrEqual(1)
      })
    }
  })
}
