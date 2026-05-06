'use client'

import Link from 'next/link'
import { getProducts, pickLocaleField } from '@/lib/content'
import { Container } from '@/components/layout/Container'
import { useLocale } from '@/lib/i18n/use-locale'

const STATUS_COLOR: Record<string, string> = {
  live: 'bg-emerald-100 text-emerald-700',
  beta: 'bg-amber-100 text-amber-700',
  wip: 'bg-stone-200 text-stone-700',
}

export default function ProductsIndexPage() {
  const items = getProducts()
  const locale = useLocale()

  return (
    <section className="py-16">
      <Container>
        <div className="mb-8">
          <div className="eyebrow">— {locale === 'zh' ? 'Products · 产品' : 'Products'} —</div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            {locale === 'zh' ? '工具与产品' : 'Tools & Products'}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {locale === 'zh'
              ? `${items.length} 个 · 持续开发中的小工具与产品`
              : `${items.length} items · indie tools & products in active development`}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={item.permalink}
              className="block rounded-card border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-base font-semibold">{pickLocaleField(item.title, locale)}</h3>
                <span className={`rounded-pill px-2 py-0.5 font-mono text-[10px] uppercase ${STATUS_COLOR[item.status_label] ?? STATUS_COLOR.wip}`}>
                  {item.status_label}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted line-clamp-3">{pickLocaleField(item.excerpt, locale)}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-mono text-[11px] text-muted2">
                  {item.pricing ? pickLocaleField(item.pricing, locale) : 'Free'}
                </span>
                <span className="text-xs font-medium text-brand">
                  {locale === 'zh' ? '查看 →' : 'View →'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
