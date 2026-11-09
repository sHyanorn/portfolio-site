import { defineConfig } from 'astro/config'

// Deploys take both from the GitHub Pages configuration (D007); local builds serve from the root.
const site = process.env.SITE_URL || 'http://localhost:4321'
const base = process.env.BASE_PATH || '/'

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  // HTML whitespace rules, which Prettier assumes when it formats .astro files (D006).
  compressHTML: true,
})
