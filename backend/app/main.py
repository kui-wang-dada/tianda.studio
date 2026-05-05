from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.rate_limit import limiter


@asynccontextmanager
async def lifespan(_: FastAPI):
    # NOTE: alembic upgrade head runs in entrypoint.sh, before uvicorn boots.
    yield


app = FastAPI(
    title="Tianda Studio API",
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/api/v1/docs" if settings.ENV == "dev" else None,
    redoc_url=None,
    openapi_url="/api/v1/openapi.json" if settings.ENV == "dev" else None,
)

# slowapi: register limiter on app state so the @limiter.limit decorator can
# locate it; SlowAPIMiddleware injects rate-limit headers into responses.
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    return JSONResponse(
        status_code=429,
        content={"detail": f"rate limit exceeded: {exc.detail}"},
    )


# CORS: browser → FastAPI directly. Each frontend / admin origin must be
# listed explicitly because allow_credentials=True forbids wildcards. The
# refresh-token cookie (V2 M1) rides along thanks to allow_credentials=True
# plus a shared cookie Domain (see app.core.cookies).
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    allow_credentials=True,
)


app.include_router(api_router)
