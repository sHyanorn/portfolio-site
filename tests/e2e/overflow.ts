export interface OverflowRow {
  element: string
  /** `scroll`: a scroll container; `spill`: content overflows visibly; `clipped`: overflow is hidden. */
  kind: 'scroll' | 'spill' | 'clipped'
  scrollWidth: number
  clientWidth: number
  /** Has a tabindex, so the keyboard can reach and scroll it. */
  focusable: boolean
}

export interface OverflowReport {
  /** How far the document is wider than the viewport, in CSS pixels. */
  page: number
  /** Every horizontal scroll container, and every other element whose content is wider than its box. */
  rows: OverflowRow[]
}

/** Runs in the page through `page.evaluate`, so it must not use anything from outside. */
export function measureOverflow(): OverflowReport {
  const describe = (el: Element) =>
    el.tagName.toLowerCase() +
    (el.id ? `#${el.id}` : '') +
    [...el.classList].map((c) => `.${c}`).join('')

  // Text kept for screen readers only, such as KaTeX's MathML, sits in a
  // 1 px box clipped to nothing; nothing in it shows.
  const visuallyHidden = (el: HTMLElement) => {
    for (let e: HTMLElement | null = el; e; e = e.parentElement) {
      const s = getComputedStyle(e)
      if (s.clipPath === 'inset(50%)' || s.clip === 'rect(0px, 0px, 0px, 0px)')
        return true
    }
    return false
  }

  const rows: OverflowRow[] = []
  for (const el of document.body.querySelectorAll<HTMLElement>('*')) {
    if (el.closest('[aria-hidden="true"]')) continue
    const style = getComputedStyle(el)
    if (style.display === 'inline' || style.display === 'contents') continue
    const scrolls = style.overflowX === 'auto' || style.overflowX === 'scroll'
    const overflows = el.scrollWidth > el.clientWidth + 1
    if (!scrolls && !overflows) continue
    if (visuallyHidden(el)) continue
    rows.push({
      element: describe(el),
      kind: scrolls
        ? 'scroll'
        : style.overflowX === 'visible'
          ? 'spill'
          : 'clipped',
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      focusable: el.hasAttribute('tabindex') && el.tabIndex >= 0,
    })
  }
  const doc = document.documentElement
  return { page: doc.scrollWidth - doc.clientWidth, rows }
}
