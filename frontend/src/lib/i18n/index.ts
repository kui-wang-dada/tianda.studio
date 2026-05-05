import { i18n } from '@lingui/core'
import { messages as zhMessages } from '@/locales/zh/messages'
import { messages as enMessages } from '@/locales/en/messages'

export const locales = ['zh', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'zh'

i18n.load({ zh: zhMessages, en: enMessages })
i18n.activate(defaultLocale)

export { i18n }

export function pickLocaleField<T extends { zh: string; en: string }>(field: T, locale: Locale): string {
  return field[locale] ?? field[defaultLocale]
}
