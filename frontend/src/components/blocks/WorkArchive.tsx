'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLocale } from '@/lib/i18n/use-locale'
import { useLightboxStore } from '@/stores/lightbox.store'
import { pickLocaleField, type WorkItem } from '@/lib/content'

type FilterTab = 'all' | WorkItem['type']

const TAB_LABELS: Record<FilterTab, { zh: string; en: string }> = {
  all: { zh: '全部', en: 'All' },
  app: { zh: 'APP / 全栈', en: 'APP / Full-Stack' },
  ai: { zh: 'AI', en: 'AI' },
  mobile: { zh: '移动', en: 'Mobile' },
  'mini-program': { zh: '小程序', en: 'Mini Programs' },
  web: { zh: '网站 / 桌面', en: 'Web / Desktop' },
  erp: { zh: 'ERP 后台', en: 'ERP Admin' },
  web3: { zh: 'Web3 / NFT', en: 'Web3 / NFT' },
}

const TAB_ORDER: Record<FilterTab, number> = {
  all: -1, app: 0, ai: 1, mobile: 2, 'mini-program': 3, web: 4, erp: 5, web3: 9,
}

export function WorkArchive({ items }: { items: WorkItem[] }) {
  const locale = useLocale()
  const [tab, setTab] = useState<FilterTab>('all')

  const tabs = useMemo<FilterTab[]>(() => {
    const types = Array.from(new Set(items.map((w) => w.type))) as FilterTab[]
    return (['all', ...types] as FilterTab[]).sort(
      (a, b) => (TAB_ORDER[a] ?? 99) - (TAB_ORDER[b] ?? 99),
    )
  }, [items])

  const filtered = useMemo(
    () => (tab === 'all' ? items : items.filter((w) => w.type === tab)),
    [tab, items],
  )

  const tabCount = (t: FilterTab) =>
    t === 'all' ? items.length : items.filter((w) => w.type === t).length

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-pill border px-3.5 py-1.5 font-mono text-xs transition ${
              tab === key
                ? 'border-ink bg-ink text-paper'
                : 'border-line bg-white text-muted hover:border-brand hover:text-brand'
            }`}
          >
            {TAB_LABELS[key]?.[locale] ?? key}{' '}
            <span className="text-[10px] opacity-60">({tabCount(key)})</span>
          </button>
        ))}
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((item, i) => (
          <motion.div
            key={item.slug}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.3 }}
          >
            <ArchiveCard item={item} />
          </motion.div>
        ))}
      </motion.div>
    </>
  )
}

function ArchiveCard({ item }: { item: WorkItem }) {
  const locale = useLocale()
  const title = pickLocaleField(item.title, locale)
  const openLightbox = useLightboxStore((s) => s.open)

  const galleryImages =
    item.images.length > 0
      ? item.images.map((src) => ({ src, alt: title, caption: title }))
      : item.cover
        ? [{ src: item.cover, alt: title, caption: title }]
        : []

  return (
    <div className="group overflow-hidden rounded-card border border-line bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft">
      <button
        type="button"
        onClick={() => galleryImages.length && openLightbox(galleryImages, 0)}
        disabled={!galleryImages.length}
        className="relative block w-full overflow-hidden bg-gradient-to-br from-[#ebdfca] to-[#dcc9a6]"
        aria-label={`查看 ${title} 截图`}
      >
        <div className="relative flex aspect-[16/10] items-center justify-center text-xs italic text-brandLo">
          {item.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.cover}
              alt={title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <span>{title}</span>
          )}
          {galleryImages.length > 0 && (
            <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded bg-black/55 text-xs text-white opacity-0 transition group-hover:opacity-100">
              ⤢
            </span>
          )}
          {item.images.length > 1 && (
            <span className="absolute bottom-2 left-2 rounded bg-black/55 px-1.5 py-0.5 font-mono text-[10px] text-white">
              {item.images.length} {locale === 'zh' ? '张图' : 'imgs'}
            </span>
          )}
        </div>
      </button>
      <Link href={item.permalink} className="block p-4 hover:bg-brand/5">
        <h3 className="text-base font-semibold leading-snug">{title}</h3>
        {item.title.zh !== title && (
          <p className="mt-0.5 text-xs text-muted2">{item.title.zh}</p>
        )}
        <p className="mt-1.5 line-clamp-2 text-xs text-muted">
          {pickLocaleField(item.excerpt, locale)}
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1">
          {item.tech_stack.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-pill bg-paper2 px-2 py-0.5 font-mono text-[10px] text-muted"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-2.5 flex items-center justify-between font-mono text-[11px] text-muted2">
          <span>{item.period}</span>
          <span className="text-brand">{locale === 'zh' ? '详情 →' : 'Details →'}</span>
        </div>
      </Link>
    </div>
  )
}
