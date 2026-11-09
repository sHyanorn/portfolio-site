import { describe, expect, it } from 'vitest'
import { withBase } from './paths'

describe('withBase', () => {
  it.each([
    ['/', '/', '/'],
    ['/', 'rss.xml', '/rss.xml'],
    ['/', '/articles/', '/articles/'],
    ['/portfolio-site/', '', '/portfolio-site/'],
    ['/portfolio-site/', '/', '/portfolio-site/'],
    ['/portfolio-site', 'articles/', '/portfolio-site/articles/'],
    ['/portfolio-site/', '/favicon.svg', '/portfolio-site/favicon.svg'],
  ])('base %s + %s = %s', (base, path, expected) => {
    expect(withBase(path, base)).toBe(expected)
  })
})
