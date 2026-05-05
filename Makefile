.PHONY: help install dev dev-stack dev-web dev-admin dev-api dev-db build build-web build-admin test lint clean down logs

help:
	@echo "tianda-web · Tianda Studio"
	@echo ""
	@echo "  make install         Install all deps (frontend + admin + backend)"
	@echo "  make dev             Run db + api (docker) + Next.js (native, :3000)."
	@echo "                       admin 单独起，因为日常用得少"
	@echo "  make dev-stack       Only docker stack (api + db), no web"
	@echo "  make dev-web         Run Next.js dev server only (port 3000)"
	@echo "  make dev-admin       Run Vite admin dev server (port 3002)"
	@echo "  make dev-api         Run FastAPI natively (port 8000)"
	@echo "  make dev-db          Run only postgres in docker"
	@echo "  make build           Build api docker image"
	@echo "  make build-web       Build static frontend → frontend/out/"
	@echo "  make build-admin     Build admin SPA → admin/dist/"
	@echo "  make test            Run typecheck (frontend + admin) + pytest"
	@echo "  make lint            Lint frontend (eslint) + backend (ruff)"
	@echo "  make down            Stop all docker services"
	@echo "  make logs            Tail docker logs"
	@echo "  make clean           Remove build artifacts"
	@echo ""
	@echo "See COMMANDS.md for the full reference."

install:
	cd frontend && pnpm install
	cd admin && pnpm install
	cd backend && uv sync

dev:
	@echo "→ docker stack (api + db) in background"
	docker compose -f docker-compose.dev.yml up -d --build
	@echo "→ Next.js dev on :3000 (Ctrl-C to stop; api/db keep running, use 'make down' to stop them)"
	cd frontend && pnpm dev

dev-stack:
	docker compose -f docker-compose.dev.yml up --build

dev-web:
	cd frontend && pnpm dev

dev-admin:
	cd admin && pnpm dev

dev-api:
	cd backend && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-db:
	docker compose -f docker-compose.dev.yml up -d db

build:
	docker compose -f docker-compose.yml build

build-web:
	cd frontend && pnpm build

build-admin:
	cd admin && pnpm build

test:
	cd frontend && pnpm tsc --noEmit
	cd admin && pnpm tsc
	cd backend && uv run pytest

lint:
	cd frontend && pnpm lint
	cd backend && uv run ruff check

down:
	docker compose -f docker-compose.dev.yml down
	docker compose -f docker-compose.yml down 2>/dev/null || true

logs:
	docker compose -f docker-compose.dev.yml logs -f

clean:
	rm -rf frontend/.next frontend/.velite frontend/out frontend/node_modules
	rm -rf admin/dist admin/node_modules admin/src/routeTree.gen.ts
	rm -rf backend/__pycache__
	find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
