'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLocale } from '@/lib/i18n/use-locale'
import { pickLocaleField, type WorkItem } from '@/lib/content'
import { SectionFrame, SectionHead } from '@/components/layout/SectionFrame'
import { useLightboxStore } from '@/stores/lightbox.store'

interface Props {
  items: WorkItem[]
}

export function ProjectsSection({ items }: Props) {
  const locale = useLocale()

  return (
    <SectionFrame variant="paper2" id="work">
      <SectionHead
        num="01"
        eyebrow={locale === 'zh' ? 'Projects 项目集' : 'Projects'}
        title={locale === 'zh' ? '精选作品' : 'Selected Work'}
        sub={
          locale === 'zh'
            ? '十年生产级交付 · 给客户看的实力证明'
            : 'Ten years of production-grade delivery · proof of work for clients'
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <ProjectCard item={item} />
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: items.length * 0.06, duration: 0.4 }}
        >
          <Link
            href="/work"
            className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-card border border-dashed border-line2 bg-paper p-6 text-center transition hover:border-brand hover:bg-white"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-muted2">
              archive
            </span>
            <span className="mt-2 text-base font-semibold text-brand">
              {locale === 'zh' ? '查看全部 20+ 项目 →' : 'See all 20+ projects →'}
            </span>
          </Link>
        </motion.div>
      </div>
    </SectionFrame>
  )
}

function ProjectCard({ item }: { item: WorkItem }) {
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
              {item.images.length} imgs
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
