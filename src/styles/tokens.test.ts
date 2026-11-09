// The home page background mixes only its three colour tokens (D015), so text
// over any frame keeps the contrast these tests find for the palette.
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8')
const tokens = new Map(
  [...css.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [
    name,
    value.trim(),
  ]),
)

type Scheme = 'light' | 'dark'
type Rgb = [number, number, number]

/** A colour token in one scheme, following var() references. */
function rgb(name: string, scheme: Scheme): Rgb {
  const value = tokens.get(name) ?? ''
  const ref = /^var\((--[\w-]+)\)$/.exec(value)
  if (ref) return rgb(ref[1], scheme)
  const pair = /^light-dark\((#\w{6}),\s*(#\w{6})\)$/.exec(value)
  const hex = pair ? pair[scheme === 'light' ? 1 : 2] : value
  if (!/^#[\da-f]{6}$/i.test(hex)) throw new Error(`${name}: ${value}`)
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as Rgb
}

/** WCAG 2.2 relative luminance. */
function luminance(color: Rgb): number {
  const [r, g, b] = color.map((c) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const BACKDROP = [
  '--color-backdrop',
  '--color-backdrop-tint',
  '--color-backdrop-strong',
]
const TEXT = ['--color-text', '--color-text-muted', '--color-accent']
const cases = (['light', 'dark'] as const).flatMap((scheme) =>
  TEXT.map((text) => [scheme, text] as const),
)

describe('background palette', () => {
  it('is the page background, indigo 3 and indigo 4 (Radix Colors 3.0)', () => {
    const hex = (scheme: Scheme) =>
      BACKDROP.map((t) =>
        rgb(t, scheme)
          .map((c) => c.toString(16).padStart(2, '0'))
          .join(''),
      )
    expect(hex('light')).toEqual(['fcfcfd', 'edf2fe', 'e1e9ff'])
    expect(hex('dark')).toEqual(['111113', '182449', '1d2e62'])
  })

  // A frame mixes these colours and adds under one 8-bit step of dither, so
  // each channel stays within one step of the palette's range. Luminance
  // grows with every channel, so the darkest and lightest corners of that
  // box bound the luminance of any pixel the shader or the fallback draws.
  it.each(cases)('%s: %s keeps 4.5:1 on any frame', (scheme, text) => {
    const palette = BACKDROP.map((t) => rgb(t, scheme))
    const corner = (pick: (...c: number[]) => number, step: number) =>
      [0, 1, 2].map((i) =>
        Math.min(255, Math.max(0, pick(...palette.map((c) => c[i])) + step)),
      ) as Rgb
    const low = luminance(corner(Math.min, -1))
    const high = luminance(corner(Math.max, 1))
    const fg = luminance(rgb(text, scheme))

    // Text on one side of the whole range; then the nearer end is the worst.
    expect(fg < low || fg > high, 'text inside the background range').toBe(true)
    const worst =
      fg < low ? (low + 0.05) / (fg + 0.05) : (fg + 0.05) / (high + 0.05)
    expect(worst).toBeGreaterThanOrEqual(4.5)
  })
})
