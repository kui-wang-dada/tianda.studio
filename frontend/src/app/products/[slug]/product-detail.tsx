'use client'

import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { MDXContent } from '@/components/blocks/MDXContent'
import { pickLocaleField, type ProductItem } from '@/lib/content'
import { useLocale } from '@/lib/i18n/use-locale'

export function ProductDetail({ item }: { item: ProductItem }) {
  const locale = useLocale()
  const title = pickLocaleField(item.title, locale)
  const excerpt = pickLocaleField(item.excerpt, locale)

  return (
    <article className="py-16">
      <Container>
        <Link href="/products" className="text-xs font-mono uppercase tracking-widest text-brand">
          ← {locale === 'zh' ? '回到产品列表' : 'Back to products'}
        </Link>
        <header className="mt-6 border-b border-line pb-8">
          <div className="flex items-center gap-2.5">
            <div className="eyebrow">Product · {item.status_label}</div>
            <span className="font-mono text-[11px] text-muted2">
              {item.pricing ? pickLocaleField(item.pricing, locale) : ''}
            </span>
          </div>
          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-base text-muted">{excerpt}</p>
          <a
            href={item.external_url}
            target="_blank"
            rel="noopener"
            className="mt-5 inline-block rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink2"
          >
            {locale === 'zh' ? `前往 ${title} ↗` : `Visit ${title} ↗`}
          </a>
        </header>
        <div className="prose prose-tianda mt-10 max-w-none">
          <MDXContent code={item.body} />
        </div>
      </Container>
    </article>
  )
}
