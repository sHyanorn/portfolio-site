import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { unified } from '@astrojs/markdown-remark'
import { defineConfig } from 'astro/config'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import { LANG_TAG } from './src/lib/i18n'
import { remarkReadingTime } from './src/lib/reading-time'
import { rehypeCornerCell } from './src/lib/table'

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
  // time and highlighting at build time, so they add no client JS. The
  // sitemap pairs each page with its other language, as the page heads do.
  integrations: [
    mdx(),
    sitemap({ i18n: { defaultLocale: 'en', locales: LANG_TAG } }),
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkReadingTime],
      rehypePlugins: [rehypeKatex, rehypeCornerCell],
    }),
    // Both themes as CSS variables; base.css picks one by colour scheme.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
})
