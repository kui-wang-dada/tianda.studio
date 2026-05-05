import type { Metadata } from 'next'
import Link from 'next/link'
import { getProducts } from '@/lib/content'
import { Container } from '@/components/layout/Container'

export const metadata: Metadata = { title: 'Products · 产品' }

const STATUS_COLOR: Record<string, string> = {
  live: 'bg-emerald-100 text-emerald-700',
  beta: 'bg-amber-100 text-amber-700',
  wip: 'bg-stone-200 text-stone-700',
}

export default function ProductsIndexPage() {
  const items = getProducts()

  return (
    <section className="py-16">
      <Container>
        <div className="mb-8">
          <div className="eyebrow">— Products · 产品 —</div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Tools &amp; Products</h1>
          <p className="mt-2 text-sm text-muted">{items.length} 个 · 持续开发中的小工具与产品</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={item.permalink}
              className="block rounded-card border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-base font-semibold">{item.title.zh}</h3>
                <span className={`rounded-pill px-2 py-0.5 font-mono text-[10px] uppercase ${STATUS_COLOR[item.status_label] ?? STATUS_COLOR.wip}`}>
                  {item.status_label}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted line-clamp-3">{item.excerpt.zh}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-mono text-[11px] text-muted2">
                  {item.pricing?.zh ?? 'Free'}
                </span>
                <span className="text-xs font-medium text-brand">查看 →</span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
