'use client'

import Link from 'next/link'
import { getWriting, pickLocaleField } from '@/lib/content'
import { Container } from '@/components/layout/Container'
import { useLocale } from '@/lib/i18n/use-locale'

export default function WritingIndexPage() {
  const items = getWriting()
  const locale = useLocale()

  return (
    <section className="py-16">
      <Container>
        <div className="mb-8">
          <div className="eyebrow">— {locale === 'zh' ? 'Writing · 文章' : 'Writing'} —</div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            {locale === 'zh' ? '技术文章' : 'Tech articles'}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {locale === 'zh'
              ? `${items.length} 篇 · 技术随笔、踩坑日记、产品复盘`
              : `${items.length} posts · engineering notes, debugging logs, retros`}
          </p>
        </div>
        <ul className="overflow-hidden rounded-card border border-line bg-white">
          {items.map((item, idx) => (
            <li key={item.slug} className="border-b border-line last:border-b-0">
              <Link
                href={item.permalink}
                className="grid grid-cols-[80px_1fr_120px] items-center gap-6 px-6 py-5 transition hover:bg-brand/5"
              >
                <span className="font-mono text-xl font-semibold text-brand">
                  №{String(items.length - idx).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-base font-semibold leading-snug">
                    {pickLocaleField(item.title, locale)}
                  </h3>
                  <p className="mt-1 text-xs text-muted line-clamp-2">
                    {pickLocaleField(item.excerpt, locale)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.tags.slice(0, 4).map((t) => (
                      <span key={t} className="rounded-pill bg-paper2 px-2 py-0.5 font-mono text-[10px] text-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right font-mono text-[11px] tracking-wider text-muted2">
                  <div>{item.published_at.slice(0, 10)}</div>
                  {item.reading_time && (
                    <div className="mt-1 text-brand">
                      {item.reading_time} {locale === 'zh' ? '分钟' : 'min'} →
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
