// The home pages list every project, in the order its content file gives.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import { BASE } from './site'

const CONTENT = 'src/content/projects'
const titles = readdirSync(CONTENT)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join(CONTENT, f), 'utf8')))
  .sort((a, b) => a.order - b.order)
  .map((p) => p.title as string)

for (const path of [BASE, `${BASE}zh/`])
  test(`${path}: project cards follow their order`, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator('#projects h3')).toHaveText(titles)
  })
