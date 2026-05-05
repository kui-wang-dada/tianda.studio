'use client'

import { motion } from 'framer-motion'
import { useLocale } from '@/lib/i18n/use-locale'
import { SectionFrame } from '@/components/layout/SectionFrame'
import { FeedbackForm } from '@/components/blocks/FeedbackForm'

export function FeedbackSection() {
  const locale = useLocale()

  return (
    <SectionFrame variant="feedback" id="feedback">
      <div className="relative grid gap-9 md:grid-cols-[1fr_1.4fr] md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
            <span className="text-muted2">07 —</span>{' '}
            {locale === 'zh' ? '留言反馈' : 'Feedback'}
          </div>
          <h3 className="mt-2 text-[28px] font-bold leading-[1.25]">
            {locale === 'zh' ? (
              <>
                有想说的，
                <br />
                就留个言吧。
              </>
            ) : (
              <>
                Got something to say?
                <br />
                Drop me a note.
              </>
            )}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            {locale === 'zh' ? (
              <>
                匿名也可以，姓名邮箱都是选填。雇佣意向、合作提议、或单纯说一句"看到了"——
                <strong className="text-ink">我会读每一条。</strong>
              </>
            ) : (
              <>
                Anonymous OK; name & email optional. Hiring, collab, or just "I saw this"—
                <strong className="text-ink">I read every one.</strong>
              </>
            )}
          </p>
          <div className="mt-4 flex gap-5">
            {[
              { n: '100%', l: locale === 'zh' ? '必读' : 'read' },
              { n: '24h', l: locale === 'zh' ? '通常回复' : 'reply time' },
              { n: '~12', l: locale === 'zh' ? '本周已收到' : 'this week' },
            ].map((s) => (
              <div key={s.n}>
                <div className="font-serif text-[22px] font-bold text-brand">{s.n}</div>
                <div className="font-mono text-[11px] uppercase tracking-wide text-muted2">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <FeedbackForm />
        </motion.div>
      </div>
    </SectionFrame>
  )
}
