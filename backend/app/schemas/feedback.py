from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

FeedbackType = Literal["general", "hire", "collab"]
Locale = Literal["zh", "en"]


class FeedbackIn(BaseModel):
    """User-submitted feedback. All bot fields are validated server-side."""

    type: FeedbackType = "general"
    name: str | None = Field(default=None, max_length=80)
    email: EmailStr | None = None
    message: str = Field(min_length=2, max_length=4000)
    locale: Locale | None = None

    # Honeypot — must be empty. Real users never see it (CSS-hidden).
    # Bots fill all input fields blindly and trip this check.
    website: str | None = Field(default=None, max_length=200)


class FeedbackOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ok: bool = True
    id: int | None = None


class FeedbackRecord(BaseModel):
    """Admin view of a stored feedback row."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    type: str
    name: str | None
    email: str | None
    message: str
    locale: str | None
    ip_hash: str | None
    user_agent: str | None
    referer: str | None
    is_spam: bool
    is_archived: bool
    created_at: datetime
