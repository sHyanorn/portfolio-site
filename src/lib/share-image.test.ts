import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import { shareImage } from './share-image'

const DIR = 'src/content/projects'

/** The colour of one pixel, as hex. */
async function pixel(png: Buffer, x: number, y: number) {
  const { data } = await sharp(png)
    .extract({ left: x, top: y, width: 1, height: 1 })
    .raw()
    .toBuffer({ resolveWithObject: true })
  return `#${[...data.subarray(0, 3)].map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

describe('shareImage', () => {
  it.each([
    // A dark source too small to fill the card goes on the dark page colour.
    ['matching-engine/demo-poster.png', '#111113'],
    ['vault-share/demo-poster.png', '#fcfcfd'],
    // A large one is scaled down, never cropped.
    ['backtest-lab/random-control.png', '#fcfcfd'],
  ])('%s is 1200×630 on %s', async (file, bg) => {
    const png = await shareImage(`${DIR}/${file}`)
    expect(await sharp(png).metadata()).toMatchObject({
      format: 'png',
      width: 1200,
      height: 630,
    })
    expect(await pixel(png, 0, 0)).toBe(bg)
    expect(await pixel(png, 1199, 629)).toBe(bg)
  })

  it('gives the same bytes for the same source', async () => {
    const file = `${DIR}/local-ledger/overview-light.png`
    expect((await shareImage(file)).equals(await shareImage(file))).toBe(true)
  })
})
