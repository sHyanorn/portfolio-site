// The full-text feed of published articles, in English like the articles.
// Bodies are rendered with the Container API, as in Astro's recipe for full
// post content in RSS, with math as MathML alone; every link is absolute and
// includes the base.
import { getContainerRenderer } from '@astrojs/mdx/container-renderer'
import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { loadRenderers } from 'astro:container'
import { render } from 'astro:content'
import { publishedArticles } from '../lib/articles'
import { mathmlOnly } from '../lib/feed'
import { t } from '../lib/i18n'
import { withBase } from '../lib/paths'

export async function GET(context: APIContext): Promise<Response> {
  const site = context.site!
  const container = await AstroContainer.create({
    renderers: await loadRenderers([getContainerRenderer()]),
  })
  const items = await Promise.all(
    (await publishedArticles()).map(async (article) => {
      const { Content } = await render(article)
      return {
        title: article.data.title,
        description: article.data.summary,
        pubDate: article.data.date,
        link: new URL(withBase(`articles/${article.id}/`), site).href,
        content: mathmlOnly(await container.renderToString(Content)),
      }
    }),
  )
  return rss({
    title: 'Aaron Yang',
    description: t('en', 'articlesDescription'),
    site: new URL(withBase(''), site).href,
    items,
    customData: '<language>en</language>',
  })
}
