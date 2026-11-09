// Prints the scores of the representative runs saved by `lhci upload`.
import { existsSync, readFileSync } from 'node:fs'

interface Run {
  url: string
  isRepresentativeRun: boolean
  summary: Record<string, number>
}

const categories = ['performance', 'accessibility', 'best-practices', 'seo']

console.log(`preset   ${categories.join(' / ')}  page`)
for (const preset of ['mobile', 'desktop']) {
  const file = `.lighthouseci/${preset}/manifest.json`
  if (!existsSync(file)) continue
  const runs: Run[] = JSON.parse(readFileSync(file, 'utf8'))
  for (const run of runs.filter((r) => r.isRepresentativeRun)) {
    const scores = categories.map((c) => Math.round(run.summary[c] * 100))
    console.log(
      `${preset.padEnd(8)} ${scores.join(' / ')}  ${new URL(run.url).pathname}`,
    )
  }
}
