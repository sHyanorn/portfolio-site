export const LANGS = ['en', 'zh'] as const
export type Lang = (typeof LANGS)[number]

/** BCP 47 tags for `lang` and `hreflang`. */
export const LANG_TAG: Record<Lang, string> = { en: 'en', zh: 'zh-CN' }

export function toLang(locale: string | undefined): Lang {
  return locale === 'zh' ? 'zh' : 'en'
}

export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'zh' : 'en'
}

/** A page's path below the base and the locale prefix: `/b/zh/projects/x/` gives `projects/x/`. */
export function pagePath(
  pathname: string,
  base: string = import.meta.env.BASE_URL,
): string {
  const root = base.endsWith('/') ? base : `${base}/`
  const rest = pathname.startsWith(root)
    ? pathname.slice(root.length)
    : pathname.replace(/^\/+/, '')
  return rest.replace(/^zh(\/|$)/, '')
}

/** Interface text; page content lives in the content collections. */
const ui = {
  description: {
    en: 'Aaron Yang: algorithm engineering and server-side systems.',
    zh: 'Aaron Yang：算法工程与服务端系统。',
  },
  skip: { en: 'Skip to content', zh: '跳到正文' },
  projects: { en: 'Projects', zh: '项目' },
  earlier: { en: 'Earlier projects', zh: '早期项目' },
  articles: { en: 'Articles', zh: '文章' },
  about: { en: 'About', zh: '关于' },
  aboutDescription: {
    en: 'Commerce student at the University of Melbourne.',
    zh: '墨尔本大学商科在读。',
  },
  articlesDescription: {
    en: 'Articles about the projects on this site.',
    zh: '关于本站项目的文章。',
  },
  english: { en: 'English', zh: '英文' },
  language: { en: '中文', zh: 'English' },
  metrics: { en: 'Key metrics', zh: '关键指标' },
  problem: { en: 'Problem and goals', zh: '问题与目标' },
  architecture: { en: 'Architecture', zh: '架构' },
  decisions: { en: 'Key decisions', zh: '关键决策' },
  decisionLog: { en: 'Decision log', zh: '决策记录' },
  challenges: { en: 'Challenges', zh: '难点与解法' },
  repo: { en: 'Source on GitHub', zh: 'GitHub 源码' },
  project: { en: 'Project', zh: '项目' },
  contents: { en: 'Contents', zh: '目录' },
  article: { en: 'Article', zh: '文章（英文）' },
  // The kinds of article, by their names in the content schema.
  note: { en: 'Note', zh: '短文' },
  paper: { en: 'Paper', zh: '论文' },
} satisfies Record<string, Record<Lang, string>>

export type UiKey = keyof typeof ui

export function t(lang: Lang, key: UiKey): string {
  return ui[key][lang]
}

const LOCALE: Record<Lang, string> = { en: 'en-GB', zh: 'zh-CN' }

/** A content date, written as the calendar day it names: `9 Nov 2026`, `2026年11月9日`. */
export function formatDate(lang: Lang, date: Date): string {
  return date.toLocaleDateString(LOCALE[lang], {
    year: 'numeric',
    month: lang === 'en' ? 'short' : 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

/** Reading time: `6 min read`, `阅读约 6 分钟`. */
export function formatMinutes(lang: Lang, minutes: number): string {
  return lang === 'en' ? `${minutes} min read` : `阅读约 ${minutes} 分钟`
}
