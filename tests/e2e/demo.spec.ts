// A project's demo video, or its first screenshot, keeps its aspect ratio,
// sits in the middle of its column and ends on the first screen with at
// least a line of summary to spare, so a video's controls still show when a
// font wraps the summary once more. Screenshots number two to four,
// each with alt text, a caption and a link that wraps it; later ones fit
// one screen each, in a grid below the first screen. A screenshot with a dark copy shows and links to the copy
// that matches the theme, and the hidden lazy copies never load.
import { expect, test } from '@playwright/test'
import { BASE, pages } from './site'

// Common laptop screens, and a tablet held upright; then the same screens
// less a maximised browser's tabs, address bar and taskbar.
const viewports = [
  { width: 1366, height: 768 },
  { width: 1536, height: 864 },
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
  { width: 1920, height: 1080 },
  { width: 1366, height: 657 },
  { width: 1280, height: 603 },
  { width: 1536, height: 730 },
  { width: 1440, height: 789 },
  { width: 1920, height: 953 },
]
// The first screenshot, then the gallery of the later ones.
const SHOTS = ':is(.demo, .gallery) figure img:visible'
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
        const shots = page.locator(SHOTS)
        const isVideo = (await shots.count()) === 0
        if (!isVideo) {
          expect(await shots.count()).toBeGreaterThanOrEqual(2)
          expect(await shots.count()).toBeLessThanOrEqual(4)
          for (const alt of await shots.evaluateAll((imgs) =>
            imgs.map((img) => img.getAttribute('alt')),
          ))
            expect(alt?.trim()).toBeTruthy()
          for (const caption of await page
            .locator(':is(.demo, .gallery) figcaption')
            .allTextContents())
            expect(caption.trim()).toBeTruthy()
          // Each screenshot's link is one box round it, so its focus ring
          // goes round the screenshot; an inline link around a block image
          // splits into empty boxes that the ring is drawn on instead.
          for (const shot of await shots.all()) {
            const [boxes, link, img] = await shot.evaluate((el) => {
              const a = el.closest('a')!
              const box = (r: DOMRect) => [r.width, r.height]
              return [
                a.getClientRects().length,
                box(a.getBoundingClientRect()),
                box(el.getBoundingClientRect()),
              ]
            })
            expect(boxes, 'screenshot link boxes').toBe(1)
            expect(link).toEqual(img)
          }
          for (const later of (await shots.all()).slice(1)) {
            const { height } = (await later.boundingBox())!
            expect(height, 'later screenshot height').toBeLessThanOrEqual(
              viewport.height,
            )
          }
        }
        const first = isVideo ? page.locator('.demo video') : shots.first()
        const box = (await first.boundingBox())!
        // The page column, or the intro's neighbour on a wide screen.
        const column = (await page.locator('.demo').boundingBox())!
        // The ratio inside the border, which is a larger share of a small demo.
        const [width, height, inner] = await first.evaluate((el) => [
          ...(el instanceof HTMLVideoElement
            ? [el.width, el.height]
            : [
                (el as HTMLImageElement).naturalWidth,
                (el as HTMLImageElement).naturalHeight,
              ]),
          el.clientWidth / el.clientHeight,
        ])

        const line = await page
          .locator('.summary')
          .evaluate((el) => parseFloat(getComputedStyle(el).lineHeight))
        expect(
          viewport.height - (box.y + box.height),
          'space below the demo',
        ).toBeGreaterThanOrEqual(line)
        expect(inner).toBeCloseTo(width / height, 2)
        const left = box.x - column.x
        const right = column.x + column.width - (box.x + box.width)
        expect(Math.abs(left - right), 'centred').toBeLessThanOrEqual(1)
      })
    }
  })
}

for (const colorScheme of ['light', 'dark'] as const) {
  test(`local-ledger screenshots follow the ${colorScheme} theme`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme })
    const fetched: string[] = []
    page.on('request', (r) => {
      if (r.resourceType() === 'image') fetched.push(r.url())
    })
    await page.goto(`${BASE}projects/local-ledger/`)
    const shots = page.locator(SHOTS)
    expect(await shots.count()).toBe(3)
    for (const shot of await shots.all()) {
      await shot.scrollIntoViewIfNeeded()
      await expect(shot).toHaveJSProperty('complete', true)
      const [src, href] = await shot.evaluate((el: HTMLImageElement) => [
        el.currentSrc,
        el.closest('a')!.href,
      ])
      for (const url of [src, href])
        expect(url, 'visible copy').toMatch(new RegExp(`-${colorScheme}\\.`))
    }
    const other = colorScheme === 'dark' ? 'light' : 'dark'
    expect(fetched.filter((u) => u.includes(`-${other}.`))).toEqual([])

    // The preload for this scheme asks for the files the first image uses.
    const preloads = await page
      .locator('link[rel="preload"][as="image"]')
      .evaluateAll((links: HTMLLinkElement[]) =>
        links
          .filter((l) => matchMedia(l.media).matches)
          .map((l) => [l.getAttribute('imagesrcset'), l.imageSizes]),
      )
    expect(preloads).toEqual([
      await shots
        .first()
        .evaluate((el: HTMLImageElement) => [
          el.getAttribute('srcset'),
          el.sizes,
        ]),
    ])

    // One tab stop per screenshot, its visible link.
    await page.locator('h1').click()
    const stops: string[] = []
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab')
      const href = await page.evaluate(() =>
        document.activeElement?.closest('.demo, .gallery')
          ? (document.activeElement as HTMLAnchorElement).href
          : null,
      )
      if (href) stops.push(href)
      else if (stops.length) break
    }
    expect(stops).toHaveLength(3)
    for (const href of stops)
      expect(href).toMatch(new RegExp(`-${colorScheme}\\.`))
  })
}

// A click anywhere on a video's poster starts it, before anything has loaded.
for (const path of [
  `${BASE}projects/matching-engine/`,
  `${BASE}zh/projects/vault-share/`,
])
  test(`${path}: a click on the poster plays the video`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(path)
    const video = page.locator('.demo video')
    await video.click()
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused))
      .toBe(true)
  })

// Later screenshots sit side by side on a wide screen, unless their aspect
// ratios differ so much that the wider one would be a thin strip beside a
// tall one; then they stack.
for (const [project, columns] of [
  ['backtest-lab', 1],
  ['push-lab', 2],
  ['local-ledger', 2],
] as const)
  test(`${project}: later screenshots in ${columns} column(s)`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`${BASE}projects/${project}/`)
    const tops = await page
      .locator('.shots.rest figure')
      .evaluateAll((els) =>
        els.map((e) => Math.round(e.getBoundingClientRect().top)),
      )
    expect(tops.filter((t) => t === tops[0]).length).toBe(columns)
  })

// Stacked screenshots are offered a file at least as wide as they show.
test('backtest-lab: stacked screenshots are not enlarged', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`${BASE}projects/backtest-lab/`)
  for (const img of await page.locator('.shots.rest img').all()) {
    await img.scrollIntoViewIfNeeded()
    await expect
      .poll(() =>
        img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth),
      )
      .toBeTruthy()
    const [natural, shown] = await img.evaluate((i: HTMLImageElement) => [
      i.naturalWidth,
      i.getBoundingClientRect().width,
    ])
    expect(natural).toBeGreaterThanOrEqual(shown)
  }
})
