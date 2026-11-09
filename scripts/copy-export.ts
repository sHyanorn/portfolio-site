// Writes the text of project pages for review as two files, one per
// language, with the same numbered paragraphs in each:
// artifacts/copy-en.md and artifacts/copy-zh.md.
// Usage: node scripts/copy-export.ts <project> [<project> ...]
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

type Lang = 'en' | 'zh'
interface Entry {
  path: string
  text: Record<Lang, string>
}

const isPair = (v: unknown): v is Record<Lang, string> =>
  typeof v === 'object' &&
  v !== null &&
  Object.keys(v).sort().join() === 'en,zh' &&
  Object.values(v).every((s) => typeof s === 'string')

/** Every { en, zh } pair in document order, with the path that leads to it. */
function pairs(value: unknown, path: string): Entry[] {
  if (isPair(value)) return [{ path, text: value }]
  if (Array.isArray(value))
    return value.flatMap((v, i) => pairs(v, `${path}[${i}]`))
  if (typeof value === 'object' && value !== null)
    return Object.entries(value).flatMap(([k, v]) =>
      pairs(v, path ? `${path}.${k}` : k),
    )
  return []
}

const projects = process.argv.slice(2)
if (projects.length === 0) {
  console.error('Usage: node scripts/copy-export.ts <project> [<project> ...]')
  process.exit(1)
}

const out: Record<Lang, string[]> = { en: [], zh: [] }
for (const id of projects) {
  const data = JSON.parse(
    readFileSync(`src/content/projects/${id}.json`, 'utf8'),
  )
  for (const lang of ['en', 'zh'] as const) {
    out[lang].push(`## ${id}`, '')
    pairs(data, '').forEach((e, i) =>
      out[lang].push(`${i + 1}. \`${e.path}\` ${e.text[lang]}`, ''),
    )
  }
}

mkdirSync('artifacts', { recursive: true })
for (const lang of ['en', 'zh'] as const)
  writeFileSync(`artifacts/copy-${lang}.md`, out[lang].join('\n'))
console.log('Wrote artifacts/copy-en.md and artifacts/copy-zh.md')
