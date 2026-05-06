export interface UpworkService {
  title: { zh: string; en: string }
  detail: string
}

export const upworkServices: UpworkService[] = [
  {
    title: { zh: 'AI 应用 · LLM 集成', en: 'AI Apps · LLM Integration' },
    detail: 'Claude / OpenAI / RAG / Agents / MCP',
  },
  {
    title: { zh: '全栈 Web 产品', en: 'Full-Stack Web Products' },
    detail: 'Next.js + FastAPI + Postgres',
  },
  {
    title: { zh: '移动应用', en: 'Mobile Apps' },
    detail: 'React Native / Flutter / Mini Programs',
  },
  {
    title: { zh: 'Web3 NFT 平台', en: 'Web3 NFT Platforms' },
    detail: 'Wagmi / Viem / Solidity / Multi-chain',
  },
]

export const upworkInfoCard = {
  profileUrl: 'https://www.upwork.com/freelancers/~012a1e9c108e49cd19?viewMode=1',
  rows: [
    { k: { zh: '客户分布', en: 'Client regions' }, v: 'US · EU · JP' },
    { k: { zh: '交付节奏', en: 'Delivery cadence' }, v: 'Weekly demos' },
    { k: { zh: '可用时段', en: 'Availability' }, v: '30+ hrs/wk' },
    { k: { zh: '时区', en: 'Timezone' }, v: 'UTC+8 (Shanghai)' },
    { k: { zh: '语言', en: 'Languages' }, v: '中 · EN (Pro)' },
    { k: { zh: '合作模式', en: 'Engagement' }, v: 'Hourly · Fixed' },
    { k: { zh: '项目周期', en: 'Project length' }, v: '2 weeks — 6 months' },
    { k: { zh: '技术栈', en: 'Stack' }, v: 'Next · FastAPI · LLM' },
  ],
  testimonial: {
    quote:
      'Kevin delivered our RAG system in three weeks. Clean code, great communication.',
    author: 'Recent Upwork client, US',
  },
}

export interface UpworkBadge {
  value: string
  label: { zh: string; en: string }
  highlight?: boolean
}

export const upworkBadges: UpworkBadge[] = [
  { value: 'Top Rated Plus', label: { zh: '官方认证 · Plus', en: 'Verified · Plus' }, highlight: true },
  { value: '100%', label: { zh: 'Job Success', en: 'Job Success' } },
  { value: '$60K+', label: { zh: '累计收入', en: 'Total earned' } },
  { value: '43 / 2,233', label: { zh: '项目数 / 工时', en: 'Jobs / hours' } },
]

export const upworkNarrative: { zh: string[]; en: string[] } = {
  zh: [
    'Upwork 上独立接单 5 年，累计 43 个项目、2,233 小时、$60K+ 交付',
    '100% Job Success Rate · Top Rated Plus（Upwork 顶级 1% 标识）',
    '一人对接、按周交付、报价透明 —— 从需求到上线全部包',
    '不接超出能力栈的活、不接需要纯外包搬砖的活',
    '新合作可提供 **1-3 天免费开发或技术咨询**，对项目可行性、架构方案双向评估后再决定是否长期合作',
  ],
  en: [
    'Five years on Upwork — 43 projects, 2,233 hours, $60K+ delivered',
    '100% Job Success · Top Rated Plus (Upwork top 1% talent)',
    'Single point of contact, weekly delivery, transparent pricing — spec to deploy in one hand',
    'I do not take work outside my stack, nor staff-aug grunt work',
    'New engagements get **1–3 days of free dev or consulting** so we can both assess feasibility and architecture before committing long-term',
  ],
}

export interface UpworkMiniCase {
  slug: string
  thumb: string
  title: { zh: string; en: string }
  outcome: { zh: string; en: string }
}

export const upworkMiniCases: UpworkMiniCase[] = [
  {
    slug: 'venus-ai-skincare',
    thumb: '/img/project/venus/thumb.png',
    title: { zh: 'Venus AI 护肤', en: 'Venus AI Skincare' },
    outcome: { zh: '上线 JP App Store', en: 'Live on JP App Store' },
  },
  {
    slug: 'obico-3d-monitor',
    thumb: '/img/project/obico/thumb.png',
    title: { zh: 'Obico 3D 监控', en: 'Obico 3D Monitor' },
    outcome: { zh: '+30% 留存', en: '+30% retention' },
  },
  {
    slug: 'bluez-nft-marketplace',
    thumb: '/img/project/bluez/thumb.png',
    title: { zh: 'Bluez NFT 市场', en: 'Bluez NFT' },
    outcome: { zh: '多链上线', en: 'Multi-chain live' },
  },
]
