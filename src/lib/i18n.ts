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
  intro: {
    en: "I'm Aaron, a commerce student at the University of Melbourne. I build systems whose correctness can be measured: an exchange matching engine, end-to-end encrypted file sharing, a finance app that never leaves your computer, and research tools that test their own results.",
    zh: '我是 Aaron，在墨尔本大学读商科。我做的系统，对错都能用数字衡量：交易所撮合引擎、端到端加密的文件分享、数据从不离开本机的记账应用，以及会检验自身结果的研究工具。',
  },
  focusLabel: { en: 'Focus', zh: '方向' },
  focusBackend: { en: 'Backend systems', zh: '后端系统' },
  focusSecurity: { en: 'Security', zh: '安全' },
  focusRecommender: { en: 'Recommender systems', zh: '推荐系统' },
  focusQuant: { en: 'Quantitative research', zh: '量化研究' },
  projects: { en: 'Projects', zh: '项目' },
  articles: { en: 'Articles', zh: '文章' },
  about: { en: 'About', zh: '关于' },
  aboutDescription: {
    en: 'Aaron Yang studies commerce at the University of Melbourne.',
    zh: 'Aaron Yang 在墨尔本大学读商科。',
  },
  education: { en: 'Education', zh: '教育' },
  school: {
    en: 'The University of Melbourne',
    zh: '墨尔本大学（The University of Melbourne）',
  },
  // Word joiners keep the year range on one line.
  degree: {
    en: 'Bachelor of Commerce, 2024\u2060–\u20602027 (in progress)',
    zh: '商学学士（Bachelor of Commerce），2024\u2060–\u20602027，在读',
  },
  direction: { en: 'Where the work sits', zh: '我的方向' },
  directionBody: {
    en: 'My work sits where economics, finance and technology meet. Commerce asks how markets match orders, how a strategy can look good by chance, and how to judge a decision without live data. Software is how I test those questions, and each project on this site answers one with numbers that trace back to its repository.',
    zh: '我的工作处在经济、金融和技术的交汇处。商科提出的问题是：市场怎样撮合订单，一个策略怎样仅凭运气就显得很好，没有线上数据时怎样评判一个决策。软件是我检验这些问题的方式，这个网站上的每个项目都回答其中一个问题，给出的数字都能追溯到项目仓库。',
  },
  articlesDescription: {
    en: "Aaron Yang's articles, one per project.",
    zh: 'Aaron Yang 的文章，每个项目一篇。',
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
  article: { en: 'Article', zh: '文章（英文）' },
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
