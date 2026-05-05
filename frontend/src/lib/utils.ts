export function cn(...args: Array<string | false | null | undefined>): string {
  return args.filter(Boolean).join(' ')
}

export function formatDate(iso: string, locale: 'zh' | 'en' = 'zh'): string {
  const d = new Date(iso)
  if (locale === 'zh') {
    return `${d.getFullYear()} · ${String(d.getMonth() + 1).padStart(2, '0')} · ${String(d.getDate()).padStart(2, '0')}`
  }
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
