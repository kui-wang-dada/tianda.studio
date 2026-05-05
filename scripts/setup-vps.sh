#!/bin/bash
# tianda-web · 一次性 VPS 环境初始化脚本（不部署，只打底）
# 用法（在 VPS 上执行）：
#   curl -sL https://raw.githubusercontent.com/<owner>/<repo>/main/scripts/setup-vps.sh | bash -s -- <owner> [<repo>]
# 或手动 clone 后跑 ./scripts/setup-vps.sh <owner> [<repo>]
# 默认 owner=kui-wang-dada, repo=tianda.studio
#
# 跑完后 VPS 已具备：仓库 / .env / docker-compose 软链 / pnpm。
# 真正的首次部署由 GitHub Actions 触发（push to main 或 Run workflow）。

set -euo pipefail

OWNER="${1:-kui-wang-dada}"
REPO="${2:-tianda.studio}"
DEPLOY_DIR="/srv/tianda-web"
REPO_DIR="$DEPLOY_DIR/repo"

echo "→ 准备 $DEPLOY_DIR"
sudo mkdir -p "$DEPLOY_DIR"
sudo chown "$USER:$USER" "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

# 1. clone 仓库到 /srv/tianda-web/repo（GH Actions 后续会 git pull）
# 前置条件：你已经在 GitHub 仓库的 Settings → Deploy keys 加过本机公钥，
# 并配好 ~/.ssh/config 让 git@github.com 走对应私钥。详见 README 部署章节。
if [ ! -d "$REPO_DIR/.git" ]; then
  echo "→ git clone 到 $REPO_DIR"
  git clone --depth=1 "git@github.com:${OWNER}/${REPO}.git" "$REPO_DIR"
fi

# 2. 清理历史遗留软链（旧版本曾把 compose 软链到 DEPLOY_DIR，新版本直接 cd 进 repo 跑）
rm -f "$DEPLOY_DIR/docker-compose.yml" "$DEPLOY_DIR/postgres-init.sql"

# 3. 生成 .env（仅 api + db 运行时变量）
if [ ! -f .env ]; then
  echo "→ 生成 .env (随机 secrets)"
  cat > .env <<EOF
# 自动生成于 $(date)
ENV=prod
DB_PASSWORD=$(openssl rand -hex 24)
ADMIN_TOKEN=$(openssl rand -hex 32)
IP_SALT=$(openssl rand -hex 32)
CORS_ORIGINS=https://tianda.studio,https://admin.tianda.studio
COOKIE_DOMAIN=.tianda.studio
COOKIE_SECURE=true
API_PORT=8000
DB_PORT=5432

# 阿里云 PyPI 镜像（国内 ECS 用），docker build 时通过 compose build.args 注入
PIP_INDEX_URL=https://mirrors.aliyun.com/pypi/simple/
EOF
  chmod 600 .env
  echo "  ✓ .env 已生成（chmod 600）。请记录 ADMIN_TOKEN：调 admin endpoint 用得着。"
fi

# 4. 准备静态产物目录（GH Actions 首次部署会原子替换它们）
mkdir -p "$DEPLOY_DIR/web" "$DEPLOY_DIR/admin"

# 5. 安装 pnpm（VPS 上构建 frontend / admin 用）
if ! command -v pnpm >/dev/null; then
  echo "→ 安装 pnpm"
  curl -fsSL https://get.pnpm.io/install.sh | sh -
  export PATH="$HOME/.local/share/pnpm:$PATH"
  # 确保 GH Actions 之后 ssh 进来也能找到 pnpm
  if ! grep -q "pnpm" ~/.bashrc 2>/dev/null; then
    echo 'export PATH="$HOME/.local/share/pnpm:$PATH"' >> ~/.bashrc
  fi
fi

# 6. 检查 docker / docker compose
if ! command -v docker >/dev/null; then
  echo "❌ 未安装 docker。请先装：curl -fsSL https://get.docker.com | bash"
  exit 1
fi
if ! docker compose version >/dev/null 2>&1; then
  echo "❌ 未装 docker compose plugin。请用宝塔面板的 Docker 模块安装，或参考 https://docs.docker.com/compose/install/"
  exit 1
fi

cat <<EOF

✅ VPS 环境初始化完成

目录结构：
  $DEPLOY_DIR/
  ├── repo/                 git 仓库（compose 文件 + 源码都在这里跑）
  ├── web/ admin/           静态产物（待 GH Actions 首次部署填充）
  └── .env                  随机 secrets（chmod 600，由 docker compose --env-file 读）

下一步：
  1. 配 GitHub Secrets：VPS_HOST / VPS_USER / VPS_SSH_KEY
  2. push 到 main，或在仓库 Actions → Deploy → Run workflow 勾选 force-* 触发首次部署
  3. 部署完成后在宝塔面板配 3 个网站：
     - tianda.studio        → 根目录 $DEPLOY_DIR/web    + SSL
     - admin.tianda.studio  → 根目录 $DEPLOY_DIR/admin  + SSL + nginx try_files \$uri \$uri/ /index.html
     - api.tianda.studio    → 反代 http://127.0.0.1:8000 + SSL
EOF
