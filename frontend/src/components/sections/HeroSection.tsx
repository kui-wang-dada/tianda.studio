'use client'

import Link from 'next/link'
import CountUp from 'react-countup'
import { motion } from 'framer-motion'
import { useLocale } from '@/lib/i18n/use-locale'
import { heroStats, pickLabel } from '@/lib/data/stats'
import { AnimateIn } from '@/components/blocks/AnimateIn'
import { useLightboxStore } from '@/stores/lightbox.store'

export function HeroSection() {
  const locale = useLocale()
  const openLightbox = useLightboxStore((s) => s.open)

  const RESUME_IMAGES = [
    {
      src: '/img/resume/cn.png',
      alt: locale === 'zh' ? '中文简历' : 'Chinese resume',
      caption: locale === 'zh' ? '中文简历 · 添达 Kevin' : 'Chinese résumé · Tianda Kevin',
    },
    {
      src: '/img/resume/en.png',
      alt: locale === 'zh' ? '英文简历' : 'English resume',
      caption: 'English Resume · Kevin Wang',
    },
  ]

  return (
    <section className="pb-12 pt-10 md:pb-16 md:pt-14">
      <div className="container-page">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr] md:gap-12 md:items-start">
          <div>
            <AnimateIn>
              <span className="inline-flex items-center gap-1.5 rounded-pill bg-successBg px-3 py-1 text-xs font-medium text-success before:h-1.5 before:w-1.5 before:rounded-full before:bg-successDot before:shadow-[0_0_0_4px_rgba(16,185,129,0.2)]">
                {locale === 'zh' ? '可接单 · 远程 · UTC+8' : 'Available · Remote · UTC+8'}
              </span>
            </AnimateIn>

            <AnimateIn delay={0.05}>
              <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight md:text-[56px]">
                {locale === 'zh' ? '添达' : 'Tianda'}{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent">
                  Kevin
                </span>
              </h1>
            </AnimateIn>

            <AnimateIn delay={0.1}>
              <div className="mt-3 flex flex-wrap items-center gap-2.5 text-[15px] text-muted">
                <span>
                  {locale === 'zh'
                    ? '全栈工程师 / AI 应用 / Web3 NFT'
                    : 'Full-Stack · AI Apps · Web3 NFT'}
                </span>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.15}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink2">
                {locale === 'zh' ? (
                  <>
                    十年磨一剑——独立打造 <strong className="text-ink">生产级 AI 应用</strong>、
                    <strong className="text-ink"> NFT 平台</strong>、与全栈 Web 产品。React ·
                    Next.js · FastAPI · Wagmi · LangChain。日常用{' '}
                    <span className="bg-gradient-to-b from-transparent from-60% to-brand/25 to-60% px-0.5">
                      Claude Code 与 Gemini CLI
                    </span>{' '}
                    进行 Vibe Coding。
                  </>
                ) : (
                  <>
                    Ten years of building <strong className="text-ink">production-grade AI apps</strong>,
                    <strong className="text-ink"> NFT platforms</strong>, and full-stack web products.
                    React · Next.js · FastAPI · Wagmi · LangChain. Daily Vibe Coding with{' '}
                    <span className="bg-gradient-to-b from-transparent from-60% to-brand/25 to-60% px-0.5">
                      Claude Code &amp; Gemini CLI
                    </span>
                    .
                  </>
                )}
              </p>
            </AnimateIn>

            <AnimateIn delay={0.2}>
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <Link
                  href="/work"
                  className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink2"
                >
                  {locale === 'zh' ? '查看作品 ↓' : 'View Work ↓'}
                </Link>
                <a
                  href="https://www.upwork.com/freelancers/~012a1e9c108e49cd19?viewMode=1"
                  target="_blank"
                  rel="noopener"
                  className="rounded-md border border-line2 bg-white px-5 py-2.5 text-sm font-medium hover:border-brand hover:text-brand"
                >
                  ↗ Upwork
                </a>
                <a
                  href="https://github.com/kui-wang-dada"
                  target="_blank"
                  rel="noopener"
                  className="rounded-md border border-line2 bg-white px-5 py-2.5 text-sm font-medium hover:border-brand hover:text-brand"
                >
                  ⌥ GitHub
                </a>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.25}>
              <div className="mt-7 flex items-center gap-3">
                <div className="flex gap-2">
                  <ResumeThumb
                    src="/img/resume/cn.png"
                    label={locale === 'zh' ? '中文' : 'ZH'}
                    sub={locale === 'zh' ? '简历' : 'Resume'}
                    onClick={() => openLightbox(RESUME_IMAGES, 0)}
                  />
                  <ResumeThumb
                    src="/img/resume/en.png"
                    label="EN"
                    sub="Resume"
                    onClick={() => openLightbox(RESUME_IMAGES, 1)}
                  />
                </div>
                <span className="text-xs text-muted2">
                  {locale === 'zh' ? '点击查看完整简历 ⤢' : 'Click to view full résumé ⤢'}
                </span>
              </div>
            </AnimateIn>
          </div>

          {/* RIGHT — stats stack */}
          <div className="flex flex-col gap-2.5">
            {heroStats.map((stat, i) => (
              <AnimateIn key={pickLabel(stat, locale)} delay={0.1 + i * 0.08} y={20}>
                <div
                  className={`flex items-center justify-between rounded-xl border px-5 py-4 shadow-card ${
                    stat.feature
                      ? 'border-ink bg-ink-gradient text-paper'
                      : 'border-line bg-white'
                  }`}
                >
                  <div>
                    <div
                      className={`text-[13px] font-medium ${
                        stat.feature ? 'text-muted2' : 'text-muted'
                      }`}
                    >
                      {pickLabel(stat, locale)}
                    </div>
                    <div className="mt-1.5 flex items-baseline gap-0.5 font-serif text-3xl font-bold leading-none">
                      {typeof stat.number === 'string' ? (
                        <span>{stat.number}</span>
                      ) : (
                        <CountUp
                          start={0}
                          end={stat.countTo ?? (stat.number as number)}
                          duration={1.4}
                          enableScrollSpy
                          scrollSpyOnce
                        />
                      )}
                      {stat.unit && (
                        <span
                          className={`text-xl ${stat.feature ? 'text-brand2' : 'text-brand'}`}
                        >
                          {stat.unit}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className={`font-mono text-[11px] ${
                      stat.feature ? 'text-brand2' : 'text-muted2'
                    }`}
                  >
                    {stat.caption?.[locale] ?? stat.caption?.zh}
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ResumeThumb({
  src,
  label,
  sub,
  onClick,
}: {
  src: string
  label: string
  sub: string
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2, scale: 1.02 }}
      onClick={onClick}
      className="group relative h-16 w-[52px] overflow-hidden rounded border border-line2 bg-white shadow-card"
      aria-label={`查看 ${label} ${sub}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={`${label} ${sub}`} className="h-full w-full object-cover object-top" />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-1 pb-0.5 pt-2 text-center font-mono text-[8px] leading-tight text-white">
        {label}
        <br />
        {sub}
      </span>
    </motion.button>
  )
}
