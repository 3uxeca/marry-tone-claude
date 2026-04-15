from fastapi import FastAPI
from app.routers import diagnosis

app = FastAPI(title="MarryTone ML Sidecar", version="0.1.0")

app.include_router(diagnosis.router, prefix="/api/v1", tags=["diagnosis"])


@app.get("/health")
def health():
    return {"status": "ok"}
