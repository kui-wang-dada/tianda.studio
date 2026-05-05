import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getWriting, getWritingBySlug } from '@/lib/content'
import { Container } from '@/components/layout/Container'
import { MDXContent } from '@/components/blocks/MDXContent'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getWriting().map((w) => ({ slug: w.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const item = getWritingBySlug(slug)
  if (!item) return {}
  return {
    title: `${item.title.zh}`,
    description: item.excerpt.zh,
  }
}

export default async function WritingDetailPage({ params }: PageProps) {
  const { slug } = await params
  const item = getWritingBySlug(slug)
  if (!item) notFound()

  return (
    <article className="py-16">
      <Container>
        <Link href="/writing" className="text-xs font-mono uppercase tracking-widest text-brand">
          ← Back to writing
        </Link>
        <header className="mt-6 border-b border-line pb-6">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted2">
            {item.published_at.slice(0, 10)}
            {item.reading_time && <> · {item.reading_time} min read</>}
          </div>
          <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">{item.title.zh}</h1>
          <p className="mt-3 text-base text-muted">{item.excerpt.zh}</p>
        </header>
        <div className="prose prose-tianda mt-10 max-w-none">
          <MDXContent code={item.body} />
        </div>
      </Container>
    </article>
  )
}
