// The degree's year range stays on one line at the narrowest width, and the
// text holds no invisible characters that copying would carry along.
import { expect, test } from '@playwright/test'
import { BASE } from './site'

test.use({ viewport: { width: 320, height: 640 } })

for (const path of [`${BASE}about/`, `${BASE}zh/about/`])
  test(`${path}: year range on one line`, async ({ page }) => {
    await page.goto(path)
    const years = page.locator('.years')
    await expect(years).toHaveText('2024–2027')
    expect(await years.evaluate((el) => el.getClientRects().length)).toBe(1)
    // No spaces from markup line breaks around the range.
    await expect(page.locator('.meta')).not.toHaveText(/\s{2}|\s，|，\s/)
    const text = await page.locator('main').innerText()
    expect(text).not.toMatch(/[​-‍⁠﻿]/)
  })
