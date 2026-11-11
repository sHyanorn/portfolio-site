// The share image of pages without their own (D018): the home page's first
// screen in each language, saved to public/og/, and the text it shows, saved
// beside this script for a unit test to compare with the current text.
// Run after `npm run build`: node scripts/site-image.ts
import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'
import { LANGS, type Lang } from '../src/lib/i18n.ts'

export const TEXT_FILE = 'scripts/site-image.json'
export const imageFile = (lang: Lang) =>
  `public/og/${lang === 'en' ? 'site' : 'site-zh'}.png`

export interface SiteText {
  headline: string
  intro: string
}

/** The text the images should show: the home page's headline and
 * introduction. The areas under them are left out. */
export function siteText(lang: Lang): SiteText {
  const home = JSON.parse(readFileSync('src/content/site/home.json', 'utf8'))
  return {
    headline: home.headline[lang],
    intro: home.intro[lang],
  }
}

/** The base path a built page loads its assets from, such as `/` or
 * `/ci-base/`, or null when it loads none. */
export function builtBase(html: string): string | null {
  return /(?:href|src)="([^"]*\/)_astro\//.exec(html)?.[1] ?? null
}

if (import.meta.main) {
  // The preview serves dist/ from the root, so a build under a base path
  // would load no styles and give unstyled images.
  const base = builtBase(readFileSync('dist/index.html', 'utf8'))
  if (base !== '/')
    throw new Error(
      `dist/ was built for the base ${base}: run \`npm run build\` without BASE_PATH first`,
    )
  const { chromium } = await import('@playwright/test')
  const port = 4329
  const server = spawn(
    'npx',
    ['astro', 'preview', '--port', `${port}`, '--ignore-lock'],
    {
      env: { ...process.env, BASE_PATH: '/' },
      stdio: 'ignore',
      detached: true,
    },
  )
  const root = `http://localhost:${port}/`
  const text: Partial<Record<Lang, SiteText>> = {}
  let browser
  try {
    let up = false
    for (let i = 0; i < 100 && !up; i++) {
      up = await fetch(root).then(
        (r) => r.ok,
        () => false,
      )
      if (!up) await new Promise((r) => setTimeout(r, 200))
    }
    if (!up) throw new Error(`the preview did not answer at ${root} in 20 s`)
    // A software renderer draws the background's still frame (D015).
    browser = await chromium.launch({
      args: ['--enable-unsafe-swiftshader'],
    })
    for (const lang of LANGS) {
      // 800×420 at 1.5× gives 1200×630 with type large enough for a thumbnail.
      const page = await browser.newPage({
        viewport: { width: 800, height: 420 },
        deviceScaleFactor: 1.5,
        colorScheme: 'light',
        reducedMotion: 'reduce',
      })
      await page.goto(lang === 'en' ? root : `${root}zh/`)
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(1500)
      // The headline and introduction alone, centred in the frame.
      await page.addStyleTag({
        content: `header.header, .skip, #projects, .earlier, footer, .areas { display: none !important }
          main { display: flex; flex-direction: column; justify-content: center;
            min-height: 420px; padding-top: 0 !important }
          main > * { margin-block: 0 !important; padding-block: 0 !important }`,
      })
      await sharp(await page.screenshot())
        .png({ compressionLevel: 9 })
        .toFile(imageFile(lang))
      text[lang] = await page.evaluate(() => ({
        headline: document.querySelector('h1')!.textContent!.trim(),
        intro: document.querySelector('.lede')!.textContent!.trim(),
      }))
      await page.close()
    }
  } finally {
    await browser?.close()
    process.kill(-server.pid!)
  }
  writeFileSync(TEXT_FILE, `${JSON.stringify(text, null, 2)}\n`)
}
