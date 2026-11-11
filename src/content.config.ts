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
      // 2. Demo: an MP4 under public/ with a poster of the same size, or
      // three screenshots for a project with no browser demo, each with an
      // optional dark-theme copy of the same size (D013, D020)
      demo: z.union([
        z.strictObject({
          video: z.string().regex(/^[\w/-]+\.mp4$/),
          poster: image(),
          caption: text,
        }),
        z.strictObject({
          images: z
            .array(
              // themeCopies() in src/lib/shots.ts checks the dark copy's
              // size, which is not known here.
              z.strictObject({
                src: image(),
                dark: image().optional(),
                alt: text,
                caption: text,
              }),
            )
            // The first beside the intro, the other two a row under it.
            .length(3),
        }),
      ]),
      // 3. Key metrics, the conditions they were measured under, and the report
      metrics: z.strictObject({
        items: z
          .array(z.strictObject({ value: text, label: text }))
          // Two a row, or one row of four on a wide screen.
          .length(4),
        note: text,
        /** The report the numbers come from, named as the project names it. */
        source: z.strictObject({ label: text, url: z.url() }),
      }),
      // 4. Problem and goals, one entry per paragraph
      problem: z.array(text).min(1),
      // 5. Architecture: the diagram's labels and the same picture in words
      architecture: z.strictObject({
        labels: z.record(z.string(), text),
        description: text,
      }),
      // 6. Three to five decisions from the repository's decision log, or,
      // for a pre-registered study, rules from its registration (`§4`, `H3`)
      // and amendments (`A7`)
      decisions: z.strictObject({
        items: z
          .array(
            item.extend({ id: z.string().regex(/^(D\d{3}|§\d+|H\d|A\d+)$/) }),
          )
          .min(3)
          .max(5),
        source: z.url(),
      }),
      // 7. Challenges and how they were solved
      challenges: z.array(item).min(1),
      // 8. Links
      repo: z.url(),
      /** Titles a study gives sections 6 and 7 and the link under section 6,
       * in place of "Key decisions", "Challenges" and "Decision log". */
      headings: z
        .strictObject({ decisions: text, decisionLog: text, challenges: text })
        .optional(),
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
      /** Shown with the article: a paper is a preprint or a submitted or
       * published paper, a note is anything else. */
      kind: z.enum(['note', 'paper']),
      math: z.boolean(),
      draft: z.boolean().default(false),
    })
    // Unlike reference(), which only logs a missing entry, this fails the build (D012).
    .refine((a) => a.draft || projectIds.has(a.project), {
      message: 'names no project in src/content/projects',
      path: ['project'],
    }),
})

/** The home page's introduction (D017). */
const home = defineCollection({
  loader: glob({ pattern: 'home.json', base: './src/content/site' }),
  schema: z.strictObject({
    headline: text,
    intro: text,
    /** The four areas of the work, each a title and a sentence. */
    areas: z.array(item).length(4),
  }),
})

/** The About page (D017): education, the areas of the work with the
 * projects behind each, tools, and where the work sits. */
const about = defineCollection({
  loader: glob({ pattern: 'about.json', base: './src/content/site' }),
  schema: z.strictObject({
    education: z.strictObject({
      title: text,
      school: text,
      degree: text,
      location: text,
    }),
    areas: z
      .array(
        z.strictObject({
          title: text,
          items: z.array(text).min(1),
          /** Project ids, linked to their pages. */
          projects: z
            .array(
              z.string().refine((id) => projectIds.has(id), {
                message: 'names no project in src/content/projects',
              }),
            )
            .min(1),
        }),
      )
      .length(4),
    tools: z.strictObject({ title: text, body: text }),
    direction: z.strictObject({ title: text, body: text }),
  }),
})

export const collections = { projects, articles, home, about }
