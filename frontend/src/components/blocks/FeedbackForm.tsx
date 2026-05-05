'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocale } from '@/lib/i18n/use-locale'
import { apiFetch, ApiError } from '@/lib/api'

const TYPES = [
  { id: 'general', icon: '✦', zh: '一般留言', en: 'General' },
  { id: 'hire', icon: '💼', zh: '雇佣意向', en: 'Hiring' },
  { id: 'collab', icon: '🤝', zh: '合作提议', en: 'Collab' },
] as const

type FeedbackType = (typeof TYPES)[number]['id']
type Status = 'idle' | 'sending' | 'sent' | 'error'

export function FeedbackForm() {
  const locale = useLocale()
  const [type, setType] = useState<FeedbackType>('general')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'sending') return
    if (message.trim().length < 2) {
      setErrorMsg(locale === 'zh' ? '留言内容不能为空' : 'Message cannot be empty')
      return
    }

    setStatus('sending')
    setErrorMsg('')

    try {
      await apiFetch('/api/v1/public/feedback', {
        method: 'POST',
        body: JSON.stringify({
          type,
          name: name.trim() || null,
          email: email.trim() || null,
          message: message.trim(),
          locale,
          website,
        }),
      })
      setStatus('sent')
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setErrorMsg(
          locale === 'zh'
            ? '提交太频繁，请稍后再试（限流：每分钟 3 次）'
            : 'Too many requests. Try again in a minute.',
        )
      } else if (err instanceof ApiError) {
        const body = err.body as { error?: string } | null
        setErrorMsg(
          body?.error ?? (locale === 'zh' ? '提交失败，请稍后重试' : 'Submission failed'),
        )
      } else {
        console.error(err)
        setErrorMsg(locale === 'zh' ? '网络错误，请稍后重试' : 'Network error')
      }
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-successBd bg-successBg p-7 shadow-soft"
      >
        <div className="text-2xl">✅</div>
        <h4 className="mt-3 text-lg font-semibold text-successFg">
          {locale === 'zh' ? '收到了，谢谢你的留言' : 'Got it — thanks for writing'}
        </h4>
        <p className="mt-2 text-sm text-successFg/85">
          {locale === 'zh'
            ? '我会读每一条；通常 24 小时内回复。'
            : 'I read every one; usually reply within 24h.'}
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm text-successFg underline"
        >
          {locale === 'zh' ? '再写一条' : 'Send another'}
        </button>
      </motion.div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-line bg-white p-7 shadow-soft"
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setType(t.id)}
            className={`rounded-pill border px-3 py-1.5 text-xs transition ${
              type === t.id
                ? 'border-brand bg-brand text-white'
                : 'border-line text-muted hover:border-brand'
            }`}
          >
            {t.icon} {locale === 'zh' ? t.zh : t.en}
          </button>
        ))}
      </div>
      <div className="flex gap-2.5">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          className="flex-1 rounded-md border border-line bg-paper px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
          placeholder={locale === 'zh' ? '姓名 (选填)' : 'Name (optional)'}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={255}
          className="flex-1 rounded-md border border-line bg-paper px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
          placeholder={locale === 'zh' ? '邮箱 (选填)' : 'Email (optional)'}
        />
      </div>
      <textarea
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={4000}
        className="mt-2.5 min-h-[100px] w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
        placeholder={
          locale === 'zh' ? '想对添达工作室 / Kevin 说点什么？' : 'What would you like to say?'
        }
      />
      {/* HONEYPOT: hidden from real users via off-screen positioning + tabIndex=-1.
          Bots fill all inputs blindly; backend silently drops if non-empty. */}
      <label className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        Don't fill this in:
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </label>

      {errorMsg && (
        <p
          role="alert"
          className="mt-2 rounded border border-dangerBd bg-dangerBg px-3 py-2 text-xs text-danger"
        >
          {errorMsg}
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-3 w-full rounded-md bg-ink px-5 py-3.5 text-sm font-medium text-paper hover:bg-ink2 disabled:opacity-60"
      >
        {status === 'sending'
          ? locale === 'zh'
            ? '发送中...'
            : 'Sending...'
          : locale === 'zh'
            ? '发送留言 →'
            : 'Send →'}
      </button>
      <p className="mt-2 text-center text-[11px] text-muted2">
        {locale === 'zh'
          ? '匿名也可以 · 限流：每分钟 3 次 / 每小时 10 次'
          : 'Anonymous OK · rate-limited 3/min · 10/hr'}
      </p>
    </form>
  )
}
