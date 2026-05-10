#!/usr/bin/env bash
# 在 VPS 上构建 admin SPA 并把 dist/ 原子替换到 /www/wwwroot/tianda-web/admin/。
# 宝塔反代 admin.tianda.studio 网站根目录指向 /www/wwwroot/tianda-web/admin。
# 注意：admin 是 SPA，宝塔 nginx 配置需要 try_files $uri $uri/ /index.html。

set -euo pipefail

REPO_DIR="${REPO_DIR:-/www/wwwroot/tianda-web/repo}"
ADMIN_DIR="${ADMIN_DIR:-/www/wwwroot/tianda-web/admin}"
TMP_DIR="$(mktemp -d -p "$(dirname "$ADMIN_DIR")" .admin.XXXXXX)"

cd "$REPO_DIR/admin"

export VITE_API_BASE="${VITE_API_BASE:-https://api.tianda.studio}"

pnpm install --frozen-lockfile
pnpm build

cp -R dist/. "$TMP_DIR/"

if [ -d "$ADMIN_DIR" ]; then
    OLD_DIR="${ADMIN_DIR}.old"
    # 宝塔在站点根放 .user.ini 并 chattr +i，rm 之前先解锁
    if [ -d "$OLD_DIR" ]; then
        find "$OLD_DIR" -name ".user.ini" -exec chattr -i {} \; 2>/dev/null || true
        rm -rf "$OLD_DIR"
    fi
    mv "$ADMIN_DIR" "$OLD_DIR"   # 保留 .old 一份，便于一键回滚
fi
mv "$TMP_DIR" "$ADMIN_DIR"

# 让宝塔 nginx (www 用户) 能读
if id www >/dev/null 2>&1; then
    chown -R www:www "$ADMIN_DIR"
fi

echo "✓ admin deployed → $ADMIN_DIR (previous version kept at ${ADMIN_DIR}.old)"
