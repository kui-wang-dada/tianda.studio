'use client'

import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { MDXContent } from '@/components/blocks/MDXContent'
import { ArticleToc, type TocEntry } from '@/components/blocks/ArticleToc'
import { pickLocaleField, type WritingItem } from '@/lib/content'
import { useLocale } from '@/lib/i18n/use-locale'

export function WritingDetail({ item }: { item: WritingItem }) {
  const locale = useLocale()
  const isZh = locale === 'zh'
  const title = pickLocaleField(item.title, locale)
  const excerpt = pickLocaleField(item.excerpt, locale)
  const toc = (item.toc ?? []) as TocEntry[]
  const hasToc = toc.length > 0

  return (
    <article className="py-12 md:py-16">
      <Container>
        <Link href="/writing" className="text-xs font-mono uppercase tracking-widest text-brand">
          ← {isZh ? '回到文章列表' : 'Back to writing'}
        </Link>

        <header className="mt-6 border-b border-line pb-6">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted2">
            {item.published_at.slice(0, 10)}
            {item.reading_time && (
              <>
                {' · '}
                {item.reading_time} {isZh ? '分钟' : 'min read'}
              </>
            )}
          </div>
          <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-base text-muted">{excerpt}</p>
        </header>

        {/* Mobile collapsible TOC */}
        {hasToc && (
          <details className="mt-6 rounded-card border border-line bg-paper2 p-4 lg:hidden">
            <summary className="cursor-pointer font-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-brand">
              {isZh ? '本文目录' : 'Contents'}
            </summary>
            <div className="mt-3">
              <ArticleToc
                toc={toc}
                zhLabel="本文目录"
                enLabel="Contents"
                isZh={isZh}
              />
            </div>
          </details>
        )}

        <div
          className={
            hasToc
              ? 'mt-8 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]'
              : 'mt-8'
          }
        >
          {hasToc && (
            <aside className="hidden lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
                <ArticleToc
                  toc={toc}
                  zhLabel="本文目录"
                  enLabel="On this page"
                  isZh={isZh}
                />
              </div>
            </aside>
          )}

          <div className="prose prose-tianda max-w-none scroll-mt-24">
            <MDXContent code={item.body} />
          </div>
        </div>
      </Container>
    </article>
  )
}
