import { describe, expect, it } from 'vitest'
import { withBase } from './paths'

describe('withBase', () => {
  it.each([
    ['/', '/', '/'],
    ['/', 'rss.xml', '/rss.xml'],
    ['/', '/articles/', '/articles/'],
    ['/ci-base/', '', '/ci-base/'],
    ['/ci-base/', '/', '/ci-base/'],
    ['/ci-base', 'articles/', '/ci-base/articles/'],
    ['/ci-base/', '/favicon.svg', '/ci-base/favicon.svg'],
  ])('base %s + %s = %s', (base, path, expected) => {
    expect(withBase(path, base)).toBe(expected)
  })
})
