import { readFileSync } from 'node:fs'
import sharp from 'sharp'

/** The size Open Graph and large Twitter cards ask for. */
const W = 1200
const H = 630
const PAD = 48
const RADIUS = 12

/** A `light-dark()` colour token, as `[light, dark]`. Builds and tests run
 * from the project root. */
const tokens = readFileSync('src/styles/tokens.css', 'utf8')
function token(name: string): [string, string] {
  const m = new RegExp(`${name}: light-dark\\((#\\w+), (#\\w+)\\)`).exec(tokens)
  if (!m) throw new Error(`${name} is not a light-dark() pair`)
  return [m[1], m[2]]
}
const [bg, line] = [token('--color-bg'), token('--color-line')]
const THEME = {
  light: { bg: bg[0], line: line[0] },
  dark: { bg: bg[1], line: line[1] },
}

/**
 * A project's share image: its demo poster or first screenshot, whole, as a
 * card on the page background of its own lightness. The source is scaled
 * down to fit and never up, so a small one stays sharp.
 */
export async function shareImage(file: string): Promise<Buffer> {
  const { width, height } = await sharp(file).metadata()
  const scale = Math.min(1, (W - 2 * PAD) / width, (H - 2 * PAD) / height)
  const w = Math.round(width * scale)
  const h = Math.round(height * scale)
  const [r, g = r, b = r] = (await sharp(file).stats()).channels
  const luma = 0.2126 * r.mean + 0.7152 * g.mean + 0.0722 * b.mean
  const theme = THEME[luma < 128 ? 'dark' : 'light']
  const svg = (body: string) =>
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${body}</svg>`,
    )
  const card = await sharp(file)
    .resize(w, h)
    .composite([
      {
        input: svg(`<rect width="${w}" height="${h}" rx="${RADIUS}"/>`),
        blend: 'dest-in',
      },
      {
        input: svg(
          `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="${RADIUS - 0.5}" fill="none" stroke="${theme.line}"/>`,
        ),
      },
    ])
    .png()
    .toBuffer()
  return sharp({
    create: { width: W, height: H, channels: 3, background: theme.bg },
  })
    .composite([
      {
        input: card,
        left: Math.round((W - w) / 2),
        top: Math.round((H - h) / 2),
      },
    ])
    .png()
    .toBuffer()
}
