import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'paper' | 'paper2' | 'invert' | 'feedback'

const VARIANT_CLS: Record<Variant, string> = {
  paper: 'bg-paper',
  paper2: 'bg-paper2 border-y border-line2',
  invert: 'bg-ink text-paper',
  feedback:
    "bg-paper relative before:absolute before:inset-0 before:pointer-events-none before:bg-[radial-gradient(ellipse_at_top_right,rgba(196,127,58,0.08),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(196,127,58,0.05),transparent_60%)]",
}

export function SectionFrame({
  variant = 'paper',
  className,
  children,
  id,
}: {
  variant?: Variant
  className?: string
  children: ReactNode
  id?: string
}) {
  return (
    <section
      id={id}
      className={cn(
        'py-16 md:py-20',
        VARIANT_CLS[variant],
        variant === 'invert' && 'py-20 md:py-24',
        className,
      )}
    >
      <div className="container-page relative">{children}</div>
    </section>
  )
}

/** Decorative circular divider used between sections. */
export function Divider({ mark = '✦' }: { mark?: '✦' | '~' | '·' | '✉' }) {
  return (
    <div className="container-page flex h-9 items-center">
      <span className="block h-px flex-1 bg-gradient-to-r from-transparent via-line2 to-transparent" />
      <span className="mx-4 grid h-7 w-7 place-items-center rounded-full border border-line2 bg-paper font-serif text-sm italic text-brand">
        {mark}
      </span>
      <span className="block h-px flex-1 bg-gradient-to-r from-transparent via-line2 to-transparent" />
    </div>
  )
}

/** Section eyebrow + h2 + sub combo. */
export function SectionHead({
  num,
  eyebrow,
  title,
  sub,
  right,
  invert = false,
}: {
  num: string
  eyebrow: string
  title: string
  sub?: string
  right?: ReactNode
  invert?: boolean
}) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        <div
          className={cn(
            'font-mono text-[11px] font-semibold uppercase tracking-[0.25em]',
            invert ? 'text-brand2' : 'text-brand',
          )}
        >
          <span className="text-muted2">{num} —</span> {eyebrow}
        </div>
        <h2
          className={cn(
            'mt-1.5 text-3xl font-bold tracking-tight md:text-[38px] md:leading-tight',
            invert ? 'text-paper' : 'text-ink',
          )}
        >
          {title}
        </h2>
        {sub && (
          <p
            className={cn(
              'mt-2 max-w-xl text-sm leading-relaxed',
              invert ? 'text-muted2' : 'text-muted',
            )}
          >
            {sub}
          </p>
        )}
      </div>
      {right && <div className="text-right">{right}</div>}
    </div>
  )
}
