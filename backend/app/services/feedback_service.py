from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request

from app.core.security import hash_ip
from app.models.feedback import Feedback
from app.schemas.feedback import FeedbackIn


def _client_ip(req: Request) -> str:
    """Trust X-Forwarded-For first hop (set by Next route handler / Caddy / 宝塔)."""
    fwd = req.headers.get("x-forwarded-for") or req.headers.get("x-real-ip")
    if fwd:
        return fwd.split(",")[0].strip()
    return req.client.host if req.client else "unknown"


async def create(db: AsyncSession, body: FeedbackIn, request: Request) -> Feedback:
    fb = Feedback(
        type=body.type,
        name=body.name or None,
        email=str(body.email) if body.email else None,
        message=body.message.strip(),
        locale=body.locale,
        ip_hash=hash_ip(_client_ip(request)),
        user_agent=(request.headers.get("user-agent") or "")[:512] or None,
        referer=(request.headers.get("referer") or "")[:512] or None,
    )
    db.add(fb)
    await db.commit()
    await db.refresh(fb)
    return fb


async def list_recent(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 50,
    type_filter: str | None = None,
) -> list[Feedback]:
    stmt = select(Feedback).order_by(Feedback.created_at.desc())
    if type_filter:
        stmt = stmt.where(Feedback.type == type_filter)
    stmt = stmt.offset(skip).limit(min(limit, 200))
    result = await db.execute(stmt)
    return list(result.scalars().all())
