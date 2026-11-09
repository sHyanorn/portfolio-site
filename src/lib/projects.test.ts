import { describe, expect, it } from 'vitest'
import { byOrder } from './projects'

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
