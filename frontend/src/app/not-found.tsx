import Link from 'next/link'
import { Container } from '@/components/layout/Container'

export default function NotFound() {
  return (
    <section className="py-24">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand">
            — 404 —
          </div>
          <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
            <span className="bg-brand-gradient bg-clip-text text-transparent">404</span>
          </h1>
          <p className="mt-3 text-lg font-semibold">
            页面没找到 · Page not found
          </p>
          <p className="mt-2 text-sm text-muted">
            链接可能拼错了，或者文章被我归档了。回到首页看看？
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Link
              href="/"
              className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink2"
            >
              ← 回首页
            </Link>
            <Link
              href="/work"
              className="rounded-md border border-line2 bg-white px-5 py-2.5 text-sm font-medium hover:border-brand hover:text-brand"
            >
              看作品集
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
