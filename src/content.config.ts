import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

/** Text a page shows, in both languages. Backticks mark inline code. */
const text = z.strictObject({ en: z.string().min(1), zh: z.string().min(1) })

/** A titled paragraph, such as a decision or a challenge. */
const item = z.strictObject({ title: text, body: text })

/** One file per project; the page follows the eight sections of SPEC §2 (D012). */
const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.strictObject({
      /** The repository name, the title in both languages. */
      title: z.string(),
      // 1. Summary and tags
      summary: text,
      tags: z.array(text).min(1),
      // 2. Demo: an MP4 under public/, with a poster of the same size
      demo: z.strictObject({
        video: z.string().regex(/^[\w/-]+\.mp4$/),
        poster: image(),
        caption: text,
      }),
      // 3. Key metrics, linked to where they were measured
      metrics: z.strictObject({
        items: z
          .array(z.strictObject({ value: text, label: text }))
          .min(2)
          .max(6),
        source: z.url(),
      }),
      // 4. Problem and goals, one entry per paragraph
      problem: z.array(text).min(1),
      // 5. Architecture: the diagram's labels and the same picture in words
      architecture: z.strictObject({
        labels: z.record(z.string(), text),
        description: text,
      }),
      // 6. Three to five decisions from the repository's decision log
      decisions: z.strictObject({
        items: z
          .array(item.extend({ id: z.string().regex(/^D\d{3}$/) }))
          .min(3)
          .max(5),
        source: z.url(),
      }),
      // 7. Challenges and how they were solved
      challenges: z.array(item).min(1),
      // 8. Links
      repo: z.url(),
    }),
})

export const collections = { projects }
