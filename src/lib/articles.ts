import { getCollection, getEntry, type CollectionEntry } from 'astro:content'

/** Articles that are not drafts, newest first; articles of one day go by title. */
export async function publishedArticles(): Promise<
  CollectionEntry<'articles'>[]
> {
  const articles = await getCollection('articles', (a) => !a.data.draft)
  return articles.toSorted(
    (a, b) =>
      b.data.date.valueOf() - a.data.date.valueOf() ||
      a.data.title.localeCompare(b.data.title),
  )
}

/** The project an article names; the schema has already checked it exists. */
export async function projectOf(
  article: CollectionEntry<'articles'>,
): Promise<CollectionEntry<'projects'>> {
  const project = await getEntry('projects', article.data.project)
  if (!project)
    throw new Error(`${article.id} names no project ${article.data.project}`)
  return project
}
