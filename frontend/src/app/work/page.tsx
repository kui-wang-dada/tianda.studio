'use client'

import { getWork } from '@/lib/content'
import { Container } from '@/components/layout/Container'
import { WorkArchive } from '@/components/blocks/WorkArchive'
import { useLocale } from '@/lib/i18n/use-locale'

export default function WorkIndexPage() {
  const items = getWork()
  const locale = useLocale()

  return (
    <section className="py-16">
      <Container>
        <div className="mb-8">
          <div className="eyebrow">— {locale === 'zh' ? '项目 · Projects' : 'Projects · 项目'} —</div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            {locale === 'zh' ? '所有项目' : 'All projects'}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {locale === 'zh'
              ? `过去 10 年陆续交付的 ${items.length} 个项目 · 按类型筛选 · 点击图片查看截图`
              : `${items.length} projects shipped over 10 years · filter by type · click image for screenshots`}
          </p>
        </div>
        <WorkArchive items={items} />
      </Container>
    </section>
  )
}
