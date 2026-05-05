#!/usr/bin/env bash
# 在 VPS 上构建主站并把产物原子替换到 /srv/tianda-web/web/。
# GH Actions ssh 到 VPS 后执行此脚本（先 git pull，再跑这个）。
# 宝塔反代 tianda.studio 的网站根目录指向 /srv/tianda-web/web 即可。

set -euo pipefail

REPO_DIR="${REPO_DIR:-/srv/tianda-web/repo}"
WEB_DIR="${WEB_DIR:-/srv/tianda-web/web}"
TMP_DIR="$(mktemp -d -p "$(dirname "$WEB_DIR")" .web.XXXXXX)"

cd "$REPO_DIR/frontend"

# Build-time env baked into the static bundle.
export NEXT_PUBLIC_API_BASE="${NEXT_PUBLIC_API_BASE:-https://api.tianda.studio}"
export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://tianda.studio}"

pnpm install --frozen-lockfile
pnpm build

# Copy out/ → tmp → atomic rename so visitors never see a half-deployed site.
cp -R out/. "$TMP_DIR/"

if [ -d "$WEB_DIR" ]; then
    OLD_DIR="${WEB_DIR}.old"
    rm -rf "$OLD_DIR"
    mv "$WEB_DIR" "$OLD_DIR"   # 保留 .old 一份，便于一键回滚
fi
mv "$TMP_DIR" "$WEB_DIR"

echo "✓ frontend deployed → $WEB_DIR (previous version kept at ${WEB_DIR}.old)"
