import mdx from '@astrojs/mdx'
import { unified } from '@astrojs/markdown-remark'
import { defineConfig } from 'astro/config'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import { remarkReadingTime } from './src/lib/reading-time'

// Deploys take both from the GitHub Pages configuration (D007); local builds serve from the root.
const site = process.env.SITE_URL || 'http://localhost:4321'
const base = process.env.BASE_PATH || '/'

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  // HTML whitespace rules, which Prettier assumes when it formats .astro files (D006).
  compressHTML: true,
  // English at the root, Chinese under /zh/ (D011).
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: { prefixDefaultLocale: false },
  },
  // Articles (D005): MDX through the unified pipeline, with math, reading
  // time and highlighting at build time, so they add no client JS.
  integrations: [mdx()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkReadingTime],
      rehypePlugins: [rehypeKatex],
    }),
    // Both themes as CSS variables; base.css picks one by colour scheme.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
})
