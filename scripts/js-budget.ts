// Measures the JavaScript each built page loads before any interaction:
// its scripts, island code and their static imports, gzipped file by file.
import { readFileSync, readdirSync } from 'node:fs'
import { join, posix, relative, sep } from 'node:path'
import { gzipSync } from 'node:zlib'
import { init, parse } from 'es-module-lexer'

export const LIMIT = 150_000

export interface PageReport {
  page: string
  files: string[]
  bytes: number
}

const JS_TYPES = new Set(['', 'module', 'text/javascript'])

function attr(tag: string, name: string): string | undefined {
  return new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1]
}

function htmlFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((f) => f.endsWith('.html'))
    .map((f) => join(dir, f))
}

/** Maps a script URL to its path in dist, relative to dist. */
function toDistPath(url: string, base: string): string {
  const root = base.endsWith('/') ? base : `${base}/`
  if (!url.startsWith(root)) throw new Error(`script outside the site: ${url}`)
  return url.slice(root.length)
}

export async function measure(dist: string, base = '/'): Promise<PageReport[]> {
  await init
  const gzipped = (text: string) => gzipSync(text, { level: 9 }).length

  return htmlFiles(dist).map((file) => {
    const html = readFileSync(file, 'utf8')
    const entries: string[] = []
    let bytes = 0

    for (const [, tag, body] of html.matchAll(
      /(<script\b[^>]*>)([\s\S]*?)<\/script>/g,
    )) {
      if (!JS_TYPES.has(attr(tag, 'type') ?? '')) continue
      const src = attr(tag, 'src')
      if (src) entries.push(src)
      else if (body.trim()) bytes += gzipped(body)
    }
    for (const [tag] of html.matchAll(/<(?:link|astro-island)\b[^>]*>/g)) {
      if (tag.startsWith('<link') && attr(tag, 'rel') !== 'modulepreload')
        continue
      for (const name of ['href', 'component-url', 'renderer-url']) {
        const url = attr(tag, name)
        if (url) entries.push(url)
      }
    }

    // Follow static imports; dynamic imports load later and are not counted.
    const seen = new Set<string>()
    const queue = entries.map((url) => toDistPath(url, base))
    while (queue.length) {
      const path = queue.pop()!
      if (seen.has(path)) continue
      seen.add(path)
      const code = readFileSync(join(dist, path), 'utf8')
      bytes += gzipped(code)
      for (const imp of parse(code)[0]) {
        const isStatic = imp.type === 'static' || imp.type === 'reexport-star'
        if (isStatic && imp.specifier.startsWith('.'))
          queue.push(posix.join(posix.dirname(path), imp.specifier))
      }
    }

    return {
      page: relative(dist, file).split(sep).join('/'),
      files: [...seen].sort(),
      bytes,
    }
  })
}

if (import.meta.main) {
  const reports = await measure('dist', process.env.BASE_PATH || '/')
  for (const r of reports.sort((a, b) => a.page.localeCompare(b.page)))
    console.log(`${(r.bytes / 1000).toFixed(1).padStart(7)} kB  ${r.page}`)
  const over = reports.filter((r) => r.bytes > LIMIT)
  if (over.length) {
    console.error(
      `Over the ${LIMIT / 1000} kB budget: ${over.map((r) => r.page).join(', ')}`,
    )
    process.exit(1)
  }
}
