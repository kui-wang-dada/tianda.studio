# Homepage Restructure (V1.5) — Design

> **Status**: 已与 Kevin（添达）对齐 2026-05-05
> **Scope**: 仅前端 `frontend/`，不涉及 backend / admin。是 V2 业务功能开始前对首页 + 导航做的"信息架构 + 身份"重排，不引入新数据源。
> **Out of scope**: 评论 / 用户中心 / OSS / 后台 / 认证等 V2 业务功能。

---

## 1. 动机

- Hero 上"王奎 Kevin / Wang"暴露真实姓名，与「天大工作室」品牌（Kevin / 添达）不一致
- Hero 的 `~/` mono chip + 闪烁光标是装饰性 terminal 隐喻，不传递任何信息
- 首页 `精选作品` 与 `Upwork · 接单` 两个板块都在展示同一批案例，重复
- 当前没有"产品"概念 —— 项目（接单交付的实力证明）和产品（自己独立开发的工具）混在一起，未来产品线无处生长
- `/writing` 同时承载技术文章和小说，但二者权重 / SEO 策略 / 读者画像完全不同（V2_PLAN 已经为小说留了 `/novels/[slug]` 伏笔）

## 2. 设计原则

- **身份替换而非堆叠**：hero 中文用「添达 Kevin」，英文用「Tianda Kevin」，不再出现真名
- **去重而非互补**：项目板块讲全部精选作品；Upwork 板块只讲"在 Upwork 上的接单实力"，不再展示 case 详情
- **项目（已有实力） vs 产品（未来重点）双轨**：用副标题文案 + 产品 section 顶部 callout 双重区分
- **静态导出兼容**：所有改动落在静态 HTML 内，不需要 SSR / route handler

## 3. 改动范围

### 3.1 Hero（`frontend/src/components/sections/HeroSection.tsx`）

| 项 | 现状 | 改为 |
|---|---|---|
| 中文标题 | `王奎 Kevin` | `添达 Kevin` |
| 英文标题 | `Kevin Wang` | `Tianda Kevin` |
| `~/` mono chip + 闪烁光标 | 存在 | 删除（保留同一行的"全栈工程师 / AI 应用 / Web3 NFT"文字） |
| 简历缩略图 caption | `中文简历 · Kevin Wang / 王奎` | `中文简历 · 添达 Kevin` |

英文 `RESUME_IMAGES[1].caption` 保留 `English Resume · Kevin Wang`（英文简历内文里就是 Kevin Wang，不强行改）。

> **副标题段落正文不动** —— "十年磨一剑——独立打造 生产级 AI 应用、NFT 平台、与全栈 Web 产品" 保留。

### 3.2 项目 section（`ProjectsSection.tsx`）

| 项 | 现状 | 改为 |
|---|---|---|
| Tag tabs | 8 个筛选 tab | 删除整个 tab 行 |
| 卡片来源 | `getFeaturedWork(6)` 取前 6 | `getFeaturedWork(5)` 取前 5（依据 `featured: true`） |
| "查看全部"卡文案 | `查看全部 ${items.length} 项 →` | `查看全部 20+ 项目 →` / `See all 20+ projects →`（**硬编码 20+**，不再用 items.length） |
| SectionHead eyebrow | `01 · Projects` | `01 · Projects 项目集` |
| SectionHead sub | `真实交付的项目 · 点击卡片查看截图与详情` | `十年生产级交付 · 给客户看的实力证明` |
| `right` 计数 | `{filtered.length} / {items.length} 个项目` | 删除（无筛选时无意义） |

featured 数据准备：在 5 个目标项目的 mdx frontmatter 里确认/补 `featured: true`。`lib/content.ts` 的 `getFeaturedWork` 已支持，无需改函数签名。

### 3.3 Upwork section（`UpworkSection.tsx`）+ 数据 `lib/data/upwork.ts`

**新结构**（自上而下）：

1. **Hero strip（替代当前 4 列 badge grid）**：
   - 4 个突出 badge：`Top Rated Plus` · `100% Job Success` · `$60K+ Total Earnings` · `2,233 hrs / 43 jobs`
   - 字号比当前大一档（数值用 `font-serif` 加粗放大），背景区分度提高
2. **叙事段落（左列，新增）**：≤150 字的 Upwork 经历叙述
   - 在 Upwork 多久、累计交付数、客户地区分布
   - 协作方式（一人对接、按周交付、报价透明）
   - 擅长的客户类型 / 不接什么（划清边界）
3. **Mini case strip（左列，替代原 2 张大 case 卡）**：
   - 5 张小缩略图横排（aspect 1:1 或 4:3），每张下方一行 caption（项目名 + 一句结果）
   - 点击触发 lightbox 看截图（复用 `useLightboxStore`）
4. **服务清单（左列，保留）**：4 项不变
5. **右列信息卡（保留并扩充）**：
   - 新增行：客户地区分布（US / EU / JP）、典型周交付节奏、时区与可用时段
   - 推荐语 + 时薪 + CTA（保留）

**数据更新（`lib/data/upwork.ts`）**：
- `upworkBadges` 改为 4 项新优先级，带 `highlight` 标记最重要的（Top Rated Plus）
- 新增 `upworkNarrative: { zh: string; en: string }`
- 新增 `upworkMiniCases: Array<{ slug, thumb, title, outcome }>` —— 5 项
- 删除 `upworkCases`（不再使用）—— 注意：仅当 `UpworkSection.tsx` 是唯一引用方时才删除
- `upworkInfoCard.rows` 增加 3 行（地区 / 节奏 / 时区）

### 3.4 新增产品 section（`ProductsSection.tsx`）

- 新组件 `frontend/src/components/sections/ProductsSection.tsx`
- 数据来源：`content/products/*.mdx`，通过 `lib/content.ts` 新增 `getFeaturedProducts(n)` / `getProducts()`
- 当前 content 只有 1 个产品（`claude-loop.mdx`）—— section 设计需在 0 / 1 / N 三种数量下都能看
- **顶部 callout 横条**（区分项目 vs 产品的关键）：

  > "上面是接单交付的**项目**；这里是我自己在做的**产品**。"

  右侧附小标签 `Solo · WIP / Indie`
- 卡片网格：与项目 section 同结构（aspect 16:10 cover + title + excerpt + tech stack），但 cover 上加角标 `WIP` / `Live` / `Beta` 区分状态
- SectionHead：eyebrow `03 · Products 产品线` / title `独立开发中` / sub `我自己想做的工具与产品 · 未来重点`
- 数量为 0 时整个 section 不渲染（避免空 section）

### 3.5 写作分流：`/writing` + `/novels`

**内容侧**：
- `content/writing/*.mdx` 仍是技术文章
- 新建 `content/novels/*.mdx`（暂可空）
- Velite collection 配置（`velite.config.ts`）新增 `novels` collection，schema 与 writing 类似，但允许 `chapters`（CSR 加载，构建期不入静态）
- `lib/content.ts` 新增 `getNovels()` / `getRecentNovels(n)`

**路由侧**：
- 保留 `/writing`（技术列表 + 详情）
- 新增 `/novels`（小说列表）+ `/novels/[slug]`（小说详情，章节走 CSR fetch FastAPI；详情页本身静态化）—— V2_PLAN 第 9 行已有此规划

**Navbar（`components/layout/` 中的 nav）**：
- 形态 **C2**：3 项「项目 / 产品 / 文章 ▾」
- 「文章 ▾」展开二级菜单：`技术文章` → `/writing`，`小说` → `/novels`
- 移动端折叠时按平铺 4 项展示（避免 hover 二级菜单失效）

### 3.6 首页 `WritingSection` 改为左右两栏

- 左栏：技术文章（最多 4 篇），标题 `技术文章` / `Tech Articles`
- 右栏：小说（最多 4 篇），标题 `小说连载` / `Fiction`
- **任一栏数据为空时**：仅渲染另一栏，且占满整行宽（不要留空白栏）
- 两栏底部各自有 `查看全部 →` 链接到 `/writing` / `/novels`

### 3.7 首页 section 顺序（`app/page.tsx`）

```
Hero
  → ProjectsSection           (01 · 项目集)
  → UpworkSection             (02 · Upwork)
  → ProductsSection (新)      (03 · 产品线)
  → ExperienceSection         (04 · 经历)
  → SkillsSection             (05 · 技术栈)
  → WritingSection            (06 · 文章 — 左右两栏)
  → FeedbackSection           (07 · 反馈)
```

注意：现有 `SectionHead num` 字段可能写死了 `01 / 02 / ...`，要随顺序调整。

## 4. 文件改动清单

**修改**：
- `frontend/src/components/sections/HeroSection.tsx` — 删 `~/` chip / 改名
- `frontend/src/components/sections/ProjectsSection.tsx` — 删 tabs / 改文案
- `frontend/src/components/sections/UpworkSection.tsx` — 重构布局
- `frontend/src/components/sections/WritingSection.tsx` — 改两栏
- `frontend/src/lib/data/upwork.ts` — badge / 叙事 / mini cases / info card 更新
- `frontend/src/lib/content.ts` — 增加 `getProducts` / `getNovels` 等
- `frontend/src/app/page.tsx` — section 顺序
- `frontend/velite.config.ts` — novels collection
- 现有 navbar 组件（位置待 grep 定位） — 二级菜单
- `content/work/*.mdx` 中 5 个目标项目 — 补 `featured: true`

**新增**：
- `frontend/src/components/sections/ProductsSection.tsx`
- `frontend/src/app/novels/page.tsx`
- `frontend/src/app/novels/[slug]/page.tsx`
- `content/novels/`（空目录，可放 `.gitkeep`）

**不动**：
- backend / admin 全部
- `ExperienceSection` / `SkillsSection` / `FeedbackSection`
- 路由 `/work` / `/products` / `/writing` 现有页面（仅 `/writing` navbar 入口形态变了）

## 5. 验收标准

1. Hero 上不再出现「王奎」（除英文简历图内文这一不可控来源）
2. Hero 上不再有 `~/` chip 或闪烁光标
3. 首页项目板块：5 张卡片 + 1 张"查看全部 20+ 项目"卡，无 tab 行
4. Upwork 板块：4 个突出 badge / 一段叙事 / 5 张 mini case / 服务清单 / 信息卡（含地区 / 节奏 / 时区）
5. 首页存在产品 section，0 个产品时不渲染、≥1 个时展示卡片网格
6. Navbar 桌面端有「文章 ▾」二级菜单，能进入 `/writing` 和 `/novels`
7. 首页 WritingSection：技术 / 小说两栏并排；任一为空时仅渲染另一栏并占满
8. `pnpm build` 静态导出无报错；`out/index.html` 可静态访问
9. `frontend/src/app/page.tsx` 的 section 顺序：Hero → 项目 → Upwork → 产品 → Experience → Skills → 文章 → Feedback

## 6. 风险与边界

- **Upwork 数据真实性**：`$60K+ / 43 jobs / 2,233 hrs` 取自截图（2026-05-05），如 Upwork 主页变化，需在 `lib/data/upwork.ts` 同步
- **Mini case 与项目重合**：mini case 5 个建议从已经在 `featured` 中的项目里挑，避免再准备一套数据
- **Navbar 二级菜单的静态导出兼容**：纯 CSS hover 方案即可，不要引入需要客户端 hydration 才能展开的库
- **i18n**：新增文案（叙事段落、callout、二级菜单标签、各 section 新副标题）需要 zh / en 两份；用 `pickLocaleField` / `useLocale` 现有模式
- **现有 `getFeaturedWork(6)` 改为 5** 如果其他地方（archive 页）也用了，要确认 `/work` 页不受影响（建议它直接用 `getWork()` 全量）
- **空状态的视觉处理**：产品 0 个时不渲染整个 section；写作小说 0 个时只渲染单栏 —— 这两种逻辑都需要写测试或至少手动 QA

## 7. 不做的事

- 不动 SSR 模式（保持 `output: 'export'`）
- 不引入新依赖（不新增 UI 库、CMS、analytics）
- 不重构 Hero 右侧 stats 卡（"从业年限 / 交付项目 / Web3 NFT 上线 / Upwork 时薪"保留）
- 不改 i18n 引擎（继续 Lingui + `pickLocaleField`）
- 不改色板 / token（继续用 `bg-paper` / `text-ink` / `text-brand`）
- V2 业务功能（评论 / 用户 / 后台 / OSS / 邮件）—— 等本次架构对齐后另起 plan
