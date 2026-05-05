'use client'

import { useLanguageStore } from '@/stores/language.store'
import type { Locale } from './index'

/** Convenience hook returning the current locale (subscribes only to lang). */
export function useLocale(): Locale {
  return useLanguageStore((s) => s.lang)
}
