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
    number: 100,
    unit: '%',
    countTo: 100,
    label: { zh: 'Upwork 成功率', en: 'Job Success' },
    caption: { zh: 'Job Success', en: '100% rate' },
  },
  {
    number: 'Top Rated',
    unit: ' Plus',
    label: { zh: 'Upwork 官方认证', en: 'Upwork verified' },
    caption: { zh: 'Top 1%', en: 'Top 1%' },
    feature: true,
  },
]

export function pickLabel(stat: StatCard, locale: Locale): string {
  return stat.label[locale] ?? stat.label.zh
}
