# syntax=docker/dockerfile:1.7
# ─────────────── builder ───────────────
FROM python:3.11-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

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

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/usr/local/bin:${PATH}"

RUN apt-get update && apt-get install -y --no-install-recommends curl && \
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
