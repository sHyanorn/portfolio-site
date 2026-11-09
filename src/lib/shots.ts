import type { ImageMetadata } from 'astro'

/** A demo screenshot as AVIF in 358, 720 and 1440 px widths, the largest
 * capped at the source width (D013). The page and its preload use the same
 * options, so they ask for the same files. */
export const shotImage = (src: ImageMetadata) => ({
  src,
  format: 'avif' as const,
  widths: [
    ...[358, 720].filter((w) => w < src.width),
    Math.min(src.width, 1440),
  ],
  sizes: '(min-width: 768px) 720px, 100vw',
})
