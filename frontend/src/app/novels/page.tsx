import type { Metadata } from 'next'
import Link from 'next/link'
import { getNovels } from '@/lib/content'
import { Container } from '@/components/layout/Container'

export const metadata: Metadata = { title: 'Novels · 小说' }

export default function NovelsIndexPage() {
  const items = getNovels()

  return (
    <section className="py-16">
      <Container>
        <div className="mb-8">
          <div className="eyebrow">— Novels · 小说 —</div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">小说连载</h1>
          <p className="mt-2 text-sm text-muted">{items.length} 部 · 业余写作</p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-card border border-dashed border-line2 bg-paper p-10 text-center text-sm text-muted">
            暂无小说 · Coming soon
          </div>
        ) : (
          <ul className="overflow-hidden rounded-card border border-line bg-white">
            {items.map((item, idx) => (
              <li key={item.slug} className="border-b border-line last:border-b-0">
                <Link
                  href={item.permalink}
                  className="grid grid-cols-[80px_1fr_120px] items-center gap-6 px-6 py-5 transition hover:bg-brand/5"
                >
                  <span className="font-mono text-xl font-semibold text-brand">№{String(items.length - idx).padStart(2, '0')}</span>
                  <div>
                    <h3 className="text-base font-semibold leading-snug">{item.title.zh}</h3>
                    <p className="mt-1 text-xs text-muted line-clamp-2">{item.excerpt.zh}</p>
                  </div>
                  <div className="text-right font-mono text-[11px] tracking-wider text-muted2">
                    <div>{item.published_at.slice(0, 10)}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  )
}
