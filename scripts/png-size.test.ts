import { describe, expect, it } from 'vitest'
import { pngSize } from './png-size.mjs'

/** The first 24 bytes of a PNG: signature, IHDR length and type, size. */
function header(width: number, height: number) {
  const b = Buffer.alloc(24)
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(b)
  b.write('IHDR', 12)
  b.writeUInt32BE(width, 16)
  b.writeUInt32BE(height, 20)
  return b
}

describe('pngSize', () => {
  it('reads the size from the header', () => {
    expect(pngSize(header(1200, 630))).toBe('1200x630')
  })

  it.each([
    ['empty', Buffer.alloc(0)],
    ['a redirect body', Buffer.from('Moved')],
    ['HTML', Buffer.from('<!doctype html><title>Not found</title>')],
  ])('gives null for %s', (_, body) => {
    expect(pngSize(body)).toBeNull()
  })
})
