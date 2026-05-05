# Tianda Web V2 — 静态前端 + FastAPI + Vite Admin

> **决策前提**（2026-05-05 与 Kevin 对齐）：
> - 既然已经做了后端，V2 不引入三方 SaaS。评论、后台、用户体系、邮件全部自建。
> - 监控暂缓（不做 Sentry / Uptime）。
> - 三项目完全解耦：**Next.js 静态导出主站 + FastAPI 后端 + Vite + React Admin SPA**，互相不依赖运行时。
> - **去掉 Next.js route handler**，浏览器直连 `api.tianda.studio`，cookie 走 `.tianda.studio` 根域共享。
> - 静态导出（`output: 'export'`）—— 主站 SEO 由静态 HTML 兜底；动态部分（评论列表写入、小说章节、用户中心）走 CSR fetch FastAPI。
> - 小说权重低、章节不需要 SEO，章节正文走 CSR；只需要小说**详情页**（`/novels/[slug]`）有 SEO，构建时静态化。
> - 国际化以中文为主，英文是次要语种，SSR 闪烁问题可接受。
> - 部署形态：**前端 / admin 都在 VPS 上构建静态文件**，宝塔直接静态托管（不上 OSS / CDN，不上容器）。仅 api + db 走 Docker。
> - 本周 V1 收尾（**只完成结构改造**），下周起做 V2 业务功能。

---

## 0. 最终架构

```
                              ┌─ tianda.studio
                              │    宝塔静态托管 → /srv/tianda-web/web (Next.js 静态产物)
                              │
浏览器 (cookie domain=.tianda.studio)
                              ├─ admin.tianda.studio
                              │    宝塔静态托管 → /srv/tianda-web/admin (Vite SPA 产物)
                              │
                              └─ api.tianda.studio
                                   宝塔反代 → 127.0.0.1:8000 → FastAPI 容器 ──► Postgres 16

VPS 三网站全在宝塔配 SSL；前端 / admin 由 GH Actions ssh 触发 git pull + 本地构建脚本。
```

**关键架构原则**：
- **三项目独立 build / deploy / lifecycle**，main 仓库内分目录（`frontend/` / `backend/` / `admin/`）
- **浏览器直连 FastAPI**，CORS allow_origins 列白名单，`credentials=true`
- **Cookie 跨子域共享**：`Domain=.tianda.studio; HttpOnly; Secure; SameSite=Lax`
- **API 路径前缀**：`/api/v1/{public,auth,me,admin}/*` 四段，权限语义内嵌路径
- **静态导出限制接受**：no middleware / no `cookies()` / `next/image` 用 `unoptimized`

---

## 1. V1 本周要完成的「结构改造」（不含业务功能）

> 目标：把架构骨架立起来，让 V2 各个里程碑可以直接往里填业务代码。**本周不做评论、不做用户、不做小说、不做 OSS**，只做架构变更和最小化迁移。

### V1.1 — Frontend 切换到静态导出 + 直连 FastAPI（1 天）

**[frontend/next.config.ts](frontend/next.config.ts)**
- 加 `output: 'export'`
- `images: { unoptimized: true }`
- `trailingSlash: true`（OSS 静态托管对目录路径友好）

**清理 route handler**
- 删除 [frontend/src/app/api/](frontend/src/app/api/) 整个目录（feedback proxy 不再需要）
- 在 `frontend/src/lib/api.ts` 写一个统一的 fetch 封装：
  ```ts
  export const apiBase = process.env.NEXT_PUBLIC_API_BASE!
  export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${apiBase}${path}`, {
      credentials: 'include',  // 关键：带跨子域 cookie
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    })
    if (!res.ok) throw new ApiError(res.status, await res.text())
    return res.json()
  }
  ```

**Feedback 表单改造**
- 现有 `frontend/src/app/api/feedback/route.ts` 删除
- Feedback 表单组件改为客户端组件，直接 `apiFetch('/api/v1/public/feedback', { method: 'POST', body })`

**环境变量**
- `frontend/.env.example` 加 `NEXT_PUBLIC_API_BASE=https://api.tianda.studio`
- 开发环境用 `http://localhost:8000`

**构建产物**
- `pnpm build` 后产物在 `frontend/out/`
- 部署改为 `aliyun-oss-cli sync out/ oss://tianda-web/` 或 ossutil

**验收**
- `pnpm build` 成功生成 `out/` 目录
- 本地起 `python -m http.server -d out 3000` 能访问主站
- feedback 表单提交直接打到 FastAPI（DevTools 看请求是 `api.tianda.studio` 不是主站）

---

### V1.2 — Backend 路径前缀重构 + CORS + Cookie 跨子域准备（0.5 天）

**[backend/app/api/v1/__init__.py](backend/app/api/v1/__init__.py)**
- 拆 4 个 sub-router：`public_router / auth_router / me_router / admin_router`
- 主 router 挂载：
  ```python
  api_router.include_router(public_router, prefix="/public")
  api_router.include_router(auth_router, prefix="/auth")
  api_router.include_router(me_router, prefix="/me")
  api_router.include_router(admin_router, prefix="/admin")
  ```

**Feedback 路由迁移**
- `POST /api/v1/feedback` → `POST /api/v1/public/feedback`
- `GET  /api/v1/feedback` → `GET  /api/v1/admin/feedback`（仍保留旧的 Bearer，V2 M1 再换 JWT）

**CORS 中间件**
- [backend/app/main.py](backend/app/main.py) 加：
  ```python
  app.add_middleware(
      CORSMiddleware,
      allow_origins=settings.CORS_ORIGINS,  # 从 env 读列表
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```
- `.env.example` 加：
  ```
  CORS_ORIGINS=https://tianda.studio,https://admin.tianda.studio,http://localhost:3000,http://localhost:3002
  ```

**Cookie 工具函数**（先建好，V2 用）
- 新建 [backend/app/core/cookies.py](backend/app/core/cookies.py)：
  ```python
  def set_session_cookie(response, key: str, value: str, max_age: int):
      response.set_cookie(
          key=key,
          value=value,
          max_age=max_age,
          httponly=True,
          secure=settings.COOKIE_SECURE,
          samesite="lax",
          domain=settings.COOKIE_DOMAIN,  # .tianda.studio / 本地空
          path="/",
      )
  ```
- `.env.example` 加 `COOKIE_DOMAIN=.tianda.studio`、`COOKIE_SECURE=true`，dev 环境留空

**验收**
- `curl https://api.tianda.studio/api/v1/public/feedback -H "Origin: https://tianda.studio"` 返回 CORS 头
- 浏览器从主站提交 feedback，DevTools 中 preflight + 真实请求都通过
- 旧的 `/api/v1/feedback` 路径返回 404（CI 中如有引用同步更新）

---

### V1.3 — Admin 项目骨架（0.5 天，**仅项目搭起来，不写业务**）

**新建 [admin/](admin/) 目录**
- `pnpm create vite admin --template react-ts`
- 装：`@tanstack/react-router @tanstack/react-query axios react-hook-form zod tailwindcss zustand`
- 基础脚手架：
  ```
  admin/
  ├── package.json
  ├── vite.config.ts        # base: '/', server.port: 3002
  ├── tsconfig.json
  ├── tailwind.config.ts    # 复用主站 token，色调更冷
  ├── index.html
  ├── src/
  │   ├── main.tsx
  │   ├── routes/
  │   │   ├── __root.tsx
  │   │   └── index.tsx     # 占位 "Admin V2 coming"
  │   ├── lib/
  │   │   └── api.ts        # axios 实例，baseURL=NEXT_PUBLIC_API_BASE，withCredentials=true
  │   └── styles.css
  └── Dockerfile            # 多阶段：node build → nginx:alpine
  ```

**Robots / noindex**（防止子域被搜索引擎索引）
- `admin/public/robots.txt`：
  ```
  User-agent: *
  Disallow: /
  ```
- nginx 配置加响应头 `X-Robots-Tag: noindex, nofollow`
- HTML `<head>`：`<meta name="robots" content="noindex, nofollow">`

**Docker Compose 接入**
- [docker-compose.yml](docker-compose.yml) 新增 admin service：
  ```yaml
  admin:
    image: ghcr.io/kui-wang-dada/tianda-admin:${TAG:-latest}
    ports: ["3002:80"]
    restart: unless-stopped
  ```
- [docker-compose.dev.yml](docker-compose.dev.yml) 同步加（dev 端口 3003 避免冲突）

**Makefile 任务**
- 新增 `make dev-admin` —— `cd admin && pnpm dev`
- `make install` 加 `cd admin && pnpm install`
- `make test` 加 admin 的 tsc

**CI**
- [.github/workflows/ci.yml](.github/workflows/ci.yml) 加 `admin` job：tsc + build
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml) 加 admin 镜像构建 + 推送 GHCR

**验收**
- `make dev` 三个容器（web 静态预览 + api + db + admin）全部起来
- 浏览器打开 `http://localhost:3002` 看到 "Admin V2 coming"
- CI 全绿，admin 镜像推送到 GHCR

---

### V1.4 — 部署链路改造（0.5 天）

**主站不再走容器**
- 从 [docker-compose.yml](docker-compose.yml) 删除 `web` service
- 主站部署改为 `pnpm build` → `ossutil sync out/ oss://...`
- 在 [scripts/](scripts/) 加 `deploy-frontend.sh`，封装构建 + 同步命令
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml) 拆分：
  - `deploy-frontend` job：build → ossutil sync（需要 OSS AccessKey secret）
  - `deploy-backend` job：build → push GHCR → ssh → docker compose pull api db
  - `deploy-admin` job：build → push GHCR → ssh → docker compose pull admin

**OSS 部分凭证待用户提供**，V1 阶段先把脚本和 GHA workflow 框架写好，AccessKey 用占位 secret 名 `OSS_ACCESS_KEY_ID / OSS_ACCESS_KEY_SECRET / OSS_BUCKET`。

**宝塔配置笔记**（写到 README 或 [COMMANDS.md](COMMANDS.md)）：
- `tianda.studio` → CNAME 到 OSS 静态网站托管 endpoint（用户后续配）
- `api.tianda.studio` → 反代到 `localhost:8000`
- `admin.tianda.studio` → 反代到 `localhost:3002`，可叠加 IP 白名单 / Basic Auth

**验收**
- 本地手动跑 `./scripts/deploy-frontend.sh` 在干跑模式（dry-run）下能列出要同步的文件
- backend / admin 部署 workflow 在 GitHub Actions 上能跑通构建（不一定真部署）

---

### V1 改造完成时的状态总结

完成本周改造后：
- ✅ 三项目目录结构齐全：[frontend/](frontend/) / [backend/](backend/) / [admin/](admin/)
- ✅ 主站静态导出，部署到 OSS（凭证就位后即可一键部署）
- ✅ 浏览器直连 FastAPI，feedback 跑通
- ✅ Backend 四前缀路由（public/auth/me/admin）就位
- ✅ CORS + cookie 跨子域基础设施就位（V2 直接用）
- ✅ Admin 子项目跑得起来（仅占位页）
- ⏸️ 用户系统、评论、小说、OSS 业务、SEO 全部留到 V2

**V1 改造工时**：1 + 0.5 + 0.5 + 0.5 = **2.5 天**

---

## 2. V2 业务功能里程碑（下周起）

每个里程碑都建立在 V1 已完成的架构骨架之上。**所有"前后端怎么通信、admin 怎么登录"问题在 V1 已经解决了**。

### M1 — 用户系统 + 认证基座（3 天）

**目标**：admin 能登录、主站能登录、JWT + httpOnly cookie 通跑。

- `users` 表扩展字段：`password_hash` (argon2)、`role` (`user|author|admin`)、`is_active`、`email_verified_at`、`avatar_url`、`display_name`
- 新依赖：`argon2-cffi>=23.1`、`pyjwt[crypto]>=2.10`、`aiosmtplib>=3.0`
- `app/core/auth.py`：JWT 签发（access 15min + refresh 7d，refresh 存 DB 可吊销）
- 端点：
  - `POST /api/v1/auth/register` — 创建用户 + 发 OTP 邮件
  - `POST /api/v1/auth/verify-email` — 验证 OTP
  - `POST /api/v1/auth/login` — 验密 + set-cookie(refresh) + 返回 access
  - `POST /api/v1/auth/refresh` — 用 cookie 中的 refresh 换 access
  - `POST /api/v1/auth/logout` — 吊销 refresh + 清 cookie
- 依赖注入：`current_user` / `optional_user` / `require_role("admin")`
- 删除旧的 `require_admin_token`（静态 Bearer），统一 JWT
- 限流：`/auth/login` 5/min;20/hour、`/auth/register` 3/hour
- 邮件：aiosmtplib 直连企业邮箱 SMTP，SMTP 凭证待用户后续提供
- 结构化日志：structlog middleware，每请求 `request_id / user_id / route / latency_ms`，写 `logs/api.json`

**Frontend 主站登录页**
- `/login` `/register` `/verify-email` 全部静态导出（页面骨架是静态的，业务逻辑客户端 fetch）
- `frontend/src/stores/authStore.ts`：access token 存内存（zustand 不持久化），刷新页面靠 refresh cookie 重新换
- 路由守卫：`/me/*` 客户端检查 access，无则跳 `/login?redirect=`

**Admin 登录页**
- `admin/src/routes/login.tsx`
- `_authed.tsx` layout：未登录跳 login，access token 内存存储
- axios 拦截器：401 自动调 refresh

**验收**
- 注册 → 收 OTP 邮件 → 验证 → 登录 → 刷新页面仍登录 → 登出
- admin 用 admin 角色账号能登录，普通用户登录被拒

---

### M2 — Admin 业务模块（2 天）

**目标**：admin 能管理 feedback、查看用户列表。

- `_authed/feedback.tsx` — 列表（分页 / 类型筛选 / 标记 spam / 归档）
- `_authed/users.tsx` — 用户列表（搜索 / 角色调整 / 禁用账号）
- 后端补：
  - `PATCH /api/v1/admin/feedback/{id}` — 更新 spam/archived 状态
  - `GET /api/v1/admin/users` — 分页列表
  - `PATCH /api/v1/admin/users/{id}` — 改角色 / 禁用

**验收**：admin 全流程可用，无需 SSH 或 curl 操作 DB

---

### M3 — 评论系统（4 天）

**目标**：主站任意 MDX 文章 / 作品 / 产品页底部能挂评论；admin 可审核。

- `comments` 表扩展：`target_type / target_slug / parent_id / body / body_html / status / like_count / ip_hash`
- `comment_likes` 已有 schema 即用
- 端点：
  - `GET /api/v1/public/comments?target_type=&target_slug=` — 仅 approved
  - `POST /api/v1/me/comments` — 进入 pending
  - `POST /api/v1/me/comments/{id}/like` — 幂等
  - `DELETE /api/v1/me/comments/{id}` — 软删
  - `GET /api/v1/admin/comments?status=pending`
  - `PATCH /api/v1/admin/comments/{id}` — approve/reject

**反垃圾**：
- 敏感词词库 `backend/data/sensitive_words.txt`，命中→直接 spam
- 用户级 1/min;30/day 限流
- ≥2 个外链自动进 pending
- markdown-it-py 渲染，白名单（粗体/斜体/code/quote/link），禁图片和 HTML

**主站集成**（注意：CSR，不影响 SEO 关键内容）
- `frontend/src/components/comments/CommentSection.tsx` — **客户端组件**，挂载后 fetch `/public/comments`
- `CommentForm.tsx` — 未登录跳 `/login?redirect=`
- `CommentItem.tsx` — 嵌套一层

**Admin**：`_authed/comments.tsx` 待审列表 + 批量操作

---

### M4 — 用户中心（1.5 天）

**目标**：登录用户能管理自身资料、看历史评论、修改密码。

- 主站 `/me` `/me/comments` `/me/settings`，全部 CSR
- 后端 `/api/v1/me/profile` GET/PATCH、`/api/v1/me/password` PATCH

---

### M5 — 小说连载（4 天）

**目标**：admin 录入小说与章节，前台**详情页有 SEO，章节页 CSR**。

**数据模型**
```python
class Novel(Base):
    id, slug (unique), title_zh, title_en, cover_url
    synopsis_zh, synopsis_en, author_id, status, visibility, tags[]
    chapter_count, word_count, published_at, updated_at, created_at

class NovelChapter(Base):
    id, novel_id, chapter_number, title
    body_md, body_html, word_count, visibility
    published_at, updated_at, created_at
    # unique (novel_id, chapter_number)

class ReadingProgress(Base):
    user_id, novel_id, chapter_id, scroll_percent, updated_at
    # PK (user_id, novel_id)
```

**渲染策略（关键）**
- `/novels` 列表页 — 静态导出，构建时拉所有 published Novel
- `/novels/[slug]` 详情页 — **静态导出**，构建时拉小说元数据 + 目录（仅 chapter_number / title）
  - SEO 字段：generateMetadata + JSON-LD `Book`
  - 新章节加进目录 → admin 触发主站重构建（GHA webhook 或 ssh 脚本）
- `/novels/[slug]/[chapterNumber]` 章节页 — **CSR**
  - 静态导出仅生成壳子（用 `dynamicParams` + 空 `generateStaticParams`）
  - 客户端 fetch `/api/v1/public/novels/{slug}/chapters/{n}` 拿 body_html
  - 不索引：`<meta name="robots" content="noindex, follow">`（详情页可索引、章节不索引）

**章节正文渲染**：markdown-it-py 服务端渲染，body_html 入库

**Admin**：CodeMirror 6 编辑器 + 实时预览，章节列表可拖拽排序，发布章节后调主站重构建 webhook

**主站重构建机制**
- admin 发布章节后，POST 到 `https://api.tianda.studio/api/v1/admin/trigger-rebuild`
- 后端调用 GitHub repository_dispatch event 或本地 ssh 脚本
- 重构建只刷新 `/novels` 和 `/novels/[slug]` 两个静态页（章节正文是 CSR，不需要重构建）

---

### M6 — 阿里云 OSS 上传（1.5 天）

**前置（用户后续提供）**：bucket / endpoint / RAM AccessKey / CDN 域名

- 新依赖 `oss2>=2.19`，`run_in_threadpool` 包装
- `app/services/storage.py`：`upload(file_bytes, key, content_type) -> cdn_url`
- `POST /api/v1/admin/uploads` — 10MB 限制 / mime 白名单
- Pillow 自动转 webp + 1x/2x，路径 `covers/* / works/* / avatars/*`
- 主站 `next.config.ts` 的 `images.remotePatterns` 加 CDN 域名（虽然 unoptimized，但仍需声明）
- 一次性迁移脚本 `scripts/migrate_images_to_oss.py`，把 work 内容图片传 OSS、frontmatter 改绝对 URL
- Admin 加 `<ImageUploader>` 组件

---

### M7 — SEO 静态导出收尾（0.5 天）

- `frontend/src/app/sitemap.ts` 改为静态生成（构建期）；含 work / writing / products / novels（详情，不含章节）
- `frontend/src/app/robots.ts` 静态生成
- 每个详情页 `generateMetadata`：openGraph、twitter、canonical
- JSON-LD：`/` Person + WebSite、work CreativeWork、novel Book、writing Article
- 章节页 `<meta name="robots" content="noindex, follow">`
- `<TiandaImage>` 组件封装 srcset / blur placeholder / priority（替代失效的 next/image）
- CI 加 lock 校验：frontend `--frozen-lockfile`、admin 同上、backend `uv sync --frozen`
- README 加回滚说明：`TAG=<上个 sha> docker compose up -d`（仅 api/admin，主站直接重传上个 build 产物）

---

## 3. 时间表

### V1 本周（架构改造）
| 子任务 | 工期 |
|---|---|
| V1.1 Frontend 静态导出 + 直连 | 1 天 |
| V1.2 Backend 四前缀 + CORS + Cookie 工具 | 0.5 天 |
| V1.3 Admin 项目骨架 | 0.5 天 |
| V1.4 部署链路改造 | 0.5 天 |
| **V1 小计** | **2.5 天** |

### V2 业务功能（下周起）
| 里程碑 | 工期 | 累计 |
|---|---|---|
| M1 用户 + 认证 | 3 天 | 3 |
| M2 Admin 业务 | 2 天 | 5 |
| M3 评论系统 | 4 天 | 9 |
| M4 用户中心 | 1.5 天 | 10.5 |
| M5 小说连载 | 4 天 | 14.5 |
| M6 阿里云 OSS | 1.5 天 | 16 |
| M7 SEO 收尾 | 0.5 天 | 16.5 |

**V2 总计 ~16.5 工作日**，按每天 6h 实际投入约 3.5 周。

---

## 4. 待用户提供的凭证

| 时机 | 需要的东西 | 用途 |
|---|---|---|
| V1.4 部署前 | 阿里云 OSS bucket / RAM AccessKey | 主站静态文件托管 |
| M1 开始时 | SMTP host / user / password / from 地址 | 注册 OTP / 密码重置 |
| M5 重构建机制 | GitHub PAT 或 VPS ssh key | admin 触发主站重构建 |
| M6 开始时 | OSS 第二个 bucket（图片用，可与主站同 bucket 分 prefix） / CDN 域名 | 用户上传图片存储 |

---

## 5. 不在 V2 范围

- 全文搜索（PG tsvector 也不上，等内容到 50+ 再说）
- 站内私信 / 通知中心
- 付费阅读 / 打赏
- 监控（Sentry / Uptime）
- Redis 缓存层
- WebSocket 实时通知
- 多语言扩展（zh/en 之外）
- 移动端 App / PWA

---

## 6. 静态导出已知限制清单（V2 实施时记得避坑）

| 限制 | 影响 | 处理方式 |
|---|---|---|
| `next/image` 优化失效 | 自动 webp / srcset 没了 | M7 写 `<TiandaImage>`；M6 OSS 上传时 Pillow 预生成多尺寸 |
| middleware 失效 | 不能做服务端重定向 / 地区分流 | 用静态 redirect 配置或客户端逻辑 |
| `cookies()` / `headers()` 服务端 API 失效 | 服务端组件读不到请求头 | 业务逻辑全部走 CSR fetch |
| `revalidate*` 失效 | 不能 ISR 增量更新 | M5 章节用 CSR 兜底；详情页改动靠重构建 |
| 动态路由必须 `generateStaticParams` 全列出 | 构建时 api 必须可达 | 构建脚本里先确保 api 健康检查通过；章节用空数组 + `dynamicParams: true` |
| Lingui SSR 优势消失 | 中英文切换首屏闪烁 | 中文为主，英文用户少，可接受；首屏默认中文 |
| admin 子域不能被索引 | 防止登录页出现在搜索结果 | V1.3 已做：robots.txt + X-Robots-Tag + meta noindex |

---

**下一步**：等你点头后，按 V1.1 → V1.2 → V1.3 → V1.4 顺序执行本周改造。
