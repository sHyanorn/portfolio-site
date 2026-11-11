// A screenshot opens enlarged on its page, in a modal dialog, and every way
// of closing it leaves the visitor where they were: the page's address, its
// scroll position and the focus on the screenshot.
import { expect, test, type Page } from '@playwright/test'
import { BASE } from './site'

const PATH = `${BASE}projects/ope-checks/`
const dialog = (page: Page) => page.locator('dialog.zoom')
// The screenshot under the first: reaching it scrolls the page.
const shot = (page: Page) => page.locator('.shots.rest a:visible').first()

/** The scroll position once fonts and pictures have stopped moving it. */
async function settled(page: Page) {
  await page.evaluate(() => document.fonts.ready)
  let last = -1
  await expect
    .poll(async () => {
      const now = await page.evaluate(() => scrollY)
      const same = now === last
      last = now
      return same
    })
    .toBe(true)
  return last
}

async function open(page: Page) {
  await page.goto(PATH, { waitUntil: 'networkidle' })
  await shot(page).scrollIntoViewIfNeeded()
  const before = await settled(page)
  expect(before).toBeGreaterThan(0)
  await shot(page).click()
  await expect(dialog(page)).toBeVisible()
  return before
}

async function expectBack(page: Page, scroll: number) {
  await expect(dialog(page)).toBeHidden()
  expect(new URL(page.url()).pathname).toBe(PATH)
  expect(await page.evaluate(() => scrollY)).toBe(scroll)
  await expect(shot(page)).toBeFocused()
}

for (const [width, height] of [
  [390, 844],
  [1440, 900],
]) {
  test.describe(`${width} px`, () => {
    test.use({ viewport: { width: width!, height: height! } })

    test('a screenshot opens on its page', async ({ page }) => {
      await open(page)
      expect(new URL(page.url()).pathname).toBe(PATH)
      const picture = dialog(page).locator('img')
      await expect(picture).toHaveJSProperty(
        'src',
        await shot(page).evaluate((a: HTMLAnchorElement) => a.href),
      )
      await expect
        .poll(() =>
          picture.evaluate((img: HTMLImageElement) => img.naturalWidth),
        )
        .toBeGreaterThan(0)
      // The whole picture fits the screen until it is enlarged.
      const box = (await picture.boundingBox())!
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(width!)
      expect(box.y + box.height).toBeLessThanOrEqual(height!)
      // The dialog is named by what the picture shows.
      await expect(dialog(page)).toHaveAttribute(
        'aria-label',
        (await shot(page).locator('img').getAttribute('alt'))!,
      )
    })

    test('the close button closes it', async ({ page }) => {
      const scroll = await open(page)
      const close = dialog(page).getByRole('button')
      await expect(close).toBeFocused()
      const box = (await close.boundingBox())!
      expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44)
      await close.click()
      await expectBack(page, scroll)
    })

    test('Escape closes it', async ({ page }) => {
      const scroll = await open(page)
      await page.keyboard.press('Escape')
      await expectBack(page, scroll)
    })

    test('a click beside the picture closes it', async ({ page }) => {
      const scroll = await open(page)
      await page.mouse.click(4, height! - 4)
      await expectBack(page, scroll)
    })

    test('Back closes it and stays on the page', async ({ page }) => {
      const scroll = await open(page)
      await page.goBack()
      await expectBack(page, scroll)
      // Closing took the dialog's entry out of the history: one more step
      // back leaves the page.
      await page.goBack()
      expect(page.url()).toBe('about:blank')
    })

    test('closing leaves no entry to go forward to', async ({ page }) => {
      const scroll = await open(page)
      await page.keyboard.press('Escape')
      await expectBack(page, scroll)
      await page.evaluate(() => history.forward())
      await page.waitForTimeout(300)
      await expect(dialog(page)).toBeHidden()
      expect(new URL(page.url()).pathname).toBe(PATH)
    })

    test('the keyboard opens it and stays inside', async ({ page }) => {
      await page.goto(PATH)
      await shot(page).focus()
      const scroll = await page.evaluate(() => scrollY)
      await page.keyboard.press('Enter')
      await expect(dialog(page)).toBeVisible()
      for (let i = 0; i < 3; i++) {
        await page.keyboard.press('Tab')
        expect(
          await page.evaluate(
            () =>
              !document.activeElement ||
              document.activeElement === document.body ||
              !!document.activeElement.closest('dialog.zoom'),
          ),
        ).toBe(true)
      }
      await page.keyboard.press('Escape')
      await expectBack(page, scroll)
    })

    test('the page under it does not scroll', async ({ page }) => {
      const scroll = await open(page)
      await page.mouse.move(width! / 2, height! / 2)
      await page.mouse.wheel(0, 600)
      await page.waitForTimeout(300)
      expect(await page.evaluate(() => scrollY)).toBe(scroll)
    })

    test('a click on the picture enlarges it, and another restores it', async ({
      page,
    }) => {
      await open(page)
      const picture = dialog(page).locator('img')
      await expect
        .poll(() =>
          picture.evaluate((img: HTMLImageElement) => img.naturalWidth),
        )
        .toBeGreaterThan(0)
      const fitted = (await picture.boundingBox())!.width
      await picture.click()
      await expect(dialog(page)).toBeVisible()
      const natural = await picture.evaluate(
        (img: HTMLImageElement) => img.naturalWidth,
      )
      const enlarged = (await picture.boundingBox())!.width
      expect(Math.round(enlarged)).toBe(Math.min(2 * width!, natural))
      // A phone shows it wider than the screen, to be scrolled sideways.
      if (width! < 600) {
        expect(enlarged).toBeGreaterThan(width!)
        expect(
          await dialog(page).evaluate((d) => d.scrollWidth > d.clientWidth),
        ).toBe(true)
      }
      await picture.click({ position: { x: 5, y: 5 } })
      expect((await picture.boundingBox())!.width).toBe(fitted)
    })
  })
}

for (const colorScheme of ['light', 'dark'] as const)
  test(`${colorScheme}: the enlarged picture is the theme's copy`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme })
    await open(page)
    await expect(dialog(page).locator('img')).toHaveAttribute(
      'src',
      new RegExp(`-${colorScheme}\\.`),
    )
  })

test('zh: the close button is named in Chinese', async ({ page }) => {
  await page.goto(`${BASE}zh/projects/ope-checks/`)
  await shot(page).click()
  await expect(dialog(page).getByRole('button')).toHaveAccessibleName('关闭')
})

// A click that asks for a new tab is not taken over: the page's handler
// leaves its default action alone. The event is made here, so that no tab
// has to open, and a listener after the page's own reports what it did.
test('a modified click is left to the browser', async ({ page }) => {
  await page.goto(PATH)
  const taken = (ctrlKey: boolean) =>
    shot(page).evaluate((a, ctrlKey) => {
      let prevented = false
      addEventListener(
        'click',
        (event) => {
          prevented = event.defaultPrevented
          event.preventDefault()
        },
        { once: true },
      )
      a.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey }),
      )
      return prevented
    }, ctrlKey)
  expect(await taken(true)).toBe(false)
  await expect(dialog(page)).toBeHidden()
  expect(await taken(false)).toBe(true)
  await expect(dialog(page)).toBeVisible()
})

test.describe('without scripts', () => {
  test.use({ javaScriptEnabled: false })

  test('a screenshot is a link to its full-size copy', async ({ page }) => {
    await page.goto(PATH)
    await expect(shot(page)).toHaveAttribute('href', /\.avif$/)
  })
})
