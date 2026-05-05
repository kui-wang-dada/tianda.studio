from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import get_db

router = APIRouter()


@router.get("/health")
async def health(db: AsyncSession = Depends(get_db)) -> dict[str, str]:
    db_status = "ok"
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:  # noqa: BLE001
        db_status = f"error: {type(e).__name__}"
    return {
        "status": "ok",
        "db": db_status,
        "env": settings.ENV,
        "version": settings.APP_VERSION,
    }
