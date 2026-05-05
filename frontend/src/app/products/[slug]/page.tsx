import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProducts, getProductBySlug } from '@/lib/content'
import { Container } from '@/components/layout/Container'
import { MDXContent } from '@/components/blocks/MDXContent'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const item = getProductBySlug(slug)
  if (!item) return {}
  return { title: item.title.zh, description: item.excerpt.zh }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  const item = getProductBySlug(slug)
  if (!item) notFound()

  return (
    <article className="py-16">
      <Container>
        <Link href="/products" className="text-xs font-mono uppercase tracking-widest text-brand">
          ← Back to products
        </Link>
        <header className="mt-6 border-b border-line pb-8">
          <div className="flex items-center gap-2.5">
            <div className="eyebrow">Product · {item.status_label}</div>
            <span className="font-mono text-[11px] text-muted2">{item.pricing?.zh ?? ''}</span>
          </div>
          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">{item.title.zh}</h1>
          <p className="mt-3 max-w-2xl text-base text-muted">{item.excerpt.zh}</p>
          <a
            href={item.external_url}
            target="_blank"
            rel="noopener"
            className="mt-5 inline-block rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink2"
          >
            前往 {item.title.zh} ↗
          </a>
        </header>
        <div className="prose prose-tianda mt-10 max-w-none">
          <MDXContent code={item.body} />
        </div>
      </Container>
    </article>
  )
}
