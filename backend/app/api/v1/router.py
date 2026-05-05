from fastapi import APIRouter

from .endpoints import health
from .endpoints.admin import admin_router
from .endpoints.auth import auth_router
from .endpoints.me import me_router
from .endpoints.public import public_router

api_router = APIRouter(prefix="/api/v1")

# Health stays at the top level — load balancers / probes hit /api/v1/health
# without going through any access tier.
api_router.include_router(health.router, tags=["health"])

api_router.include_router(public_router, prefix="/public")
api_router.include_router(auth_router, prefix="/auth")
api_router.include_router(me_router, prefix="/me")
api_router.include_router(admin_router, prefix="/admin")
