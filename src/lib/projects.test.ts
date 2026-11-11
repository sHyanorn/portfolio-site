import { describe, expect, it } from 'vitest'
import { byOrder, repoName } from './projects'

const project = (id: string, order: number) => ({ id, data: { order } })

describe('byOrder', () => {
  it('sorts by order, whatever the input order', () => {
    const sorted = byOrder([project('b', 2), project('c', 3), project('a', 1)])
    expect(sorted.map((p) => p.id)).toEqual(['a', 'b', 'c'])
  })

  it('fails on two projects with the same order', () => {
    expect(() => byOrder([project('a', 1), project('b', 1)])).toThrow(
      'Projects a and b share order 1',
    )
  })
})

describe('repoName', () => {
  it('is the last part of the address', () => {
    expect(repoName('https://github.com/sHyanorn/recserve')).toBe('recserve')
    expect(repoName('https://github.com/sHyanorn/recserve/')).toBe('recserve')
  })
})
