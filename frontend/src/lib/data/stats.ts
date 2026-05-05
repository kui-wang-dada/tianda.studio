import type { Locale } from '@/lib/i18n'

export interface StatCard {
  number: number | string
  unit?: string
  label: { zh: string; en: string }
  caption?: { zh: string; en: string }
  feature?: boolean
  countTo?: number
}

export const heroStats: StatCard[] = [
  {
    number: 10,
    unit: '+',
    countTo: 10,
    label: { zh: '从业年限', en: 'Years' },
    caption: { zh: 'Years', en: '10+ yrs' },
  },
  {
    number: 30,
    unit: '+',
    countTo: 30,
    label: { zh: '交付项目', en: 'Projects' },
    caption: { zh: 'Projects', en: 'shipped' },
  },
  {
    number: 21,
    unit: '+',
    countTo: 21,
    label: { zh: 'Web3 / NFT 上线', en: 'NFT & dApps' },
    caption: { zh: 'NFT & dApps', en: 'multi-chain' },
  },
  {
    number: '$25',
    unit: '/h',
    label: { zh: 'Upwork 时薪', en: 'Upwork rate' },
    caption: { zh: 'Available', en: 'available' },
    feature: true,
  },
]

export function pickLabel(stat: StatCard, locale: Locale): string {
  return stat.label[locale] ?? stat.label.zh
}
