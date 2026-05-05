export type ExperienceBadge = 'now' | 'web3' | 'edu' | 'ai'

export interface ExperienceRow {
  when: string
  role: { zh: string; en: string }
  company: { zh: string; en: string }
  description: { zh: string; en: string }
  badge: ExperienceBadge
  isNow?: boolean
}

export const experience: ExperienceRow[] = [
  {
    when: '2022.03 — NOW',
    role: { zh: '独立工程师 · 创始人', en: 'Independent Engineer · Founder' },
    company: { zh: '添达工作室 / Upwork', en: 'Tianda Studio / Upwork' },
    description: {
      zh: '独立承接 AI 应用、全栈 Web 与 Web3 NFT 项目',
      en: 'Solo delivery — AI apps, full-stack Web, Web3 NFT',
    },
    badge: 'now',
    isNow: true,
  },
  {
    when: '2019.03 — 2022.03',
    role: { zh: '前端负责人', en: 'Frontend Lead' },
    company: { zh: '厚仁教育', en: 'Houren Education' },
    description: {
      zh: '4 款 App (RN→Flutter)、7 款小程序 (Taro)、ERP 后台、8 个企业站',
      en: '4 mobile apps (RN→Flutter), 7 mini-programs (Taro), ERP, 8 websites',
    },
    badge: 'edu',
  },
  {
    when: '2016.10 — 2019.03',
    role: { zh: '前端工程师', en: 'Frontend Engineer' },
    company: { zh: '科大讯飞 / 闲徕一指', en: 'iFLYTEK / XianLai' },
    description: {
      zh: 'React / Vue / Electron / Egret · AI 语音产品前端',
      en: 'React, Vue, Electron, Egret game framework · AI speech UIs',
    },
    badge: 'ai',
  },
]
