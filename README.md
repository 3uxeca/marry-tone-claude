# MarryTone

퍼스널 컬러·골격 진단을 기반으로 예비부부의 스드메(스튜디오·드레스·메이크업) 선택을 돕는 웨딩 스타일 코치 서비스.

## 시작하기

### 사전 요구사항

- Docker & Docker Compose
- Node.js 20+ / pnpm 9+ (로컬 개발 시)

### Docker로 실행 (권장)

```bash
cp .env.example .env
docker compose up --build
# 별도 터미널에서 (첫 실행 시):
docker compose exec api npx prisma migrate deploy
```

접속:

| 서비스 | URL |
|--------|-----|
| 웹 | http://localhost:3060 |
| API | http://localhost:4060/api |
| ML | http://localhost:8060 |

### 로컬 개발

```bash
pnpm install
cp services/api/.env.example services/api/.env
# services/api/.env에서 DATABASE_URL을 로컬 MySQL로 수정
pnpm dev
```

## 기술 스택

| 영역 | 스택 |
|------|------|
| Frontend | Next.js 14 (App Router + FSD), TanStack Query, Tailwind CSS |
| Backend | NestJS 10 + Fastify, Prisma ORM, MySQL 8, Redis 7 |
| ML | FastAPI, MediaPipe, OpenCV, scikit-learn KMeans |
| Infra | Docker Compose, Turborepo 2, pnpm 9 workspace, GitHub Actions |

## 프로젝트 구조

```
marry-tone-claude/
├── apps/
│   └── web/              # Next.js 14 (App Router + FSD)
├── services/
│   ├── api/              # NestJS + Fastify + Prisma
│   └── ml/               # Python FastAPI ML sidecar
├── packages/
│   └── contracts/        # 공유 DTO (Zod)
└── docs/                 # 기획·설계 문서
```

## 개발 명령어

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 전 서비스 개발 서버 시작 |
| `pnpm build` | 전 패키지 빌드 |
| `pnpm lint` | 린트 검사 |
| `pnpm typecheck` | 타입 검사 |
| `docker compose up --build` | 전 스택 Docker 실행 |

## 문서

- [블루프린트](docs/blueprint.md) — 서비스 개요, 사용자 유형, MVP 기능
- [구현 계획](docs/implementation-plan.md) — 기술 스택, 아키텍처, Phase 1 스프린트 계획
- [Sprint 1](docs/sprint-1.md) — Week 1–2 실행 계획 (완료)
- [Sprint 2](docs/sprint-2.md) — Week 3–4 실행 계획
- [DESIGN.md](DESIGN.md) — 디자인 토큰, 컴포넌트 가이드
- [AGENTS.md](AGENTS.md) — 에이전트 역할 및 파일 소유권 규칙
