import { work, writing, products, novels, shared } from '#site/content'

import type { Locale } from '@/lib/i18n'

export type WorkItem = (typeof work)[number]
export type WritingItem = (typeof writing)[number]
export type ProductItem = (typeof products)[number]
export type NovelItem = (typeof novels)[number]
export type SharedItem = (typeof shared)[number]

const byPublishedDesc = <T extends { published_at: string }>(a: T, b: T) =>
  +new Date(b.published_at) - +new Date(a.published_at)

const onlyPublished = <T extends { status: 'draft' | 'published' }>(item: T) =>
  item.status === 'published'

// ── Work ────────────────────────────────────────────────────────────
export function getWork(): WorkItem[] {
  return [...work].filter(onlyPublished).sort(byPublishedDesc)
}

// 首页排序：app / ai 等"全栈/产品"类项目优先；web3 / 协议类殿后；同类按时间倒序
const TYPE_ORDER: Record<WorkItem['type'], number> = {
  app: 0,
  ai: 1,
  mobile: 2,
  'mini-program': 3,
  web: 4,
  erp: 5,
  web3: 9,
}

export function getFeaturedWork(limit = 6): WorkItem[] {
  return getWork()
    .filter((w) => w.featured)
    .sort((a, b) => {
      const ord = (TYPE_ORDER[a.type] ?? 99) - (TYPE_ORDER[b.type] ?? 99)
      if (ord !== 0) return ord
      return +new Date(b.published_at) - +new Date(a.published_at)
    })
    .slice(0, limit)
}

export function getWorkBySlug(slug: string): WorkItem | undefined {
  return work.find((w) => w.slug === slug)
}

export function getWorkTypes(): WorkItem['type'][] {
  return Array.from(new Set(work.map((w) => w.type)))
}

// ── Writing ─────────────────────────────────────────────────────────
export function getWriting(): WritingItem[] {
  return [...writing].filter(onlyPublished).sort(byPublishedDesc)
}

export function getRecentWriting(limit = 4): WritingItem[] {
  return getWriting().slice(0, limit)
}

export function getWritingBySlug(slug: string): WritingItem | undefined {
  return writing.find((w) => w.slug === slug)
}

// ── Products ────────────────────────────────────────────────────────
export function getProducts(): ProductItem[] {
  return [...products].filter(onlyPublished).sort(byPublishedDesc)
}

export function getFeaturedProducts(limit = 4): ProductItem[] {
  return getProducts()
    .filter((p) => p.featured)
    .slice(0, limit)
}

export function getProductBySlug(slug: string): ProductItem | undefined {
  return products.find((p) => p.slug === slug)
}

// ── Novels ──────────────────────────────────────────────────────────
export function getNovels(): NovelItem[] {
  return [...novels].filter(onlyPublished).sort(byPublishedDesc)
}

export function getRecentNovels(limit = 4): NovelItem[] {
  return getNovels().slice(0, limit)
}

export function getNovelBySlug(slug: string): NovelItem | undefined {
  return novels.find((n) => n.slug === slug)
}

// ── Shared (about, etc.) ────────────────────────────────────────────
export function getSharedBySlug(slug: string): SharedItem | undefined {
  return shared.find((s) => s.slug === slug)
}

// ── Tags ────────────────────────────────────────────────────────────
export function getAllTags(): string[] {
  const all = [
    ...work.flatMap((w) => w.tags),
    ...writing.flatMap((w) => w.tags),
    ...products.flatMap((p) => p.tags),
  ]
  return Array.from(new Set(all)).sort()
}

// ── Locale helpers ──────────────────────────────────────────────────
export function pickLocaleField(field: { zh: string; en: string }, locale: Locale): string {
  return field[locale] ?? field.zh
}
