import { existsSync, readFileSync } from 'node:fs'
import { expect, it } from 'vitest'
import { LANGS } from '../src/lib/i18n'
import { TEXT_FILE, imageFile, siteText } from './site-image'

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
