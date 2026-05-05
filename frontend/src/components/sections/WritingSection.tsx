'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLocale } from '@/lib/i18n/use-locale'
import { pickLocaleField, type NovelItem, type WritingItem } from '@/lib/content'
import { SectionFrame, SectionHead } from '@/components/layout/SectionFrame'

interface Props {
  articles: WritingItem[]
  articlesTotal: number
  novels: NovelItem[]
  novelsTotal: number
  num: string
}

export function WritingSection({ articles, articlesTotal, novels, novelsTotal, num }: Props) {
  const locale = useLocale()
  const hasArticles = articles.length > 0
  const hasNovels = novels.length > 0

  if (!hasArticles && !hasNovels) return null

  const gridClass = hasArticles && hasNovels ? 'md:grid-cols-2' : 'md:grid-cols-1'

  return (
    <SectionFrame variant="paper" id="writing">
      <SectionHead
        num={num}
        eyebrow={locale === 'zh' ? '文章 · Writing' : 'Writing'}
        title={locale === 'zh' ? '最近笔记' : 'Recent notes'}
        sub={
          locale === 'zh'
            ? '左侧技术随笔 · 右侧小说连载'
            : 'Tech notes on the left · fiction on the right'
        }
      />

      <div className={`grid grid-cols-1 gap-10 ${gridClass}`}>
        {hasArticles && (
          <Column
            heading={locale === 'zh' ? '技术文章' : 'Tech articles'}
            archiveHref="/writing"
            archiveLabel={
              locale === 'zh' ? `查看全部 ${articlesTotal} 篇 →` : `All ${articlesTotal} articles →`
            }
          >
            {articles.map((item, i) => (
              <Row
                key={item.slug}
                href={item.permalink}
                date={item.published_at}
                title={pickLocaleField(item.title, locale)}
                tail={item.reading_time ? `${item.reading_time} ${locale === 'zh' ? '分钟' : 'min'}` : ''}
                delay={i * 0.05}
              />
            ))}
          </Column>
        )}

        {hasNovels && (
          <Column
            heading={locale === 'zh' ? '小说连载' : 'Fiction'}
            archiveHref="/novels"
            archiveLabel={
              locale === 'zh' ? `查看全部 ${novelsTotal} 部 →` : `All ${novelsTotal} novels →`
            }
          >
            {novels.map((item, i) => (
              <Row
                key={item.slug}
                href={item.permalink}
                date={item.published_at}
                title={pickLocaleField(item.title, locale)}
                tail=""
                delay={i * 0.05}
              />
            ))}
          </Column>
        )}
      </div>
    </SectionFrame>
  )
}

function Column({
  heading,
  archiveHref,
  archiveLabel,
  children,
}: {
  heading: string
  archiveHref: string
  archiveLabel: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between border-b border-line2 pb-2">
        <h3 className="font-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-muted">
          {heading}
        </h3>
        <Link href={archiveHref} className="text-xs text-brand hover:underline">
          {archiveLabel}
        </Link>
      </div>
      <ul className="divide-y divide-line/70">{children}</ul>
    </div>
  )
}

function Row({
  href,
  date,
  title,
  tail,
  delay,
}: {
  href: string
  date: string
  title: string
  tail: string
  delay: number
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Link
        href={href}
        className="group grid grid-cols-[90px_1fr_auto] items-baseline gap-4 py-3 transition hover:text-brand"
      >
        <time className="font-mono text-xs text-muted2">{date.slice(0, 10)}</time>
        <h4 className="text-[15px] font-medium leading-snug">{title}</h4>
        <span className="font-mono text-[11px] text-muted2 transition group-hover:text-brand">
          {tail} <span className="text-brand">→</span>
        </span>
      </Link>
    </motion.li>
  )
}
