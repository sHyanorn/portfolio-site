// The width and height in a PNG's header, as `1200x630`, or null for a body
// that is not a PNG, such as a redirect or an HTML error page.
const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

/** @param {Buffer} png @returns {string | null} */
export function pngSize(png) {
  if (png.length < 24 || !png.subarray(0, 8).equals(SIGNATURE)) return null
  return `${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`
}
