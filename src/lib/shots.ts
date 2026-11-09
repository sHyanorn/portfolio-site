import type { ImageMetadata } from 'astro'

/** The width each demo screenshot is shown at (D013, D020): the first fills
 * the column, or the intro's neighbour from 64rem up; later ones sit two a
 * row from 48rem up. */
const SIZES = {
  first: '(min-width: 64rem) 710px, 100vw',
  rest: '(min-width: 80rem) 616px, (min-width: 48rem) 50vw, 100vw',
}

/** A demo screenshot as AVIF in 358, 720 and 1440 px widths, the largest
 * capped at the source width (D013). The page and its preload use the same
 * options, so they ask for the same files. */
export const shotImage = (
  src: ImageMetadata,
  part: keyof typeof SIZES = 'first',
) => ({
  src,
  format: 'avif' as const,
  widths: [
    ...[358, 720].filter((w) => w < src.width),
    Math.min(src.width, 1440),
  ],
  sizes: SIZES[part],
})

/** A screenshot and its dark copy, if it has one, each with the theme it
 * shows under. The page sizes both by one aspect ratio, so the copy must
 * have the screenshot's size (D013). The check lives here because the
 * content schema sees image paths, not their sizes. */
export function themeCopies({
  src,
  dark,
}: {
  src: ImageMetadata
  dark?: ImageMetadata
}): { src: ImageMetadata; theme?: 'light' | 'dark' }[] {
  if (!dark) return [{ src, theme: undefined }]
  if (dark.width !== src.width || dark.height !== src.height)
    throw new Error(
      `${dark.src} is ${dark.width}×${dark.height}, but ${src.src} is ${src.width}×${src.height}`,
    )
  return [
    { src, theme: 'light' },
    { src: dark, theme: 'dark' },
  ]
}
