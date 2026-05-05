from httpx import AsyncClient


async def test_health(client: AsyncClient) -> None:
    res = await client.get("/api/v1/health")
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "ok"
    assert "version" in body
    assert "env" in body
