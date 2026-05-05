'use client'

import { motion } from 'framer-motion'
import { useLocale } from '@/lib/i18n/use-locale'
import { experience } from '@/lib/data/experience'
import { SectionFrame, SectionHead } from '@/components/layout/SectionFrame'

export function ExperienceSection() {
  const locale = useLocale()

  return (
    <SectionFrame variant="paper" id="experience">
      <SectionHead
        num="04"
        eyebrow={locale === 'zh' ? '经历' : 'Path'}
        title={locale === 'zh' ? '职业路径' : 'Career timeline'}
        sub={locale === 'zh' ? '从大厂到独立工作室 · 2016 — 至今' : 'From big tech to indie studio · 2016 — now'}
      />

      <div className="relative mx-auto max-w-[820px] pl-7">
        <motion.span
          aria-hidden
          className="absolute left-[7px] top-2 w-px origin-top bg-gradient-to-b from-brand to-line2"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ height: 'calc(100% - 16px)' }}
        />
        {experience.map((row, i) => (
          <motion.div
            key={row.when}
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
            className="relative grid grid-cols-[110px_1fr] items-start gap-7 border-b border-dashed border-line py-4 last:border-b-0"
          >
            <span
              className={`absolute -left-[25px] top-6 h-[11px] w-[11px] rounded-full border-2 border-brand ${
                row.isNow ? 'bg-brand shadow-[0_0_0_4px_rgba(196,127,58,0.2)]' : 'bg-paper'
              }`}
            />
            <div className="pt-1 font-mono text-[11px] tracking-wide text-muted2">
              {row.when}
              {row.isNow && (
                <span className="ml-1 inline-block rounded bg-brand px-1.5 py-px text-[9px] text-white">
                  {locale === 'zh' ? '现在' : 'NOW'}
                </span>
              )}
            </div>
            <div className="text-sm leading-relaxed">
              <span className="font-semibold text-ink">{row.role[locale]}</span>
              <span className="ml-1 text-brand">@ {row.company[locale]}</span>
              <div className="mt-1 text-[13px] text-muted">{row.description[locale]}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionFrame>
  )
}
