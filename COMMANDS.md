# tianda-web 常用命令

> 所有命令默认在仓库根目录 `/Users/wkui/Project/profile/code/tianda-web` 下执行。
> Make 是封装层（推荐用），下方对应"原始命令"是 Make 实际跑的内容。

---

## 一次性安装

```bash
make install
```
等价于：
```bash
cd frontend && pnpm install
cd admin    && pnpm install
cd backend  && uv sync
```

---

## 本地开发

### 日常（最常用）

```bash
make dev          # 后台起 db + api，前台跑 Next.js (:3000)
                  # Ctrl-C 只停 web；db / api 用 'make down' 停
```

需要时另开终端起 admin（日常用得少）：
```bash
make dev-admin    # → :3002
```

### 拆分启动（按需）

```bash
make dev-stack    # 只起 docker stack (api + db)，前台带日志
make dev-db       # 只起 postgres
make dev-api      # FastAPI native (hot reload)
make dev-web      # Next.js native
make dev-admin    # Vite admin native
```

**主站本地是 `next dev`（动态预览，方便迭代）**。要测试静态导出产物：
```bash
cd frontend && pnpm build && python3 -m http.server -d out 3000
```

服务端口（本地）：
- `http://localhost:3000` → frontend
- `http://localhost:3002` → admin
- `http://localhost:8000/api/v1/health` → backend
- `localhost:5432` → postgres（user=`tianda` pwd=`tianda` db=`tianda`）

环境变量：
- 默认值在代码里都有，本地无需任何 .env 即可跑通
- 想覆盖时在 `frontend/.env.local` / `admin/.env.local` 手动创建（变量名见根 [.env.example](./.env.example) 第 2 段）
- 唯一一份样板是根 [.env.example](./.env.example)（`scp` 即可上线）

---

## Frontend 单独操作

```bash
cd frontend

pnpm dev                  # next dev (动态预览，带 HMR)
pnpm build                # 静态导出 → out/ (含 lingui:compile + velite)
pnpm lint                 # eslint
pnpm tsc                  # 类型检查
pnpm velite               # 仅重跑内容编译（添新 MDX 后）
pnpm lingui:compile       # 仅重编 i18n 词条
pnpm lingui:extract       # 从源码提取新词条到 .po
```

---

## Admin 单独操作

```bash
cd admin

pnpm dev                  # vite dev (HMR)
pnpm build                # 生成 dist/（先跑 router:gen + tsc）
pnpm preview              # 预览 build 产物
pnpm tsc                  # 路由生成 + 类型检查
pnpm router:gen           # 仅重新生成 src/routeTree.gen.ts
```

---

## Backend 单独操作

```bash
cd backend

uv sync                                      # 安装/同步依赖
uv run uvicorn app.main:app --reload         # 开发服务器
uv run pytest -v                             # 跑测试
uv run pytest tests/test_health.py -v        # 跑单个测试文件
uv run ruff check                            # lint
uv run ruff format                           # 自动格式化
```

### 数据库 schema 修改（手写 SQL）

Schema 真源是 `postgres-init.sql`（仓库根），仅在首次启动 postgres 容器时执行。
后续要改表 / 加列 / 加索引：

```bash
# 1. 在线改：进 dev 容器跑 SQL
docker compose -f docker-compose.dev.yml exec db psql -U tianda -d tianda
# 比如 ALTER TABLE feedbacks ADD COLUMN tag VARCHAR(32);

# 2. 同时在 postgres-init.sql 里加上同样的 DDL，下一次新建的环境才会一致

# 3. 改 SQLAlchemy 模型 backend/app/models/*.py 让 ORM 查询能拿到新字段

# 重置 dev 数据库（清空数据，重跑 init.sql）
docker compose -f docker-compose.dev.yml down -v
make dev
```

生产环境改 schema：scp 一段 SQL 上 VPS，`docker compose exec db psql -U tianda -d tianda -f /path/to.sql`。

---

## 内容管理（MDX）

新增一篇文章 / 一个项目 / 一个产品：

```bash
# 在对应目录新建 .mdx
touch content/writing/2026-06-my-new-post.mdx

# 编辑后，重跑 velite 让它生成类型 + 数据
cd frontend && pnpm velite

# next dev 会热更新；docker dev 需要 make down && make dev
```

frontmatter 必填字段（参考 `frontend/velite.config.ts`）：

| 字段 | 示例 |
|---|---|
| `slug` | `my-post`（唯一） |
| `title` | `{ zh: '中文标题', en: 'EN title' }` |
| `excerpt` | `{ zh: '摘要', en: 'excerpt' }` |
| `published_at` | `2026-05-04` |
| `tags` | `[ai, rag]` |
| `featured` | `true` 才会上首页精选 |

work 还需 `type` (`web3 | ai | mobile | mini-program | web | erp`) + `tech_stack` 数组。
products 还需 `external_url` + `status_label` (`live | beta | wip`)。

---

## 测试与 lint

```bash
make test          # frontend tsc + admin tsc + backend pytest
make lint          # frontend eslint + backend ruff
```

---

## 数据库直查（看反馈数据）

```bash
# 进 postgres
docker compose -f docker-compose.dev.yml exec db psql -U tianda -d tianda

# 看反馈
\d feedbacks                               # 表结构
SELECT id, type, name, email, message, created_at FROM feedbacks ORDER BY id DESC LIMIT 20;
```

---

## 生产部署

所有部署都通过 `git push origin main` 触发 GH Actions，按改动范围只跑对应 job：

| 改动路径 | 触发的 job | 流程 |
|---|---|---|
| `frontend/**` · `content/**` · `scripts/deploy-frontend.sh` | `deploy-frontend` | ssh 到 VPS → git pull → `pnpm build` → 原子替换 `/www/wwwroot/tianda-web/web` |
| `admin/**` · `scripts/deploy-admin.sh` | `deploy-admin` | ssh 到 VPS → git pull → `pnpm build` → 原子替换 `/www/wwwroot/tianda-web/admin` |
| `backend/**` · `docker-compose.yml` | `deploy-api` | ssh 到 VPS → git pull → `docker compose up -d --build --no-deps api db` + 健康检查 |
| `.github/workflows/deploy.yml` | 三个全跑（保险） | — |

强制重发某项：GitHub UI → Actions → Deploy → Run workflow，勾选对应 `force-*`。

### VPS 目录约定

- `/www/wwwroot/tianda-web/repo` — git 仓库（GH Actions ssh 进来 git pull 这里；compose 也在这里跑）
- `/www/wwwroot/tianda-web/web` — frontend 静态产物，宝塔托管 `tianda.studio` 指向此
- `/www/wwwroot/tianda-web/admin` — admin 静态产物，宝塔托管 `admin.tianda.studio` 指向此
- `/www/wwwroot/tianda-web/.env` — docker-compose 用的环境变量（由 `setup-vps.sh` 生成，chmod 600）

### 在 VPS 上手动部署

```bash
ssh vps "cd /www/wwwroot/tianda-web/repo && git pull && ./scripts/deploy-frontend.sh"
ssh vps "cd /www/wwwroot/tianda-web/repo && git pull && ./scripts/deploy-admin.sh"
```

### 宝塔反代配置

- `tianda.studio` → 网站根目录 `/www/wwwroot/tianda-web/web`，开启 SSL
- `admin.tianda.studio` → 网站根目录 `/www/wwwroot/tianda-web/admin`，开启 SSL，建议加 IP 白名单或 Basic Auth；
  必须配置 SPA fallback（nginx）：`try_files $uri $uri/ /index.html;`
- `api.tianda.studio` → 反代到 `http://127.0.0.1:8000`，开启 SSL

### Repo Secrets（仅一组）

| Secret | 用途 |
|---|---|
| `VPS_HOST` / `VPS_USER` / `VPS_SSH_KEY` | ssh 触发部署（前端构建 + admin 构建 + api 重启都用） |

域名、API URL 等非敏感值已写死在 [.github/workflows/deploy.yml](./.github/workflows/deploy.yml)。
VPS 上的 `.env` 见根 [.env.example](./.env.example)，scp 上传即可。

### 回滚

```bash
# API 回上个 sha（VPS 本地构建，回滚 = checkout 旧 sha 重 build）
ssh vps "cd /www/wwwroot/tianda-web/repo && git checkout <上个 sha> && set -a && . /www/wwwroot/tianda-web/.env && set +a && docker compose up -d --build --no-deps api"

# Frontend / admin 回上个版本（部署脚本会保留 .old 副本到下次部署前）
ssh vps "mv /www/wwwroot/tianda-web/web /www/wwwroot/tianda-web/web.failed && mv /www/wwwroot/tianda-web/web.old /www/wwwroot/tianda-web/web"

# 或者：git checkout <上个 sha> && ./scripts/deploy-{frontend,admin}.sh
```

---

## 清理

```bash
make clean         # 删 frontend out/.next/.velite + admin dist + node_modules + backend .venv
make down          # 停所有 docker
docker compose -f docker-compose.dev.yml down -v   # 同时删 postgres 数据卷（重置 db）
```

---

## 故障排查

### 端口被占
```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN     # 看谁占了 3000
lsof -nP -iTCP:3002 -sTCP:LISTEN     # admin 端口
```

### CORS / cookie 不工作
检查 backend `CORS_ORIGINS` 是否包含浏览器实际访问的 origin（含端口），以及 `COOKIE_DOMAIN` 在本地是否为空（跨子域 cookie 仅在生产 `.tianda.studio` 下生效）。

### postgres-init.sql 改了但表没更新
postgres-init.sql 只在 **pg_data 卷为空时**首次运行。改 schema 后要么手动连 psql 跑 ALTER，要么重置数据卷：
```bash
docker compose -f docker-compose.dev.yml down -v
make dev
```

### Velite 改了 schema 但 frontend tsc 报错
```bash
cd frontend && pnpm velite && pnpm tsc
```

### Admin 路由报 `Argument of type '"/"' is not assignable`
```bash
cd admin && pnpm router:gen     # 重新生成 src/routeTree.gen.ts
```

### curl 不通（macOS 走了系统代理）
```bash
curl --noproxy '*' http://localhost:8000/api/v1/health
```
