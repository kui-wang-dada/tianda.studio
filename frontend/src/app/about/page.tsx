import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { experience } from '@/lib/data/experience'
import { skills } from '@/lib/data/skills'

export const metadata: Metadata = { title: '关于 · About' }

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-paper2 border-b border-line py-20">
        <Container>
          <div className="grid gap-10 md:grid-cols-[2fr_1fr] md:items-start">
            <div>
              <div className="eyebrow">— 关于 · About —</div>
              <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                添达{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent">Kevin</span>
              </h1>
              <p className="mt-3 font-mono text-sm text-muted2">
                Founder of Tianda Studio · 添达工作室 · 上海
              </p>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink2">
                10+ 年经验的全栈工程师。2024 年起以
                <strong className="text-ink"> Tianda Studio (添达工作室) </strong>
                的名义在 Upwork 独立承接 AI、全栈 Web、Web3 NFT 项目。
                这个站点是我的作品集、写作和小工具的集合地。
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/work"
                  className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink2"
                >
                  查看 21 个作品 →
                </Link>
                <a
                  href="https://www.upwork.com/freelancers/~012a1e9c108e49cd19?viewMode=1"
                  target="_blank"
                  rel="noopener"
                  className="rounded-md border border-line2 bg-white px-5 py-2.5 text-sm font-medium hover:border-brand hover:text-brand"
                >
                  ↗ Upwork 主页
                </a>
                <a
                  href="mailto:kui.wang.upwork@gmail.com"
                  className="rounded-md border border-line2 bg-white px-5 py-2.5 text-sm font-medium hover:border-brand hover:text-brand"
                >
                  ✉ 发邮件
                </a>
              </div>
            </div>
            <aside className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <h3 className="mb-4 text-sm font-semibold">基本信息</h3>
              <dl className="space-y-2.5 text-sm">
                {[
                  { k: '所在地', v: '上海 (UTC+8)' },
                  { k: '语言', v: '中文母语 / 英文 Pro' },
                  { k: '从业', v: '2014 — 至今' },
                  { k: '当前身份', v: '一人工作室创始人' },
                  { k: '可接单', v: '是 · 24h 内回复' },
                  { k: '时薪起价', v: '$25/h' },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="flex justify-between border-b border-line pb-2 last:border-b-0 last:pb-0"
                  >
                    <dt className="text-muted2">{row.k}</dt>
                    <dd className="font-mono text-[12px] font-semibold">{row.v}</dd>
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
            <div className="eyebrow">— 经历 · Path —</div>
            <h2 className="mt-2 text-2xl font-bold md:text-3xl">职业路径</h2>
            <p className="mt-2 text-sm text-muted">从大厂到独立工作室 · 2014 — 至今</p>
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
                      现在
                    </span>
                  )}
                </div>
                <div className="text-sm leading-relaxed">
                  <div className="text-base font-semibold">
                    {row.role.zh} <span className="text-brand">@ {row.company.zh}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{row.description.zh}</p>
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
            <div className="eyebrow">— 技术栈 · Stack —</div>
            <h2 className="mt-2 text-2xl font-bold md:text-3xl">技术栈</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((group) => (
              <div key={group.title.zh} className="rounded-card border border-line bg-white p-5">
                <h4 className="mb-3 flex items-center gap-2 text-base font-semibold">
                  <span className="h-2 w-2 rounded-full bg-brand" />
                  {group.title.zh}
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
            <div className="eyebrow">— 工作方式 · How I work —</div>
            <h2 className="mt-2 text-2xl font-bold md:text-3xl">合作方式</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: '单一对接人',
                body: '从需求拆解、架构设计、编码、部署到后续维护一条龙。没有项目经理来回拉扯，也没有外包团队踢皮球。',
              },
              {
                title: 'Vibe Coding',
                body: '日常用 Claude Code + Gemini CLI。让我能用更短的时间，交付传统 2-3 人团队的产出量。',
              },
              {
                title: '24h 回复',
                body: 'UTC+8 (上海)，工作日 24 小时内回复邮件 / Upwork 消息。',
              },
              {
                title: '中英无障碍',
                body: '中文母语，英文 professional 等级。可以直接和美 / 欧 / 日客户开会与写技术文档。',
              },
            ].map((p) => (
              <div key={p.title} className="rounded-card border border-line bg-paper2 p-5">
                <h4 className="text-base font-semibold">✦ {p.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-2xl bg-ink p-7 text-paper md:p-9">
            <h3 className="text-xl font-bold md:text-2xl">想合作？</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted2">
              邮件最稳；如果是商业项目，建议直接走 Upwork（自带托管担保 + 时薪计费工具）。
              想随便聊聊就在留言板留个言。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="mailto:kui.wang.upwork@gmail.com"
                className="rounded-md bg-paper px-5 py-2.5 text-sm font-medium text-ink hover:bg-paper2"
              >
                ✉ 邮件咨询
              </a>
              <a
                href="https://www.upwork.com/freelancers/~012a1e9c108e49cd19?viewMode=1"
                target="_blank"
                rel="noopener"
                className="rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
              >
                ↗ Upwork 找我
              </a>
              <Link
                href="/feedback"
                className="rounded-md border border-paper/20 px-5 py-2.5 text-sm font-medium hover:bg-white/5"
              >
                💬 留言反馈
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
