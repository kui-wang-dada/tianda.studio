from fastapi import Response

from .config import settings


def set_session_cookie(
    response: Response,
    key: str,
    value: str,
    max_age: int,
) -> None:
    """Sets an HttpOnly session cookie that flows across the .tianda.studio subdomains.

    V2 M1 will use this for the refresh token. Kept here in V1 so that auth/me
    endpoints can adopt it without touching cookie semantics again.
    """
    response.set_cookie(
        key=key,
        value=value,
        max_age=max_age,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        domain=settings.COOKIE_DOMAIN or None,
        path="/",
    )


def clear_session_cookie(response: Response, key: str) -> None:
    response.delete_cookie(
        key=key,
        domain=settings.COOKIE_DOMAIN or None,
        path="/",
    )
