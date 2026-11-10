import { readdirSync, readFileSync } from 'node:fs'
import type { SchemaContext } from 'astro:content'
import { z } from 'astro/zod'
import { describe, expect, it } from 'vitest'
import { collections } from './content.config'

// The schema with image paths taken as they are, and a project to vary.
const schema = (
  collections.projects.schema as (ctx: SchemaContext) => z.ZodType
)({ image: () => z.string() } as unknown as SchemaContext)
const read = (id: string) =>
  JSON.parse(readFileSync(`src/content/projects/${id}.json`, 'utf8'))

describe('project schema', () => {
  it('takes four metrics and no other number', () => {
    const p = read('matching-engine')
    expect(schema.safeParse(p).success).toBe(true)
    for (const n of [2, 3, 5, 6]) {
      const items = Array.from({ length: n }, () => p.metrics.items[0])
      expect(
        schema.safeParse({ ...p, metrics: { ...p.metrics, items } }).success,
        `${n} metrics`,
      ).toBe(false)
    }
  })

  it('takes three screenshots and no other number', () => {
    const p = read('local-ledger')
    expect(schema.safeParse(p).success).toBe(true)
    for (const n of [2, 4]) {
      const images = Array.from({ length: n }, () => p.demo.images[0])
      expect(
        schema.safeParse({ ...p, demo: { images } }).success,
        `${n} screenshots`,
      ).toBe(false)
    }
  })
})

describe('content text', () => {
  it('keeps numbers on the same line as their units', () => {
    const unit =
      /(?<![\w.])\d[\d.,]* (?:ms|µs|ns|s|MiB|KiB|GiB|kB|MB|GB|GHz|bps?|vCPUs?|px|万)(?![A-Za-z0-9])/g
    const files = readdirSync('src/content', {
      recursive: true,
      encoding: 'utf8',
    })
      .filter((f) => /\.(json|mdx)$/.test(f))
      .map((f) => `src/content/${f}`)
    const split = files.flatMap((f) =>
      (
        readFileSync(f, 'utf8')
          .replace(/```[\s\S]*?```|`[^`\n]*`/g, '')
          .match(unit) ?? []
      ).map((m) => `${f}: ${m}`),
    )
    expect(split).toEqual([])
  })
})
