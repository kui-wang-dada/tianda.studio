import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { FeedbackForm } from '@/components/blocks/FeedbackForm'

export const metadata: Metadata = { title: 'Feedback · 留言' }

export default function FeedbackPage() {
  return (
    <section className="py-16">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="eyebrow">— Feedback · 留言 —</div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            有想说的，就留个言吧
          </h1>
          <p className="mt-3 text-sm text-muted">
            匿名也可以，姓名邮箱都是选填。我会读每一条；通常 24 小时内回复。
          </p>
          <div className="mt-6">
            <FeedbackForm />
          </div>
        </div>
      </Container>
    </section>
  )
}
