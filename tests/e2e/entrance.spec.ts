// Entrances on load (D014), sampled every frame: whatever the viewport, the
// blocks on the first screen fade in from the top down, the first one without
// waiting for blocks out of view, and blocks below the fold wait for the
// scroll. A link to a place in a page lands where following it does.
import { expect, test, type Page } from '@playwright/test'
import { BASE, pages } from './site'

const viewports = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]
// Slack for the frame on which a change is first seen.
const FRAME = 20

interface Block {
  top: number
  bottom: number
  /** Opacity on each sampled frame. */
  opacity: number[]
}

/** Opens a page and samples the opacity of every entering block on each frame. */
async function sample(page: Page, path: string) {
  await page.addInitScript(() => {
    const frames: { t: number; opacity: number[] }[] = []
    Object.assign(window, { frames })
    const tick = (t: number) => {
      const blocks = document.querySelectorAll('.rise, .reveal')
      frames.push({
        t,
        opacity: [...blocks].map((b) => Number(getComputedStyle(b).opacity)),
      })
      if (t < 1500) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
  await page.goto(path)
  await page.waitForFunction(() => performance.now() > 1600)
  return page.evaluate(() => {
    const { frames } = window as unknown as {
      frames: { t: number; opacity: number[] }[]
    }
    const blocks = [...document.querySelectorAll('.rise, .reveal')]
    // Frames from before the last block was parsed do not line up.
    const full = frames.filter((f) => f.opacity.length === blocks.length)
    return {
      height: innerHeight,
      paint: performance.getEntriesByName('first-contentful-paint')[0]
        .startTime,
      times: full.map((f) => f.t),
      blocks: blocks.map((b, i) => {
        const { top, bottom } = b.getBoundingClientRect()
        return { top, bottom, opacity: full.map((f) => f.opacity[i]) }
      }),
    }
  })
}

function check(result: Awaited<ReturnType<typeof sample>>) {
  const { height, paint, times, blocks } = result
  const at = (b: Block, test: (o: number) => boolean) => {
    const i = b.opacity.findIndex(test)
    return i < 0 ? Infinity : times[i]
  }
  const visible = blocks
    .filter((b) => b.top < height && b.bottom > 0)
    .sort((a, b) => a.top - b.top)
  expect(visible.length, 'blocks on the first screen').toBeGreaterThan(0)
  for (const b of visible)
    expect(Math.min(...b.opacity), `block at ${b.top}`).toBeLessThan(1)
  const start = visible.map((b) => at(b, (o) => o > 0.02))
  const done = visible.map((b) => at(b, (o) => o > 0.98))
  // Above the bottom strip, where a block may rest partly faded, every
  // block finishes its entrance.
  visible.forEach((b, i) => {
    if (b.top < height - 96)
      expect(done[i], `block at ${b.top} ends`).toBeLessThan(Infinity)
  })
  // The header paints first; the first block follows within a few frames.
  expect(start[0] - paint, 'wait before the first block').toBeLessThan(150)
  for (let i = 1; i < visible.length; i++) {
    if (visible[i].top - visible[i - 1].top < 1) continue
    const where = `blocks at ${visible[i - 1].top} and ${visible[i].top}`
    expect(start[i - 1], `${where} start in order`).toBeLessThanOrEqual(
      start[i] + FRAME,
    )
    expect(done[i - 1], `${where} end in order`).toBeLessThanOrEqual(
      done[i] + FRAME,
    )
  }
  for (const b of blocks.filter((b) => b.top >= height))
    expect(Math.max(...b.opacity), `block below at ${b.top}`).toBe(0)
}

for (const viewport of viewports) {
  test.describe(`${viewport.width}`, () => {
    test.use({ viewport, reducedMotion: 'no-preference' })

    for (const p of pages.filter((p) => p.name !== '404')) {
      test(p.name, async ({ page }) => {
        check(await sample(page, p.path))
      })
    }

    for (const path of [`${BASE}#projects`, `${BASE}zh/#projects`]) {
      test(`${path} lands on the projects`, async ({ page }) => {
        check(await sample(page, path))
      })
    }
  })
}

test.describe('1440', () => {
  test.use({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'no-preference',
  })

  test('a link to a section lands where following it does', async ({
    page,
  }) => {
    const path = `${BASE}articles/order-book-cpu/`
    const heading = page.locator('#limits')
    const below = () =>
      heading.evaluate(
        (h) =>
          h.getBoundingClientRect().top -
          document.querySelector('header')!.getBoundingClientRect().bottom,
      )
    await page.goto(`${path}#limits`)
    await page.waitForTimeout(1500)
    const opened = await below()

    await page.goto(path)
    await page.waitForTimeout(1500)
    await page.locator('.toc a[href="#limits"]').click()
    await expect.poll(below).toBeLessThan(100)
    await page.waitForTimeout(1500)
    expect(opened).toBe(await below())
  })
})
