import type { Metadata } from 'next'
import { getWork } from '@/lib/content'
import { Container } from '@/components/layout/Container'
import { WorkArchive } from '@/components/blocks/WorkArchive'

export const metadata: Metadata = { title: '作品 · Work' }

export default function WorkIndexPage() {
  const items = getWork()

  return (
    <section className="py-16">
      <Container>
        <div className="mb-8">
          <div className="eyebrow">— 作品 · Work —</div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">所有作品</h1>
          <p className="mt-2 text-sm text-muted">
            过去 10 年陆续交付的 {items.length} 个项目 · 按类型筛选 · 点击图片查看截图
          </p>
        </div>
        <WorkArchive items={items} />
      </Container>
    </section>
  )
}
