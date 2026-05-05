from fastapi import APIRouter

from . import feedback

public_router = APIRouter()
public_router.include_router(feedback.router, tags=["public:feedback"])
