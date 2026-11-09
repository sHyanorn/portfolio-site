import { describe, expect, it } from 'vitest'
import { readingMinutes } from './reading-time'

const words = (n: number) => Array.from({ length: n }, () => 'word').join(' ')

describe('readingMinutes', () => {
  it.each([
    [0, 1],
    [1, 1],
    [230, 1],
    [231, 2],
    [1403, 7],
  ])('%i words take %i min', (n, minutes) => {
    expect(readingMinutes(words(n))).toBe(minutes)
  })

  it('counts words across line breaks and runs of spaces', () => {
    expect(readingMinutes(`${words(200)}\n\n  ${words(31)}`)).toBe(2)
  })
})
