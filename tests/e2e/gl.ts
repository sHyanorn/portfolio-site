// Helpers for the home page background tests (D015).
import { expect, type Page } from '@playwright/test'

declare global {
  interface Window {
    /** drawArrays calls so far. */
    draws: number
    /** The last values each float uniform was set to, by name. */
    uniforms: Record<string, number[]>
    gl?: WebGL2RenderingContext
    lose?: WEBGL_lose_context
    /** Milliseconds between frames once a test spaces them out. */
    frameGap?: number
  }
}

/** A hardware renderer's name, for tests that need the background to animate. */
export const GPU =
  'ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0, D3D11)'

/**
 * Makes WebGL report `name` as its renderer; runs in the page before its
 * scripts. Without a GPU, browsers in tests shade on the CPU, where the
 * background draws one still frame.
 */
export function fakeRenderer(name: string) {
  const { getParameter } = WebGL2RenderingContext.prototype
  WebGL2RenderingContext.prototype.getParameter = function (pname: number) {
    // RENDERER, and UNMASKED_RENDERER_WEBGL from WEBGL_debug_renderer_info.
    return pname === 0x1f01 || pname === 0x9246
      ? name
      : getParameter.call(this, pname)
  }
}

/** Counts draws, records uniforms and keeps the context; runs in the page before its scripts. */
export function instrument() {
  window.draws = 0
  window.uniforms = {}
  const gl = WebGL2RenderingContext.prototype
  const names = new WeakMap<WebGLUniformLocation, string>()
  const { drawArrays, getUniformLocation, uniform1f, uniform2f } = gl
  gl.drawArrays = function (...args) {
    window.draws++
    return drawArrays.apply(this, args)
  }
  gl.getUniformLocation = function (program, name) {
    const location = getUniformLocation.call(this, program, name)
    if (location) names.set(location, name)
    return location
  }
  gl.uniform1f = function (location, x) {
    if (location) window.uniforms[names.get(location)!] = [x]
    return uniform1f.call(this, location, x)
  }
  gl.uniform2f = function (location, x, y) {
    if (location) window.uniforms[names.get(location)!] = [x, y]
    return uniform2f.call(this, location, x, y)
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

export const draws = (page: Page) => page.evaluate(() => window.draws)

export const uniform = (page: Page, name: string) =>
  page.evaluate((n) => window.uniforms[n], name)

/**
 * Opens a page on a hardware renderer with its clock stopped, then runs it up
 * to the background's first frame.
 */
export async function openPaused(page: Page, path: string) {
  await page.addInitScript(fakeRenderer, GPU)
  await page.clock.install({ time: 0 })
  await page.clock.pauseAt(1000)
  await page.goto(path)
  const canvas = page.locator('.backdrop canvas')
  for (let i = 0; i < 100; i++) {
    if (await canvas.evaluate((c) => c.classList.contains('ready'))) break
    await page.clock.runFor(16)
  }
  await expect(canvas).toHaveClass('ready')
}
