from fastapi import APIRouter

from . import feedback

admin_router = APIRouter()
admin_router.include_router(feedback.router, tags=["admin:feedback"])
