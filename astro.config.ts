import { defineConfig } from 'astro/config'

export default defineConfig({
  trailingSlash: 'always',
  // HTML whitespace rules, which Prettier assumes when it formats .astro files (D006).
  compressHTML: true,
})
