import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getWriting, getWritingBySlug } from '@/lib/content'
import { WritingDetail } from './writing-detail'

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

  return <WritingDetail item={item} />
}
