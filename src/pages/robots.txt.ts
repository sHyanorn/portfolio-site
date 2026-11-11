// Crawlers read robots.txt only at the host root, where the site now lives
// (D021). It names the sitemap index, as in Astro's sitemap guide.
import type { APIRoute } from 'astro'
import { withBase } from '../lib/paths'

export const GET: APIRoute = ({ site }) =>
  new Response(
    `Sitemap: ${new URL(withBase('sitemap-index.xml'), site).href}\n`,
  )
