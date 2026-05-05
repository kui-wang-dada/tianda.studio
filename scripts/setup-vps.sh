#!/bin/bash
# tianda-web · 一次性 VPS 部署脚本
# 用法（在 VPS 上执行）：
#   curl -sL https://raw.githubusercontent.com/<owner>/tianda-web/main/scripts/setup-vps.sh | bash -s -- <owner>
# 或手动 clone 后跑 ./scripts/setup-vps.sh <owner>

set -euo pipefail

OWNER="${1:-kui-wang-dada}"
DEPLOY_DIR="/srv/tianda-web"
REPO_DIR="$DEPLOY_DIR/repo"

echo "→ 准备 $DEPLOY_DIR"
sudo mkdir -p "$DEPLOY_DIR"
sudo chown "$USER:$USER" "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

# 1. clone 仓库到 /srv/tianda-web/repo（GH Actions 后续会 git pull）
if [ ! -d "$REPO_DIR/.git" ]; then
  echo "→ git clone 到 $REPO_DIR"
  git clone --depth=1 "https://github.com/${OWNER}/tianda-web.git" "$REPO_DIR"
fi

# 2. 软链 docker-compose.yml + postgres-init.sql 到 DEPLOY_DIR（compose 默认从 cwd 读）
ln -sf "$REPO_DIR/docker-compose.yml" "$DEPLOY_DIR/docker-compose.yml"
ln -sf "$REPO_DIR/postgres-init.sql" "$DEPLOY_DIR/postgres-init.sql"

# 3. 生成 .env（仅 api + db 运行时变量）
if [ ! -f .env ]; then
  echo "→ 生成 .env (随机 secrets)"
  cat > .env <<EOF
# 自动生成于 $(date)
ENV=prod
TAG=latest
DB_PASSWORD=$(openssl rand -hex 24)
ADMIN_TOKEN=$(openssl rand -hex 32)
IP_SALT=$(openssl rand -hex 32)
CORS_ORIGINS=https://tianda.studio,https://admin.tianda.studio
COOKIE_DOMAIN=.tianda.studio
COOKIE_SECURE=true
API_PORT=8000
DB_PORT=5432
EOF
  chmod 600 .env
  echo "  ✓ .env 已生成（chmod 600）。请记录 ADMIN_TOKEN：调 admin endpoint 用得着。"
fi

# 4. 准备静态产物目录
mkdir -p "$DEPLOY_DIR/web" "$DEPLOY_DIR/admin"

# 5. 安装 pnpm（VPS 上要构建静态产物）
if ! command -v pnpm >/dev/null; then
  echo "→ 安装 pnpm"
  curl -fsSL https://get.pnpm.io/install.sh | sh -
  export PATH="$HOME/.local/share/pnpm:$PATH"
fi

# 6. docker login GHCR（拉 api 镜像用）
echo "→ docker login ghcr.io"
echo "  请输入 GitHub username + Personal Access Token (scope: read:packages):"
docker login ghcr.io

# 7. 首次构建 frontend / admin
echo "→ 首次构建 frontend"
"$REPO_DIR/scripts/deploy-frontend.sh"
echo "→ 首次构建 admin"
"$REPO_DIR/scripts/deploy-admin.sh"

# 8. 拉 api 镜像 + 启动
echo "→ 拉 api 镜像 + 启动"
docker compose pull
docker compose up -d

echo "→ 等待 api 起来..."
sleep 10
docker compose ps

echo ""
echo "→ 健康检查"
if curl -fsS http://localhost:8000/api/v1/health; then
  echo ""
  echo "✅ 部署成功"
  echo ""
  echo "下一步（宝塔面板）："
  echo "  1. 新建网站 tianda.studio → 网站根目录指向 $DEPLOY_DIR/web → 申请 Let's Encrypt SSL"
  echo "  2. 新建网站 admin.tianda.studio → 根目录 $DEPLOY_DIR/admin → SSL → nginx 配置 try_files \$uri \$uri/ /index.html"
  echo "  3. 新建网站 api.tianda.studio → 反代到 http://127.0.0.1:8000 → SSL"
  echo "  4. push 到 main 触发自动部署"
else
  echo "❌ 健康检查失败，看 logs：docker compose logs api"
  exit 1
fi
