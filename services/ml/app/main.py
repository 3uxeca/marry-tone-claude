from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.routers import diagnosis

app = FastAPI(
    title="MarryTone ML Sidecar",
    version="0.1.0",
    description="퍼스널컬러/골격 진단 ML 추론 서비스 (Sprint 1 stub)",
)

app.include_router(diagnosis.router)


@app.get("/health", tags=["infra"])
async def health():
    return {"status": "ok", "version": "0.1.0"}


@app.exception_handler(Exception)
async def global_exception_handler(_request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": {"code": "500", "message": str(exc)}},
    )
