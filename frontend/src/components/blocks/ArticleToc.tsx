'use client'

import { useEffect, useState } from 'react'

export interface TocEntry {
  title: string
  url: string
  items: TocEntry[]
}

interface Props {
  toc: TocEntry[]
  zhLabel: string
  enLabel: string
  isZh: boolean
}

function flattenIds(toc: TocEntry[], out: string[] = []): string[] {
  for (const entry of toc) {
    if (entry.url.startsWith('#')) out.push(entry.url.slice(1))
    if (entry.items.length) flattenIds(entry.items, out)
  }
  return out
}

export function ArticleToc({ toc, zhLabel, enLabel, isZh }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const ids = flattenIds(toc)
    if (ids.length === 0) return

    const headings = ids
      .map((id) => document.getElementById(decodeURIComponent(id)))
      .filter((el): el is HTMLElement => el != null)

    if (headings.length === 0) return

    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        // pick the first heading (in document order) that is visible
        const firstVisible = headings.find((h) => visible.has(h.id))
        if (firstVisible) {
          setActiveId(firstVisible.id)
          return
        }
        // none visible → keep last passed heading above viewport
        const scrollY = window.scrollY + 120
        let lastPassed: HTMLElement | null = null
        for (const h of headings) {
          if (h.offsetTop <= scrollY) lastPassed = h
          else break
        }
        if (lastPassed) setActiveId(lastPassed.id)
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 },
    )

    for (const h of headings) observer.observe(h)
    return () => observer.disconnect()
  }, [toc])

  if (toc.length === 0) return null

  return (
    <nav aria-label={isZh ? '本文目录' : 'Table of contents'} className="text-sm">
      <div className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-muted2">
        {isZh ? zhLabel : enLabel}
      </div>
      <TocList items={toc} activeId={activeId} depth={0} />
    </nav>
  )
}

function TocList({
  items,
  activeId,
  depth,
}: {
  items: TocEntry[]
  activeId: string | null
  depth: number
}) {
  return (
    <ul className={depth === 0 ? 'space-y-1.5' : 'mt-1.5 space-y-1 border-l border-line pl-3'}>
      {items.map((entry) => {
        const id = entry.url.startsWith('#') ? decodeURIComponent(entry.url.slice(1)) : ''
        const isActive = id !== '' && id === activeId
        return (
          <li key={entry.url}>
            <a
              href={entry.url}
              className={`block truncate rounded px-1.5 py-1 leading-snug transition ${
                isActive
                  ? 'bg-brand/10 font-semibold text-brand'
                  : depth === 0
                    ? 'text-ink2 hover:text-brand'
                    : 'text-muted hover:text-brand'
              }`}
              title={entry.title}
            >
              {entry.title}
            </a>
            {entry.items.length > 0 && (
              <TocList items={entry.items} activeId={activeId} depth={depth + 1} />
            )}
          </li>
        )
      })}
    </ul>
  )
}
