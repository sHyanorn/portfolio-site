// Checks a deployed site: every page answers 200, every same-site link and
// asset keeps the base and answers 200, a missing path serves the 404 page,
// paths without a trailing slash redirect, and the feed's links all start
// with the site address. Usage: node scripts/check-live.mjs <site URL>
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
for (const p of pages) {
  const url = new URL(p, site)
  const res = await get(url)
  report(res.status === 200, `${res.status} ${url.pathname}`)
  const html = await res.text()
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
