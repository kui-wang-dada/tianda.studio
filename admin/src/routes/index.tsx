import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="text-xs uppercase tracking-[0.3em] text-muted">tianda admin</div>
      <h1 className="text-3xl font-semibold">天大工作室 · 管理后台</h1>
      <p className="max-w-md text-sm text-muted">
        V1 阶段仅完成项目骨架。登录、Feedback / 评论 / 用户 / 小说管理面板将在 V2 里程碑里依次接入。
      </p>
      <div className="rounded-md border border-line bg-panel px-3 py-1.5 font-mono text-xs text-muted">
        API base · {import.meta.env.VITE_API_BASE ?? 'http://localhost:8000'}
      </div>
    </main>
  )
}
