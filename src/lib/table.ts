import type { Element, Root, RootContent } from 'hast'

/** Whether a node shows nothing: no text but white space, and no element. */
function blank(node: RootContent): boolean {
  return node.type === 'text' ? !node.value.trim() : node.type !== 'element'
}

function walk(node: Root | Element) {
  for (const child of node.children) {
    if (child.type !== 'element') continue
    if (child.tagName === 'th' && child.children.every(blank))
      child.tagName = 'td'
    walk(child)
  }
}

/**
 * Rehype plugin that makes an empty header cell a data cell: a Markdown
 * table whose first column names the rows has a corner cell that heads
 * nothing, and a header with no text is an accessibility error.
 */
export function rehypeCornerCell() {
  return (tree: Root) => walk(tree)
}
