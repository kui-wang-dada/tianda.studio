'use client'

import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { experience } from '@/lib/data/experience'
import { skills } from '@/lib/data/skills'
import { getWork, pickLocaleField } from '@/lib/content'
import { useLocale } from '@/lib/i18n/use-locale'

export default function AboutPage() {
  const locale = useLocale()
  const workCount = getWork().length

  const t = locale === 'zh'

  const basicInfo = [
    { k: { zh: '所在地', en: 'Location' }, v: { zh: '上海 (UTC+8)', en: 'Shanghai (UTC+8)' } },
    { k: { zh: '语言', en: 'Languages' }, v: { zh: '中文母语 / 英文 Pro', en: 'Chinese (native) / English (pro)' } },
    { k: { zh: '从业', en: 'Active since' }, v: { zh: '2016 — 至今', en: '2016 — now' } },
    { k: { zh: '当前身份', en: 'Current role' }, v: { zh: '一人工作室创始人', en: 'Solo studio founder' } },
    { k: { zh: '可接单', en: 'Available' }, v: { zh: '是 · 24h 内回复', en: 'Yes · reply within 24h' } },
    { k: { zh: 'Upwork 评级', en: 'Upwork rating' }, v: { zh: 'Top Rated Plus · 100% JS', en: 'Top Rated Plus · 100% JS' } },
  ]

  const principles = [
    {
      title: { zh: '单一对接人', en: 'Single point of contact' },
      body: {
        zh: '从需求拆解、架构设计、编码、部署到后续维护一条龙。没有项目经理来回拉扯，也没有外包团队踢皮球。',
        en: 'One person from spec to architecture to code to deploy to maintenance. No PMs bouncing tickets, no offshore teams hot-potatoing the work.',
      },
    },
    {
      title: { zh: 'Vibe Coding', en: 'Vibe Coding' },
      body: {
        zh: '日常用 Claude Code + Gemini CLI。让我能用更短的时间，交付传统 2-3 人团队的产出量。',
        en: 'Claude Code + Gemini CLI in my daily flow. I ship like a 2–3 person team in less time.',
      },
    },
    {
      title: { zh: '24h 回复', en: 'Reply within 24h' },
      body: {
        zh: 'UTC+8 (上海)，工作日 24 小时内回复邮件 / Upwork 消息。',
        en: 'UTC+8 (Shanghai). Email and Upwork messages answered within one business day.',
      },
    },
    {
      title: { zh: '中英无障碍', en: 'Bilingual' },
      body: {
        zh: '中文母语，英文 professional 等级。可以直接和国际客户开会与写技术文档。',
        en: 'Native Chinese, professional English. Comfortable in international meetings and writing technical docs in English.',
      },
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="bg-paper2 border-b border-line py-20">
        <Container>
          <div className="grid gap-10 md:grid-cols-[2fr_1fr] md:items-start">
            <div>
              <div className="eyebrow">— {t ? '关于 · About' : 'About · 关于'} —</div>
              <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                {t ? '添达' : 'Tianda'}{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent">Kevin</span>
              </h1>
              <p className="mt-3 font-mono text-sm text-muted2">
                {t
                  ? 'Founder of Tianda Studio · 添达工作室 · 上海'
                  : 'Founder of Tianda Studio · Shanghai'}
              </p>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink2">
                {t ? (
                  <>
                    10+ 年经验的全栈工程师。2022 年起以
                    <strong className="text-ink"> Tianda Studio (添达工作室) </strong>
                    的名义在 Upwork 独立承接 AI、全栈 Web、Web3 NFT 项目。
                    这个站点是我的作品集、写作和小工具的集合地。
                  </>
                ) : (
                  <>
                    Full-stack engineer with 10+ years of experience. Since 2022 I have been working independently on Upwork as
                    <strong className="text-ink"> Tianda Studio</strong>, taking AI, full-stack web, and Web3 NFT projects.
                    This site collects my work, writing, and small tools.
                  </>
                )}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/work"
                  className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink2"
                >
                  {t ? `查看 ${workCount} 个项目 →` : `See all ${workCount} projects →`}
                </Link>
                <a
                  href="https://www.upwork.com/freelancers/~012a1e9c108e49cd19?viewMode=1"
                  target="_blank"
                  rel="noopener"
                  className="rounded-md border border-line2 bg-white px-5 py-2.5 text-sm font-medium hover:border-brand hover:text-brand"
                >
                  {t ? '↗ Upwork 主页' : '↗ Upwork profile'}
                </a>
                <a
                  href="mailto:872505550@qq.com"
                  className="rounded-md border border-line2 bg-white px-5 py-2.5 text-sm font-medium hover:border-brand hover:text-brand"
                >
                  {t ? '✉ 发邮件' : '✉ Email me'}
                </a>
              </div>
            </div>
            <aside className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <h3 className="mb-4 text-sm font-semibold">
                {t ? '基本信息' : 'Quick facts'}
              </h3>
              <dl className="space-y-2.5 text-sm">
                {basicInfo.map((row) => (
                  <div
                    key={row.k.zh}
                    className="flex justify-between border-b border-line pb-2 last:border-b-0 last:pb-0"
                  >
                    <dt className="text-muted2">{row.k[locale]}</dt>
                    <dd className="font-mono text-[12px] font-semibold">{row.v[locale]}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </Container>
      </section>

      {/* Career timeline */}
      <section className="py-16">
        <Container>
          <div className="mb-8">
            <div className="eyebrow">— {t ? '经历 · Path' : 'Path · 经历'} —</div>
            <h2 className="mt-2 text-2xl font-bold md:text-3xl">
              {t ? '职业路径' : 'Career timeline'}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {t ? '从大厂到独立工作室 · 2016 — 至今' : 'From big tech to indie studio · 2016 — now'}
            </p>
          </div>
          <div className="relative mx-auto max-w-3xl pl-7">
            <span
              aria-hidden
              className="absolute left-[7px] top-2 w-px bg-gradient-to-b from-brand to-line2"
              style={{ height: 'calc(100% - 16px)' }}
            />
            {experience.map((row) => (
              <div
                key={row.when}
                className="relative grid grid-cols-[120px_1fr] items-start gap-7 border-b border-dashed border-line py-5 last:border-b-0"
              >
                <span
                  className={`absolute -left-[25px] top-7 h-[11px] w-[11px] rounded-full border-2 border-brand ${
                    row.isNow ? 'bg-brand shadow-[0_0_0_4px_rgba(196,127,58,0.2)]' : 'bg-paper'
                  }`}
                />
                <div className="pt-1 font-mono text-xs text-muted2">
                  {row.when}
                  {row.isNow && (
                    <span className="ml-1 inline-block rounded bg-brand px-1.5 py-px text-[9px] text-white">
                      {t ? '现在' : 'now'}
                    </span>
                  )}
                </div>
                <div className="text-sm leading-relaxed">
                  <div className="text-base font-semibold">
                    {pickLocaleField(row.role, locale)}{' '}
                    <span className="text-brand">@ {pickLocaleField(row.company, locale)}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {pickLocaleField(row.description, locale)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Skills */}
      <section className="bg-paper2 border-y border-line2 py-16">
        <Container>
          <div className="mb-8">
            <div className="eyebrow">— {t ? '技术栈 · Stack' : 'Stack · 技术栈'} —</div>
            <h2 className="mt-2 text-2xl font-bold md:text-3xl">
              {t ? '技术栈' : 'Skills & Stack'}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((group) => (
              <div key={group.title.zh} className="rounded-card border border-line bg-white p-5">
                <h4 className="mb-3 flex items-center gap-2 text-base font-semibold">
                  <span className="h-2 w-2 rounded-full bg-brand" />
                  {pickLocaleField(group.title, locale)}
                </h4>
                <ul className="space-y-1.5 font-mono text-sm text-ink2">
                  {group.items.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Working principles */}
      <section className="py-16">
        <Container>
          <div className="mb-8">
            <div className="eyebrow">— {t ? '工作方式 · How I work' : 'How I work · 工作方式'} —</div>
            <h2 className="mt-2 text-2xl font-bold md:text-3xl">
              {t ? '合作方式' : 'How we work together'}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {principles.map((p) => (
              <div key={p.title.zh} className="rounded-card border border-line bg-paper2 p-5">
                <h4 className="text-base font-semibold">✦ {p.title[locale]}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.body[locale]}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-2xl bg-ink p-7 text-paper md:p-9">
            <h3 className="text-xl font-bold md:text-2xl">
              {t ? '想合作？' : 'Want to work together?'}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted2">
              {t
                ? '邮件最稳；如果是商业项目，建议直接走 Upwork（自带托管担保 + 时薪计费工具）。想随便聊聊就在留言板留个言。'
                : 'Email is the most reliable; for paid engagements, going through Upwork is best (escrow + hourly billing built in). For casual chats, drop a note in the feedback board.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="mailto:872505550@qq.com"
                className="rounded-md bg-paper px-5 py-2.5 text-sm font-medium text-ink hover:bg-paper2"
              >
                {t ? '✉ 邮件咨询' : '✉ Email me'}
              </a>
              <a
                href="https://www.upwork.com/freelancers/~012a1e9c108e49cd19?viewMode=1"
                target="_blank"
                rel="noopener"
                className="rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
              >
                {t ? '↗ Upwork 找我' : '↗ Hire me on Upwork'}
              </a>
              <Link
                href="/feedback"
                className="rounded-md border border-paper/20 px-5 py-2.5 text-sm font-medium hover:bg-white/5"
              >
                {t ? '💬 留言反馈' : '💬 Leave feedback'}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
