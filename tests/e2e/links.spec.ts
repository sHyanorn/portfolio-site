// Every internal link and asset in the built pages resolves under the base
// path, so a link written without the base fails here.
import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { pages } from './site'

test('internal links and assets resolve', async ({ request }) => {
  const targets = new Map<string, string>()
  for (const p of pages) {
    const html = readFileSync(p.file, 'utf8')
    for (const [, name, value] of html.matchAll(
      /\s(href|src|srcset|poster)="([^"]*)"/g,
    )) {
      const refs =
        name === 'srcset'
          ? value.split(',').map((s) => s.trim().split(/\s+/)[0])
          : [value]
      for (const ref of refs) {
        if (!ref || ref.startsWith('#') || /^([a-z]+:|\/\/)/i.test(ref))
          continue
        const url = new URL(ref, `http://site${p.path}`)
        targets.set(url.pathname, p.path)
      }
    }
  }

  expect(targets.size).toBeGreaterThan(0)
  for (const [target, from] of targets) {
    const response = await request.get(target)
    expect(response.status(), `${target} (linked from ${from})`).toBe(200)
  }
})
