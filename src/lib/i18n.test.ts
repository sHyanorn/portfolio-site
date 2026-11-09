import { describe, expect, it } from 'vitest'
import { formatDate, formatMinutes, pagePath } from './i18n'

describe('pagePath', () => {
  it.each([
    ['/', '/', ''],
    ['/', '/zh/', ''],
    ['/', '/projects/x/', 'projects/x/'],
    ['/', '/zh/projects/x/', 'projects/x/'],
    ['/b/', '/b/', ''],
    ['/b', '/b/zh/', ''],
    ['/b/', '/b/zh/projects/x/', 'projects/x/'],
    ['/b/', '/b/zhuyin/', 'zhuyin/'],
  ])('base %s, %s gives "%s"', (base, pathname, expected) => {
    expect(pagePath(pathname, base)).toBe(expected)
  })
})

describe('formatDate', () => {
  // YAML dates are UTC midnight; the day must not shift in any time zone.
  const date = new Date('2026-11-09')

  it.each([
    ['en', '9 Nov 2026'],
    ['zh', '2026年11月9日'],
  ] as const)('%s', (lang, expected) => {
    expect(formatDate(lang, date)).toBe(expected)
  })
})

describe('formatMinutes', () => {
  it.each([
    ['en', '6 min read'],
    ['zh', '阅读约 6 分钟'],
  ] as const)('%s', (lang, expected) => {
    expect(formatMinutes(lang, 6)).toBe(expected)
  })
})
