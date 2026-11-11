// The figures of project pages whose repositories publish tables and no
// charts: drawn here from the numbers those tables hold, in the style of the
// ope-checks figures, a light and a dark copy each. Every number is traced in
// docs/project-sources. Run after changing a figure: node scripts/figures.ts
import sharp from 'sharp'

export const THEMES = {
  light: {
    surface: '#fcfcfb',
    ink: '#0b0b0b',
    secondary: '#52514e',
    muted: '#898781',
    grid: '#e1e0d9',
    blue: '#2a78d6',
    orange: '#eb6834',
    aqua: '#1baf7a',
  },
  dark: {
    surface: '#1a1a19',
    ink: '#f0efec',
    secondary: '#c3c2b7',
    muted: '#898781',
    grid: '#2c2c2a',
    blue: '#3987e5',
    orange: '#d95926',
    aqua: '#199e70',
  },
}
type Theme = (typeof THEMES)['light']
type Color = 'blue' | 'orange' | 'aqua' | 'ink'

/** What a row draws on its line; values are in the units of the scale. */
type Mark =
  | { bar: number; color: Color }
  | { from: number; to: number; color: Color; shift?: number }
  | { dot: number; color: Color; ring?: boolean }

interface Row {
  label: string
  /** A header names the rows under it and draws nothing. */
  header?: boolean
  marks?: Mark[]
  /** Words after the rightmost mark. */
  note?: string
}

interface Scale {
  min: number
  max: number
  ticks: number[]
  /** Positions follow log10(1 − value): for cosines close to 1. */
  logOneMinus?: boolean
  format: (tick: number) => string
  label: string
  /** A reference line, and a shaded span, across the rows. */
  line?: number
  band?: [number, number]
}

interface Panel {
  title?: string
  rows: Row[]
  /** A panel's own scale, drawn under it, in place of the figure's. */
  scale?: Scale
}

export interface Figure {
  file: string
  title: string
  legend?: { label: string; color: Color; ring?: boolean }[]
  /** Width of the label column. */
  gutter: number
  scale?: Scale
  panels: Panel[]
}

const fixed = (digits: number) => (tick: number) =>
  tick.toFixed(digits).replace('-', '−')

const ms: Scale = {
  min: 0,
  max: 8,
  ticks: [0, 2, 4, 6, 8],
  format: fixed(0),
  label: 'ms, range of three runs',
}

/** Before and after one row of recserve's table: two ranges, set apart. */
const pair = (
  label: string,
  before: [number, number],
  after: [number, number],
  note?: string,
): Row => ({
  label,
  marks: [
    { from: before[0], to: before[1], color: 'orange', shift: -9 },
    { from: after[0], to: after[1], color: 'blue', shift: 9 },
  ],
  note,
})

const BEIR = [
  // nDCG@10: Pyserini BM25 flat and this project, Bleve's own BM25; BGE
  // minus Pyserini's flat condition.
  ['TREC-COVID', 0.5947, 0.3513, null],
  ['NFCorpus', 0.3218, 0.3122, -0.0003],
  ['FiQA', 0.2361, 0.1906, -0.0003],
  ['ArguAna', 0.397, 0.5448, 0],
  ['SCIDOCS', 0.149, 0.1524, 0],
  ['SciFact', 0.6789, 0.6745, -0.0004],
] as const

const cosine: Scale = {
  min: 0.9,
  max: 0.999995,
  ticks: [0.9, 0.99, 0.999, 0.9999, 0.99999],
  logOneMinus: true,
  format: String,
  label: 'lowest cosine, on a log scale of 1 − cosine',
}

export const FIGURES: Figure[] = [
  {
    file: 'recserve/kind-check',
    title: 'The kind check at 100 requests/s',
    gutter: 560,
    panels: [
      {
        title: 'responses failed or degraded',
        scale: {
          min: 0,
          max: 1500,
          ticks: [0, 500, 1000, 1500],
          format: fixed(0),
          label: '',
        },
        rows: [
          {
            label: 'as deployed',
            marks: [{ bar: 0, color: 'blue' }],
            note: '0 of 15,000',
          },
          {
            label: '30 s between DNS resolutions',
            marks: [{ bar: 815, color: 'orange' }],
            note: '815 of 15,000 degraded',
          },
          {
            label: 'no shutdown delay',
            marks: [{ bar: 56, color: 'orange' }],
            note: '56 failed',
          },
        ],
      },
      {
        title: 'duration of each step as deployed, s',
        scale: {
          min: 0,
          max: 60,
          ticks: [0, 20, 40, 60],
          format: fixed(0),
          label: '',
        },
        rows: [
          {
            label: 'gateways roll',
            marks: [{ from: 9, to: 11, color: 'blue', shift: 0 }],
            note: '9 to 11',
          },
          {
            label: 'replicas roll',
            marks: [{ from: 38, to: 40, color: 'blue', shift: 0 }],
            note: '38 to 40',
          },
          {
            label: 'bundle swap',
            marks: [{ from: 15, to: 17, color: 'blue', shift: 0 }],
            note: '15 to 17',
          },
        ],
      },
    ],
  },
  {
    file: 'recserve/inner-product',
    title: 'Before and after the inner product in AVX2',
    legend: [
      { label: 'before', color: 'orange' },
      { label: 'after', color: 'blue' },
    ],
    gutter: 330,
    scale: ms,
    panels: [
      {
        title: 'p99',
        rows: [
          pair('200 requests/s', [5.14, 5.32], [3.93, 4.39]),
          pair('400 requests/s', [6.9, 7.79], [4.27, 4.64]),
        ],
      },
      {
        title: "replicas' CPU per request",
        rows: [
          pair('200 requests/s', [1.94, 1.98], [1.23, 1.29]),
          pair('400 requests/s', [1.8, 1.87], [1.1, 1.16]),
        ],
      },
      {
        title: "gateway's CPU per request",
        rows: [
          pair('200 requests/s', [1.52, 1.57], [1.46, 1.52]),
          pair('400 requests/s', [1.29, 1.33], [1.26, 1.32], 'not resolved'),
        ],
      },
    ],
  },
  {
    file: 'recserve/ranker',
    title: 'Ranker on 680 held-out users, before MMR',
    gutter: 330,
    panels: [
      {
        title: 'recall@10',
        scale: {
          min: 0,
          max: 0.1,
          ticks: [0, 0.025, 0.05, 0.075, 0.1],
          format: fixed(3),
          label: '',
        },
        rows: [
          {
            label: 'ranker',
            marks: [{ bar: 0.091, color: 'blue' }],
            note: '0.091',
          },
          {
            label: 'retrieval order',
            marks: [{ bar: 0.026, color: 'orange' }],
            note: '0.026',
          },
        ],
      },
      {
        title: 'mean per-user AUC',
        scale: {
          min: 0,
          max: 1,
          ticks: [0, 0.25, 0.5, 0.75, 1],
          format: fixed(2),
          label: '',
          line: 0.5,
        },
        rows: [
          {
            label: 'ranker',
            marks: [{ bar: 0.726, color: 'blue' }],
            note: '0.726',
          },
          {
            label: 'retrieval order',
            marks: [{ bar: 0.388, color: 'orange' }],
            note: '0.388',
          },
        ],
      },
    ],
  },
  {
    file: 'retrieval-lab/bm25',
    title: 'BM25, nDCG@10 on six BEIR test sets',
    legend: [
      { label: 'Pyserini, published', color: 'ink', ring: true },
      { label: 'this project', color: 'blue' },
      { label: "Bleve's own BM25", color: 'orange' },
    ],
    gutter: 300,
    scale: {
      min: 0,
      max: 0.8,
      ticks: [0, 0.2, 0.4, 0.6, 0.8],
      format: fixed(1),
      label: 'nDCG@10',
    },
    panels: [
      {
        rows: BEIR.map(([label, anchor, bleve]) => ({
          label,
          marks: [
            { from: anchor, to: bleve, color: 'orange' },
            { dot: bleve, color: 'orange' },
            { dot: anchor, color: 'ink', ring: true },
            { dot: anchor, color: 'blue' },
          ],
        })),
      },
    ],
  },
  {
    file: 'retrieval-lab/bge',
    title: "BGE-base-en-v1.5, nDCG@10 minus Pyserini's flat condition",
    legend: [{ label: 'tolerance ±0.005', color: 'aqua' }],
    gutter: 300,
    scale: {
      min: -0.006,
      max: 0.006,
      ticks: [-0.005, -0.0025, 0, 0.0025, 0.005],
      format: fixed(4),
      label: 'difference in nDCG@10',
      line: 0,
      band: [-0.005, 0.005],
    },
    panels: [
      {
        rows: BEIR.map(([label, , , delta]) =>
          delta === null
            ? { label, note: 'not run' }
            : { label, marks: [{ dot: delta, color: 'blue' }] },
        ),
      },
    ],
  },
  {
    file: 'retrieval-lab/vectors',
    title: "Lowest cosine to Pyserini's document vector",
    gutter: 760,
    scale: cosine,
    panels: [
      {
        title: 'first 160 SciFact documents',
        rows: [
          {
            label: 'text alone, 512 tokens',
            marks: [{ dot: 0.939, color: 'orange' }],
            note: '0.939',
          },
          {
            label: 'title and text, 256 tokens',
            marks: [{ dot: 0.96, color: 'orange' }],
            note: '0.960',
          },
        ],
      },
      {
        title: 'all of SciFact and ArguAna',
        rows: [
          {
            label: 'title and text, 512 tokens',
            marks: [{ dot: 0.9936, color: 'orange' }],
            note: '0.9936',
          },
          {
            label: 'the same, format characters removed',
            marks: [{ dot: 0.999978, color: 'blue' }],
            note: '0.999978',
          },
        ],
      },
    ],
  },
]

const WIDTH = 1800
const MARGIN = 20
const ROW = 80
const FONT = 34

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** A figure as SVG, 1800 px wide and as tall as its rows need. */
export function svg(figure: Figure, theme: Theme): string {
  const left = figure.gutter + 60
  const right = WIDTH - 60
  const out: string[] = []
  const text = (
    x: number,
    y: number,
    value: string,
    fill: string,
    extra = '',
    size = FONT,
  ) =>
    out.push(
      `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" ${extra}>${escape(value)}</text>`,
    )

  let y = 62
  text(MARGIN, y, figure.title, theme.ink, '', 38)
  if (figure.legend) {
    y += 62
    let x = left
    for (const { label, color, ring } of figure.legend) {
      out.push(
        ring
          ? `<circle cx="${x + 12}" cy="${y - 12}" r="15" fill="none" stroke="${theme[color]}" stroke-width="3"/>`
          : `<circle cx="${x + 12}" cy="${y - 12}" r="11" fill="${theme[color]}"/>`,
      )
      text(x + 38, y, label, theme.secondary)
      x += 38 + label.length * 19 + 70
    }
  }
  y += 34

  for (const panel of figure.panels) {
    const scale = panel.scale ?? figure.scale!
    const at = (value: number) => {
      const t = (v: number) => (scale.logOneMinus ? -Math.log10(1 - v) : v)
      const share = (t(value) - t(scale.min)) / (t(scale.max) - t(scale.min))
      return left + share * (right - left)
    }
    if (panel.title) {
      y += 46
      text(left, y, panel.title, theme.secondary)
      y += 18
    }
    const top = y
    const bottom = top + panel.rows.length * ROW
    if (scale.band)
      out.push(
        `<rect x="${at(scale.band[0])}" y="${top}" width="${at(scale.band[1]) - at(scale.band[0])}" height="${bottom - top}" fill="${theme.aqua}" opacity="0.14"/>`,
      )
    for (const tick of scale.ticks)
      out.push(
        `<line x1="${at(tick)}" x2="${at(tick)}" y1="${top}" y2="${bottom}" stroke="${theme.grid}" stroke-width="3"/>`,
      )
    if (scale.line !== undefined)
      out.push(
        `<line x1="${at(scale.line)}" x2="${at(scale.line)}" y1="${top}" y2="${bottom}" stroke="${theme.muted}" stroke-width="4"/>`,
      )

    for (const [i, row] of panel.rows.entries()) {
      const mid = top + i * ROW + ROW / 2
      text(
        figure.gutter,
        mid + 12,
        row.label,
        row.header ? theme.ink : theme.secondary,
        `text-anchor="end"${row.header ? ' font-weight="bold"' : ''}`,
      )
      // A row with nothing drawn says so from the reference line.
      let end = row.marks ? left : at(scale.line ?? scale.min)
      for (const mark of row.marks ?? []) {
        const color = theme[mark.color]
        if ('bar' in mark) {
          const x = at(mark.bar)
          out.push(
            `<rect x="${left}" y="${mid - 18}" width="${Math.max(x - left, 4)}" height="36" fill="${color}"/>`,
          )
          end = Math.max(end, x, left + 4)
        } else if ('from' in mark) {
          const [a, b] = [at(mark.from), at(mark.to)]
          const line = mid + (mark.shift ?? 0)
          const width = mark.shift === undefined ? 6 : 14
          out.push(
            `<line x1="${a}" x2="${b}" y1="${line}" y2="${line}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`,
          )
          end = Math.max(end, a + width / 2, b + width / 2)
        } else {
          const x = at(mark.dot)
          out.push(
            mark.ring
              ? `<circle cx="${x}" cy="${mid}" r="19" fill="${theme.surface}" stroke="${color}" stroke-width="3"/>`
              : `<circle cx="${x}" cy="${mid}" r="12" fill="${color}" stroke="${theme.surface}" stroke-width="3"/>`,
          )
          end = Math.max(end, x + (mark.ring ? 19 : 12))
        }
      }
      if (row.note) text(end + 20, mid + 12, row.note, theme.secondary)
    }

    y = bottom
    const last = panel === figure.panels.at(-1)
    if (panel.scale || last) {
      y += 50
      for (const tick of scale.ticks)
        text(
          at(tick),
          y,
          scale.format(tick),
          theme.secondary,
          'text-anchor="middle"',
        )
      if (scale.label) {
        y += 56
        text(
          (left + right) / 2,
          y,
          scale.label,
          theme.secondary,
          'text-anchor="middle"',
        )
      }
    }
    y += 16
  }

  const height = Math.ceil(y + 24)
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${height}" viewBox="0 0 ${WIDTH} ${height}" font-family="DejaVu Sans">`,
    `<rect width="${WIDTH}" height="${height}" fill="${theme.surface}"/>`,
    ...out,
    '</svg>',
  ].join('\n')
}

/** Every string a figure shows, for a reader of the page's sources. */
export function words(figure: Figure): string[] {
  const scales = [figure.scale, ...figure.panels.map((p) => p.scale)]
  return [
    figure.title,
    ...(figure.legend ?? []).map((l) => l.label),
    ...figure.panels.flatMap((p) => [
      p.title,
      ...p.rows.flatMap((r) => [r.label, r.note]),
    ]),
    ...scales.map((s) => s?.label),
  ].filter((word): word is string => Boolean(word))
}

if (import.meta.main)
  for (const figure of FIGURES)
    for (const [mode, theme] of Object.entries(THEMES)) {
      const file = `src/content/projects/${figure.file}-${mode}.png`
      await sharp(Buffer.from(svg(figure, theme)))
        .png({ compressionLevel: 9, palette: true })
        .toFile(file)
      console.log(file)
    }
