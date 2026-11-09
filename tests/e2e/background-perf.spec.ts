// What the home page background costs a slow phone (D015). Runs only with
// PERF=1: two phone screens, the CPU slowed 4 and 6 times through the Chrome
// DevTools Protocol, 10 s each. The page reports a hardware renderer, so the
// animation runs on whatever renderer the browser has, usually a software
// one in tests, which is the worst case. The loop must hold its pace or stop
// itself; the blocking time, draws and frame pace are printed for the record.
import { expect, test } from '@playwright/test'
import { fakeRenderer, GPU, instrument } from './gl'
import { BASE } from './site'

declare global {
  interface Window {
    /** Durations of the long tasks so far, in milliseconds. */
    longTasks: number[]
  }
}

test.skip(!process.env.PERF, 'set PERF=1 to run')

const phones = [
  { width: 390, height: 844, deviceScaleFactor: 3 },
  { width: 412, height: 823, deviceScaleFactor: 1.75 },
]

for (const { width, height, deviceScaleFactor } of phones)
  for (const rate of [4, 6])
    test(`${width}×${height} at ${deviceScaleFactor}x, CPU slowed ${rate} times`, async ({
      browser,
    }) => {
      test.setTimeout(60_000)
      const context = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor,
        isMobile: true,
        hasTouch: true,
      })
      const page = await context.newPage()
      await page.addInitScript(instrument)
      await page.addInitScript(fakeRenderer, GPU)
      await page.addInitScript(() => {
        window.longTasks = []
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries())
            window.longTasks.push(entry.duration)
        }).observe({ type: 'longtask', buffered: true })
      })
      const cdp = await context.newCDPSession(page)
      await cdp.send('Emulation.setCPUThrottlingRate', { rate })

      await page.goto(BASE)
      await expect(page.locator('.backdrop canvas')).toHaveClass('ready')
      const sample = () =>
        page.evaluate(() => ({
          draws: window.draws,
          time: window.uniforms.u_time?.[0] ?? 0,
          longTasks: window.longTasks,
        }))
      await page.waitForTimeout(8000)
      const before = await sample()
      await page.waitForTimeout(2000)
      const after = await sample()

      const blocking = after.longTasks.reduce(
        (sum, d) => sum + Math.max(0, d - 50),
        0,
      )
      const lastTwoSeconds = after.draws - before.draws
      console.log(
        `${width}×${height}@${deviceScaleFactor}x ÷${rate}: ` +
          `${after.draws} draws, ${lastTwoSeconds} in the last 2 s, ` +
          `${after.time.toFixed(2)} s of animation, ` +
          `${after.longTasks.length} long tasks, ${Math.round(blocking)} ms blocking`,
      )
      // Either the loop keeps at least 20 frames a second or it has stopped.
      expect(lastTwoSeconds === 0 || lastTwoSeconds >= 40).toBe(true)
      await context.close()
    })
