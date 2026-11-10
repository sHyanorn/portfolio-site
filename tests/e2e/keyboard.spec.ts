// Keyboard use on every page: the first Tab shows the skip link, which moves
// the next stop past the header; every stop is on screen once focused and
// draws a focus ring until the walk reaches the footer, and no element
// changes the tab order with a positive tabindex.
import { expect, test } from '@playwright/test'
import sharp from 'sharp'
import { BASE, pages } from './site'

for (const { name, path } of pages)
  test(`${name}: keyboard walk`, async ({ page }) => {
    // Each stop is measured as soon as it has focus, and with motion on the
    // page would still be scrolling to it (D014).
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(path)
    expect(
      await page
        .locator('[tabindex]:not([tabindex^="-"])')
        .evaluateAll((els) => els.filter((el) => el.tabIndex > 0).length),
    ).toBe(0)

    await page.keyboard.press('Tab')
    const skip = page.locator('a.skip')
    await expect(skip).toBeFocused()
    await expect(skip).toBeInViewport({ ratio: 1 })
    await page.keyboard.press('Enter')
    await page.keyboard.press('Tab')
    expect(
      await page.evaluate(() => {
        const el = document.activeElement!
        const main = document.querySelector('main')!
        return (
          main.contains(el) ||
          !!(
            main.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING
          )
        )
      }),
      'the stop after the skip link is in or after main',
    ).toBe(true)

    await page.locator('a.skip').focus()
    let end = false
    for (let i = 0; i < 60; i++) {
      await page.keyboard.press('Tab')
      const stop = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null
        if (!el || el === document.body) return null
        const drawn = (s: CSSStyleDeclaration) =>
          s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2
        const r = el.getBoundingClientRect()
        return {
          id: `${el.tagName} ${el.getAttribute('href') ?? ''} ${el.textContent?.trim()}`,
          // A video's own controls draw their ring inside its shadow tree.
          ring:
            el.tagName === 'VIDEO' ||
            drawn(getComputedStyle(el)) ||
            drawn(getComputedStyle(el, '::after')),
          onScreen:
            r.width > 0 &&
            r.bottom > 0 &&
            r.top < innerHeight &&
            r.right > 0 &&
            r.left < innerWidth,
          last: el.matches('footer li:last-child a'),
        }
      })
      if (!stop) break
      expect(stop.ring, `${stop.id} draws a focus ring`).toBe(true)
      expect(stop.onScreen, `${stop.id} is on screen`).toBe(true)
      if ((end = stop.last)) break
    }
    expect(end, 'the walk reaches the footer').toBe(true)
  })

// A card's ring is drawn by its title link's ::after, so reading the computed
// outline cannot tell whether the card clips it: compare the pixels around
// each edge with the card focused and blurred.
for (const width of [1024, 1440])
  for (const colorScheme of ['light', 'dark'] as const)
    test(`${width} ${colorScheme}: home cards show the focus ring on every side`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' })
      await page.goto(BASE)
      const cards = page.locator('#projects .card')
      for (let i = 0; i < Math.min(2, await cards.count()); i++) {
        const card = cards.nth(i)
        await page.keyboard.press('Tab')
        await card.locator('h3 a').focus()
        await card.evaluate((el) => el.scrollIntoView({ block: 'center' }))
        const box = (await card.boundingBox())!
        const pad = 6
        const clip = {
          x: box.x - pad,
          y: box.y - pad,
          width: box.width + 2 * pad,
          height: box.height + 2 * pad,
        }
        const shot = async () =>
          sharp(await page.screenshot({ clip }))
            .removeAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true })
        const on = await shot()
        await card.locator('h3 a').blur()
        const off = await shot()
        const { width: w, height: h } = on.info
        const changed = (x: number, y: number) => {
          const o = (y * w + x) * 3
          return [0, 1, 2].some(
            (c) => Math.abs(on.data[o + c]! - off.data[o + c]!) > 40,
          )
        }
        // Each side: the share of points along the edge, past the rounded
        // corners, where some pixel within 5 px either side of it changed.
        const along = (n: number, hit: (t: number, d: number) => boolean) => {
          let seen = 0
          for (let t = 20; t < n - 20; t++)
            for (let d = 1; d <= 2 * pad - 1; d++)
              if (hit(t, d)) {
                seen++
                break
              }
          return seen / (n - 40)
        }
        const sides = {
          top: along(w, (x, d) => changed(x, d)),
          bottom: along(w, (x, d) => changed(x, h - 1 - d)),
          left: along(h, (y, d) => changed(d, y)),
          right: along(h, (y, d) => changed(w - 1 - d, y)),
        }
        for (const [side, share] of Object.entries(sides))
          expect(share, `card ${i + 1} ${side}`).toBeGreaterThan(0.95)
      }
    })
