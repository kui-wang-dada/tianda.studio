import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProducts, getProductBySlug } from '@/lib/content'
import { ProductDetail } from './product-detail'

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

  return <ProductDetail item={item} />
}
