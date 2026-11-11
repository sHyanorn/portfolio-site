// Checks a deployed site: every page answers 200, every same-site link and
// asset keeps the base and answers 200, each page's share image is a
// 1200×630 PNG, a missing path serves the 404 page, paths without a trailing
// slash redirect, the sitemap lists every page, and the feed's links all
// start with the site address. Usage: node scripts/check-live.mjs <site URL>
import { pngSize } from './png-size.mjs'

const site = new URL(process.argv[2].replace(/\/?$/, '/'))
const base = site.pathname

// English routes; each also exists under zh/. Add new pages here.
const routes = [
  '',
  'about/',
  'articles/',
  'articles/cryptography-held/',
  'articles/locking-ends-a-process/',
  'articles/low-pbo-easy-question/',
  'articles/order-book-cpu/',
  'projects/backtest-lab/',
  'projects/local-ledger/',
  'projects/matching-engine/',
  'projects/ope-checks/',
  'projects/push-lab/',
  'projects/vault-share/',
]
const pages = routes.flatMap((r) => [r, `zh/${r}`])

let failures = 0
const report = (ok, msg) => {
  if (!ok) failures++
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`)
}
const get = (url) => fetch(url, { redirect: 'manual' })

const refs = new Map()
const images = new Set()
for (const p of pages) {
  const url = new URL(p, site)
  const res = await get(url)
  report(res.status === 200, `${res.status} ${url.pathname}`)
  const html = await res.text()
  const image = html.match(/property="og:image" content="([^"]*)"/)?.[1]
  report(!!image?.startsWith(site.href), `${url.pathname} og:image ${image}`)
  if (image) images.add(image)
  for (const [, name, value] of html.matchAll(
    /\s(href|src|srcset|poster|content)="([^"]*)"/g,
  )) {
    const values =
      name === 'srcset'
        ? value.split(',').map((s) => s.trim().split(/\s+/)[0])
        : [value]
    for (const v of values) {
      if (!v || v.startsWith('#') || v.startsWith('mailto:')) continue
      if (name === 'content' && !/^https?:\/\//.test(v)) continue
      if (/^https?:\/\//.test(v)) {
        const u = new URL(v)
        if (u.host !== site.host) continue
        report(u.pathname.startsWith(base), `absolute ${v} keeps the base`)
        refs.set(u.pathname, url.pathname)
      } else {
        report(v.startsWith(base), `link ${v} starts with ${base}`)
        refs.set(new URL(v, url).pathname, url.pathname)
      }
    }
  }
}
for (const [path, from] of refs) {
  const res = await get(new URL(path, site.origin))
  report(res.status === 200, `${res.status} ${path} (linked from ${from})`)
}

for (const image of images) {
  const res = await get(image)
  const size = pngSize(Buffer.from(await res.arrayBuffer()))
  report(
    res.status === 200 && size === '1200x630',
    `${res.status} ${image} is ${size ? `a ${size} PNG` : 'not a PNG'}`,
  )
}

// The sitemap: every page, each with its other language.
const index = await (await get(new URL('sitemap-index.xml', site))).text()
const locs = []
for (const [, map] of index.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const xml = await (await get(map)).text()
  for (const [, body] of xml.matchAll(/<url>(.*?)<\/url>/g))
    locs.push([
      body.match(/<loc>([^<]+)<\/loc>/)[1],
      body.match(/hreflang=/g)?.length ?? 0,
    ])
}
report(
  locs.length === pages.length &&
    pages.every((p) => locs.some(([loc]) => loc === new URL(p, site).href)) &&
    locs.every(([, alternates]) => alternates === 2),
  `sitemap lists ${locs.length} of ${pages.length} pages, each with both languages`,
)

// The feed: well formed at the level of its elements, one link and one guid
// per item, and every link and guid under the site address.
const feed = await get(new URL('rss.xml', site))
const xml = await feed.text()
report(feed.status === 200, `${feed.status} ${base}rss.xml`)
const count = (tag) => [
  xml.match(new RegExp(`<${tag}[\\s>]`, 'g'))?.length ?? 0,
  xml.match(new RegExp(`</${tag}>`, 'g'))?.length ?? 0,
]
const balanced = ['rss', 'channel', 'item', 'link', 'guid'].every((tag) => {
  const [open, close] = count(tag)
  return open === close
})
const [items] = count('item')
const links = [...xml.matchAll(/<link>([^<]*)<\/link>/g)].map((m) => m[1])
const guids = [...xml.matchAll(/<guid[^>]*>([^<]*)<\/guid>/g)].map((m) => m[1])
report(
  xml.startsWith('<?xml') && balanced && items > 0,
  `rss.xml is well formed with ${items} items`,
)
report(
  links.length === items + 1 && guids.length === items,
  `rss.xml has a channel link and a link and guid per item`,
)
for (const v of [...links, ...guids])
  report(v.startsWith(site.href), `feed ${v} starts with ${site.href}`)

const missing = await get(new URL('does-not-exist/', site))
report(
  missing.status === 404 && (await missing.text()).includes('Page not found'),
  `${missing.status} missing path serves the 404 page`,
)
for (const p of pages.filter(Boolean)) {
  const bare = p.replace(/\/$/, '')
  const res = await get(new URL(bare, site))
  const loc = res.headers.get('location') ?? ''
  report(
    res.status === 301 && new URL(loc, site).pathname === `${base}${p}`,
    `${res.status} ${base}${bare} -> ${loc}`,
  )
}
if (base !== '/') {
  const res = await get(site.href.replace(/\/$/, ''))
  report(
    res.status === 301,
    `${res.status} bare base -> ${res.headers.get('location')}`,
  )
}

console.log(failures ? `${failures} failed` : 'all passed')
process.exit(failures ? 1 : 0)
