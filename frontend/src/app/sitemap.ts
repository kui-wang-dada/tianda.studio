import type { MetadataRoute } from 'next'
import { getNovels, getProducts, getWork, getWriting } from '@/lib/content'

export const dynamic = 'force-static'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tianda.studio'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/work`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/writing`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/novels`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${SITE_URL}/products`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/feedback`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ]

  const work = getWork().map((w) => ({
    url: `${SITE_URL}${w.permalink}`,
    lastModified: w.published_at,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const writing = getWriting().map((w) => ({
    url: `${SITE_URL}${w.permalink}`,
    lastModified: w.published_at,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const products = getProducts().map((p) => ({
    url: `${SITE_URL}${p.permalink}`,
    lastModified: p.published_at,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const novels = getNovels().map((n) => ({
    url: `${SITE_URL}${n.permalink}`,
    lastModified: n.published_at,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...staticRoutes, ...work, ...writing, ...products, ...novels]
}
