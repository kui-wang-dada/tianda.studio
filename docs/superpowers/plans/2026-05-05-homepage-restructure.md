# Homepage Restructure (V1.5) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the homepage according to the 2026-05-05 design — fix identity (添达 Kevin), de-duplicate Projects vs Upwork, add a new Products section, split writing into tech vs novels, and reorder sections.

**Architecture:** Pure frontend changes within the existing Next.js static-export setup. No new dependencies, no SSR changes, no backend touches. Velite gets one new collection (`novels`); the rest is component / data / route restructuring.

**Tech Stack:** Next.js 15 App Router (`output: 'export'`), TypeScript, Tailwind 3, Velite + MDX, Framer Motion, Zustand. No frontend unit-test framework — verification per task is `pnpm tsc --noEmit`, `pnpm build` (when route or velite shape changes), and manual smoke in `pnpm dev`.

**Spec:** [`docs/superpowers/specs/2026-05-05-homepage-restructure-design.md`](../specs/2026-05-05-homepage-restructure-design.md)

**Working directory for all `pnpm` commands:** `frontend/` — i.e. `cd frontend && pnpm tsc` or run via `pnpm --dir frontend tsc`.

---

## Task 1: Hero — replace name and remove `~/` chip

**Files:**
- Modify: `frontend/src/components/sections/HeroSection.tsx`

- [ ] **Step 1: Update the resume image caption to drop "王奎"**

In `HeroSection.tsx`, replace the `RESUME_IMAGES` constant at the top of the file:

```tsx
const RESUME_IMAGES = [
  { src: '/img/resume/cn.png', alt: '中文简历', caption: '中文简历 · 添达 Kevin' },
  { src: '/img/resume/en.png', alt: 'EN Resume', caption: 'English Resume · Kevin Wang' },
]
```

(English resume image text itself still says "Kevin Wang" — leaving that caption alone is intentional.)

- [ ] **Step 2: Replace the H1 to use 添达 / Tianda instead of 王奎 / Wang**

Replace the entire `<h1>` block (currently roughly lines 32-37):

```tsx
<h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight md:text-[56px]">
  {locale === 'zh' ? '添达' : 'Tianda'}{' '}
  <span className="bg-brand-gradient bg-clip-text text-transparent">
    {locale === 'zh' ? 'Kevin' : 'Kevin'}
  </span>
</h1>
```

- [ ] **Step 3: Remove the `~/` chip and blinking cursor from the role line**

Replace the `AnimateIn delay={0.1}` block that contains the role line. New version (drop the `<span>~/</span>` chip and the `<span className="cursor-blink ...">`):

```tsx
<AnimateIn delay={0.1}>
  <div className="mt-3 flex flex-wrap items-center gap-2.5 text-[15px] text-muted">
    <span>
      {locale === 'zh'
        ? '全栈工程师 / AI 应用 / Web3 NFT'
        : 'Full-Stack · AI Apps · Web3 NFT'}
    </span>
  </div>
</AnimateIn>
```

- [ ] **Step 4: Verify type check + visual smoke**

Run: `pnpm --dir frontend tsc`
Expected: no errors.

Run: `pnpm --dir frontend dev` and load `http://localhost:3000`. Confirm:
- Hero shows `添达 Kevin` (中文) / `Tianda Kevin` (EN) — no "王奎" / "Wang" anywhere
- Below the H1: a single line with "全栈工程师 / AI 应用 / Web3 NFT" — no terminal chip, no blinking cursor
- Resume thumbnail caption (lightbox) reads `中文简历 · 添达 Kevin`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/sections/HeroSection.tsx
git commit -m "feat(hero): rebrand to 添达 Kevin and drop terminal chip"
```

---

## Task 2: Projects section — drop tabs, slice 5, fix archive wording

**Files:**
- Modify: `frontend/src/components/sections/ProjectsSection.tsx`
- Modify: `frontend/src/app/page.tsx` (one-line change to `getFeaturedWork(6)` → `getFeaturedWork(5)`)

- [ ] **Step 1: Change homepage to fetch 5 featured items**

In `frontend/src/app/page.tsx` line 11:

```tsx
const featuredWork = getFeaturedWork(5)
```

(Just changing the number — `getFeaturedWork`'s default stays at 6 for any future caller.)

- [ ] **Step 2: Strip the tab UI, the right-side counter, and the constants used only for tabs**

Open `frontend/src/components/sections/ProjectsSection.tsx`. Replace the file contents with:

```tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLocale } from '@/lib/i18n/use-locale'
import { pickLocaleField, type WorkItem } from '@/lib/content'
import { SectionFrame, SectionHead } from '@/components/layout/SectionFrame'
import { useLightboxStore } from '@/stores/lightbox.store'

interface Props {
  items: WorkItem[]
}

export function ProjectsSection({ items }: Props) {
  const locale = useLocale()

  return (
    <SectionFrame variant="paper2" id="work">
      <SectionHead
        num="01"
        eyebrow={locale === 'zh' ? 'Projects 项目集' : 'Projects'}
        title={locale === 'zh' ? '精选作品' : 'Selected Work'}
        sub={
          locale === 'zh'
            ? '十年生产级交付 · 给客户看的实力证明'
            : 'Ten years of production-grade delivery · proof of work for clients'
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <ProjectCard item={item} />
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: items.length * 0.06, duration: 0.4 }}
        >
          <Link
            href="/work"
            className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-card border border-dashed border-line2 bg-paper p-6 text-center transition hover:border-brand hover:bg-white"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-muted2">
              archive
            </span>
            <span className="mt-2 text-base font-semibold text-brand">
              {locale === 'zh' ? '查看全部 20+ 项目 →' : 'See all 20+ projects →'}
            </span>
          </Link>
        </motion.div>
      </div>
    </SectionFrame>
  )
}

function ProjectCard({ item }: { item: WorkItem }) {
  const locale = useLocale()
  const title = pickLocaleField(item.title, locale)
  const openLightbox = useLightboxStore((s) => s.open)

  const galleryImages =
    item.images.length > 0
      ? item.images.map((src) => ({ src, alt: title, caption: title }))
      : item.cover
        ? [{ src: item.cover, alt: title, caption: title }]
        : []

  return (
    <div className="group overflow-hidden rounded-card border border-line bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft">
      <button
        type="button"
        onClick={() => galleryImages.length && openLightbox(galleryImages, 0)}
        disabled={!galleryImages.length}
        className="relative block w-full overflow-hidden bg-gradient-to-br from-[#ebdfca] to-[#dcc9a6]"
        aria-label={`查看 ${title} 截图`}
      >
        <div className="relative flex aspect-[16/10] items-center justify-center text-xs italic text-brandLo">
          {item.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.cover}
              alt={title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <span>{title}</span>
          )}
          {galleryImages.length > 0 && (
            <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded bg-black/55 text-xs text-white opacity-0 transition group-hover:opacity-100">
              ⤢
            </span>
          )}
          {item.images.length > 1 && (
            <span className="absolute bottom-2 left-2 rounded bg-black/55 px-1.5 py-0.5 font-mono text-[10px] text-white">
              {item.images.length} imgs
            </span>
          )}
        </div>
      </button>
      <Link href={item.permalink} className="block p-4 hover:bg-brand/5">
        <h3 className="text-base font-semibold leading-snug">{title}</h3>
        {item.title.zh !== title && (
          <p className="mt-0.5 text-xs text-muted2">{item.title.zh}</p>
        )}
        <p className="mt-1.5 line-clamp-2 text-xs text-muted">
          {pickLocaleField(item.excerpt, locale)}
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1">
          {item.tech_stack.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-pill bg-paper2 px-2 py-0.5 font-mono text-[10px] text-muted"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-2.5 flex items-center justify-between font-mono text-[11px] text-muted2">
          <span>{item.period}</span>
          <span className="text-brand">详情 →</span>
        </div>
      </Link>
    </div>
  )
}
```

Key removals: `useState`, `useMemo`, `TAB_LABELS`, `TAB_ORDER`, `FilterTab`, the tab `<button>` row, the `right={...}` counter on `SectionHead`, and the `<motion.div layout>` wrapper (no longer needed without filter animation). Card markup is unchanged.

- [ ] **Step 3: Verify**

Run: `pnpm --dir frontend tsc`
Expected: no errors.

Run dev server and check homepage: 5 project cards + 1 dashed "查看全部 20+ 项目 →" card, no tab row, no counter.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/page.tsx frontend/src/components/sections/ProjectsSection.tsx
git commit -m "feat(projects): drop tag tabs, show 5 + archive link"
```

---

## Task 3: Promote two more `featured: true` work items so the homepage has 5

**Files:**
- Modify: 2 of these MDX files (Kevin to confirm — defaults below):
  - `content/work/wholeren-app.mdx` (full-stack ERP / app — covers a missing category)
  - `content/work/astriddao-cdp.mdx` (Web3 DeFi protocol — diversifies tech mix)

> **Pre-task confirmation:** The current `featured: true` set is `bluez-nft-marketplace`, `obico-3d-monitor`, `venus-ai-skincare` (3 items). To reach 5, the defaults above are picked for tech-mix diversity. If Kevin wants different ones from the remaining `content/work/*.mdx`, swap the two file paths below before running steps 1-2.

- [ ] **Step 1: Promote `wholeren-app.mdx`**

Open `content/work/wholeren-app.mdx`. In the frontmatter, change `featured: false` to `featured: true`. (If `featured` is missing, add it under the existing fields.)

- [ ] **Step 2: Promote `astriddao-cdp.mdx`**

Same change in `content/work/astriddao-cdp.mdx`: `featured: true`.

- [ ] **Step 3: Verify count**

Run:
```bash
grep -l "featured: true" content/work/*.mdx | wc -l
```
Expected: `5`.

- [ ] **Step 4: Verify homepage shows 5 cards**

Run: `pnpm --dir frontend dev`, load `http://localhost:3000`. The Projects section should now show exactly 5 project cards plus the "查看全部 20+ 项目" archive card.

- [ ] **Step 5: Commit**

```bash
git add content/work/wholeren-app.mdx content/work/astriddao-cdp.mdx
git commit -m "content(work): promote 2 more items to featured"
```

---

## Task 4: Upwork section — restructure data file

**Files:**
- Modify: `frontend/src/lib/data/upwork.ts`

- [ ] **Step 1: Replace `upworkBadges` with the four most-valuable signals**

In `lib/data/upwork.ts`, replace the existing `upworkBadges` export with:

```ts
export const upworkBadges: UpworkBadge[] = [
  { value: 'Top Rated Plus', label: { zh: '官方认证 · Plus', en: 'Verified · Plus' }, highlight: true },
  { value: '100%', label: { zh: 'Job Success', en: 'Job Success' } },
  { value: '$60K+', label: { zh: '累计收入', en: 'Total earned' } },
  { value: '43 / 2,233', label: { zh: '项目数 / 工时', en: 'Jobs / hours' } },
]
```

- [ ] **Step 2: Add the narrative copy export**

Add new exports near the bottom of `lib/data/upwork.ts` (after `upworkBadges`):

```ts
export const upworkNarrative = {
  zh: 'Upwork 上独立接单 5 年，累计 43 个项目、2,233 小时、$60K+ 交付，100% Job Success Rate · Top Rated Plus。客户来自 US / EU / JP，多为创业团队 / 独立产品负责人。一人对接、按周交付、报价透明 —— 从需求到上线全部包。不接超出我能力栈的活、不接需要纯外包搬砖的活。',
  en: 'Five years of solo contracting on Upwork — 43 projects, 2,233 hours, $60K+ delivered, 100% Job Success · Top Rated Plus. Clients across US / EU / JP, mostly founders and indie product owners. Single point of contact, weekly delivery cadence, transparent pricing — spec to deploy in one hand. I do not take work outside my stack, and I do not do staff-aug grunt work.',
}
```

- [ ] **Step 3: Add the 5-item mini case strip**

Add this export below `upworkNarrative`:

```ts
export interface UpworkMiniCase {
  slug: string
  thumb: string
  title: { zh: string; en: string }
  outcome: { zh: string; en: string }
}

export const upworkMiniCases: UpworkMiniCase[] = [
  {
    slug: 'venus-ai-skincare',
    thumb: '/img/project/venus/thumb.png',
    title: { zh: 'Venus AI 护肤', en: 'Venus AI Skincare' },
    outcome: { zh: '上线 JP App Store', en: 'Live on JP App Store' },
  },
  {
    slug: 'obico-3d-monitor',
    thumb: '/img/project/obico/thumb.png',
    title: { zh: 'Obico 3D 监控', en: 'Obico 3D Monitor' },
    outcome: { zh: '+30% 留存', en: '+30% retention' },
  },
  {
    slug: 'bluez-nft-marketplace',
    thumb: '/img/project/bluez/thumb.png',
    title: { zh: 'Bluez NFT 市场', en: 'Bluez NFT' },
    outcome: { zh: '多链上线', en: 'Multi-chain live' },
  },
  {
    slug: 'wholeren-app',
    thumb: '/img/project/wholeren/thumb.png',
    title: { zh: 'Wholeren 留学 App', en: 'Wholeren App' },
    outcome: { zh: '万级用户', en: '10K+ users' },
  },
  {
    slug: 'astriddao-cdp',
    thumb: '/img/project/astriddao/thumb.png',
    title: { zh: 'AstridDAO CDP', en: 'AstridDAO CDP' },
    outcome: { zh: '主网上线', en: 'Mainnet live' },
  },
]
```

> **Note:** thumb paths follow the existing `/img/project/<slug>/thumb.png` convention. If a slug's image doesn't exist (e.g. `wholeren` or `astriddao`), the `<img>` will 404 — verification (Step 7) will catch this. If a file is missing, replace the `thumb` value with `/img/project/<slug>/cover.png` or any existing image under that project's folder.

- [ ] **Step 4: Extend the info card with three more rows**

Replace the `upworkInfoCard.rows` array (keep `profileUrl` and `testimonial` intact):

```ts
export const upworkInfoCard = {
  profileUrl: 'https://www.upwork.com/freelancers/~012a1e9c108e49cd19?viewMode=1',
  rows: [
    { k: { zh: '客户分布', en: 'Client regions' }, v: 'US · EU · JP' },
    { k: { zh: '交付节奏', en: 'Delivery cadence' }, v: 'Weekly demos' },
    { k: { zh: '可用时段', en: 'Availability' }, v: '30+ hrs/wk' },
    { k: { zh: '时区', en: 'Timezone' }, v: 'UTC+8 (Shanghai)' },
    { k: { zh: '语言', en: 'Languages' }, v: '中 · EN (Pro)' },
    { k: { zh: '合作模式', en: 'Engagement' }, v: 'Hourly · Fixed' },
    { k: { zh: '项目周期', en: 'Project length' }, v: '2 weeks — 6 months' },
    { k: { zh: '技术栈', en: 'Stack' }, v: 'Next · FastAPI · LLM' },
  ],
  testimonial: {
    quote:
      'Kevin delivered our RAG system in three weeks. Clean code, great communication.',
    author: 'Recent Upwork client, US',
  },
}
```

- [ ] **Step 5: Remove `upworkCases` and `upworkScreenshots` (no longer used)**

Delete the entire `upworkCases` export and the entire `upworkScreenshots` export (and their `UpworkCase` / `UpworkScreenshot` interfaces if not referenced elsewhere). Run a quick check to make sure nothing else imports them:

```bash
grep -rn "upworkCases\|upworkScreenshots\|UpworkCase\b\|UpworkScreenshot" frontend/src --include='*.ts' --include='*.tsx'
```
Expected (after Task 5 finishes): only the `lib/data/upwork.ts` file matches. **For now**, after deleting these exports, you'll still have one usage in `UpworkSection.tsx` — that's fine because Task 5 immediately rewrites `UpworkSection.tsx`. **Do not run tsc between Step 5 and Task 5 — it will fail until Task 5 lands.** Bundle the commit at the end of Task 5.

- [ ] **Step 6: Hold commit**

Do NOT commit yet — `UpworkSection.tsx` still references the deleted exports. Proceed to Task 5; commit at the end of Task 5.

---

## Task 5: Upwork section — rewrite component

**Files:**
- Modify: `frontend/src/components/sections/UpworkSection.tsx`

- [ ] **Step 1: Replace the file with the new layout**

Replace the entire contents of `frontend/src/components/sections/UpworkSection.tsx` with:

```tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLocale } from '@/lib/i18n/use-locale'
import { useLightboxStore } from '@/stores/lightbox.store'
import {
  upworkBadges,
  upworkInfoCard,
  upworkMiniCases,
  upworkNarrative,
  upworkServices,
} from '@/lib/data/upwork'
import { SectionFrame, SectionHead } from '@/components/layout/SectionFrame'

export function UpworkSection() {
  const locale = useLocale()
  const openLightbox = useLightboxStore((s) => s.open)

  const lbImages = upworkMiniCases.map((c) => ({
    src: c.thumb,
    alt: c.title[locale],
    caption: c.title[locale],
  }))

  return (
    <SectionFrame variant="invert" id="upwork">
      <SectionHead
        invert
        num="02"
        eyebrow={locale === 'zh' ? 'Upwork · 接单' : 'Upwork · Hire'}
        title={locale === 'zh' ? '在 Upwork 找我' : 'Hire me on Upwork'}
        sub={
          locale === 'zh'
            ? '一个对接人，从需求到上线全部包。已交付 43 项目，客户分布美 / 欧 / 日。'
            : 'Single point of contact, spec → deploy. 43 shipped for US / EU / JP clients.'
        }
        right={
          <a
            href={upworkInfoCard.profileUrl}
            target="_blank"
            rel="noopener"
            className="hidden text-xs text-brand2 hover:underline md:inline"
          >
            {locale === 'zh' ? '查看完整 Upwork 主页 ↗' : 'Full Upwork profile ↗'}
          </a>
        }
      />

      {/* TOP — credentials hero strip (most valuable signals, oversized) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4 }}
        className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4"
      >
        {upworkBadges.map((b, i) => (
          <motion.div
            key={b.value}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            className={`rounded-xl border px-5 py-4 ${
              b.highlight
                ? 'border-successDot/50 bg-successDot/15 shadow-[0_0_0_1px_rgba(16,185,129,0.2)]'
                : 'border-white/10 bg-white/5'
            }`}
          >
            <div
              className={`font-serif text-[28px] font-bold leading-none md:text-3xl ${
                b.highlight ? 'text-successDot' : 'text-paper'
              }`}
            >
              {b.value}
            </div>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-widest text-muted2">
              {b.label[locale]}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 3-col grid: narrative + mini cases + services on left, info card on right */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          {/* Narrative */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
            className="text-[15px] leading-relaxed text-paper/90"
          >
            {upworkNarrative[locale]}
          </motion.p>

          {/* Mini case strip */}
          <div>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-brand2">
              {locale === 'zh' ? '★ 部分 Upwork 案例' : '★ Selected Upwork cases'}
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
              {upworkMiniCases.map((c, i) => (
                <motion.button
                  key={c.slug}
                  type="button"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  onClick={() => openLightbox(lbImages, i)}
                  className="group flex flex-col gap-1.5 text-left"
                  aria-label={`${c.title[locale]} 截图`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-white/10 bg-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.thumb}
                      alt={c.title[locale]}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  </div>
                  <div className="text-[12px] font-medium leading-tight text-paper">
                    {c.title[locale]}
                  </div>
                  <div className="font-mono text-[10px] leading-tight text-successDot">
                    ✓ {c.outcome[locale]}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {upworkServices.map((svc) => (
              <div
                key={svc.title.zh}
                className="rounded border-l-2 border-successDot bg-white/5 px-3 py-2"
              >
                <span className="block text-xs font-semibold text-paper">
                  {svc.title[locale]}
                </span>
                <span className="mt-0.5 block font-mono text-[10px] text-muted2">
                  {svc.detail}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — info card */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.2, 0.7, 0.2, 1] }}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
        >
          <div className="divide-y divide-white/5 text-sm">
            {upworkInfoCard.rows.map((row) => (
              <div key={row.k.zh} className="flex justify-between py-2">
                <span className="text-muted2">{row.k[locale]}</span>
                <span className="font-mono text-[12px] font-semibold text-paper">{row.v}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded border-l-[3px] border-successDot bg-successDot/10 px-3 py-2.5 text-[13px] italic leading-relaxed text-paper">
            "{upworkInfoCard.testimonial.quote}"
            <span className="mt-1.5 block text-[11px] not-italic text-muted2">
              — {upworkInfoCard.testimonial.author}
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <a
              href={upworkInfoCard.profileUrl}
              target="_blank"
              rel="noopener"
              className="rounded-md bg-success px-4 py-2.5 text-center text-sm font-semibold text-white hover:brightness-110"
            >
              {locale === 'zh' ? '前往 Upwork 主页 ↗' : 'Go to Upwork ↗'}
            </a>
            <Link
              href="mailto:kui.wang.upwork@gmail.com"
              className="rounded-md border border-white/20 px-4 py-2.5 text-center text-sm text-paper hover:bg-white/5"
            >
              {locale === 'zh' ? '邮件咨询' : 'Email me'}
            </Link>
          </div>
        </motion.div>
      </div>
    </SectionFrame>
  )
}
```

Note: this version **drops** the old `CaseCard` component and the `upworkCases` import entirely.

- [ ] **Step 2: Verify type check**

Run: `pnpm --dir frontend tsc`
Expected: no errors.

If tsc complains about unused `UpworkCase` interface in `lib/data/upwork.ts`, delete the interface declaration (it should already be gone from Task 4 Step 5).

- [ ] **Step 3: Visual smoke**

Run: `pnpm --dir frontend dev` and load `http://localhost:3000#upwork`. Confirm:
- 4 oversized badges on top: `Top Rated Plus`, `100%`, `$60K+`, `43 / 2,233`. The `Top Rated Plus` one has the green-tinted background (highlight).
- A paragraph of narrative copy below the badges.
- A row of 5 small portrait-orientation case thumbnails. Click one — lightbox opens and cycles through all 5.
- 4 service cards below the case strip.
- Right column info card has 8 rows including 客户分布 / 交付节奏 / 可用时段 + the existing rows.
- Switch to EN (top-right toggle) — every label translates.

If a thumbnail image 404s, swap that mini case's `thumb` path in `lib/data/upwork.ts` to an existing file under `public/img/project/<slug>/`.

- [ ] **Step 4: Commit (bundles Task 4 + Task 5)**

```bash
git add frontend/src/lib/data/upwork.ts frontend/src/components/sections/UpworkSection.tsx
git commit -m "feat(upwork): de-duplicate cases, lead with credentials and narrative"
```

---

## Task 6: Add ProductsSection component + helper

**Files:**
- Modify: `frontend/src/lib/content.ts` (add `getFeaturedProducts`)
- Create: `frontend/src/components/sections/ProductsSection.tsx`

- [ ] **Step 1: Add `getFeaturedProducts` helper**

In `frontend/src/lib/content.ts`, in the Products block (around line 65-71), add a new helper after `getProducts`:

```ts
export function getFeaturedProducts(limit = 4): ProductItem[] {
  return getProducts()
    .filter((p) => p.featured)
    .slice(0, limit)
}
```

- [ ] **Step 2: Create the ProductsSection component**

Create `frontend/src/components/sections/ProductsSection.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLocale } from '@/lib/i18n/use-locale'
import { pickLocaleField, type ProductItem } from '@/lib/content'
import { SectionFrame, SectionHead } from '@/components/layout/SectionFrame'

interface Props {
  items: ProductItem[]
  num: string
}

const STATUS_LABEL: Record<string, { zh: string; en: string; cls: string }> = {
  live: { zh: 'Live', en: 'Live', cls: 'bg-emerald-100 text-emerald-700' },
  beta: { zh: 'Beta', en: 'Beta', cls: 'bg-amber-100 text-amber-700' },
  wip:  { zh: 'WIP',  en: 'WIP',  cls: 'bg-stone-200 text-stone-700' },
}

export function ProductsSection({ items, num }: Props) {
  const locale = useLocale()

  if (items.length === 0) return null

  return (
    <SectionFrame variant="paper" id="products">
      <SectionHead
        num={num}
        eyebrow={locale === 'zh' ? 'Products 产品线' : 'Products'}
        title={locale === 'zh' ? '独立开发中' : 'Building solo'}
        sub={
          locale === 'zh'
            ? '我自己想做的工具与产品 · 未来重点'
            : 'Tools and products I am building for myself · the road ahead'
        }
        right={
          <Link href="/products" className="text-xs text-brand hover:underline">
            {locale === 'zh' ? '全部产品 →' : 'All products →'}
          </Link>
        }
      />

      <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-line bg-paper2 px-4 py-3 text-[13px] text-muted">
        <span>
          {locale === 'zh' ? (
            <>
              <span className="text-muted2">↑ 上面是接单交付的</span>{' '}
              <strong className="text-ink">项目</strong>
              <span className="text-muted2">；这里是我自己在做的</span>{' '}
              <strong className="text-ink">产品</strong>
              <span className="text-muted2">。</span>
            </>
          ) : (
            <>
              <span className="text-muted2">↑ Above are shipped client</span>{' '}
              <strong className="text-ink">projects</strong>
              <span className="text-muted2">; here are</span>{' '}
              <strong className="text-ink">products</strong>{' '}
              <span className="text-muted2">I build solo.</span>
            </>
          )}
        </span>
        <span className="shrink-0 rounded-pill border border-brand/30 bg-brand/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-brand">
          Solo · Indie
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const status = STATUS_LABEL[item.status_label] ?? STATUS_LABEL.wip
          return (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <Link
                href={item.permalink}
                className="block h-full rounded-card border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold leading-snug">
                    {pickLocaleField(item.title, locale)}
                  </h3>
                  <span className={`shrink-0 rounded-pill px-2 py-0.5 font-mono text-[10px] uppercase ${status.cls}`}>
                    {status[locale]}
                  </span>
                </div>
                <p className="mt-2 line-clamp-3 text-xs text-muted">
                  {pickLocaleField(item.excerpt, locale)}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-muted2">
                    {item.pricing ? pickLocaleField(item.pricing, locale) : 'Free'}
                  </span>
                  <span className="text-xs font-medium text-brand">详情 →</span>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </SectionFrame>
  )
}
```

> **Why `num` is a prop**: section ordering is decided in `app/page.tsx` (Task 11). Letting the page pass the number keeps numbering accurate without scattering literals across components.

- [ ] **Step 3: Verify type check**

Run: `pnpm --dir frontend tsc`
Expected: no errors.

(The component isn't wired in yet — that happens in Task 11. Type-checking alone is enough here.)

- [ ] **Step 4: Commit**

```bash
git add frontend/src/lib/content.ts frontend/src/components/sections/ProductsSection.tsx
git commit -m "feat(products): add homepage ProductsSection with project/product divider"
```

---

## Task 7: Add `novels` Velite collection + helpers

**Files:**
- Modify: `frontend/velite.config.ts`
- Modify: `frontend/src/lib/content.ts`
- Create: `content/novels/.gitkeep`

- [ ] **Step 1: Add the `novels` collection definition**

In `frontend/velite.config.ts`, add a new collection definition just below the existing `products` declaration (around line 56):

```ts
const novels = defineCollection({
  name: 'Novel',
  pattern: 'novels/**/*.mdx',
  schema: s.object({
    ...baseFields,
    chapters_path: s.string().optional(),
    body:          s.mdx(),
  }).transform(d => ({ ...d, permalink: `/novels/${d.slug}` })),
})
```

Then add `novels` to the `collections` map at the bottom of the file:

```ts
collections: { work, writing, products, novels, shared },
```

- [ ] **Step 2: Create empty content folder**

```bash
mkdir -p content/novels && touch content/novels/.gitkeep
```

- [ ] **Step 3: Run velite to generate the type**

```bash
pnpm --dir frontend velite
```
Expected: completes without errors and `frontend/.velite/index.d.ts` now exports a `novels` array (you can grep it).

```bash
grep "novels" frontend/.velite/index.d.ts
```
Expected: at least one match showing `export const novels`.

- [ ] **Step 4: Add `getNovels` / `getRecentNovels` / `getNovelBySlug` to content lib**

In `frontend/src/lib/content.ts`:

Update line 1 import to include `novels`:

```ts
import { work, writing, products, novels, shared } from '#site/content'
```

Add a new type alias near the other type exports (around line 5-8):

```ts
export type NovelItem = (typeof novels)[number]
```

Add a new section after the Products block (so before "Shared"), around line 72:

```ts
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
```

- [ ] **Step 5: Verify type check**

Run: `pnpm --dir frontend tsc`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add frontend/velite.config.ts frontend/src/lib/content.ts content/novels/.gitkeep
git commit -m "feat(content): add novels velite collection + helpers"
```

---

## Task 8: Add `/novels` index + slug routes

**Files:**
- Create: `frontend/src/app/novels/page.tsx`
- Create: `frontend/src/app/novels/[slug]/page.tsx`
- Modify: `frontend/src/app/sitemap.ts` (include novels)

- [ ] **Step 1: Create `/novels` index page (mirrors `/writing/page.tsx`)**

First, peek at `/writing/page.tsx` to copy the existing pattern:

```bash
cat frontend/src/app/writing/page.tsx
```

Then create `frontend/src/app/novels/page.tsx` with the same structure, but pointing to novels. Use this content:

```tsx
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
          <ul className="divide-y divide-line/70">
            {items.map((item) => (
              <li key={item.slug}>
                <Link
                  href={item.permalink}
                  className="grid grid-cols-[100px_1fr_auto] items-baseline gap-5 py-4 hover:text-brand"
                >
                  <time className="font-mono text-xs text-muted2">
                    {item.published_at.slice(0, 10)}
                  </time>
                  <h3 className="text-base font-medium leading-snug">{item.title.zh}</h3>
                  <span className="font-mono text-[11px] text-muted2">→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  )
}
```

- [ ] **Step 2: Create `/novels/[slug]` detail route**

First peek at the `/writing/[slug]/page.tsx` pattern:

```bash
cat frontend/src/app/writing/\[slug\]/page.tsx
```

Then create `frontend/src/app/novels/[slug]/page.tsx` mirroring it. Replace `getWriting/getWritingBySlug` with `getNovels/getNovelBySlug`. Concretely:

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getNovels, getNovelBySlug } from '@/lib/content'
import { Container } from '@/components/layout/Container'
import { MDXContent } from '@/components/blocks/MDXContent'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return getNovels().map((n) => ({ slug: n.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const item = getNovelBySlug(slug)
  if (!item) return { title: 'Novel not found' }
  return { title: `${item.title.zh} · ${item.title.en}` }
}

export default async function NovelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = getNovelBySlug(slug)
  if (!item) notFound()

  return (
    <article className="py-16">
      <Container>
        <header className="mb-8">
          <div className="eyebrow">— Novel · 小说 —</div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{item.title.zh}</h1>
          <p className="mt-2 text-sm text-muted">{item.title.en}</p>
          <time className="mt-1 block font-mono text-xs text-muted2">
            {item.published_at.slice(0, 10)}
          </time>
        </header>
        <MDXContent code={item.body} />
      </Container>
    </article>
  )
}
```

> **Important — match the existing pattern:** if `cat frontend/src/app/writing/[slug]/page.tsx` shows a different file structure (different imports, different params shape, etc.), prefer the project's actual pattern over the snippet above. The frontend is already running on Next.js 15 App Router, which uses async `params` — the snippet reflects that.

- [ ] **Step 3: Add novels to the sitemap**

Open `frontend/src/app/sitemap.ts`. Find the `getWriting()` block and replicate it for novels. After the existing imports add `getNovels` to the `@/lib/content` import. Then add a parallel block where writing is mapped, e.g. (your sitemap may differ — match its style):

```ts
import { getNovels, getProducts, getWork, getWriting } from '@/lib/content'
// ...
const novels = getNovels().map((n) => ({
  url: `${base}${n.permalink}`,
  lastModified: n.published_at,
}))
// add `...novels` to the returned array
```

- [ ] **Step 4: Verify build**

Run: `pnpm --dir frontend tsc`
Expected: no errors.

Run: `pnpm --dir frontend build`
Expected: succeeds. Output should mention `/novels` route. (No novels yet, so `/novels/[slug]` produces 0 static params — that's fine.)

- [ ] **Step 5: Smoke**

```bash
pnpm --dir frontend dev
```
Open `http://localhost:3000/novels` — should show "暂无小说 · Coming soon".

- [ ] **Step 6: Commit**

```bash
git add frontend/src/app/novels frontend/src/app/sitemap.ts
git commit -m "feat(novels): add /novels index and slug routes"
```

---

## Task 9: Navbar — add 文章 ▾ dropdown for tech / 小说

**Files:**
- Modify: `frontend/src/components/layout/Nav.tsx`

- [ ] **Step 1: Replace the Nav file with a version that includes a CSS-only dropdown**

Replace the entire contents of `frontend/src/components/layout/Nav.tsx` with:

```tsx
'use client'

import Link from 'next/link'
import { useLanguageStore } from '@/stores/language.store'
import { cn } from '@/lib/utils'

type NavLink = {
  href: string
  zh: string
  en: string
  children?: ReadonlyArray<{ href: string; zh: string; en: string }>
}

const NAV_ITEMS: ReadonlyArray<NavLink> = [
  { href: '/', zh: '首页', en: 'Home' },
  { href: '/work', zh: '项目', en: 'Projects' },
  { href: '/products', zh: '产品', en: 'Products' },
  {
    href: '/writing',
    zh: '文章',
    en: 'Writing',
    children: [
      { href: '/writing', zh: '技术文章', en: 'Tech articles' },
      { href: '/novels', zh: '小说', en: 'Novels' },
    ],
  },
  { href: '/about', zh: '关于', en: 'About' },
  { href: '/feedback', zh: '留言', en: 'Feedback' },
] as const

export function Nav() {
  const lang = useLanguageStore((s) => s.lang)
  const setLang = useLanguageStore((s) => s.setLang)

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur">
      <div className="container-page flex items-center justify-between py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-gradient font-serif text-lg font-bold text-paper shadow-md shadow-brand/25">
            天
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-semibold tracking-tight">Tianda Studio</span>
            <span className="mt-0.5 block text-[10px] tracking-[0.15em] text-muted2">天大工作室</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div key={item.href} className="group relative">
                <Link href={item.href} className="flex items-center gap-1 hover:text-brand">
                  {lang === 'zh' ? item.zh : item.en}
                  <span className="text-[10px] text-muted2 transition group-hover:text-brand">▾</span>
                </Link>
                <div className="invisible absolute left-1/2 top-full z-20 mt-1 w-40 -translate-x-1/2 rounded-md border border-line bg-paper p-1 opacity-0 shadow-card transition group-hover:visible group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded px-3 py-2 text-sm text-muted hover:bg-brand/5 hover:text-brand"
                    >
                      {lang === 'zh' ? child.zh : child.en}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className="hover:text-brand">
                {lang === 'zh' ? item.zh : item.en}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLang('zh')}
            className={cn(
              'rounded px-2 py-1 text-xs',
              lang === 'zh'
                ? 'bg-brand/10 font-semibold text-brand'
                : 'text-muted2 hover:text-brand',
            )}
          >
            中
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            className={cn(
              'rounded px-2 py-1 text-xs',
              lang === 'en'
                ? 'bg-brand/10 font-semibold text-brand'
                : 'text-muted2 hover:text-brand',
            )}
          >
            EN
          </button>
          <a
            href="https://www.upwork.com/freelancers/~012a1e9c108e49cd19?viewMode=1"
            target="_blank"
            rel="noopener"
            className="rounded-pill bg-ink px-4 py-2 text-[13px] font-medium text-paper hover:bg-ink2"
          >
            {lang === 'zh' ? '雇用我 ↗' : 'Hire me ↗'}
          </a>
        </div>
      </div>
    </header>
  )
}
```

Key changes from the old version:
- `/work` label `作品 / Work` → `项目 / Projects`
- `/products` moved up to right after `/work` (new ordering)
- `/writing` becomes a dropdown trigger; clicking the trigger still goes to `/writing`; hover reveals 技术文章 + 小说

> **Mobile note:** This nav has no mobile menu rendered (`hidden md:flex`). The dropdown only matters on desktop, so a CSS-only hover/focus implementation is sufficient — no extra mobile work needed in this task.

- [ ] **Step 2: Verify type check + smoke**

Run: `pnpm --dir frontend tsc`
Expected: no errors.

Run: `pnpm --dir frontend dev`. Confirm:
- Desktop nav order: 首页 / 项目 / 产品 / 文章 ▾ / 关于 / 留言
- Hovering "文章 ▾" reveals two items: 技术文章 (`/writing`), 小说 (`/novels`)
- Clicking "文章" itself still goes to `/writing`
- Switching to EN shows: Home / Projects / Products / Writing ▾ / About / Feedback
- Dropdown stays put on hover (does not flicker when moving cursor onto the panel — there's a 4px gap with `mt-1` we may need to fix if it does flicker; if so, change `mt-1` to `pt-1` and remove the gap. Verify visually.)

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/layout/Nav.tsx
git commit -m "feat(nav): rename Work→Projects, add Writing dropdown for novels"
```

---

## Task 10: WritingSection — split into tech + novels two columns

**Files:**
- Modify: `frontend/src/components/sections/WritingSection.tsx`

- [ ] **Step 1: Rewrite the WritingSection to take two source lists**

Replace the entire contents of `frontend/src/components/sections/WritingSection.tsx` with:

```tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLocale } from '@/lib/i18n/use-locale'
import { pickLocaleField, type NovelItem, type WritingItem } from '@/lib/content'
import { SectionFrame, SectionHead } from '@/components/layout/SectionFrame'

interface Props {
  articles: WritingItem[]
  articlesTotal: number
  novels: NovelItem[]
  novelsTotal: number
  num: string
}

export function WritingSection({ articles, articlesTotal, novels, novelsTotal, num }: Props) {
  const locale = useLocale()
  const hasArticles = articles.length > 0
  const hasNovels = novels.length > 0

  if (!hasArticles && !hasNovels) return null

  const gridClass = hasArticles && hasNovels ? 'md:grid-cols-2' : 'md:grid-cols-1'

  return (
    <SectionFrame variant="paper" id="writing">
      <SectionHead
        num={num}
        eyebrow={locale === 'zh' ? '文章 · Writing' : 'Writing'}
        title={locale === 'zh' ? '最近笔记' : 'Recent notes'}
        sub={
          locale === 'zh'
            ? '左侧技术随笔 · 右侧小说连载'
            : 'Tech notes on the left · fiction on the right'
        }
      />

      <div className={`grid grid-cols-1 gap-10 ${gridClass}`}>
        {hasArticles && (
          <Column
            heading={locale === 'zh' ? '技术文章' : 'Tech articles'}
            archiveHref="/writing"
            archiveLabel={
              locale === 'zh' ? `查看全部 ${articlesTotal} 篇 →` : `All ${articlesTotal} articles →`
            }
          >
            {articles.map((item, i) => (
              <Row
                key={item.slug}
                href={item.permalink}
                date={item.published_at}
                title={pickLocaleField(item.title, locale)}
                tail={item.reading_time ? `${item.reading_time} ${locale === 'zh' ? '分钟' : 'min'}` : ''}
                delay={i * 0.05}
              />
            ))}
          </Column>
        )}

        {hasNovels && (
          <Column
            heading={locale === 'zh' ? '小说连载' : 'Fiction'}
            archiveHref="/novels"
            archiveLabel={
              locale === 'zh' ? `查看全部 ${novelsTotal} 部 →` : `All ${novelsTotal} novels →`
            }
          >
            {novels.map((item, i) => (
              <Row
                key={item.slug}
                href={item.permalink}
                date={item.published_at}
                title={pickLocaleField(item.title, locale)}
                tail=""
                delay={i * 0.05}
              />
            ))}
          </Column>
        )}
      </div>
    </SectionFrame>
  )
}

function Column({
  heading,
  archiveHref,
  archiveLabel,
  children,
}: {
  heading: string
  archiveHref: string
  archiveLabel: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between border-b border-line2 pb-2">
        <h3 className="font-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-muted">
          {heading}
        </h3>
        <Link href={archiveHref} className="text-xs text-brand hover:underline">
          {archiveLabel}
        </Link>
      </div>
      <ul className="divide-y divide-line/70">{children}</ul>
    </div>
  )
}

function Row({
  href,
  date,
  title,
  tail,
  delay,
}: {
  href: string
  date: string
  title: string
  tail: string
  delay: number
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Link
        href={href}
        className="group grid grid-cols-[90px_1fr_auto] items-baseline gap-4 py-3 transition hover:text-brand"
      >
        <time className="font-mono text-xs text-muted2">{date.slice(0, 10)}</time>
        <h4 className="text-[15px] font-medium leading-snug">{title}</h4>
        <span className="font-mono text-[11px] text-muted2 transition group-hover:text-brand">
          {tail} <span className="text-brand">→</span>
        </span>
      </Link>
    </motion.li>
  )
}
```

Key changes:
- Props now: `articles`, `articlesTotal`, `novels`, `novelsTotal`, `num`
- Returns `null` if both lists are empty
- Auto-collapses to one column when only one list has content
- `num` is passed in by the page (same pattern as ProductsSection)

- [ ] **Step 2: Verify type check (will fail until page.tsx is updated in Task 11)**

Skip running tsc yet — `page.tsx` still calls `<WritingSection items=... totalCount=... />` which is the old prop shape. Task 11 fixes this. Don't commit yet either.

---

## Task 11: Wire up homepage with new section order + numbering

**Files:**
- Modify: `frontend/src/app/page.tsx`

- [ ] **Step 1: Replace `app/page.tsx` with the new wiring**

Replace the entire contents of `frontend/src/app/page.tsx` with:

```tsx
import {
  getFeaturedProducts,
  getFeaturedWork,
  getNovels,
  getRecentNovels,
  getRecentWriting,
  getWriting,
} from '@/lib/content'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { UpworkSection } from '@/components/sections/UpworkSection'
import { ProductsSection } from '@/components/sections/ProductsSection'
import { ExperienceSection } from '@/components/sections/ExperienceSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { WritingSection } from '@/components/sections/WritingSection'
import { FeedbackSection } from '@/components/sections/FeedbackSection'

export default function HomePage() {
  const featuredWork = getFeaturedWork(5)
  const featuredProducts = getFeaturedProducts(6)
  const recentArticles = getRecentWriting(4)
  const articlesTotal = getWriting().length
  const recentNovelItems = getRecentNovels(4)
  const novelsTotal = getNovels().length

  return (
    <>
      <HeroSection />
      <ProjectsSection items={featuredWork} />
      <UpworkSection />
      <ProductsSection items={featuredProducts} num="03" />
      <ExperienceSection />
      <SkillsSection />
      <WritingSection
        articles={recentArticles}
        articlesTotal={articlesTotal}
        novels={recentNovelItems}
        novelsTotal={novelsTotal}
        num="06"
      />
      <FeedbackSection />
    </>
  )
}
```

> **Note on section numbers**: `ProjectsSection` hardcodes `num="01"` and `UpworkSection` hardcodes `num="02"` already. `ProductsSection` and `WritingSection` accept `num` as a prop (set above). `ExperienceSection` and `SkillsSection` likely also hardcode their own nums — leave those alone for now (visual numbering will read 01, 02, 03, ?, ?, 06, ? — Step 2 reconciles them).

- [ ] **Step 2: Reconcile ExperienceSection / SkillsSection / FeedbackSection numbers**

Inspect each:
```bash
grep -n 'num=' frontend/src/components/sections/ExperienceSection.tsx frontend/src/components/sections/SkillsSection.tsx frontend/src/components/sections/FeedbackSection.tsx
```

For each that has a hardcoded `num="XX"`, update them to match the new ordering:
- `ExperienceSection.tsx` → `num="04"`
- `SkillsSection.tsx` → `num="05"`
- `FeedbackSection.tsx` → `num="07"`

Edit each file in place using the Edit tool with the exact old → new num strings.

- [ ] **Step 3: Verify type check + build**

Run: `pnpm --dir frontend tsc`
Expected: no errors.

Run: `pnpm --dir frontend build`
Expected: succeeds. Static export to `frontend/out/`.

- [ ] **Step 4: Visual smoke (full homepage)**

```bash
pnpm --dir frontend dev
```
Load `http://localhost:3000`. Walk top-to-bottom and confirm:
1. Hero — 添达 Kevin / 全栈工程师 line / no `~/` chip
2. `01 — Projects 项目集` — 5 cards + `查看全部 20+ 项目 →`
3. `02 — Upwork · 接单` — 4 oversized badges, narrative, mini case strip (5), services, info card
4. `03 — Products 产品线` — divider callout + product cards (currently 1: claude-loop)
5. `04 — Experience` (existing)
6. `05 — Skills` (existing)
7. `06 — Writing` — two columns: 技术文章 (1 article) + 小说连载 (empty → only one column shows full width)
8. `07 — Feedback` (existing)

Also test EN toggle — every label translates.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/page.tsx \
        frontend/src/components/sections/WritingSection.tsx \
        frontend/src/components/sections/ExperienceSection.tsx \
        frontend/src/components/sections/SkillsSection.tsx \
        frontend/src/components/sections/FeedbackSection.tsx
git commit -m "feat(home): reorder sections, add Products, split Writing two-column"
```

---

## Task 12: Final verification + i18n catalog refresh

**Files:**
- Modify (auto): `frontend/src/locales/**` (Lingui catalogs, if extracted)

- [ ] **Step 1: Search for any remaining "王奎" references on the visible site**

```bash
grep -rn "王奎\|Wang'" frontend/src --include='*.tsx' --include='*.ts' \
  | grep -v "RESUME_IMAGES\|cn.png\|en.png\|kui.wang"
```
Expected: no matches (the resume image English caption "Kevin Wang" inside `RESUME_IMAGES` is intentional and grep is filtered to ignore it).

- [ ] **Step 2: Search for any remaining `~/` chip references**

```bash
grep -rn "cursor-blink\|font-mono.*~/" frontend/src
```
Expected: no matches.

- [ ] **Step 3: Run Lingui extract (if any t-macros were added)**

In the Upwork narrative we used plain `narrative[locale]` (not the `t` macro), so this step is mainly defensive:

```bash
pnpm --dir frontend lingui:extract
```
If new strings were added to catalogs, also run:
```bash
pnpm --dir frontend lingui:compile
```

- [ ] **Step 4: Full build**

```bash
pnpm --dir frontend build
```
Expected: succeeds. `out/` directory exists.

```bash
ls frontend/out
```
Expected: `index.html`, `work/`, `products/`, `writing/`, `novels/`, etc.

- [ ] **Step 5: Local static serve sanity**

```bash
cd frontend && pnpm dlx http-server out -p 3001
```
Open `http://localhost:3001`. Same page as dev mode. Click into `/work`, `/products`, `/writing`, `/novels`, hover the navbar dropdown — all should work.

- [ ] **Step 6: Commit Lingui catalogs if changed**

```bash
git status frontend/src/locales 2>/dev/null
# if there are changes:
git add frontend/src/locales
git commit -m "chore(i18n): refresh Lingui catalogs after homepage restructure"
```

If no changes, skip commit.

- [ ] **Step 7: Final summary**

Open `git log --oneline -15` and confirm the commit chain looks like:

```
chore(i18n): refresh Lingui catalogs after homepage restructure   (optional)
feat(home): reorder sections, add Products, split Writing two-column
feat(nav): rename Work→Projects, add Writing dropdown for novels
feat(novels): add /novels index and slug routes
feat(content): add novels velite collection + helpers
feat(products): add homepage ProductsSection with project/product divider
feat(upwork): de-duplicate cases, lead with credentials and narrative
content(work): promote 2 more items to featured
feat(projects): drop tag tabs, show 5 + archive link
feat(hero): rebrand to 添达 Kevin and drop terminal chip
```

---

## Self-Review Notes (already applied)

- **Spec coverage check**: every § 3.x item in the spec maps to a task above. § 3.1 → Task 1; § 3.2 → Task 2 + Task 3; § 3.3 → Task 4 + Task 5; § 3.4 → Task 6; § 3.5 → Task 7 + Task 8 + Task 9; § 3.6 → Task 10; § 3.7 → Task 11. § 4 file lists are reflected in each task's "Files" header. § 5 verification items are covered by Task 12.
- **Type consistency check**: prop names match across tasks — `ProductsSection` exposes `items` + `num`; `WritingSection` exposes `articles` / `articlesTotal` / `novels` / `novelsTotal` / `num`; `ProjectsSection` exposes `items` only. Helper function names match: `getFeaturedWork`, `getFeaturedProducts`, `getRecentWriting`, `getRecentNovels`, `getNovels`, `getWriting`.
- **Bundling commits across coupled tasks**: Tasks 4 and 5 share a commit because Task 4 deletes exports that Task 5 stops importing — committing in between would break the build. Tasks 10 and 11 share a commit for the same reason (WritingSection prop shape change).
- **No frontend unit tests**: this codebase has no Jest/Vitest setup. Verification per task is `pnpm tsc` + `pnpm build` (when relevant) + manual smoke. Adding test infra is out of scope.
