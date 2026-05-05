# syntax=docker/dockerfile:1.7
# ─────────────── builder ───────────────
FROM python:3.11-slim AS builder

# 默认 pypi.org，VPS 上可通过 .env 设 PIP_INDEX_URL=https://mirrors.aliyun.com/pypi/simple/
# 走阿里云内网镜像，比公网 PyPI 快 10x。
ARG PIP_INDEX_URL=https://pypi.org/simple/
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_INDEX_URL=$PIP_INDEX_URL

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY backend/pyproject.toml backend/uv.lock* ./

RUN uv pip install --system --no-cache \
    "fastapi>=0.115.0" "uvicorn[standard]>=0.32.0" \
    "pydantic>=2.10.0" "pydantic-settings>=2.7.0" \
    "sqlalchemy[asyncio]>=2.0.36" "asyncpg>=0.30.0" "alembic>=1.14.0" \
    "slowapi>=0.1.9" "structlog>=24.4.0" "python-multipart>=0.0.20" "email-validator>=2.2.0"

# ─────────────── runtime ───────────────
FROM python:3.11-slim AS runtime

# 默认走原 deb.debian.org，VPS 通过 build arg 切到阿里云镜像（mirrors.aliyun.com/debian）
# 国内 ECS 拉包速度从 5KB/s → 50MB/s。
ARG APT_MIRROR=
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/usr/local/bin:${PATH}"

RUN if [ -n "$APT_MIRROR" ]; then \
        sed -i "s|http://deb.debian.org|$APT_MIRROR|g; s|http://security.debian.org|$APT_MIRROR|g" \
            /etc/apt/sources.list.d/debian.sources 2>/dev/null || \
        sed -i "s|http://deb.debian.org|$APT_MIRROR|g; s|http://security.debian.org|$APT_MIRROR|g" \
            /etc/apt/sources.list 2>/dev/null || true; \
    fi && \
    apt-get update && apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/* && \
    groupadd --system --gid 1001 app && \
    useradd  --system --uid 1001 --gid app app

WORKDIR /app

COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

COPY backend/app ./app
COPY backend/alembic ./alembic
COPY backend/alembic.ini ./alembic.ini
COPY backend/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh && chown -R app:app /app

USER app
EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
