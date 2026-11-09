import { describe, expect, it } from 'vitest'
import { pagePath } from './i18n'

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
