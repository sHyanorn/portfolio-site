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
  home: { en: 'Home', zh: '首页' },
  language: { en: '中文', zh: 'English' },
} satisfies Record<string, Record<Lang, string>>

export type UiKey = keyof typeof ui

export function t(lang: Lang, key: UiKey): string {
  return ui[key][lang]
}
