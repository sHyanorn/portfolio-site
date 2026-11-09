import katex from 'katex'
import { describe, expect, it } from 'vitest'
import { mathmlOnly } from './feed'

describe('mathmlOnly', () => {
  it('keeps the MathML of inline and display math and the text around it', () => {
    const inline = katex.renderToString('\\lambda_c \\le 0')
    const display = katex.renderToString(
      '\\widehat{PBO} = \\frac{1}{12{,}870} \\sum_{c} \\mathbf{1}[\\lambda_c \\le 0]',
      { displayMode: true },
    )
    const html = `<p>a ${inline} b</p>${display}<p>c</p>`
    const out = mathmlOnly(html)

    expect(out).not.toContain('katex-html')
    expect(out.match(/<math\b/g)).toHaveLength(2)
    expect(out).toMatch(/^<p>a <span class="katex"><span class="katex-mathml">/)
    expect(out).toMatch(/<\/math><\/span><\/span> b<\/p>/)
    expect(out).toMatch(/<\/math><\/span><\/span><\/span><p>c<\/p>$/)
  })

  it('leaves HTML without math as it is', () => {
    expect(mathmlOnly('<p><span>x</span></p>')).toBe('<p><span>x</span></p>')
  })
})
