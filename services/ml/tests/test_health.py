import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_health():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_personal_color_stub():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/diagnosis/personal-color", json={
            "image_base64": "stub_base64",
            "user_id": "test-user-1",
        })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "season" in data["data"]
    assert data["data"]["confidence"] == 0.0  # 저신뢰 C정책 테스트
