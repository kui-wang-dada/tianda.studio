# Project: tianda-web

Personal brand portal for **Tianda Studio · 天大工作室** (Kevin Wang).

## Stack pin (do NOT swap without asking)

- **Frontend** `frontend/` — Next.js 15 App Router (**`output: 'export'` 静态导出**) · TS · Tailwind 3 · Lingui 5 · Zustand · Framer Motion · Velite + MDX
- **Admin SPA** `admin/` — Vite 6 + React 19 · TanStack Router (文件路由) · TanStack Query · axios · Tailwind · 独立子域 `admin.tianda.studio`
- **Backend** `backend/` — FastAPI · Pydantic v2 · SQLAlchemy async · Alembic · Postgres 16 · slowapi
- **部署形态** frontend / admin 都在 VPS 上由 GH Actions ssh 触发构建（`scripts/deploy-{frontend,admin}.sh`），产物落 `/www/wwwroot/tianda-web/{web,admin}`，宝塔静态托管 + 反代 + SSL；compose 仅生产 `api + db`
- **Package mgmt** `pnpm` (frontend / admin), `uv` (backend)

## Hard conventions

- **Content lives in `content/` at repo root**, not inside `frontend/`. Velite reads from `../content/`. New project / article / product = a new `.mdx` file with bilingual `frontmatter.title.zh / .en`.
- **i18n**: Chinese default. Use Lingui `t` macros in components, `pickLocaleField()` for MDX frontmatter.
- **Database content**: only `feedbacks` table is wired in V1. `users / comments / comment_likes` exist but are dormant — do not query them, do not add endpoints for them in V1.
- **API 调用方式**：浏览器直连 `api.tianda.studio`（无 Next.js route handler）；4 段前缀 `/api/v1/{public,auth,me,admin}/*` —— `public` 任何人可访问、`auth` 登录注册、`me` 已登录用户自身、`admin` 管理员。新增 endpoint 落在对应 tier 子目录。
- **Cookie 跨子域**：refresh token 由 FastAPI 下发，`Domain=.tianda.studio` 让 web/admin/api 共享。本地空 domain。
- **静态导出限制**：frontend 不能用 middleware / `cookies()` / `headers()` / `revalidate*` / `next/image` 优化；写新页面前确认它能 SSG。`opengraph-image.tsx` / `sitemap.ts` / `robots.ts` 必须 `export const dynamic = 'force-static'`。
- **No raw IPs**: every IP must be `hash_ip()` from `app.core.security` before storage.
- **Tailwind tokens** are the source of truth — never hardcode colors. Use `bg-paper`, `text-ink`, `text-brand`, etc.
- **环境变量**：仓库唯一样板是根 `.env.example`。子项目无 `.env.example` —— 本地默认值在代码里兜底，需覆盖时手动建 `frontend/.env.local` / `admin/.env.local` / `backend/.env`。

## Common commands

```bash
make install         # frontend + admin + backend deps
make dev             # 后台起 db + api，前台跑 Next.js dev (:3000)；admin 不起
make dev-stack       # 仅 docker (api + db)，前台带日志
make dev-admin       # Vite admin (:3002)，单独终端
make dev-api         # FastAPI native (:8000)
make dev-web         # Next.js native only (:3000)
make dev-db          # postgres only
make build-web       # 静态导出 → frontend/out/
make deploy-frontend # ossutil sync 到阿里云 OSS（需 OSS_* env）
make test            # frontend tsc + admin tsc + backend pytest
```

## Plans

- **当前实施计划**（V1 改造 + V2 业务里程碑）：`./V2_PLAN.md`
- 视觉真源（首页 8 sections）：`.superpowers/brainstorm/60125-1777857083/content/homepage-layout-v5.html`
