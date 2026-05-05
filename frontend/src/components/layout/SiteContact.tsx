'use client'

import { useLocale } from '@/lib/i18n/use-locale'
import { contactChannels } from '@/lib/data/contact'

/**
 * 全站底部"联系"栏 — 简洁横排所有联系方式 + 邮箱大图标。
 * 嵌入在 Footer 之上、所有页面共享。
 */
export function SiteContact() {
  const locale = useLocale()

  return (
    <section className="border-t border-line bg-paper2 py-10" id="contact">
      <div className="container-page">
        <div className="grid gap-6 md:grid-cols-[1fr_2fr] md:items-center">
          <div>
            <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
              {locale === 'zh' ? '联系方式' : 'Get in touch'}
            </div>
            <h3 className="mt-2 text-xl font-bold leading-tight md:text-2xl">
              {locale === 'zh' ? '在以下任一平台找到我' : 'Find me on any of these'}
            </h3>
            <p className="mt-1.5 text-xs text-muted">
              {locale === 'zh'
                ? '邮件最稳；其他平台不一定每天看'
                : 'Email is most reliable; other platforms checked occasionally'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {contactChannels.map((c) => (
              <a
                key={c.name.zh}
                href={c.url}
                target={c.url.startsWith('http') ? '_blank' : undefined}
                rel="noopener"
                className="flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 transition hover:border-brand hover:text-brand"
              >
                <span className="grid h-7 w-7 place-items-center rounded bg-brand/10 text-xs text-brand">
                  {c.icon}
                </span>
                <div className="min-w-0 flex-1 leading-tight">
                  <div className="text-[12px] font-medium">{c.name[locale]}</div>
                  <div className="truncate font-mono text-[10px] text-muted2">{c.handle}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
