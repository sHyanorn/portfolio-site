/** Prefixes a site-root path with the configured base: `withBase('rss.xml')` gives `/ci-base/rss.xml`. */
export function withBase(
  path: string,
  base: string = import.meta.env.BASE_URL,
): string {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}
