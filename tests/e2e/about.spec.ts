// The degree's year range stays on one line at the narrowest width, and the
// text holds no invisible characters that copying would carry along. Each
// area names its projects, by page or by repository, and the earlier
// projects follow the areas.
import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { BASE } from './site'

const about = JSON.parse(readFileSync('src/content/site/about.json', 'utf8'))

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

for (const path of [`${BASE}about/`, `${BASE}zh/about/`])
  test(`${path}: areas link their projects and repositories`, async ({
    page,
  }) => {
    await page.goto(path)
    const zh = path.endsWith('zh/about/')
    await expect(
      page.locator('section[aria-labelledby^="area-"] h2'),
    ).toHaveText(
      about.areas.map((a: { title: Record<string, string> }) =>
        zh ? a.title.zh : a.title.en,
      ),
    )
    for (const [i, area] of about.areas.entries()) {
      const hrefs = await page
        .locator(`section[aria-labelledby="area-${i + 1}"] .projects a`)
        .evaluateAll((as) => as.map((a) => a.getAttribute('href')))
      expect(hrefs).toEqual([
        ...area.projects.map(
          (id: string) => `${BASE}${zh ? 'zh/' : ''}projects/${id}/`,
        ),
        ...(area.repos ?? []),
      ])
    }
    // Every project named in an area has a page.
    expect(
      about.areas.flatMap((a: { repos?: string[] }) => a.repos ?? []),
    ).toEqual([])
    // Earlier projects come after the last area and before the tools.
    const order = await page
      .locator('main section[aria-labelledby]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('aria-labelledby')))
    expect(order.slice(-3)).toEqual(['earlier', 'tools', 'direction'])
    await expect(page.locator('#earlier ~ ul a')).toHaveCount(3)
  })
