// Every page but the 404 declares its two language versions with hreflang,
// and its language toggle leads to the other version (D011).
import { expect, test } from '@playwright/test'
import { BASE, pages } from './site'

const ZH = `${BASE}zh/`
const localized = pages.filter((p) => p.name !== '404')

test('every page has a version in the other language', () => {
  const paths = new Set(localized.map((p) => p.path))
  for (const p of localized) {
    const other = p.path.startsWith(ZH)
      ? BASE + p.path.slice(ZH.length)
      : ZH + p.path.slice(BASE.length)
    expect(paths, `counterpart of ${p.path}`).toContain(other)
  }
})

for (const p of localized) {
  test(`${p.name}: lang, hreflang and toggle`, async ({ page }) => {
    const zh = p.path.startsWith(ZH)
    const en = zh ? BASE + p.path.slice(ZH.length) : p.path
    const cn = zh ? p.path : ZH + p.path.slice(BASE.length)
    await page.goto(p.path)

    await expect(page.locator('html')).toHaveAttribute(
      'lang',
      zh ? 'zh-CN' : 'en',
    )
    const href = async (selector: string) =>
      new URL((await page.locator(selector).getAttribute('href')) ?? '')
        .pathname
    expect(await href('link[rel=canonical]')).toBe(p.path)
    expect(await href('link[rel=alternate][hreflang=en]')).toBe(en)
    expect(await href('link[rel=alternate][hreflang=zh-CN]')).toBe(cn)
    expect(await href('link[rel=alternate][hreflang=x-default]')).toBe(en)

    const toggle = page.locator(`header a[hreflang="${zh ? 'en' : 'zh-CN'}"]`)
    await expect(toggle).toHaveAttribute('href', zh ? en : cn)
    await expect(toggle).toHaveAttribute('lang', zh ? 'en' : 'zh-CN')
  })
}

test('the 404 page has no alternates or toggle', async ({ page }) => {
  await page.goto(`${BASE}404.html`)
  await expect(page.locator('link[rel=alternate]')).toHaveCount(0)
  await expect(page.locator('link[rel=canonical]')).toHaveCount(0)
  await expect(page.locator('header a[hreflang]')).toHaveCount(0)
})
