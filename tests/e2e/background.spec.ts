// The home page background (D015): it draws once WebGL2 is ready, and falls
// back to the CSS gradient, without errors, when WebGL2 is missing, the
// shaders fail or the context is lost. A software renderer draws one still
// frame.
import { expect, test, type Page } from '@playwright/test'
import { fakeRenderer, GPU } from './gl'
import { BASE } from './site'

const homes = [BASE, `${BASE}zh/`]

declare global {
  interface Window {
    draws: number
    gl?: WebGL2RenderingContext
    lose?: WEBGL_lose_context
  }
}

/** Counts draw calls and keeps the context; runs in the page before its scripts. */
function instrument() {
  window.draws = 0
  const draw = WebGL2RenderingContext.prototype.drawArrays
  WebGL2RenderingContext.prototype.drawArrays = function (...args) {
    window.draws++
    return draw.apply(this, args)
  }
  const getContext = HTMLCanvasElement.prototype.getContext
  HTMLCanvasElement.prototype.getContext = function (
    this: HTMLCanvasElement,
    ...args: Parameters<typeof getContext>
  ) {
    const context = getContext.apply(this, args)
    if (context instanceof WebGL2RenderingContext) window.gl = context
    return context
  } as typeof getContext
}

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
  expect(await page.evaluate(() => window.draws)).toBe(0)
}

test.beforeEach(({ page }) => page.addInitScript(instrument))

for (const path of homes) {
  test(`${path}: draws and fades the canvas in`, async ({ page }) => {
    const errors = watchErrors(page)
    await page.goto(path)
    const canvas = page.locator('.backdrop canvas')
    await expect(canvas).toHaveClass('ready')
    await expect(canvas).toHaveCSS('opacity', '1')
    expect(await page.evaluate(() => window.draws)).toBeGreaterThan(0)

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
  const before = await page.evaluate(() => window.draws)

  await page.evaluate(() => window.lose!.restoreContext())
  await expect(canvas).toHaveClass('ready')
  expect(await page.evaluate(() => window.draws)).toBeGreaterThan(before)
  expect(errors).toEqual([])
})

for (const [renderer, still] of [
  [
    'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)',
    true,
  ],
  ['llvmpipe (LLVM 17.0.6, 256 bits)', true],
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
      expect(await page.evaluate(() => window.draws)).toBe(1)
    } else {
      await expect
        .poll(() => page.evaluate(() => window.draws))
        .toBeGreaterThan(5)
    }
  })
