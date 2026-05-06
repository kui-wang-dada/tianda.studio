'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { useLocale } from '@/lib/i18n/use-locale'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const locale = useLocale()

  useEffect(() => {
    console.error('[app error]', error)
  }, [error])

  return (
    <section className="py-24">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand">
            — 500 —
          </div>
          <h1 className="mt-4 text-3xl font-bold">
            {locale === 'zh' ? '出了点问题' : 'Something went wrong'}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {locale === 'zh' ? '服务端出错了。' : 'The server encountered an error. '}
            {error.digest && <code className="font-mono text-xs">({error.digest})</code>}
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink2"
            >
              {locale === 'zh' ? '重试' : 'Retry'}
            </button>
            <Link
              href="/"
              className="rounded-md border border-line2 bg-white px-5 py-2.5 text-sm font-medium hover:border-brand hover:text-brand"
            >
              {locale === 'zh' ? '回首页' : 'Back to home'}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
