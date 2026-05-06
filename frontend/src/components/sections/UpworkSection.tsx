'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLocale } from '@/lib/i18n/use-locale'
import { useLightboxStore } from '@/stores/lightbox.store'
import {
  upworkBadges,
  upworkInfoCard,
  upworkMiniCases,
  upworkNarrative,
  upworkServices,
} from '@/lib/data/upwork'
import { SectionFrame, SectionHead } from '@/components/layout/SectionFrame'

export function UpworkSection() {
  const locale = useLocale()
  const openLightbox = useLightboxStore((s) => s.open)

  const lbImages = upworkMiniCases.map((c) => ({
    src: c.thumb,
    alt: c.title[locale],
    caption: c.title[locale],
  }))

  return (
    <SectionFrame variant="invert" id="upwork">
      <SectionHead
        invert
        num="02"
        eyebrow={locale === 'zh' ? 'Upwork · 接单' : 'Upwork · Hire'}
        title={locale === 'zh' ? '在 Upwork 找我' : 'Hire me on Upwork'}
        sub={
          locale === 'zh'
            ? '一个对接人，从需求到上线全部包。已交付 43 项目，客户分布美 / 欧 / 日。'
            : 'Single point of contact, spec → deploy. 43 shipped for US / EU / JP clients.'
        }
        right={
          <a
            href={upworkInfoCard.profileUrl}
            target="_blank"
            rel="noopener"
            className="hidden text-xs text-brand2 hover:underline md:inline"
          >
            {locale === 'zh' ? '查看完整 Upwork 主页 ↗' : 'Full Upwork profile ↗'}
          </a>
        }
      />

      {/* TOP — credentials hero strip (most valuable signals, oversized) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4 }}
        className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4"
      >
        {upworkBadges.map((b, i) => (
          <motion.div
            key={b.value}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            className={`rounded-xl border px-5 py-4 ${
              b.highlight
                ? 'border-successDot/50 bg-successDot/15 shadow-[0_0_0_1px_rgba(16,185,129,0.2)]'
                : 'border-white/10 bg-white/5'
            }`}
          >
            <div
              className={`font-serif text-[28px] font-bold leading-none md:text-3xl ${
                b.highlight ? 'text-successDot' : 'text-paper'
              }`}
            >
              {b.value}
            </div>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-widest text-muted2">
              {b.label[locale]}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 3-col grid: narrative + mini cases + services on left, info card on right */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          {/* Narrative — bulleted */}
          <motion.ul
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
            className="space-y-2 text-[15px] leading-relaxed text-paper/90"
          >
            {upworkNarrative[locale].map((line, i) => {
              const isHighlight = i === upworkNarrative[locale].length - 1
              return (
                <li
                  key={i}
                  className={`relative pl-6 ${
                    isHighlight ? 'rounded-md border-l-2 border-successDot bg-successDot/10 px-3 py-2 pl-9' : ''
                  }`}
                >
                  <span
                    className={`absolute left-0 top-2 grid h-4 w-4 place-items-center rounded-full font-mono text-[10px] font-semibold ${
                      isHighlight
                        ? 'left-3 bg-successDot text-ink'
                        : 'border border-brand2/40 text-brand2'
                    }`}
                  >
                    {isHighlight ? '★' : i + 1}
                  </span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: line.replace(
                        /\*\*(.+?)\*\*/g,
                        '<strong class="text-paper">$1</strong>',
                      ),
                    }}
                  />
                </li>
              )
            })}
          </motion.ul>

          {/* Mini case strip */}
          <div>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-brand2">
              {locale === 'zh' ? '★ 部分 Upwork 案例' : '★ Selected Upwork cases'}
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {upworkMiniCases.map((c, i) => (
                <motion.button
                  key={c.slug}
                  type="button"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  onClick={() => openLightbox(lbImages, i)}
                  className="group flex flex-col gap-1.5 text-left"
                  aria-label={`${c.title[locale]} 截图`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-white/10 bg-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.thumb}
                      alt={c.title[locale]}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  </div>
                  <div className="text-[12px] font-medium leading-tight text-paper">
                    {c.title[locale]}
                  </div>
                  <div className="font-mono text-[10px] leading-tight text-successDot">
                    ✓ {c.outcome[locale]}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {upworkServices.map((svc) => (
              <div
                key={svc.title.zh}
                className="rounded border-l-2 border-successDot bg-white/5 px-3 py-2"
              >
                <span className="block text-xs font-semibold text-paper">
                  {svc.title[locale]}
                </span>
                <span className="mt-0.5 block font-mono text-[10px] text-muted2">
                  {svc.detail}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — info card */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.2, 0.7, 0.2, 1] }}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
        >
          <div className="divide-y divide-white/5 text-sm">
            {upworkInfoCard.rows.map((row) => (
              <div key={row.k.zh} className="flex justify-between py-2">
                <span className="text-muted2">{row.k[locale]}</span>
                <span className="font-mono text-[12px] font-semibold text-paper">{row.v}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded border-l-[3px] border-successDot bg-successDot/10 px-3 py-2.5 text-[13px] italic leading-relaxed text-paper">
            "{upworkInfoCard.testimonial.quote}"
            <span className="mt-1.5 block text-[11px] not-italic text-muted2">
              — {upworkInfoCard.testimonial.author}
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <a
              href={upworkInfoCard.profileUrl}
              target="_blank"
              rel="noopener"
              className="rounded-md bg-success px-4 py-2.5 text-center text-sm font-semibold text-white hover:brightness-110"
            >
              {locale === 'zh' ? '前往 Upwork 主页 ↗' : 'Go to Upwork ↗'}
            </a>
            <Link
              href="mailto:kui.wang.upwork@gmail.com"
              className="rounded-md border border-white/20 px-4 py-2.5 text-center text-sm text-paper hover:bg-white/5"
            >
              {locale === 'zh' ? '邮件咨询' : 'Email me'}
            </Link>
          </div>
        </motion.div>
      </div>
    </SectionFrame>
  )
}
