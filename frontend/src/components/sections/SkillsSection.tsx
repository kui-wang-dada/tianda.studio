'use client'

import { motion } from 'framer-motion'
import { useLocale } from '@/lib/i18n/use-locale'
import { skills } from '@/lib/data/skills'
import { SectionFrame, SectionHead } from '@/components/layout/SectionFrame'

export function SkillsSection() {
  const locale = useLocale()

  return (
    <SectionFrame variant="paper2" id="skills">
      <SectionHead
        num="05"
        eyebrow={locale === 'zh' ? '技术栈' : 'Stack'}
        title={locale === 'zh' ? '我熟悉的技术栈' : 'Skills & Stack'}
      />
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {skills.map((group, i) => (
          <motion.div
            key={group.title.zh}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
            className="rounded-card border border-line bg-white p-5"
          >
            <h4 className="mb-2.5 flex items-center gap-2 text-sm font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              {group.title[locale]}
            </h4>
            <div className="font-mono text-xs leading-[1.85] text-ink2">
              {group.items.map((item) => (
                <div key={item}>{item}</div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionFrame>
  )
}
