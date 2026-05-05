import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getWork, getWorkBySlug } from '@/lib/content'
import { Container } from '@/components/layout/Container'
import { MDXContent } from '@/components/blocks/MDXContent'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getWork().map((w) => ({ slug: w.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const item = getWorkBySlug(slug)
  if (!item) return {}
  return {
    title: `${item.title.zh} · ${item.title.en}`,
    description: item.excerpt.zh,
  }
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params
  const item = getWorkBySlug(slug)
  if (!item) notFound()

  return (
    <article className="py-16">
      <Container>
        <Link href="/work" className="text-xs font-mono uppercase tracking-widest text-brand">
          ← Back to all work
        </Link>
        <header className="mt-6 border-b border-line pb-8">
          <div className="eyebrow">{item.type} · {item.period}</div>
          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            {item.title.zh}
            <span className="block text-2xl font-normal italic text-muted">
              {item.title.en}
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted leading-relaxed">{item.excerpt.zh}</p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {item.tech_stack.map((t) => (
              <span key={t} className="rounded-pill bg-paper2 px-2.5 py-1 font-mono text-[11px] text-muted">
                {t}
              </span>
            ))}
          </div>
          {item.external_url && (
            <a
              href={item.external_url}
              target="_blank"
              rel="noopener"
              className="mt-5 inline-block rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink2"
            >
              访问站点 ↗
            </a>
          )}
        </header>
        <div className="prose prose-tianda mt-10 max-w-none">
          <MDXContent code={item.body} />
        </div>
      </Container>
    </article>
  )
}
