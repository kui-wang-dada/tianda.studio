from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import require_admin_token
from app.db.session import get_db
from app.schemas.feedback import FeedbackRecord, FeedbackType
from app.services import feedback_service

router = APIRouter(dependencies=[Depends(require_admin_token)])


@router.get(
    "/feedback",
    response_model=list[FeedbackRecord],
    summary="List feedback (admin)",
)
async def list_feedback(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    type: FeedbackType | None = None,
    db: AsyncSession = Depends(get_db),
) -> list[FeedbackRecord]:
    rows = await feedback_service.list_recent(db, skip=skip, limit=limit, type_filter=type)
    return [FeedbackRecord.model_validate(r) for r in rows]
