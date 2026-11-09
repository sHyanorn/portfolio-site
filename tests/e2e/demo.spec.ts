// A project's demo video, or its first screenshot, keeps its aspect ratio,
// sits in the middle of the column and ends on the first screen, so a
// video's controls show without scrolling. Screenshots number two to four,
// each with alt text and a caption; later ones fit one screen each.
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
        const shots = page.locator('.demo figure img')
        const isVideo = (await shots.count()) === 0
        if (!isVideo) {
          expect(await shots.count()).toBeGreaterThanOrEqual(2)
          expect(await shots.count()).toBeLessThanOrEqual(4)
          for (const alt of await shots.evaluateAll((imgs) =>
            imgs.map((img) => img.getAttribute('alt')),
          ))
            expect(alt?.trim()).toBeTruthy()
          for (const caption of await page
            .locator('.demo figcaption')
            .allTextContents())
            expect(caption.trim()).toBeTruthy()
          for (const later of (await shots.all()).slice(1)) {
            const { height } = (await later.boundingBox())!
            expect(height, 'later screenshot height').toBeLessThanOrEqual(
              viewport.height,
            )
          }
        }
        const first = isVideo ? page.locator('.demo video') : shots.first()
        const box = (await first.boundingBox())!
        const column = (await page.locator('.project').boundingBox())!
        const [width, height] = await first.evaluate((el) =>
          el instanceof HTMLVideoElement
            ? [el.width, el.height]
            : [
                (el as HTMLImageElement).naturalWidth,
                (el as HTMLImageElement).naturalHeight,
              ],
        )

        expect(box.y + box.height, 'demo bottom').toBeLessThanOrEqual(
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
