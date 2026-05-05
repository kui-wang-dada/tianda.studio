'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLocale } from '@/lib/i18n/use-locale'
import { pickLocaleField, type ProductItem } from '@/lib/content'
import { SectionFrame, SectionHead } from '@/components/layout/SectionFrame'

interface Props {
  items: ProductItem[]
  num: string
}

const STATUS_LABEL: Record<string, { zh: string; en: string; cls: string }> = {
  live: { zh: 'Live', en: 'Live', cls: 'bg-emerald-100 text-emerald-700' },
  beta: { zh: 'Beta', en: 'Beta', cls: 'bg-amber-100 text-amber-700' },
  wip:  { zh: 'WIP',  en: 'WIP',  cls: 'bg-stone-200 text-stone-700' },
}

export function ProductsSection({ items, num }: Props) {
  const locale = useLocale()

  if (items.length === 0) return null

  return (
    <SectionFrame variant="paper" id="products">
      <SectionHead
        num={num}
        eyebrow={locale === 'zh' ? 'Products 产品线' : 'Products'}
        title={locale === 'zh' ? '独立开发中' : 'Building solo'}
        sub={
          locale === 'zh'
            ? '我自己想做的工具与产品 · 未来重点'
            : 'Tools and products I am building for myself · the road ahead'
        }
        right={
          <Link href="/products" className="text-xs text-brand hover:underline">
            {locale === 'zh' ? '全部产品 →' : 'All products →'}
          </Link>
        }
      />

      <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-line bg-paper2 px-4 py-3 text-[13px] text-muted">
        <span>
          {locale === 'zh' ? (
            <>
              <span className="text-muted2">↑ 上面是接单交付的</span>{' '}
              <strong className="text-ink">项目</strong>
              <span className="text-muted2">；这里是我自己在做的</span>{' '}
              <strong className="text-ink">产品</strong>
              <span className="text-muted2">。</span>
            </>
          ) : (
            <>
              <span className="text-muted2">↑ Above are shipped client</span>{' '}
              <strong className="text-ink">projects</strong>
              <span className="text-muted2">; here are</span>{' '}
              <strong className="text-ink">products</strong>{' '}
              <span className="text-muted2">I build solo.</span>
            </>
          )}
        </span>
        <span className="shrink-0 rounded-pill border border-brand/30 bg-brand/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-brand">
          Solo · Indie
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const status = STATUS_LABEL[item.status_label] ?? STATUS_LABEL.wip
          return (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <Link
                href={item.permalink}
                className="block h-full rounded-card border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold leading-snug">
                    {pickLocaleField(item.title, locale)}
                  </h3>
                  <span className={`shrink-0 rounded-pill px-2 py-0.5 font-mono text-[10px] uppercase ${status.cls}`}>
                    {status[locale]}
                  </span>
                </div>
                <p className="mt-2 line-clamp-3 text-xs text-muted">
                  {pickLocaleField(item.excerpt, locale)}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-muted2">
                    {item.pricing ? pickLocaleField(item.pricing, locale) : 'Free'}
                  </span>
                  <span className="text-xs font-medium text-brand">详情 →</span>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </SectionFrame>
  )
}
