"""Pytest config.

We deliberately do NOT define a session-scoped `event_loop` fixture here —
asyncpg's connection pool registers callbacks on the loop that created it, so
reusing one loop across tests + multiple AsyncSessionFactory() calls yields
"Event loop is closed" tracebacks during teardown.

Letting pytest-asyncio create a fresh loop per test (the default behavior with
asyncio_mode=auto) keeps connections scoped to a single loop's lifetime.
"""
from collections.abc import AsyncIterator

import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest_asyncio.fixture
async def client() -> AsyncIterator[AsyncClient]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
