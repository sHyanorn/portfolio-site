import type { ImageMetadata } from 'astro'
import { describe, expect, it } from 'vitest'
import { themeCopies } from './shots'

const image = (name: string, width: number, height: number) =>
  ({ src: `/${name}.png`, width, height, format: 'png' }) as ImageMetadata

describe('themeCopies', () => {
  it('gives a screenshot alone without a theme', () => {
    const src = image('a', 800, 500)
    expect(themeCopies({ src })).toEqual([{ src, theme: undefined }])
  })

  it('pairs a screenshot with its dark copy', () => {
    const [src, dark] = [image('a', 800, 500), image('a-dark', 800, 500)]
    expect(themeCopies({ src, dark })).toEqual([
      { src, theme: 'light' },
      { src: dark, theme: 'dark' },
    ])
  })

  it('fails on a dark copy of another size', () => {
    expect(() =>
      themeCopies({ src: image('a', 800, 500), dark: image('b', 800, 520) }),
    ).toThrow('/b.png is 800×520, but /a.png is 800×500')
  })
})
