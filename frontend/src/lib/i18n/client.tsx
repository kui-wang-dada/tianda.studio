'use client'

import { I18nProvider } from '@lingui/react'
import { useEffect, type ReactNode } from 'react'
import { i18n } from './index'
import { useLanguageStore } from '@/stores/language.store'

export function LangProvider({ children }: { children: ReactNode }) {
  const lang = useLanguageStore(s => s.lang)

  useEffect(() => {
    i18n.activate(lang)
  }, [lang])

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>
}
