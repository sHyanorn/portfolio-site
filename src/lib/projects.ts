interface Ordered {
  id: string
  data: { order: number }
}

/** Projects in their `order`; two projects with the same order fail the build. */
export function byOrder<T extends Ordered>(projects: T[]): T[] {
  const seen = new Map<number, string>()
  for (const { id, data } of projects) {
    const other = seen.get(data.order)
    if (other)
      throw new Error(`Projects ${other} and ${id} share order ${data.order}`)
    seen.set(data.order, id)
  }
  return projects.toSorted((a, b) => a.data.order - b.data.order)
}
