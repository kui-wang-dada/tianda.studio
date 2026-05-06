# 从零搭建一个全栈个人品牌门户：架构、开发到上线的完整工程实践

> 这是 **tianda-web**（添达工作室）项目的工程实录。我会把每一个技术决策的"为什么"和"怎么做"都摊开来讲，目的不是教程意义上的"跟着我抄一遍"，而是让你看完之后能够**为自己的项目做出更恰当的决策**——哪怕最终选了和我完全不同的栈。
>
> 适合读者：希望自建一个长期演进的个人品牌站、独立产品官网或博客系统的开发者；对全栈技术栈选型纠结、想看一个真实样本的工程师；用过 Vercel / Netlify 但想自掌控部署细节的人。
>
> 项目仓库结构和所有配置文件都开源在仓库里，本文配套源码可作为参照。

---

## 目录

- [一、为什么要做这个项目](#一为什么要做这个项目)
- [二、技术选型的全部考量](#二技术选型的全部考量)
  - [2.1 总体架构哲学](#21-总体架构哲学)
  - [2.2 前端：Next.js 静态导出（不上 SSR / 不上 Vercel）](#22-前端nextjs-静态导出不上-ssr--不上-vercel)
  - [2.3 管理后台：独立的 Vite SPA](#23-管理后台独立的-vite-spa)
  - [2.4 后端：FastAPI + Pydantic v2 + SQLAlchemy 2.x async](#24-后端fastapi--pydantic-v2--sqlalchemy-2x-async)
  - [2.5 数据库：Postgres 16，仅一张活表](#25-数据库postgres-16仅一张活表)
  - [2.6 内容管理：Velite + MDX，文件即数据库](#26-内容管理velite--mdx文件即数据库)
  - [2.7 部署：宝塔静态托管 + Docker Compose（仅 api+db）](#27-部署宝塔静态托管--docker-composeonly-apidb)
  - [2.8 我刻意拒绝的技术](#28-我刻意拒绝的技术)
- [三、项目结构与边界](#三项目结构与边界)
- [四、从零到上线全步骤](#四从零到上线全步骤)
  - [4.1 前置准备](#41-前置准备)
  - [4.2 本地开发环境一次到位](#42-本地开发环境一次到位)
  - [4.3 三个项目的开发节奏](#43-三个项目的开发节奏)
  - [4.4 服务器与域名](#44-服务器与域名)
  - [4.5 GitHub Actions 配置](#45-github-actions-配置)
  - [4.6 首次部署](#46-首次部署)
  - [4.7 后续迭代与日常发布](#47-后续迭代与日常发布)
- [五、关键设计决策深度解析](#五关键设计决策深度解析)
  - [5.1 为什么选静态导出而不是 SSR](#51-为什么选静态导出而不是-ssr)
  - [5.2 为什么三项目独立而不是一体化](#52-为什么三项目独立而不是一体化)
  - [5.3 为什么浏览器直连后端而不走 BFF](#53-为什么浏览器直连后端而不走-bff)
  - [5.4 为什么 Cookie 跨子域而不是 token in localStorage](#54-为什么-cookie-跨子域而不是-token-in-localstorage)
  - [5.5 为什么不用 OSS / CDN](#55-为什么不用-oss--cdn)
  - [5.6 为什么自建评论而不是接 Giscus](#56-为什么自建评论而不是接-giscus)
- [六、踩坑实录](#六踩坑实录)
- [七、后续扩展规划](#七后续扩展规划)
- [附录 A：命令速查表](#附录-a命令速查表)
- [附录 B：完整文件清单](#附录-b完整文件清单)
- [结语](#结语)

---

## 一、为什么要做这个项目

我做了 10 年全栈，前 5 年在公司做大型业务系统，后 5 年做独立外包。一直缺一个**长期可演进的个人品牌门户**。它要承担四件事：

1. **接外包业务的对外名片**：作品集、技术栈、合作流程一目了然；
2. **产品矩阵的展示窗口**：未来我会陆续做几个个人产品，每个都需要一个落地页；
3. **技术图文与小说连载的发表平台**：我喜欢写作，希望有自己的"博客 + 章节阅读"双形态内容平台；
4. **沉淀互动数据的私有空间**：评论、点赞、阅读进度——这些数据应该是我自己的，不是平台的。

第 4 点是关键。如果只是做一个静态作品集，套个 Hugo / Astro 模板半天就完事，不值得写这篇文章。我真正想要的是**一个可以承接长期演进的全栈应用**——今天它是名片，半年后它是评论系统 + 用户体系，一年后可能加上付费阅读。**架构必须从一开始就为这种演进做好准备**。

但同时——这是单人项目，不是创业产品。我没有时间、也没有必要为 100 万 DAU 优化。架构决策要在"现在足够简单"和"未来可以扩展"之间找平衡，而不是两端跑偏。

这种取舍贯穿整个项目的每一个技术决策。下面我会把每个决策的考量都说清楚。

---

## 二、技术选型的全部考量

### 2.1 总体架构哲学

我有三条**不可妥协**的原则：

#### 原则 1：只引入解决真实问题的技术

不为"看起来专业"加东西。每加一个组件（Redis、Kafka、Sentry、Cloudflare），都要回答：**它解决了什么我现在真实存在的问题？** 不是"以后可能有用"，是"现在已经有问题"。

> 反例：很多人个人站一上来就上 Redis 缓存、上 Cloudflare、上 Sentry。结果维护四个东西的负担远超个人站需要承受的程度，最后弃坑收场。

#### 原则 2：自掌控优先，三方依赖最少

既然我做了后端，就尽量把所有可控的东西放在自己服务器上：评论、用户、邮件、图片。三方 SaaS（Auth0 / Algolia / Sentry）只在**自建成本远高于三方成本**时才考虑。

> 这条原则不是"NIH 综合征"。我不会自己造数据库、不会自己造 Web 框架。但**评论这种业务级的东西**，三方方案带来的"长期数据被锁定"风险远大于自建的工程负担。

#### 原则 3：演进式架构，而非过度设计

**结构上为未来留足空间，实现上只做现在需要的**。比如：
- API 路径分四段前缀（`public / auth / me / admin`），但 V1 只填了 `public/feedback` 和 `admin/feedback`
- 数据库里建好了 `users / comments / comment_likes` 三张表，但 V1 不查询、不挂任何 endpoint
- 后端 cookie 工具函数已经写好（跨子域 Domain 配置），但 V1 没调用

这样做的代价是当前看起来"过度设计"，**收益是 V2 加新功能时不用回头改架构**。

---

### 2.2 前端：Next.js 静态导出（不上 SSR / 不上 Vercel）

**最终选型**：Next.js 15 App Router，开 `output: 'export'`，部署到 VPS 上由宝塔静态托管。

**为什么是 Next.js**：
- App Router + MDX 支持成熟，写技术文章不用造轮子
- `generateMetadata` + `sitemap.ts` + `opengraph-image.tsx` 这些 SEO 基础设施开箱即用
- React 19 + Server Components 的开发体验好——即使最终走静态导出，Server Components 仍然在编译期工作

**为什么是静态导出（`output: 'export'`）而不是 SSR / ISR**：

| 方案 | 个人站适用性 | 我的判断 |
|---|---|---|
| 完整 SSR (`output: 'standalone'`) | 需要 Node 容器一直跑，VPS 内存吃紧；个人站根本用不到 SSR 动态计算 | ❌ |
| ISR（增量静态再生成） | 需要长期运行的 Next 进程，加上 Vercel 之外的自建支持麻烦 | ❌ |
| **静态导出** | 编译期一次性产出 HTML，部署等于 rsync，无运行时进程 | ✅ |

代价是**接受一组限制**：
- 不能用 middleware
- 不能用 server-side `cookies()` / `headers()`
- 不能用 route handler（这正好倒逼浏览器直连后端，反而更干净）
- `next/image` 的运行时优化失效（需要 `images.unoptimized: true`）

这些限制对个人站完全没问题，因为**该有的都已经在编译期完成了**：
- SEO：每个文章/作品页都是真实的静态 HTML
- 性能：宝塔静态托管直接吐 HTML，TTFB 很低
- 国际化：Lingui 编译期生成中英文资源，不需要运行时切换

**为什么不上 Vercel**：
1. 国内访问 Vercel 慢，国内域名走 Vercel 边缘网络效果不如自家 VPS 直接吐
2. Vercel 的 Function 调用按次计费，写个评论 endpoint 都可能产生隐性账单
3. **数据库放哪？** Vercel + Supabase / PlanetScale 又是两层依赖
4. 我已经有 VPS 了，零边际成本

国内独立开发者部署个人站，**自己的阿里云 ECS + 宝塔**几乎永远是性价比最优解。Vercel 适合 indie hacker 做海外 SaaS。

#### 选型加分项

- **Velite**：内容编译器，用 Zod 校验 frontmatter，输出类型化的 `.velite/index.js`。作者是 Next.js / Vite 生态老玩家，比 Contentlayer（已停维护）更稳定。
- **Tailwind 3**：CSS 不需要思考。配合自定义 token（`paper / ink / brand`）保证设计一致性。
- **Lingui 5**：i18n 编译期方案，运行时几乎零开销。中文为主，英文为辅，刚好。
- **Zustand + Framer Motion**：状态管理和动效都是当前 React 生态最克制的选择，没有 Redux 那种 over-engineering。
- **Shiki + rehype-pretty-code**：代码高亮编译期完成，运行时不需要任何 JS 介入。

---

### 2.3 管理后台：独立的 Vite SPA

**最终选型**：Vite 6 + React 19 + TanStack Router + TanStack Query + axios + shadcn 风格 Tailwind，独立子域 `admin.tianda.studio`。

**为什么不和 Next.js 主站共用一个项目**：

很多教程会教你"在 Next.js 里加一个 `/admin` 路由就完事了"。这条路对个人站不合适：

1. **构建产物耦合**：admin 改一个按钮要重构建整个主站
2. **登录态污染**：admin 要登录、要 token、要 cookie；主站完全是匿名静态——硬塞在一起需要在每个页面加"是否需要登录"的判断
3. **依赖耦合**：admin 用了 antd / shadcn，主站不需要这些重 UI 库；放一起会让主站 bundle 体积膨胀
4. **样式风格差异**：admin 是冷调专业风（数据看板），主站是温暖文艺风（个人品牌）；放一起两边样式互相干扰

把 admin 单独切出来，三个层面解耦：

| 层面 | 主站 | admin |
|---|---|---|
| 框架 | Next.js 静态导出 | Vite SPA |
| UI 风格 | 温暖纸张色 | 冷调深色 |
| 路由 | 文件路由 (Next App Router) | 文件路由 (TanStack Router) |
| 数据 | 编译期 MDX | 运行时 fetch |
| SEO | 必须 | 必须 noindex（防止登录页进搜索结果） |

代价是多维护一个 `package.json`、多一组 lockfile、多一份构建脚本。**收益是两个项目互不干扰、独立演进、独立部署**。

**为什么不用 antd / element-plus**：
- 包体积大（antd 完整版 700KB+）
- 设计语言强势，和你的品牌色不太兼容
- 个人后台不需要那么多组件

**shadcn 风格**（Radix + Tailwind 自己拼组件）的好处是：每个组件都是你自己的代码，要改什么直接改，不用跟版本升级博弈。代价是要自己组装表单 / 表格 / 对话框，但 admin 用不到太多复杂组件，划算。

---

### 2.4 后端：FastAPI + Pydantic v2 + SQLAlchemy 2.x async

**最终选型**：FastAPI 0.115+ · Pydantic v2 · SQLAlchemy 2.x async · asyncpg · Alembic · slowapi · structlog

**为什么是 Python 而不是 Go / Node / Rust**：

我能写 Go、能写 TypeScript、也能用 Rust 玩 Axum，但选 Python 的原因很具体：

1. **AI 应用扩展性**：未来我会做一些 AI 相关的小功能（文章自动摘要、内容审核），Python 生态最完整；用 Go 调 OpenAI 也行，但 RAG / LangChain / LlamaIndex 这些都是 Python 优先
2. **数据处理顺手**：访问统计、内容分析这些一次性脚本，Python 5 分钟搞定，Go 要写 50 行
3. **FastAPI 的 OpenAPI 自动生成**：管理端调试 API 直接看 `/api/v1/docs`，不用 Swagger 单独搭

**为什么是 FastAPI 而不是 Django / Flask**：

| 框架 | 我的判断 |
|---|---|
| Django | 全家桶很完整，但 admin 我已经决定单独做了；Django ORM 不如 SQLAlchemy 灵活；async 支持是后期补的 |
| Flask | 太小，每次都要自己拼鉴权 / 序列化 / 文档；不值得 |
| **FastAPI** | Pydantic 校验 + 自动文档 + async 原生 + 依赖注入，这套组合是当前 Python Web 的最优解 |

**为什么 Pydantic v2 而不是 dataclass / attrs**：

Pydantic v2 用 Rust 重写后性能不再是瓶颈，**它的真正价值是 schema-first**：
- API 输入用 `BaseModel` 自动校验、自动生成 OpenAPI
- API 输出用 `model_validate` 自动序列化（避免暴露内部字段）
- 配置用 `pydantic-settings` 自动从环境变量读取

这一套组合让 backend 代码看起来非常薄：

```python
@router.post("/feedback", response_model=FeedbackOut, status_code=201)
@limiter.limit("3/minute;10/hour")
async def submit_feedback(
    request: Request,
    body: FeedbackIn,
    db: AsyncSession = Depends(get_db),
) -> FeedbackOut:
    if body.website:  # 蜜罐
        return FeedbackOut(ok=True)
    fb = await feedback_service.create(db, body, request=request)
    return FeedbackOut(ok=True, id=fb.id)
```

10 行代码完成校验、限流、IP hash、入库、响应。换 Flask 要 30 行，换 Django 要 50 行。

**为什么 SQLAlchemy async + asyncpg 而不是 SQLModel / Tortoise**：

- SQLModel 是 FastAPI 作者写的"SQLAlchemy + Pydantic"融合层，但**它的类型体操经常和 mypy 打架**，且不支持 SQLAlchemy 全部能力
- Tortoise ORM 借鉴 Django ORM 但生态不如 SQLAlchemy
- **SQLAlchemy 2.x 的 `Mapped[]` 类型注解 + `select()` 风格** 已经够现代，没必要再叠一层

**为什么 slowapi 而不是 redis-based 限流**：

slowapi 用进程内内存做限流。优点是零依赖、零运维。缺点是多进程时各 worker 的计数不共享。但**个人站单进程跑就够了**，不需要 Redis。等真要扩到多 worker 那天再换。

**为什么 structlog 而不是标准 logging**：

structlog 输出结构化 JSON，方便后期接 ELK / Loki。即使现在没接，先用上也不增加复杂度，未来直接对接。

---

### 2.5 数据库：Postgres 16，仅一张活表

**为什么是 Postgres 而不是 MySQL / SQLite**：

- **MySQL**：对于我来说没有单一吸引点。Postgres 在 JSON、全文搜索、数组、CTE 各方面都更现代
- **SQLite**：单文件好维护，但**多个容器并发写就崩**；个人站今天单进程，但我希望保留扩展空间
- **Postgres 16**：JSONB、tsvector 全文搜索、行级锁、async 友好（asyncpg），未来 V2 上小说阅读进度需要点赞计数都能用上

**为什么 V1 只激活一张表**：

我在 V1 的初版迁移里就建好了 `users / comments / comment_likes` 三张表的 schema，但所有相关的 endpoint 都不写、不查。原因是：

> 表结构的设计成本是一次性的，但 endpoint 一旦上线就要一直维护。先把表结构想清楚（V1 一次到位），endpoint 等真的需要再写（V2 分批）。

这种 **"schema 早 / API 晚"** 的策略避免了两类问题：
1. 一旦激活了用户体系，你的整个后端复杂度立刻翻倍（认证、鉴权、邮件、密码重置）
2. 等到 V2 才设计 schema，会被既有数据形态绑架，做出妥协的设计

**Alembic 迁移管理**：

```bash
alembic revision --autogenerate -m "describe what changed"
alembic upgrade head    # 容器 entrypoint 自动跑
```

每次启动 api 容器都会自动跑 `alembic upgrade head`，新 schema 自动应用。开发者只管写 model + 写 revision，部署时数据库自己跟上。

---

### 2.6 内容管理：Velite + MDX，文件即数据库

**为什么不用 CMS（Strapi / Notion / Sanity）**：

很多人会推荐"用 Notion 当 CMS，调它的 API 拉文章"。这条路我**不喜欢**：

1. **每次构建要联网拉 Notion**：Notion 挂了，你的 CI 就挂
2. **Notion API 配额限制**：免费版有调用次数限制
3. **数据被锁在 Notion**：哪天 Notion 不让你用了，你的所有文章都得手动迁
4. **frontmatter 不可控**：Notion 的属性字段映射到 markdown frontmatter 总要写一层适配

**MDX + git 的优势**：
- 完整版本控制：每次内容修改有 commit 历史
- 支持代码块语法高亮、JSX 嵌入交互组件、表格、checkbox 等所有富内容
- 编辑器自由：VSCode + Markdown All in One 扩展，离线可写
- 部署即发布：push 触发自动构建

**为什么是 Velite 而不是 Contentlayer**：

Contentlayer 是早期 Next.js MDX 圈的主流，但 **2024 年开始作者明确不再维护**。Velite 是社区接力做的替代品，API 几乎一致：

```typescript
// velite.config.ts
const work = defineCollection({
  name: 'Work',
  pattern: 'work/**/*.mdx',
  schema: s.object({
    slug:         s.slug('global'),
    title:        s.object({ zh: s.string(), en: s.string() }),
    type:         s.enum(['web3', 'ai', 'app', 'web', ...]),
    tech_stack:   s.array(s.string()),
    body:         s.mdx(),
  }).transform(d => ({ ...d, permalink: `/work/${d.slug}` })),
})
```

输出 `.velite/index.js` 是一个完全类型化的对象数组：

```typescript
import { Work } from '#site/content'
const items: Array<typeof Work[number]> = Work
```

每个字段都有类型推导，写错字段名 tsc 立刻报错。

**目录结构**：

```
content/
├── work/         # 作品集（25 篇）
├── writing/      # 技术文章
├── products/     # 产品介绍
├── novels/       # 小说（V2 用，元数据走 MDX，章节走 DB）
└── shared/       # 跨页面共享内容
```

**双语 frontmatter** 全部走 `{ zh: ..., en: ... }` 嵌入式结构，不分文件：

```yaml
---
slug: hello-tianda
title:
  zh: 你好，添达工作室
  en: Hello, Tianda Studio
excerpt:
  zh: 这是一篇示例文章
  en: This is a sample article
published_at: 2026-05-04
tags: [annoucement]
featured: true
---
```

页面渲染用 `pickLocaleField()` 按当前 locale 拿对应字段，比独立维护 `index.zh.mdx` / `index.en.mdx` 简洁得多。

---

### 2.7 部署：宝塔静态托管 + Docker Compose（仅 api+db）

**最终形态**：

```
                  GH Actions (path-filter)
                          │
   ┌──────────────────────┼──────────────────────┐
   │                      │                      │
frontend/**          admin/**            backend/**
   │                      │                      │
   └─ ssh →               └─ ssh →               └─ ssh →
      git pull               git pull               git pull
      pnpm build             pnpm build             docker compose up --build api
      atomic mv → /www/.../web   atomic mv → /www/.../admin
```

**关键决策**：

1. **前端 / admin 不进容器**——它们是纯静态文件，宝塔 nginx 直接托管目录即可；进容器是浪费 CPU 和内存
2. **api 进容器**——隔离 Python 运行时和 VPS 主机环境，alembic 自动迁移更可靠
3. **数据库进容器**——和 api 一起 compose，volume 挂载持久化
4. **不上 OSS / CDN**——单人个人站，VPS 出口带宽足够；OSS+CDN 会带来流量计费、域名、SSL 等额外配置

**为什么 GH Actions 走 ssh 而不是 GHCR + pull**：

最早我设计的是"GH Actions 构建 → 推 GHCR → ssh 到 VPS 拉镜像"。后来改成"GH Actions ssh → VPS git pull → VPS 本地构建"。原因：

| 方案 | GHCR 构建 | VPS 本地构建 |
|---|---|---|
| 网络消耗 | GH Actions 拉 base image，VPS 拉镜像 | 仅 git pull 代码 |
| 国内拉镜像速度 | 慢（GHCR 在海外） | 快（git 仓库通常已经在国内镜像） |
| GH Actions 时长 | 长（要构建 + 推送） | 短（仅 ssh 触发） |
| 镜像版本管理 | 有 SHA tag，回滚方便 | 仅 git history，回滚要 checkout + 重构建 |

对个人站来说，第二种方案的"VPS 本地构建"完全够用，且节省 GH Actions 配额。**回滚需求低于一周一次**，git checkout 完全能应付。

**为什么不用 systemd / supervisor 管 api 进程**：

直接 `docker compose up -d`，restart policy 设 `unless-stopped`。Docker 守护进程本身比 systemd unit file 更省心：
- 不需要写 unit file
- 不需要管 stdout / stderr 重定向
- `docker compose logs -f` 看日志一气呵成

宝塔自带 docker 管理面板，可以直接看容器状态。

---

### 2.8 我刻意拒绝的技术

| 技术 | 为什么不上 |
|---|---|
| Redis | V1 没有热点 key 写入场景；评论计数等用 DB 字段维护够了；引入 Redis 等于多一个要监控、要持久化、要备份的服务 |
| Celery / arq 后台任务 | 没有定时任务、没有耗时操作；评论审核也是同步流程 |
| Sentry | 报错日志走 structlog 写文件，定期看够了；个人站每月可能 0 个错误，付钱不值得 |
| Cloudflare CDN | 国内不工作；阿里云 CDN 又是一笔费用；VPS 出口带宽足够 |
| Nginx 容器 | 宝塔自带 nginx，再起一个容器化 nginx 是重复 |
| Caddy | 同上，宝塔已经管 SSL 了 |
| Kubernetes | 一台 VPS 部署三个东西，杀鸡用牛刀 |
| GitHub Codespaces / GitPod | 本地开发环境足够 |
| 三方评论（Disqus / Giscus） | 我已经做了后端，自建评论的"边际成本"很低；评论数据被锁定在三方的风险更高 |
| 三方鉴权（Auth0 / Clerk） | 同理，邮箱 + 密码 + OTP 自建 1 周搞定，省下每月 25 美元 |
| Notion / Strapi 当 CMS | 见 2.6 |
| Vercel / Netlify | 见 2.2 |
| Server Components 数据 fetch | 静态导出场景下，所有动态数据走 CSR fetch 后端，更清晰 |
| GraphQL | API 数量少，REST + 4 段路径前缀完全够用 |
| tRPC | 前后端非同语言，tRPC 没意义 |
| Turborepo / Nx 工作区 | 三个项目独立 lockfile，不需要 monorepo 工具，pnpm + 三个目录就行 |
| @tanstack/start / Remix | 它们解决的是 SSR 问题，我已经走了静态路线 |

**注意**：这个清单不是"这些技术不好"，而是"对当前项目阶段不需要"。等业务真长到那一步再加，不晚。

---

## 三、项目结构与边界

完整目录树（仓库根）：

```
tianda-web/
├── frontend/             Next.js 15 主站（静态导出）
│   ├── src/
│   │   ├── app/          路由（文件式）
│   │   ├── components/   blocks / layout / mdx / sections / ui 五层分组
│   │   ├── lib/          api / content / i18n 工具
│   │   └── stores/       Zustand 状态
│   ├── velite.config.ts  内容编译配置
│   ├── tailwind.config.ts
│   └── next.config.ts    output: 'export'
│
├── admin/                Vite + React Admin SPA
│   ├── src/
│   │   ├── routes/       TanStack Router 文件路由
│   │   ├── lib/          axios 实例
│   │   └── main.tsx
│   ├── tsr.config.json   路由生成器配置
│   └── vite.config.ts
│
├── backend/              FastAPI
│   ├── app/
│   │   ├── api/v1/       4 段前缀路由
│   │   │   ├── endpoints/
│   │   │   │   ├── public/        # 任何人可访问
│   │   │   │   ├── auth/          # 登录/注册（V2 M1）
│   │   │   │   ├── me/            # 已登录用户（V2 M1）
│   │   │   │   └── admin/         # 管理员
│   │   │   └── router.py
│   │   ├── core/         config / security / cookies / rate_limit
│   │   ├── db/           session + base
│   │   ├── models/       SQLAlchemy ORM
│   │   ├── schemas/      Pydantic 校验
│   │   └── services/     业务逻辑
│   ├── alembic/          数据库迁移
│   └── pyproject.toml
│
├── content/              MDX 源文件（git 仓库内，不进容器）
│   ├── work/             作品集
│   ├── writing/          技术文章
│   ├── products/         产品介绍
│   ├── novels/           小说元数据（V2）
│   └── shared/
│
├── scripts/
│   ├── deploy-frontend.sh   VPS 上构建 + 原子替换 web 目录
│   ├── deploy-admin.sh      VPS 上构建 + 原子替换 admin 目录
│   └── setup-vps.sh         首次部署脚本
│
├── .github/workflows/
│   ├── ci.yml            PR 检查（tsc / ruff / pytest）
│   └── deploy.yml        main 推送时自动部署（path-filter 分发）
│
├── docker-compose.yml    生产 compose（仅 api + db）
├── docker-compose.dev.yml 本地 dev compose（仅 api + db）
├── Makefile              统一任务入口
├── .env.example          唯一的环境变量样板
├── CLAUDE.md             面向 AI 的项目约定
├── V2_PLAN.md            V2 业务功能里程碑
└── TUTORIAL.md           本文
```

**API 路径前缀分层**（这是 V2 演进的关键）：

```
/api/v1/health                   公开健康检查
/api/v1/public/feedback          POST 提交反馈
/api/v1/public/comments          GET 评论列表（V2 M3）
/api/v1/auth/register            POST 注册（V2 M1）
/api/v1/auth/login               POST 登录（V2 M1）
/api/v1/me/profile               GET 个人资料（V2 M1）
/api/v1/me/comments              POST 发表评论（V2 M3）
/api/v1/admin/feedback           GET 管理员看反馈
/api/v1/admin/comments           GET/PATCH 评论审核（V2 M3）
```

V1 只填了 `health / public/feedback / admin/feedback`，但目录骨架四段都已经建好。**新加 endpoint 落到对应 tier 的子目录就行**，不用动 router 编排逻辑。

---

## 四、从零到上线全步骤

下面是一份**从空目录到生产可访问的完整 checklist**。每一步我都会说清楚做什么、为什么这么做、以及容易踩的坑。

### 4.1 前置准备

**账号与服务**：
- GitHub 账号（仓库 + Actions）
- 阿里云 / 腾讯云 ECS（推荐 4 核 8G，单月 ~150 元）—— Postgres + 静态托管 + Python 都跑得舒服
- 域名（Namecheap / 阿里云万网都行，建议 `.studio` / `.dev` / `.app` 这类专业感强的 TLD）
- 备案（中国大陆服务器必须，海外服务器不需要）

**本地工具**：

```bash
# Node.js 22+ via nvm 或 fnm
nvm install 22 && nvm use 22

# pnpm 10+
corepack enable && corepack prepare pnpm@10 --activate

# Python 3.11 + uv
brew install python@3.11
curl -LsSf https://astral.sh/uv/install.sh | sh

# Docker Desktop（本地开发用 db 容器）
brew install --cask docker

# git + ssh key（SSH key 推到 GitHub）
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub  # 粘贴到 GitHub Settings → SSH Keys
```

**编辑器**：VSCode + 这几个扩展：
- `unifiedjs.vscode-mdx`（MDX 语法高亮）
- `bradlc.vscode-tailwindcss`（Tailwind 类名提示）
- `esbenp.prettier-vscode`（格式化）
- `dbaeumer.vscode-eslint`
- `ms-python.python` + `charliermarsh.ruff`

---

### 4.2 本地开发环境一次到位

```bash
git clone https://github.com/<owner>/tianda-web.git
cd tianda-web
make install        # frontend + admin + backend 依赖一次装齐
```

`make install` 等价于：

```bash
cd frontend && pnpm install
cd admin    && pnpm install
cd backend  && uv sync
```

启动开发：

```bash
make dev            # 后台起 db + api（Docker），前台跑 Next.js dev
                    # → http://localhost:3000
```

需要时另开终端：

```bash
make dev-admin      # → http://localhost:3002
make dev-api        # 原生跑 FastAPI（如不用 Docker 版）
```

**端口约定**：
- `3000` Next.js 主站
- `3002` Vite admin
- `8000` FastAPI
- `5432` Postgres

**环境变量**：本地默认值都在代码里兜底，**无需任何 `.env` 文件即可跑**。要覆盖时手建 `frontend/.env.local` / `admin/.env.local` / `backend/.env`，变量名见根 `.env.example` 第 2 段。

**热重载**：
- Next.js dev 自动 HMR，改完文件刷新即可
- Vite admin 同上
- FastAPI `--reload` 自动重启进程
- 改 MDX 后**有时**需要手动重跑 `pnpm velite`（编译期产物），但 Next dev 通常会自动触发

---

### 4.3 三个项目的开发节奏

#### 写一篇新文章（最常见操作）

```bash
# 1. 在 content/writing/ 新建 mdx 文件
touch content/writing/2026-06-my-new-post.mdx

# 2. 编辑，frontmatter 填写：
---
slug: my-new-post
title: { zh: 我的新文章, en: My new post }
excerpt: { zh: 一句摘要, en: One-sentence summary }
published_at: 2026-06-15
tags: [tag-a, tag-b]
featured: false
---

# 3. 重跑 velite（next dev 通常会自动触发）
cd frontend && pnpm velite

# 4. 浏览器看效果 http://localhost:3000/writing/my-new-post

# 5. 满意后提交
git add content/writing/2026-06-my-new-post.mdx
git commit -m "writing: my-new-post"
git push origin main
# → GH Actions 自动触发 frontend 部署
```

#### 加一个 backend endpoint

```bash
# 1. 设计 schema（pydantic）
# backend/app/schemas/feature_x.py

# 2. 设计 model（如果要存表）
# backend/app/models/feature_x.py

# 3. 生成迁移
cd backend
uv run alembic revision --autogenerate -m "add feature_x table"
# 检查生成的迁移文件是否合理！

# 4. 写业务逻辑
# backend/app/services/feature_x_service.py

# 5. 写路由
# backend/app/api/v1/endpoints/public/feature_x.py
# 在 endpoints/public/__init__.py 注册

# 6. 写测试
# backend/tests/test_feature_x.py

# 7. 跑测试
make test

# 8. 本地验证
curl http://localhost:8000/api/v1/public/feature-x
```

#### 在 admin 加一个管理页

```bash
# 1. 在 admin/src/routes/ 加文件路由（TanStack Router 自动生成路由树）
# 例如 _authed.feature-x.tsx

# 2. dev 时自动重新生成 routeTree.gen.ts
make dev-admin

# 3. 编写组件 + TanStack Query hook
```

---

### 4.4 服务器与域名

#### VPS 初始化

SSH 进 VPS（root 或有 sudo 的用户），装宝塔：

```bash
# 阿里云 / 腾讯云 / 华为云
curl -sSO https://download.bt.cn/install/install_lts.sh && bash install_lts.sh

# 装完会输出宝塔面板地址 + 默认账密，记下来
```

宝塔启动后，登录面板，安装这几样：
- **Docker 管理器**（启动 docker daemon）
- **Nginx**（宝塔默认就装了）
- **Git**（命令行版，不是宝塔的"代码部署"插件）
- **Node.js 版本管理器**（管理 pnpm）

或者命令行装：

```bash
# Docker
curl -fsSL https://get.docker.com | bash
sudo usermod -aG docker $USER  # 把当前用户加 docker 组（避免 sudo）

# Node 22 + pnpm（VPS 要构建静态产物）
curl -fsSL https://get.pnpm.io/install.sh | sh -
source ~/.bashrc
pnpm env use --global 22
```

#### 域名解析

在域名服务商管理面板（阿里云万网 / Namecheap）加 3 条 A 记录：

```
tianda.studio          A    <你的 VPS IP>
admin.tianda.studio    A    <你的 VPS IP>
api.tianda.studio      A    <你的 VPS IP>
```

等待 DNS 生效（通常 5-10 分钟）。

#### 项目目录初始化

```bash
sudo mkdir -p /www/wwwroot/tianda-web
sudo chown $USER:$USER /www/wwwroot/tianda-web
cd /www/wwwroot/tianda-web

# clone 仓库
git clone --depth=1 https://github.com/<owner>/tianda-web.git repo

# 软链 docker-compose.yml 和 postgres-init.sql 到 cwd
ln -s repo/docker-compose.yml .
ln -s repo/postgres-init.sql .

# 准备 .env
cp repo/.env.example .env
nano .env  # 填入随机的 DB_PASSWORD / ADMIN_TOKEN / IP_SALT
chmod 600 .env

# 准备静态产物目录
mkdir -p web admin

# Docker 拉镜像 + 启动 api + db
docker compose up -d --build api db
sleep 6
curl http://localhost:8000/api/v1/health
# → {"status":"ok","db":"ok",...}
```

#### 宝塔反代配置

宝塔面板 → 网站 → 添加站点：

**1. tianda.studio**（主站）

- 域名：`tianda.studio` `www.tianda.studio`
- 根目录：`/www/wwwroot/tianda-web/web`
- PHP 版本：纯静态（不开 PHP）
- 申请 Let's Encrypt SSL（一键）

**2. admin.tianda.studio**（管理后台）

- 域名：`admin.tianda.studio`
- 根目录：`/www/wwwroot/tianda-web/admin`
- 申请 SSL
- **关键**：站点设置 → 配置文件，在 `server { ... }` 块里加 SPA fallback：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}

# 防止搜索引擎索引
add_header X-Robots-Tag "noindex, nofollow" always;
```

- 进阶：加 IP 白名单或 Basic Auth 限制访问

**3. api.tianda.studio**（后端反代）

- 域名：`api.tianda.studio`
- 反代到 `http://127.0.0.1:8000`
- 申请 SSL
- 配置文件加 CORS 透传（FastAPI 自己处理 CORS，nginx 不要乱加）：

```nginx
location / {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

### 4.5 GitHub Actions 配置

仓库 Settings → Secrets and variables → Actions → New repository secret，加 3 个：

| Secret | 值 |
|---|---|
| `VPS_HOST` | 你的 VPS IP |
| `VPS_USER` | ssh 用户名（建议非 root） |
| `VPS_SSH_KEY` | ssh 私钥内容（**整个 `~/.ssh/id_ed25519` 文件**） |

VPS 上把对应的公钥加到 `~/.ssh/authorized_keys`，让 GH Actions 能 ssh 进来。

```bash
# 在 VPS 上
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys   # 粘贴本地的 id_ed25519.pub 内容
chmod 600 ~/.ssh/authorized_keys
```

**测试 ssh**：

```bash
# 本地
ssh user@vps_ip "echo OK"
```

如果输出 `OK`，说明 GH Actions 也能进。

---

### 4.6 首次部署

最稳的做法：**先在 VPS 上手动跑一次部署脚本，确认无误，再 push 触发 GH Actions**。

```bash
# VPS 上
cd /www/wwwroot/tianda-web/repo

# frontend
./scripts/deploy-frontend.sh
# → 构建 + 原子替换到 /www/wwwroot/tianda-web/web

# admin
./scripts/deploy-admin.sh

# 确认产物
ls /www/wwwroot/tianda-web/web/
# 应该看到 index.html / _next/ / static/ 等
```

如果脚本报错，常见原因：
1. **pnpm 没装** → `pnpm env use --global 22`
2. **权限问题** → 脚本最后会 `chown -R www:www`，确保当前用户有 sudo 权限
3. **VITE_API_BASE 没传** → 脚本会用默认值 `https://api.tianda.studio`

**浏览器测试**：

```
https://tianda.studio          → 主站首页
https://admin.tianda.studio    → admin 占位页
https://api.tianda.studio/api/v1/health  → {"status":"ok",...}
```

如果三个都能访问，**部署链路打通**。

---

### 4.7 后续迭代与日常发布

```bash
# 写完代码、跑过本地测试
make test

# 提交
git add .
git commit -m "feat: add new article"
git push origin main
```

GH Actions `deploy.yml` 自动触发：
1. `changes` job 用 `dorny/paths-filter` 检测改了哪些目录
2. 改了 `frontend/**` 或 `content/**` → 触发 `deploy-frontend`
3. 改了 `admin/**` → 触发 `deploy-admin`
4. 改了 `backend/**` 或 `docker-compose.yml` → 触发 `deploy-api`
5. 各 job ssh 进 VPS，`git pull` + 执行对应脚本
6. api 部署后自动跑健康检查

**典型部署时长**：
- 改 MDX 文章：~2 分钟（GH Actions 启动 + ssh + git pull + pnpm build + 替换目录）
- 改 admin 代码：~3 分钟
- 改 backend 代码：~4 分钟（多了 docker compose build）

**回滚**：

```bash
# 静态站回滚（保留了 .old 目录）
ssh vps "mv /www/wwwroot/tianda-web/web /www/wwwroot/tianda-web/web.failed && \
         mv /www/wwwroot/tianda-web/web.old /www/wwwroot/tianda-web/web"

# 或者按 git checkout
ssh vps "cd /www/wwwroot/tianda-web/repo && git checkout <prev-sha> && ./scripts/deploy-frontend.sh"

# api 回滚
ssh vps "cd /www/wwwroot/tianda-web/repo && git checkout <prev-sha> && \
         cd /www/wwwroot/tianda-web && docker compose up -d --build --no-deps api"
```

---

## 五、关键设计决策深度解析

### 5.1 为什么选静态导出而不是 SSR

**SSR 的好处是什么**：
- 数据可以服务端拉取（更安全）
- 大型动态内容站点（如电商详情页）可以避免客户端 hydration 闪烁
- 复杂权限场景下可以服务端 redirect

**对个人站来说，这些好处都不存在**：
- 我的内容是 MDX 文件，编译期已经全部知道
- 没有动态用户内容（评论是 CSR fetch 异步加载）
- 没有按用户切换的页面权限

**静态导出的实质收益**：
- **零运行时**：一旦部署，整站不跑任何 Node 进程，CPU 占用 0
- **TTFB 极低**：nginx 直接吐 HTML，没有 Next.js server 启动延迟
- **可移植**：产物可以扔 OSS / GitHub Pages / 任何静态托管，未来想换基础设施零成本
- **安全面缩小**：没有 server endpoint 暴露在主站域名，所有动态请求都打到 api 子域

**接受的限制清单**（再列一次，警示后来者）：

| 失效特性 | 解决方案 |
|---|---|
| `middleware.ts` | 用客户端逻辑或反代层处理 |
| `cookies()` / `headers()` | 移到 client component + fetch |
| `revalidate*` ISR | 全静态 + push 触发重构建 |
| `next/image` 自动优化 | 用 `images: { unoptimized: true }`，自己用 webp / srcset |
| route handlers | 浏览器直接 fetch 后端域 |
| `app/sitemap.ts` 里的 `dynamic` | 必须 `export const dynamic = 'force-static'` |

---

### 5.2 为什么三项目独立而不是一体化

很多教程会教你"用 Next.js 一个项目搞定主站 + 后端 + admin"。这条路对个人站**坏处大于好处**：

**坏处**：
1. **构建产物耦合**：admin 改个按钮要重新构建主站 35 个静态页
2. **bundle 体积膨胀**：admin 用的 antd / shadcn 大量组件会进主站
3. **登录态污染**：主站匿名静态 + admin 需要登录，硬塞在一起每页都要判断
4. **路由命名空间冲突**：主站 `/work` `/writing` + admin `/admin/...` 会让 sitemap 生成困难

**三项目独立的好处**：
1. 各自 lockfile，依赖完全隔离（admin 装新组件不影响主站）
2. 各自部署节奏（改 MDX 不重启 admin）
3. 各自技术栈演进（明天主站换 Astro，admin 不受影响）
4. 各自团队协作（如果以后扩展，前端 / 运营可以专注主站）

代价只是多维护两个 `package.json` 和一个 `pyproject.toml`——单人项目这点重复**完全可接受**。

---

### 5.3 为什么浏览器直连后端而不走 BFF

主流做法是用 Next.js route handler 当 BFF（Backend for Frontend），浏览器只调主站域名，route handler 转发到内部后端。**我反过来了**：删除所有 route handler，浏览器直接打 `api.tianda.studio`。

**走 route handler 的两个真正用途**：
1. 隐藏内部 API 的 baseURL 和路径
2. 安全地管理 httpOnly cookie

**对我都不需要**：
1. 我的 API 域名 `api.tianda.studio` 已经公开，反正都能扫到
2. cookie 我可以让 FastAPI 直接下发，`Domain=.tianda.studio` 跨子域共享

**直连的好处**：
- 少一层网络跳转（浏览器 → CDN → Next → API）变成（浏览器 → API）
- Next.js 主站可以纯静态，不需要 Node 运行时
- 调试更直接：浏览器 DevTools 看到的就是真实请求

**唯一的成本**：CORS 配置 + 跨子域 cookie domain。两件事一次性配好，永久受益。

```python
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tianda.studio", "https://admin.tianda.studio"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,  # 关键：允许跨子域带 cookie
)
```

```python
# backend/app/core/cookies.py
def set_session_cookie(response, key, value, max_age):
    response.set_cookie(
        key=key,
        value=value,
        max_age=max_age,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        domain=settings.COOKIE_DOMAIN or None,  # ".tianda.studio"
        path="/",
    )
```

---

### 5.4 为什么 Cookie 跨子域而不是 token in localStorage

Token 存 localStorage 是新手最常见的方案，**也是最危险的方案**：

| 存储位置 | XSS 攻击者能拿到吗 | CSRF 攻击者能利用吗 |
|---|---|---|
| localStorage | 是（任何 JS 都能 `localStorage.getItem`） | 否 |
| memory（Zustand 不持久化） | 是（同一进程的 JS 都能访问） | 否 |
| **httpOnly cookie** | 否（JS 读不到 httpOnly cookie） | 是（但 SameSite=Lax 已挡住跨站请求） |

XSS 风险远大于 CSRF（前者一旦得手，可以做任何事；后者只能触发特定的预期请求）。所以：

- **refresh token**：必须 httpOnly cookie，永远不进 JS
- **access token**：可以放 memory（zustand 不持久化），刷新页面靠 refresh cookie 重换

跨子域 cookie 实现：

```
Domain=.tianda.studio   → 让 tianda.studio + admin.tianda.studio + api.tianda.studio 共享
HttpOnly                → JS 读不到
Secure                  → 仅 https
SameSite=Lax            → 默认挡住跨站 POST，允许同站 GET
```

本地开发时 `Domain=` 留空（host-only cookie），因为 `localhost` 不支持跨子域。

---

### 5.5 为什么不用 OSS / CDN

OSS + CDN 是国内大厂应用的标配，但**对单人个人站不划算**：

**成本对比**（典型月活 1000-5000 的个人站）：

| 方案 | 月成本估算 |
|---|---|
| 阿里云 ECS（4 核 8G）+ 宝塔静态托管 | 150 元（一台机器 cover 全部） |
| OSS（500MB） + CDN（10GB 流量） | 150 元 + 5 元 + 10 元 = 165 元（且不含 ECS） |
| OSS + CDN + ECS（仍要跑后端）| 200+ 元 |

**钱不是关键，复杂度是**：
- OSS 需要 RAM 子账号、bucket policy、跨域配置、防盗链
- CDN 需要域名 CNAME、SSL 证书托管、缓存策略
- 多一套要监控、要备份、要排查的服务

**单人项目的 KPI 应该是"维护时间最少"，不是"性能最好"**。VPS 出口带宽国内访问足够快，多一层 CDN 在国内反而增加 DNS 解析时间。

什么时候该上 OSS：
- 用户上传图片功能（评论附图、用户头像）
- 仓库总大小超过 1GB（图片太多）
- 月流量超过 100GB（VPS 带宽吃不消）

**这些都是 V2 之后才需要操心的事**。

---

### 5.6 为什么自建评论而不是接 Giscus

**Giscus** 是把评论数据挂在你 repo 的 GitHub Discussions 里，前端嵌入一个 iframe 即可：
- 优点：零后端工作量、免费、Markdown 格式天然
- 缺点：评论者必须有 GitHub 账号；数据格式被 GitHub 锁定；自定义样式有限

**对开发者博客**：Giscus 完美。读者本来就是开发者，有 GitHub 账号；评论以技术讨论为主，不需要花哨样式。

**对个人品牌站**：Giscus 不合适。
- 我希望的读者**不一定有 GitHub 账号**（小说读者、产品潜在用户）
- 评论需要审核（垃圾邮件、营销）
- 未来要做点赞、@提醒、嵌套回复——这些 Giscus 都不支持

既然我已经做了后端（feedback 已上线），评论的"边际工作量"很低：
- 数据库：复用 V1 已经建好的 `comments / comment_likes` 表
- 后端：3-4 个 endpoint
- 前端：一个 `<CommentSection>` 客户端组件挂到 MDX 文章页底部

**总工作量约 4 天**（V2 M3 规划）。换来：
- 数据完全自有，可以做任何分析
- 用户体系也是自己的（V2 M1 已规划）
- 未来加付费阅读、订阅、私信都能直接接

---

## 六、踩坑实录

下面这些坑都是我亲自踩过、解决过的。希望你不用再踩一遍。

### 6.1 静态导出下 sitemap.ts 必须 `force-static`

```ts
// frontend/src/app/sitemap.ts
export const dynamic = 'force-static'  // ← 没这行 build 会报错
```

`opengraph-image.tsx` / `robots.ts` 同理。

### 6.2 Lingui SWC 插件与 Next 15.5+ 不兼容

Lingui 5 的 SWC 插件官方还没修复对 Next 15.5+ 内部组件的兼容问题。解决方案：

```ts
// next.config.ts — 不启用 @lingui/swc-plugin
// 改用 @lingui/react 的 runtime API + babel-plugin-macros 提取
```

代价是构建时部分文件走 babel 而不是 swc，构建慢一点。但**功能完全正常**。

### 6.3 admin 子域必须 SPA fallback

TanStack Router 是客户端路由，刷新非 `/` 路径会 404。nginx 必须配：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

宝塔面板 → 网站设置 → 配置文件，添加上面这段。

### 6.4 跨子域 cookie 在本地不工作

本地开发时 `localhost` / `127.0.0.1` 不能用 `.tianda.studio` 这种 domain。解决方案：

```python
# backend/app/core/config.py
COOKIE_DOMAIN: str = ""  # 本地空，生产 .tianda.studio
```

cookie helper 在 domain 为空时不传 `domain` 参数，让浏览器按 host-only 处理。

### 6.5 docker compose up --build 在国内机器拉 Python base image 慢

解决方案：用阿里云 PyPI 镜像 + Debian 镜像。`docker-compose.yml`：

```yaml
api:
  build:
    args:
      PIP_INDEX_URL: ${PIP_INDEX_URL:-https://pypi.org/simple/}
      APT_MIRROR: ${APT_MIRROR:-}
```

`.env`：

```bash
PIP_INDEX_URL=https://mirrors.aliyun.com/pypi/simple/
APT_MIRROR=http://mirrors.aliyun.com
```

`backend/Dockerfile` 在 `RUN apt-get` 之前根据 `APT_MIRROR` 替换 `/etc/apt/sources.list`。

### 6.6 next/image 在静态导出下失效

`next/image` 的运行时优化（自动 webp / srcset / blur）依赖 Next.js server。静态导出下必须：

```ts
// next.config.ts
images: {
  unoptimized: true,
}
```

代价是图片自动优化失效。补救：用 Pillow 在上传时预生成多尺寸 webp，或者干脆用 `<img>` 直接写。

### 6.7 Velite 输出 `.velite` 目录后 tsc 找不到类型

`tsconfig.json` 里 path alias：

```json
{
  "paths": {
    "@/*": ["./src/*"],
    "#site/content": ["./.velite"]
  }
}
```

`.velite/index.d.ts` 是 Velite 自动生成的类型声明文件。

### 6.8 Alembic autogenerate 漏掉 enum

SQLAlchemy 里 `Enum` 类型，autogenerate 经常漏掉 type 创建。手动检查迁移文件，必要时手写：

```python
# alembic/versions/xxx.py
op.execute("CREATE TYPE feedback_type AS ENUM ('general', 'hire', 'collab')")
```

### 6.9 GH Actions ssh 进 VPS 报 "command not found: pnpm"

GH Actions 通过 ssh 进来的是 non-login shell，不会 source `.bashrc`。pnpm 路径找不到。

解决：在脚本开头显式加 PATH：

```bash
# scripts/deploy-frontend.sh
export PATH="$HOME/.local/share/pnpm:$PATH"
```

或者把 pnpm 装到全局：

```bash
# VPS 上
sudo pnpm setup --global
```

---

## 七、后续扩展规划

V2 共 7 个里程碑，约 18.5 个工作日（4 周）。完整方案在仓库的 [V2_PLAN.md](./V2_PLAN.md)，这里给个轮廓：

| 里程碑 | 内容 | 工时 |
|---|---|---|
| **M1 用户系统** | argon2 密码哈希 + JWT + httpOnly cookie + 邮件 OTP | 3 天 |
| **M2 Admin 业务** | feedback 审核、用户管理面板 | 2 天 |
| **M3 评论系统** | 评论 + 点赞 + 嵌套回复 + 敏感词 + admin 审核 | 4 天 |
| **M4 用户中心** | /me/profile、/me/comments、/me/settings | 1.5 天 |
| **M5 小说连载** | 小说详情 SSG + 章节 CSR + 阅读进度 + admin 编辑器 | 4 天 |
| **M6 阿里云 OSS** | 用户上传图片接 OSS（不是迁移作品图） | 1.5 天 |
| **M7 SEO + 收尾** | JSON-LD + sitemap 完善 + Lighthouse 优化 | 0.5 天 |

V1 的架构骨架已经把这些都准备好了：
- 4 段路由前缀（`/me`、`/admin` 占位 endpoint 已就位）
- comments / users / comment_likes 表 schema 已建
- cookies.py 工具函数已写
- CORS + cookie domain 配置已生效

V2 时基本只填业务逻辑，不动架构。

---

## 附录 A：命令速查表

```bash
# ─── 一次性 ───
make install              # 装所有依赖

# ─── 日常开发 ───
make dev                  # db + api（容器） + Next.js（原生）一条命令
make dev-admin            # 单独起 admin（用得少）
make dev-stack            # 仅 docker stack（看 api 日志）
make dev-api              # 原生 FastAPI（hot reload）
make test                 # tsc + pytest

# ─── 构建 ───
make build-web            # frontend 静态导出 → frontend/out/
make build-admin          # admin → admin/dist/

# ─── 服务管理 ───
make down                 # 停所有容器
make logs                 # 跟踪日志
make clean                # 清产物 + node_modules

# ─── 数据库 ───
cd backend
uv run alembic current
uv run alembic upgrade head
uv run alembic revision --autogenerate -m "describe"
uv run alembic downgrade -1

# ─── VPS 上手动部署 ───
ssh vps
cd /www/wwwroot/tianda-web/repo
git pull
./scripts/deploy-frontend.sh        # 主站
./scripts/deploy-admin.sh           # admin
docker compose up -d --build --no-deps api db   # api

# ─── 看反馈数据 ───
ssh vps "cd /www/wwwroot/tianda-web && \
  docker compose exec db psql -U tianda -d tianda -c \
  'SELECT id, type, name, message, created_at FROM feedbacks ORDER BY id DESC LIMIT 20'"

# ─── 健康检查 ───
curl https://api.tianda.studio/api/v1/health
```

---

## 附录 B：完整文件清单

仓库根目录关键文件作用：

| 文件 | 作用 |
|---|---|
| `Makefile` | 任务编排入口（make dev / make test / etc） |
| `docker-compose.yml` | 生产 compose（api + db） |
| `docker-compose.dev.yml` | 本地 dev compose |
| `postgres-init.sql` | postgres 首次启动 SQL |
| `.env.example` | 唯一的环境变量样板 |
| `.github/workflows/ci.yml` | PR 时跑 tsc + ruff + pytest |
| `.github/workflows/deploy.yml` | main 推送时按 path-filter 触发部署 |
| `scripts/deploy-frontend.sh` | VPS 上构建 + 替换 web 目录 |
| `scripts/deploy-admin.sh` | VPS 上构建 + 替换 admin 目录 |
| `scripts/setup-vps.sh` | 首次 VPS 初始化 |
| `frontend/next.config.ts` | `output: 'export'` 静态导出 |
| `frontend/velite.config.ts` | MDX 内容编译 + shiki 高亮 |
| `frontend/tailwind.config.ts` | 品牌 token + 自定义 prose 主题 |
| `admin/vite.config.ts` | Vite + TanStack Router 插件 |
| `admin/tsr.config.json` | 路由树生成器配置 |
| `backend/app/main.py` | FastAPI app + CORS + slowapi 中间件 |
| `backend/app/core/config.py` | Pydantic Settings 环境变量 |
| `backend/app/core/cookies.py` | 跨子域 cookie 工具 |
| `backend/app/api/v1/router.py` | 4 段前缀路由编排 |
| `backend/alembic/versions/0001_initial.py` | 初始 schema |
| `CLAUDE.md` | AI 协作约定（Claude Code 项目元信息） |
| `V2_PLAN.md` | V2 业务功能里程碑详细方案 |
| `README.md` | 仓库主页快速上手 |
| `COMMANDS.md` | 完整命令清单 |

---

## 结语

如果你完整看到这里——感谢你愿意读完一份 1 万 5 千字的工程实录。

这套架构不是"最现代"的方案，没用到 Bun / Deno / Workers / Edge Runtime / Drizzle / tRPC 这些 2026 年的热词。但它是**给一个人维护的、能持续演进 5 年的**方案。

我做工程 10 年学到的一件事：**架构的好坏不是看技术多新，是看它能不能在你的精力曲线上长期存活**。每多一个组件，就多一份周末加班排查问题的概率。每多一层抽象，就多一次半年后回来看不懂的尴尬。

减法比加法难。这份文档里我做了**很多次减法**：拒绝 Vercel、拒绝 Redis、拒绝三方评论、拒绝 OSS、拒绝 GHCR、拒绝 SSR、拒绝一体化项目。每一次拒绝都对应一段思考，**每一次保留也都对应一个真实需求**。

希望这份文档能帮到你。如果你按类似的思路搭了自己的项目，欢迎把链接发给我——就贴在 [tianda.studio/feedback](https://tianda.studio/feedback) 的留言里，让我知道这条路上有同伴。

—— 添达 · Kevin Wang

> 项目仓库：[github.com/kui-wang-dada/tianda-web](https://github.com/kui-wang-dada/tianda-web)
> 个人站点：[tianda.studio](https://tianda.studio)
> 写作时间：2026 年 5 月
