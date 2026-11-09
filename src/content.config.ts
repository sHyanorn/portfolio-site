import { readdirSync } from 'node:fs'
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
      /** Place in project lists, from 1; no two projects share one. */
      order: z.number().int().positive(),
      // 1. Summary and tags
      summary: text,
      tags: z.array(text).min(1),
      // 2. Demo: an MP4 under public/, with a poster of the same size
      demo: z.strictObject({
        video: z.string().regex(/^[\w/-]+\.mp4$/),
        poster: image(),
        caption: text,
      }),
      // 3. Key metrics, the conditions they were measured under, and the report
      metrics: z.strictObject({
        items: z
          .array(z.strictObject({ value: text, label: text }))
          .min(2)
          .max(6),
        note: text,
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

/** Project ids, as the glob loader names them: the file name without `.json`. */
const projectIds = new Set(
  readdirSync('./src/content/projects')
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.slice(0, -'.json'.length)),
)

/**
 * One MDX file per article (D005), naming its project. A draft waits for its
 * project page: no page, list entry or feed item shows it.
 */
const articles = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/articles' }),
  schema: z
    .strictObject({
      title: z.string().min(1),
      /** The project's id, its file name in src/content/projects. */
      project: z.string(),
      date: z.coerce.date(),
      summary: z.string().min(1),
      math: z.boolean(),
      draft: z.boolean().default(false),
    })
    // Unlike reference(), which only logs a missing entry, this fails the build (D012).
    .refine((a) => a.draft || projectIds.has(a.project), {
      message: 'names no project in src/content/projects',
      path: ['project'],
    }),
})

export const collections = { projects, articles }
