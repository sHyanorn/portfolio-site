// The home page background (D015): it draws once WebGL2 is ready, and falls
// back to the CSS gradient, without errors, when WebGL2 is missing, the
// shaders fail or the context is lost. Reduced motion and a software renderer
// get one still frame; a fine pointer moves the glows a little. Tests run as
// on a hardware renderer unless they name another.
import { expect, test, type Page } from '@playwright/test'
import {
  draws,
  fakeMaskedRenderer,
  fakeRenderer,
  GPU,
  instrument,
  openPaused,
  uniform,
} from './gl'
import { BASE } from './site'

const homes = [BASE, `${BASE}zh/`]

/** Records console errors and uncaught exceptions. */
function watchErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  page.on('pageerror', (e) => errors.push(e.message))
  return errors
}

async function expectFallback(page: Page) {
  await expect(page.locator('.backdrop canvas')).toHaveCount(0)
  await expect(page.locator('.backdrop')).toHaveCSS(
    'background-image',
    /gradient/,
  )
  expect(await draws(page)).toBe(0)
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(instrument)
  await page.addInitScript(fakeRenderer, GPU)
})

for (const path of homes) {
  test(`${path}: draws and fades the canvas in`, async ({ page }) => {
    const errors = watchErrors(page)
    await page.goto(path)
    const canvas = page.locator('.backdrop canvas')
    await expect(canvas).toHaveClass('ready')
    await expect(canvas).toHaveCSS('opacity', '1')
    expect(await draws(page)).toBeGreaterThan(0)

    // At most one backbuffer pixel per CSS pixel, and no more than the
    // budget unless the scale is at its floor of 0.5.
    const size = await canvas.evaluate((c: HTMLCanvasElement) => ({
      width: c.width,
      height: c.height,
      scale: c.width / c.clientWidth,
    }))
    expect(size.scale).toBeLessThanOrEqual(1)
    expect(size.scale).toBeGreaterThanOrEqual(0.5 - 0.01)
    if (size.scale > 0.5 + 0.01)
      expect(size.width * size.height).toBeLessThanOrEqual(200_000 * 1.01)
    expect(errors).toEqual([])
  })
}

test('without WebGL2, the gradient stays', async ({ page }) => {
  const errors = watchErrors(page)
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
  await expectFallback(page)
  expect(errors).toEqual([])
})

test('when the shaders fail to link, the gradient stays', async ({ page }) => {
  const errors = watchErrors(page)
  await page.addInitScript(() => {
    const shaderSource = WebGL2RenderingContext.prototype.shaderSource
    WebGL2RenderingContext.prototype.shaderSource = function (shader, source) {
      shaderSource.call(this, shader, source.replace('void main', 'void none'))
    }
  })
  await page.goto(BASE)
  await expectFallback(page)
  expect(errors).toEqual([])
})

test('a lost context hides the canvas until it is restored', async ({
  page,
}) => {
  const errors = watchErrors(page)
  await page.goto(BASE)
  const canvas = page.locator('.backdrop canvas')
  await expect(canvas).toHaveClass('ready')

  // A lost context returns no extensions, so keep this one from before.
  await page.evaluate(() => {
    window.lose = window.gl!.getExtension('WEBGL_lose_context')!
    window.lose.loseContext()
  })
  await expect(canvas).not.toHaveClass('ready')
  const before = await draws(page)

  await page.evaluate(() => window.lose!.restoreContext())
  await expect(canvas).toHaveClass('ready')
  expect(await draws(page)).toBeGreaterThan(before)
  expect(errors).toEqual([])
})

for (const [renderer, still] of [
  [
    'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)',
    true,
  ],
  ['llvmpipe (LLVM 17.0.6, 256 bits)', true],
  ['softpipe', true],
  [
    'ANGLE (Microsoft, Microsoft Basic Render Driver (0x0000008C) Direct3D11 vs_5_0 ps_5_0, D3D11)',
    true,
  ],
  ['Software Rasterizer', true],
  [GPU, false],
] as const)
  test(`${renderer}: ${still ? 'one still frame' : 'animates'}`, async ({
    page,
  }) => {
    await page.addInitScript(fakeRenderer, renderer)
    await page.goto(BASE)
    await expect(page.locator('.backdrop canvas')).toHaveClass('ready')
    if (still) {
      await page.waitForTimeout(500)
      expect(await draws(page)).toBe(1)
    } else {
      await expect.poll(() => draws(page)).toBeGreaterThan(5)
    }
  })

test('a masked RENDERER falls back to the debug extension', async ({
  page,
}) => {
  await page.addInitScript(fakeMaskedRenderer, 'SwiftShader driver')
  await page.goto(BASE)
  await expect(page.locator('.backdrop canvas')).toHaveClass('ready')
  await page.waitForTimeout(500)
  expect(await draws(page)).toBe(1)
})

test('a named RENDERER leaves the debug extension alone', async ({ page }) => {
  await page.addInitScript(() => {
    const gl = WebGL2RenderingContext.prototype
    const getExtension: (
      this: WebGL2RenderingContext,
      name: string,
    ) => unknown = gl.getExtension
    gl.getExtension = function (this: WebGL2RenderingContext, name: string) {
      if (name === 'WEBGL_debug_renderer_info')
        document.documentElement.dataset.debugInfo = 'asked'
      return getExtension.call(this, name)
    } as typeof gl.getExtension
  })
  await page.goto(BASE)
  await expect(page.locator('.backdrop canvas')).toHaveClass('ready')
  await expect(page.locator('html')).not.toHaveAttribute('data-debug-info')
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('draws one still frame, then only on a theme change or a resize', async ({
    page,
  }) => {
    await page.goto(BASE)
    await expect(page.locator('.backdrop canvas')).toHaveClass('ready')
    await page.waitForTimeout(500)
    expect(await draws(page)).toBe(1)
    expect(await uniform(page, 'u_time')).toEqual([0])

    await page.emulateMedia({ colorScheme: 'dark' })
    await expect.poll(() => draws(page)).toBe(2)
    await page.setViewportSize({ width: 800, height: 600 })
    await expect.poll(() => draws(page)).toBe(3)
    await page.waitForTimeout(500)
    expect(await draws(page)).toBe(3)
  })
})

test('turning reduced motion on stops at the still frame', async ({ page }) => {
  await openPaused(page, BASE)
  await page.clock.runFor(1000)
  const moving = await draws(page)
  expect(moving).toBeGreaterThan(20)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect.poll(() => draws(page)).toBe(moving + 1)
  expect(await uniform(page, 'u_time')).toEqual([0])
  await page.clock.runFor(1000)
  expect(await draws(page)).toBe(moving + 1)

  // The change event comes with a rendering update, so step until it lands.
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect
    .poll(async () => {
      await page.clock.runFor(100)
      return draws(page)
    })
    .toBeGreaterThan(moving + 1)
})

test('a mouse moves the glows by at most 4% of the canvas', async ({
  page,
}) => {
  await openPaused(page, BASE)
  await page.mouse.move(page.viewportSize()!.width - 1, 0)
  await page.clock.runFor(5000)
  const [x, y] = await uniform(page, 'u_offset')
  expect(x).toBeGreaterThan(0.035)
  expect(y).toBeGreaterThan(0.035)
  expect(Math.max(x, y)).toBeLessThanOrEqual(0.04)
})

test.describe('touch screen', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  })

  test('a coarse pointer leaves the glows in place', async ({ page }) => {
    await openPaused(page, BASE)
    await page.mouse.move(389, 0)
    await page.clock.runFor(2000)
    expect(await uniform(page, 'u_offset')).toEqual([0, 0])
  })
})

test('draws about 30 frames a second', async ({ page }) => {
  await openPaused(page, BASE)
  await page.clock.runFor(100)
  const before = await draws(page)
  await page.clock.runFor(1000)
  const perSecond = (await draws(page)) - before
  expect(perSecond).toBeGreaterThanOrEqual(28)
  expect(perSecond).toBeLessThanOrEqual(32)
})

/** Reports the page as hidden or visible, as a tab switch does. */
const hide = (page: Page, hidden: boolean) =>
  page.evaluate((h) => {
    Object.defineProperty(document, 'visibilityState', {
      value: h ? 'hidden' : 'visible',
      configurable: true,
    })
    document.dispatchEvent(new Event('visibilitychange'))
  }, hidden)

test('a hidden page draws nothing and resumes where it stopped', async ({
  page,
}) => {
  await openPaused(page, BASE)
  await page.clock.runFor(1000)
  await hide(page, true)
  const before = await draws(page)
  const [time] = await uniform(page, 'u_time')
  await page.clock.runFor(10_000)
  expect(await draws(page)).toBe(before)

  await hide(page, false)
  await page.clock.runFor(200)
  expect(await draws(page)).toBeGreaterThan(before)
  const [after] = await uniform(page, 'u_time')
  expect(after - time).toBeLessThan(0.3)
})

test('a canvas scrolled out of view draws nothing', async ({ page }) => {
  /** Draws while the clock runs for 300 ms. */
  const drawsOver300ms = async () => {
    const before = await draws(page)
    await page.clock.runFor(300)
    return (await draws(page)) - before
  }
  await openPaused(page, BASE)
  await page.evaluate(() => {
    const spacer = document.createElement('div')
    spacer.style.height = '300vh'
    document.body.append(spacer)
    scrollTo(0, 2 * innerHeight)
  })
  await expect.poll(drawsOver300ms).toBe(0)
  await page.evaluate(() => scrollTo(0, 0))
  await expect.poll(drawsOver300ms).toBeGreaterThan(0)
})

/** From here on, every frame arrives `window.frameGap` ms after the one before. */
async function spaceFrames(page: Page, gap: number) {
  await page.evaluate((g) => {
    window.frameGap = g
    window.requestAnimationFrame = (callback) =>
      window.setTimeout(() => callback(performance.now()), window.frameGap)
    window.cancelAnimationFrame = (id) => window.clearTimeout(id)
  }, gap)
}

test('a steady 20 fps keeps animating, a little over 50 ms a frame', async ({
  page,
}) => {
  await openPaused(page, BASE)
  // Three intervals of a 59.94 Hz screen are 50.05 ms; 53 ms leaves margin.
  await spaceFrames(page, 53)
  const before = await draws(page)
  await page.clock.runFor(2000)
  const after = await draws(page)
  await page.clock.runFor(1000)
  expect(after - before).toBeGreaterThan(30)
  expect(await draws(page)).toBeGreaterThan(after + 15)
})

test('late frames before a pause and after it do not add up to a stop', async ({
  page,
}) => {
  await openPaused(page, BASE)
  await spaceFrames(page, 60)
  // About six late frames each side of the pause, twelve in all.
  await page.clock.runFor(450)
  await hide(page, true)
  await page.clock.runFor(1000)
  await hide(page, false)
  await page.clock.runFor(450)
  await page.evaluate(() => (window.frameGap = 33))
  const before = await draws(page)
  await page.clock.runFor(1000)
  expect(await draws(page)).toBeGreaterThan(before + 20)
})

test('frames that keep coming late stop the loop on the current frame', async ({
  page,
}) => {
  await openPaused(page, BASE)
  await spaceFrames(page, 60)
  const before = await draws(page)
  await page.clock.runFor(2000)
  const stopped = await draws(page)
  expect(stopped - before).toBeGreaterThan(5)
  expect(stopped - before).toBeLessThan(12)
  await page.clock.runFor(2000)
  expect(await draws(page)).toBe(stopped)
  await expect(page.locator('.backdrop canvas')).toHaveClass('ready')
})
