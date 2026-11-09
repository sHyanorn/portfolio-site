// Summarises artifacts/audit/*.json, written by the e2e page checks, as a
// Markdown table: one row per page, width and colour scheme.
import { readFileSync, readdirSync } from 'node:fs'
import type { OverflowReport } from '../tests/e2e/overflow.ts'

interface Audit {
  page: string
  width: number
  colorScheme: string
  overflow: OverflowReport
  axe: string[]
}

const dir = 'artifacts/audit'
const audits: Audit[] = readdirSync(dir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')))
  .sort(
    (a, b) =>
      a.page.localeCompare(b.page) ||
      a.width - b.width ||
      a.colorScheme.localeCompare(b.colorScheme),
  )

console.log(
  '| Page | Width | Scheme | Page overflow | Scroll containers (scrollWidth/clientWidth) | Other overflow | axe |',
)
console.log('|---|---|---|---|---|---|---|')
for (const a of audits) {
  const cells = (kind: (k: string) => boolean) =>
    a.overflow.rows
      .filter((r) => kind(r.kind))
      .map(
        (r) =>
          `${r.element} ${r.scrollWidth}/${r.clientWidth}${r.focusable ? '' : ' not focusable'}`,
      )
      .join('<br>') || 'none'
  console.log(
    `| ${a.page} | ${a.width} | ${a.colorScheme} | ${a.overflow.page} | ${cells((k) => k === 'scroll')} | ${cells((k) => k !== 'scroll')} | ${a.axe.join(', ') || '0'} |`,
  )
}
