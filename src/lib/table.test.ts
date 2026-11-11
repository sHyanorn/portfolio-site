import type { Element, Root } from 'hast'
import { describe, expect, it } from 'vitest'
import { rehypeCornerCell } from './table'

const cell = (tagName: string, text?: string): Element => ({
  type: 'element',
  tagName,
  properties: {},
  children: text === undefined ? [] : [{ type: 'text', value: text }],
})

describe('rehypeCornerCell', () => {
  it('makes an empty header cell a data cell and leaves the others', () => {
    const row: Element = {
      type: 'element',
      tagName: 'tr',
      properties: {},
      children: [cell('th'), cell('th', ' '), cell('th', 'All'), cell('td')],
    }
    const tree: Root = { type: 'root', children: [row] }
    rehypeCornerCell()(tree)
    expect(row.children.map((c) => (c as Element).tagName)).toEqual([
      'td',
      'td',
      'th',
      'td',
    ])
  })
})
