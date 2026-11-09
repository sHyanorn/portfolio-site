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
    en: 'Aaron Yang: backend systems, security, recommender systems and quantitative research.',
    zh: 'Aaron Yang：后端系统、安全、推荐系统和量化研究。',
  },
  skip: { en: 'Skip to content', zh: '跳到正文' },
  projects: { en: 'Projects', zh: '项目' },
  language: { en: '中文', zh: 'English' },
  metrics: { en: 'Key metrics', zh: '关键指标' },
  benchmarks: { en: 'Benchmark report', zh: '压测报告' },
  problem: { en: 'Problem and goals', zh: '问题与目标' },
  architecture: { en: 'Architecture', zh: '架构' },
  decisions: { en: 'Key decisions', zh: '关键决策' },
  decisionLog: { en: 'Decision log', zh: '决策记录' },
  challenges: { en: 'Challenges', zh: '难点与解法' },
  repo: { en: 'Source on GitHub', zh: 'GitHub 源码' },
} satisfies Record<string, Record<Lang, string>>

export type UiKey = keyof typeof ui

export function t(lang: Lang, key: UiKey): string {
  return ui[key][lang]
}
