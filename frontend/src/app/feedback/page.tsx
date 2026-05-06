'use client'

import { Container } from '@/components/layout/Container'
import { FeedbackForm } from '@/components/blocks/FeedbackForm'
import { useLocale } from '@/lib/i18n/use-locale'

export default function FeedbackPage() {
  const locale = useLocale()

  return (
    <section className="py-16">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="eyebrow">— {locale === 'zh' ? 'Feedback · 留言' : 'Feedback'} —</div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            {locale === 'zh' ? '有想说的，就留个言吧' : 'Drop me a note'}
          </h1>
          <p className="mt-3 text-sm text-muted">
            {locale === 'zh'
              ? '匿名也可以，姓名邮箱都是选填。我会读每一条；通常 24 小时内回复。'
              : 'Anonymous is fine — name and email are both optional. I read every message and usually reply within 24 hours.'}
          </p>
          <div className="mt-6">
            <FeedbackForm />
          </div>
        </div>
      </Container>
    </section>
  )
}
