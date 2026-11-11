import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { FIGURES, svg, THEMES, words } from './figures.ts'

/** The numbers in a text, with a minus sign or a hyphen read as negative
 * only where a number follows directly. */
const numbers = (text: string) =>
  [...text.matchAll(/[−-]?\d[\d,]*(?:\.\d+)?/g)].map((m) =>
    Number(m[0].replace('−', '-').replace(/,/g, '')),
  )

const drawn = (figure: (typeof FIGURES)[number]) =>
  figure.panels.flatMap((panel) =>
    panel.rows.flatMap((row) =>
      (row.marks ?? []).flatMap((mark) =>
        'bar' in mark
          ? [mark.bar]
          : 'dot' in mark
            ? [mark.dot]
            : [mark.from, mark.to],
      ),
    ),
  )

describe('figures', () => {
  for (const figure of FIGURES) {
    const [project, name] = figure.file.split('/') as [string, string]
    const page = JSON.parse(
      readFileSync(`src/content/projects/${project}.json`, 'utf8'),
    )
    const shot = page.demo.images.find((image: { src: string }) =>
      image.src.includes(`/${name}-light.png`),
    )

    it(`${figure.file}: the page shows it, with a dark copy`, () => {
      expect(shot?.dark).toBe(`./${project}/${name}-dark.png`)
    })

    // A reader who cannot see the figure gets every value it draws.
    for (const lang of ['en', 'zh'] as const)
      it(`${figure.file}: its ${lang} description gives every number drawn`, () => {
        const given = numbers(shot.alt[lang])
        const missing = drawn(figure).filter(
          (value) => !given.some((n) => Math.abs(n - value) < 1e-9),
        )
        expect(missing).toEqual([])
      })

    it(`${figure.file}: draws its words in both themes`, () => {
      for (const theme of Object.values(THEMES)) {
        const picture = svg(figure, theme)
        for (const word of words(figure))
          expect(picture).toContain(
            word.replace(/&/g, '&amp;').replace(/</g, '&lt;'),
          )
      }
    })
  }
})
