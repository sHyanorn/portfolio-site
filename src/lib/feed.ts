const KATEX_HTML = '<span class="katex-html" aria-hidden="true">'

/**
 * Drops KaTeX's visual markup and keeps its MathML. Feed readers load no
 * stylesheet, so they would show both; the visual part is hidden from
 * assistive technology and only spans and SVG, so matching spans finds its end.
 */
export function mathmlOnly(html: string): string {
  let out = ''
  let from = 0
  for (
    let start = html.indexOf(KATEX_HTML);
    start !== -1;
    start = html.indexOf(KATEX_HTML, from)
  ) {
    out += html.slice(from, start)
    const tags = /<span\b|<\/span>/g
    tags.lastIndex = start
    let depth = 0
    for (let m = tags.exec(html); m; m = tags.exec(html)) {
      depth += m[0] === '</span>' ? -1 : 1
      if (depth === 0) break
    }
    if (depth !== 0) throw new Error('Unbalanced KaTeX markup')
    from = tags.lastIndex
  }
  return out + html.slice(from)
}
