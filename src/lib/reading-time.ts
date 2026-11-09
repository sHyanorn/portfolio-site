import type { Root } from 'mdast'
import { toString } from 'mdast-util-to-string'

/** Words read a minute (SPEC §3). */
export const WORDS_PER_MINUTE = 230

/** Whole minutes to read `text`, at least one. */
export function readingMinutes(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

/**
 * Remark plugin that adds `minutes` to the frontmatter, as in Astro's
 * "Add reading time" recipe.
 */
export function remarkReadingTime() {
  return (tree: Root, file: { data: Record<string, unknown> }) => {
    const astro = (file.data.astro ??= {}) as {
      frontmatter?: Record<string, unknown>
    }
    astro.frontmatter = {
      ...astro.frontmatter,
      minutes: readingMinutes(toString(tree)),
    }
  }
}
