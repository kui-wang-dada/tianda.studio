import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Locale } from '@/lib/i18n'

interface LanguageState {
  lang: Locale
  setLang: (lang: Locale) => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      lang: 'zh',
      setLang: (lang) => set({ lang }),
    }),
    {
      name: 'tianda-lang',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
