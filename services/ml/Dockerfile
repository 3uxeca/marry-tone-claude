FROM python:3.11-slim

WORKDIR /app

# 의존성 먼저 설치 (레이어 캐싱 최적화)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app/

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
