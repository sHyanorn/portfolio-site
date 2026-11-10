// Links within a page scroll smoothly, from a second after the page opens,
// unless the reader asks for reduced motion (D014).
import { expect, test } from '@playwright/test'
import { BASE } from './site'

test('scrolling is smooth only when motion is allowed', async ({ page }) => {
  await page.goto(BASE)
  const behavior = () =>
    page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    )
  await expect.poll(behavior).toBe('smooth')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  expect(await behavior()).toBe('auto')
})
