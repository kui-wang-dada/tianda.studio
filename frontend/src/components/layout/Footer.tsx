'use client'

import { useLanguageStore } from '@/stores/language.store'

export function Footer() {
  const lang = useLanguageStore((s) => s.lang)
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink py-8 text-xs text-muted2">
      <div className="container-page flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <span>
          © {year} {lang === 'zh' ? '添达工作室 Tianda Studio' : 'Tianda Studio · 添达工作室'} · Built
          by 添达 Kevin
        </span>
        <span className="font-mono text-[11px]">Next.js · FastAPI · Postgres</span>
      </div>
    </footer>
  )
}
