import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { LANGS } from '../src/lib/i18n'
import { TEXT_FILE, builtBase, imageFile, siteText } from './site-image'

it.each(LANGS)('the %s site share image shows the current text', (lang) => {
  const saved = JSON.parse(readFileSync(TEXT_FILE, 'utf8'))
  expect(
    saved[lang],
    `${imageFile(lang)} shows older text: run \`npm run build && node scripts/site-image.ts\``,
  ).toEqual(siteText(lang))
})

it('keeps the captured text out of the published site', () => {
  expect(TEXT_FILE.startsWith('public/')).toBe(false)
  expect(existsSync('public/og/site.json')).toBe(false)
})

describe('builtBase', () => {
  it.each([
    ['/', '<link rel="stylesheet" href="/_astro/index.abc.css">'],
    [
      '/ci-base/',
      '<link rel="stylesheet" href="/ci-base/_astro/index.abc.css">',
    ],
  ])('reads %s from the stylesheet path', (base, html) => {
    expect(builtBase(html)).toBe(base)
  })

  it('gives null for a page without built assets', () => {
    expect(builtBase('<p>No styles</p>')).toBeNull()
  })
})
