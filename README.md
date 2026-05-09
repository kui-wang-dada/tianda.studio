# tianda-web

**Tianda Studio · 天大工作室** — Kevin Wang 的个人品牌门户。

三项目解耦架构：`frontend/` Next.js 静态导出 · `admin/` Vite SPA · `backend/` FastAPI · Postgres 16。前端 / admin 都是 VPS 上构建的静态文件，宝塔静态托管 + 反代 + SSL。仅 api + db 走 Docker。

## Quick start

```bash
make install         # 安装 frontend + admin + backend 依赖
make dev             # docker compose 起 api + db
make dev-web         # 另一个终端：Next.js dev on :3000
make dev-admin       # 另一个终端：Vite admin dev on :3002
# → http://localhost:3000          (web)
# → http://localhost:3002          (admin)
# → http://localhost:8000/api/v1/health  (api)
```

完整命令表见 [COMMANDS.md](./COMMANDS.md)。

## Stack

| Layer | Choice |
|---|---|
| Frontend (主站) | Next.js 15 静态导出 (`output: 'export'`) + Tailwind 3 + Lingui 5 + Zustand + Framer Motion |
| Admin SPA | Vite 6 + React 19 + TanStack Router + TanStack Query + axios + Tailwind |
| Content | Velite + MDX（frontmatter 驱动，作品/产品/技术文章不入 DB） |
| Backend | FastAPI + Pydantic v2 + SQLAlchemy async + slowapi |
| Database | Postgres 16 |
| Reverse proxy | 宝塔面板（生产）· 直接静态托管 web / admin · 反代 api 子域 |
| Container | Docker Compose（生产仅 api + db） |
| CI/CD | GitHub Actions → ssh 到 VPS：git pull → 脚本构建静态 / 拉镜像重启 api |

## Layout

```
frontend/             Next.js 15 静态导出 (产物在 frontend/out/)
admin/                Vite + React Admin SPA (产物在 admin/dist/)
backend/              FastAPI (含 Dockerfile)
content/              MDX 源 (work / writing / products / shared)
docker-compose.yml    生产 compose（api + admin + db）
docker-compose.dev.yml 本地 dev compose（仅 api + db）
postgres-init.sql     postgres 首次启动脚本
.env.example          生产环境变量模板
.github/workflows/    CI + deploy
scripts/              deploy-frontend.sh 等辅助脚本
COMMANDS.md           常用命令清单
CLAUDE.md             面向 AI 的项目约定
V2_PLAN.md            V2 业务功能里程碑计划
```

## 部署回滚

API 镜像在 VPS 本地由 `docker compose --build` 构建。回滚：VPS 上 `cd /www/wwwroot/tianda-web/repo && git checkout <上个 sha> && set -a && . /www/wwwroot/tianda-web/.env && set +a && docker compose up -d --build api`。
Frontend / admin 静态产物：每次部署前 `mv` 旧目录到 `.old`，部署失败可直接 `mv` 回来；或者 `git checkout <sha>` 后手动跑对应 deploy 脚本。

V1 架构改造与 V2 业务功能规划：[V2_PLAN.md](./V2_PLAN.md)
