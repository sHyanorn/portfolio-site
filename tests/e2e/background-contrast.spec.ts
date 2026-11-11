// Text over the home page background keeps its contrast in light and dark,
// at several points of the animation and over the CSS fallback (D015). Each
// check hides the text, screenshots the first screen and compares every
// pixel behind each text element with its colour: 4.5:1, or 3:1 for large
// text. The still frame under reduced motion is checked too. axe cannot see
// through a canvas or a gradient, so it must list this text as needing
// review, never as passed.
//
// SCREENSHOTS=1 also saves the first screen in each state to
// artifacts/screens/. BACKGROUND_TIMES sets the points in seconds of
// animation, 0 being the first frame: BACKGROUND_TIMES=0,30,90.
import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { openPaused } from './gl'
import { BASE } from './site'

const screenshots = !!process.env.SCREENSHOTS
const times = (process.env.BACKGROUND_TIMES ?? '0,10,20')
  .split(',')
  .map(Number)
  .sort((a, b) => a - b)
const viewports = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
]

interface TextBox {
  label: string
  color: string
  large: boolean
  clip: { x: number; y: number; width: number; height: number }
}

/**
 * Elements with text of their own drawn straight over the background, with
 * no background of their own in between; marks each with data-over-backdrop.
 * Runs in the page.
 */
function textOverBackdrop(): TextBox[] {
  const backdrop = document.querySelector('.backdrop')!.getBoundingClientRect()
  const boxes: TextBox[] = []
  for (const el of document.body.querySelectorAll<HTMLElement>('*')) {
    const hasText = [...el.childNodes].some(
      (n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim(),
    )
    if (!hasText) continue
    let covered = false
    for (
      let a: Element | null = el;
      a && a !== document.body;
      a = a.parentElement
    ) {
      const style = getComputedStyle(a)
      if (
        style.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
        style.backgroundImage !== 'none'
      )
        covered = true
    }
    const r = el.getBoundingClientRect()
    const top = Math.ceil(Math.max(r.top, backdrop.top, 0))
    const bottom = Math.floor(Math.min(r.bottom, backdrop.bottom, innerHeight))
    if (covered || r.width < 1 || bottom <= top) continue
    const style = getComputedStyle(el)
    const size = parseFloat(style.fontSize)
    el.dataset.overBackdrop = ''
    boxes.push({
      label: `${el.tagName.toLowerCase()} "${el.textContent!.trim().slice(0, 30)}"`,
      color: style.color,
      large: size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700),
      clip: {
        x: Math.ceil(r.left),
        y: top,
        width: Math.floor(r.right) - Math.ceil(r.left),
        height: bottom - top,
      },
    })
  }
  return boxes
}

/** Lowest WCAG contrast between each box's text colour and the pixels behind it. Runs in a blank page. */
async function lowestContrast({
  png,
  boxes,
  scale,
}: {
  png: string
  boxes: TextBox[]
  scale: number
}): Promise<number[]> {
  const bytes = Uint8Array.from(atob(png), (c) => c.charCodeAt(0))
  const bitmap = await createImageBitmap(
    new Blob([bytes], { type: 'image/png' }),
  )
  const ctx = new OffscreenCanvas(bitmap.width, bitmap.height).getContext('2d')!
  ctx.drawImage(bitmap, 0, 0)
  const channel = (c: number) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  const luminance = (r: number, g: number, b: number) =>
    0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
  return boxes.map(({ color, clip }) => {
    const [r, g, b] = color.match(/[\d.]+/g)!.map(Number)
    const text = luminance(r, g, b)
    const { data } = ctx.getImageData(
      clip.x * scale,
      clip.y * scale,
      clip.width * scale,
      clip.height * scale,
    )
    let lowest = Infinity
    for (let i = 0; i < data.length; i += 4) {
      const bg = luminance(data[i], data[i + 1], data[i + 2])
      const ratio = (Math.max(text, bg) + 0.05) / (Math.min(text, bg) + 0.05)
      lowest = Math.min(lowest, ratio)
    }
    return lowest
  })
}

for (const viewport of viewports) {
  for (const colorScheme of ['light', 'dark'] as const) {
    test.describe(`${viewport.width} ${colorScheme}`, () => {
      const scale = screenshots ? 2 : 1
      test.use({
        viewport,
        colorScheme,
        deviceScaleFactor: scale,
        reducedMotion: 'no-preference',
      })

      /** Waits out the entrances and the canvas fade, then checks the text over the background. */
      async function check(page: Page, decoder: Page, state: string) {
        // The header's animation follows the scroll and never finishes.
        await page.evaluate(() =>
          Promise.all(
            document
              .getAnimations()
              .filter((a) => a.timeline === document.timeline)
              .map((a) => a.finished),
          ),
        )
        if (screenshots)
          await page.screenshot({
            path: `artifacts/screens/home-${viewport.width}-${colorScheme}-${state}.png`,
          })
        const boxes = await page.evaluate(textOverBackdrop)
        expect(boxes.length, 'text over the background').toBeGreaterThan(3)

        const hide = await page.addStyleTag({
          content: `* { color: transparent !important; -webkit-text-fill-color: transparent !important; text-decoration-color: transparent !important; }`,
        })
        const png = (await page.screenshot()).toString('base64')
        const lowest = await decoder.evaluate(lowestContrast, {
          png,
          boxes,
          scale,
        })
        const failing = boxes
          .map((box, i) => ({ ...box, lowest: lowest[i] }))
          .filter((box) => box.lowest < (box.large ? 3 : 4.5))
          .map((box) => `${box.label}: ${box.lowest.toFixed(2)}`)
        expect(failing, `${state}: text below its contrast minimum`).toEqual([])
        await hide.evaluate((style) => (style as ChildNode).remove())
        // Links ease back to their colour, and axe must not read one on the
        // way: under load it has read the footer's links partway.
        await page.evaluate(() =>
          Promise.allSettled(
            document
              .getAnimations()
              .filter((a) => a instanceof CSSTransition)
              .map((a) => a.finished),
          ),
        )
      }

      /** axe must not judge the text over the background as passing. */
      async function checkAxe(page: Page) {
        const axe = await new AxeBuilder({ page })
          .withRules(['color-contrast'])
          .analyze()
        expect(axe.violations).toEqual([])
        const marked = (results: typeof axe.passes) =>
          page.evaluate(
            (targets) =>
              targets.filter((t) =>
                document.querySelector(t)?.hasAttribute('data-over-backdrop'),
              ).length,
            results.flatMap((r) => r.nodes.map((n) => String(n.target[0]))),
          )
        const over = await page.locator('[data-over-backdrop]').count()
        expect(await marked(axe.passes), 'passed by axe').toBe(0)
        expect(await marked(axe.incomplete), 'left for review').toBe(over)
      }

      test('animation', async ({ page, browser }) => {
        test.slow()
        const decoder = await browser.newPage()
        await openPaused(page, BASE)
        let at = 0
        for (const time of times) {
          await page.clock.runFor((time - at) * 1000)
          at = time
          await check(page, decoder, `t${time}`)
        }
        // axe waits on timers, which run only while the clock does.
        await page.clock.resume()
        await checkAxe(page)
      })

      test('still frame', async ({ page, browser }) => {
        const decoder = await browser.newPage()
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await page.goto(BASE)
        await expect(page.locator('.backdrop canvas')).toHaveClass('ready')
        await check(page, decoder, 'still')
      })

      test('fallback', async ({ page, browser }) => {
        const decoder = await browser.newPage()
        await page.addInitScript(() => {
          const getContext = HTMLCanvasElement.prototype.getContext
          HTMLCanvasElement.prototype.getContext = function (
            this: HTMLCanvasElement,
            ...args: Parameters<typeof getContext>
          ) {
            return args[0] === 'webgl2' ? null : getContext.apply(this, args)
          } as typeof getContext
        })
        await page.goto(BASE)
        await expect(page.locator('.backdrop canvas')).toHaveCount(0)
        await check(page, decoder, 'fallback')
        await checkAxe(page)
      })
    })
  }
}
