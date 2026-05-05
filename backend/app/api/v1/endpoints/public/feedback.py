from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.rate_limit import limiter
from app.db.session import get_db
from app.schemas.feedback import FeedbackIn, FeedbackOut
from app.services import feedback_service

router = APIRouter()


@router.post(
    "/feedback",
    response_model=FeedbackOut,
    status_code=201,
    summary="Submit anonymous feedback",
)
@limiter.limit("3/minute;10/hour")
async def submit_feedback(
    request: Request,
    body: FeedbackIn,
    db: AsyncSession = Depends(get_db),
) -> FeedbackOut:
    # Honeypot — bots fill all input fields. Silently drop, return success
    # so they think it worked and don't retry / change tactics.
    if body.website:
        return FeedbackOut(ok=True)

    fb = await feedback_service.create(db, body, request=request)
    return FeedbackOut(ok=True, id=fb.id)
