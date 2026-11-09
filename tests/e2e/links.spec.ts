// Every internal link and asset in the built pages resolves under the base
// path, so a link written without the base fails here, and every link to a
// fragment names an id on the page it points to.
import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { pages } from './site'

const html = new Map(pages.map((p) => [p.path, readFileSync(p.file, 'utf8')]))

/** The page-relative references in a page's links and assets. */
function refs(page: string): string[] {
  const found: string[] = []
  for (const [, name, value] of html
    .get(page)!
    .matchAll(/\s(href|src|srcset|poster)="([^"]*)"/g))
    found.push(
      ...(name === 'srcset'
        ? value.split(',').map((s) => s.trim().split(/\s+/)[0])
        : [value]),
    )
  return found.filter((ref) => ref && !/^([a-z]+:|\/\/)/i.test(ref))
}

test('internal links and assets resolve', async ({ request }) => {
  const targets = new Map<string, string>()
  for (const p of pages)
    for (const ref of refs(p.path)) {
      if (ref.startsWith('#')) continue
      const url = new URL(ref, `http://site${p.path}`)
      targets.set(url.pathname, p.path)
    }

  expect(targets.size).toBeGreaterThan(0)
  for (const [target, from] of targets) {
    const response = await request.get(target)
    expect(response.status(), `${target} (linked from ${from})`).toBe(200)
  }
})

test('links to a fragment name an id on their page', () => {
  // As html-proofer's internal hash check: the ids of every page, then each fragment.
  const ids = new Map(
    [...html].map(([path, source]) => [
      path,
      new Set([...source.matchAll(/\sid="([^"]*)"/g)].map((m) => m[1])),
    ]),
  )
  let checked = 0
  for (const p of pages)
    for (const ref of refs(p.path)) {
      const url = new URL(ref, `http://site${p.path}`)
      if (!url.hash) continue
      const target = ids.get(url.pathname)
      expect(target, `${ref} (linked from ${p.path})`).toBeDefined()
      expect(
        target!.has(decodeURIComponent(url.hash.slice(1))),
        `${ref} (linked from ${p.path})`,
      ).toBe(true)
      checked++
    }
  expect(checked).toBeGreaterThan(0)
})
