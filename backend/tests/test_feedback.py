"""Tests use the existing dev postgres (started via `make dev-db`).
The `client` fixture defined in conftest.py uses the app's actual db engine.
Each test cleans up rows it created."""
from httpx import AsyncClient
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_ip
from app.db.session import AsyncSessionFactory
from app.models.feedback import Feedback


async def _purge(slug: str) -> None:
    """Delete any feedback whose message contains a unique slug — used to keep
    each test idempotent without nuking real data."""
    async with AsyncSessionFactory() as db:
        await db.execute(delete(Feedback).where(Feedback.message.contains(slug)))
        await db.commit()


async def test_submit_happy(client: AsyncClient) -> None:
    slug = "TEST_HAPPY_xyz123"
    try:
        res = await client.post(
            "/api/v1/public/feedback",
            json={"type": "general", "name": "Tester", "email": "t@example.com",
                  "message": f"hello from pytest {slug}"},
        )
        assert res.status_code == 201
        assert res.json()["ok"] is True
        assert isinstance(res.json()["id"], int)

        # Verify row was actually written + IP is hashed (not raw)
        async with AsyncSessionFactory() as db:
            from sqlalchemy import select
            row = (await db.execute(
                select(Feedback).where(Feedback.message.contains(slug))
            )).scalar_one()
            assert row.type == "general"
            assert row.name == "Tester"
            assert row.email == "t@example.com"
            # ip_hash is a 64-char sha256 hex digest, NOT a raw IP
            assert row.ip_hash and len(row.ip_hash) == 64
            assert "." not in row.ip_hash and ":" not in row.ip_hash
    finally:
        await _purge(slug)


async def test_submit_missing_message_returns_422(client: AsyncClient) -> None:
    res = await client.post("/api/v1/public/feedback", json={"type": "general"})
    assert res.status_code == 422


async def test_submit_invalid_type_returns_422(client: AsyncClient) -> None:
    res = await client.post(
        "/api/v1/public/feedback",
        json={"type": "spam-attack", "message": "hello"},
    )
    assert res.status_code == 422


async def test_honeypot_silently_drops(client: AsyncClient) -> None:
    slug = "TEST_HONEYPOT_xyz999"
    try:
        res = await client.post(
            "/api/v1/public/feedback",
            json={
                "type": "general",
                "message": f"bot message {slug}",
                "website": "http://spam.example.com",  # honeypot triggered
            },
        )
        # Should appear successful to the bot
        assert res.status_code == 201
        assert res.json()["ok"] is True
        assert res.json().get("id") is None  # no row created

        # Verify NO row was actually written
        async with AsyncSessionFactory() as db:
            from sqlalchemy import select
            count = (await db.execute(
                select(Feedback).where(Feedback.message.contains(slug))
            )).all()
            assert count == []
    finally:
        await _purge(slug)


async def test_admin_get_requires_token(client: AsyncClient) -> None:
    # No token
    res = await client.get("/api/v1/admin/feedback")
    assert res.status_code == 401

    # Wrong token
    res = await client.get(
        "/api/v1/admin/feedback",
        headers={"Authorization": "Bearer wrong-token"},
    )
    assert res.status_code == 401


async def test_admin_get_with_valid_token(client: AsyncClient) -> None:
    from app.core.config import settings

    res = await client.get(
        "/api/v1/admin/feedback?limit=5",
        headers={"Authorization": f"Bearer {settings.ADMIN_TOKEN.get_secret_value()}"},
    )
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_hash_ip_is_deterministic_and_salted() -> None:
    # Same IP → same hash; never returns the raw IP
    ip = "192.168.1.42"
    h1 = hash_ip(ip)
    h2 = hash_ip(ip)
    assert h1 == h2
    assert ip not in h1
    assert len(h1) == 64
