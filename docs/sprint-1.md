# Sprint 1 실행 계획 (Week 1–2)

> **작성일**: 2026-04-15
> **버전**: v1.0
> **테마**: 모노레포 안정화 · 공통 인증 골격 · 진단 게이트 UI/API
> **관련 문서**: `docs/implementation-plan.md`, `AGENTS.md`, `DESIGN.md`, `docs/blueprint.md`

---

## 1. Sprint 1 목표

Phase 1 개발 전체의 **기반 레일**을 깐다. 이후 모든 스프린트는 S1 산출물 위에서 병렬 진행된다.

1. pnpm workspace + Turborepo 기반 모노레포를 `docker compose up` 한 번에 전 스택 기동 가능한 상태로 만든다.
2. `apps/web`(Next.js 14 + FSD), `services/api`(NestJS + Fastify), `services/ml`(FastAPI) 골격을 공유 계약(`packages/contracts`) 위에 올린다.
3. 공통 인증(이메일 또는 소셜 1종) 골격과 세션 쿠키 흐름을 완성한다.
4. **진단 게이트 화면 + API**를 end-to-end로 동작시킨다 (경험자/비경험자 분기까지).

---

## 2. Exit Criteria

- [ ] `pnpm install && pnpm dev` 루트에서 web/api/ml 모두 부팅
- [ ] `docker compose -f infra/compose/docker-compose.dev.yml up` 성공 (web:3000, api:4000, ml:8000, mysql:3306, redis:6379)
- [ ] 인증: 이메일 로그인 → 세션 쿠키 발급 → `/api/me` 200
- [ ] 진단 게이트 E2E: 게이트 화면 진입 → "경험 있음/없음" 선택 → 서버 반영 → 다음 단계 라우팅 분기
- [ ] 공통 품질 게이트 전 항목 통과 (lint/test/contract/security)
- [ ] ML 헬스체크 3개 엔드포인트 스텁 200 응답
- [ ] `DESIGN.md` 토큰이 `apps/web/shared/design-tokens/`에 반영, Tailwind config 매핑 완료

---

## 3. 태스크 목록

> 작업량 단위: **S**=0.5d, **M**=1d, **L**=2d, **XL**=3d+

| # | 태스크 | 담당 | 작업량 | 의존 |
|---|---|---|---|---|
| T1 | ~~pnpm workspace + Turborepo 루트 셋업~~ ✅ | planner | S | - |
| T2 | ~~공통 TypeScript/ESLint/Prettier preset (`packages/tsconfig`, `packages/eslint-config`)~~ ✅ | frontend-engineer | S | T1 |
| T3 | ~~`packages/contracts` 초기화 (Zod + diagnosis-gate/auth DTO)~~ ✅ | backend-engineer | M | T1 |
| T4 | ~~`apps/web` Next.js 14 App Router + FSD 디렉토리 스캐폴드~~ ✅ | frontend-engineer | M | T2 |
| T5 | ~~`apps/web` DESIGN 토큰 → Tailwind theme 매핑, 기본 Button/Card/Input~~ ✅ | ui-designer | M | T4 |
| T6 | ~~`services/api` NestJS + Fastify 스캐폴드, 모듈 골격 (auth/profile/recommendation/wardrobe/couple/admin)~~ ✅ | backend-engineer | L | T2, T3 |
| T7 | ~~`services/api` Prisma 초기 스키마 (User, Profile, DiagnosisGate) + 초기 마이그레이션~~ ✅ | database-engineer | M | T6 |
| T8 | ~~`services/ml` FastAPI 스캐폴드 + 3개 엔드포인트 스텁 (`/diagnosis/personal-color`, `/diagnosis/body-measurements`, `/diagnosis/skeleton-type`)~~ ✅ | ml-inference-engineer | M | T3 |
| T9 | ~~Docker Compose (web/api/ml/mysql/redis)~~ ✅ | planner | M | T4, T6, T8 |
| T10 | ~~공통 인증 모듈 (이메일 로그인, 세션 쿠키, `/api/me`)~~ ✅ | backend-engineer | L | T6, T7 |
| T11 | ~~진단 게이트 DTO 확정 (`packages/contracts/diagnosis-gate.ts`)~~ ✅ | backend-engineer + frontend-engineer | S | T3 |
| T12 | 진단 게이트 API (`POST /profile/diagnosis-gate`, `GET /profile/diagnosis-gate`) | backend-engineer | M | T7, T11 |
| T13 | 진단 게이트 UI (경험자/비경험자 분기 화면) | ui-designer + frontend-engineer | M | T5, T11 |
| T14 | 진단 게이트 FE↔BE 연결 + TanStack Query 훅 | frontend-engineer | M | T12, T13 |
| T15 | E2E 테스트 (Playwright): 로그인 → 게이트 → 분기 라우팅 | qa-engineer | M | T10, T14 |
| T16 | CI 파이프라인 (lint / typecheck / unit / e2e-smoke) | qa-engineer | M | T9 |
| T17 | 보안 기본선 (CORS, CSRF, helmet, rate limit 기본값, .env 예시) | backend-engineer | S | T6 |

---

## 4. 모노레포 초기 설정 세부

### 4.1 루트 `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "services/api"
  - "packages/*"
```

> `services/ml`은 Python이므로 pnpm workspace 대상 외. Turborepo에는 `pipeline` 기반으로 포함.

### 4.2 루트 `turbo.json` (요지)

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "dev":   { "cache": false, "persistent": true },
    "lint":  {},
    "typecheck": { "dependsOn": ["^build"] },
    "test":  { "dependsOn": ["^build"] }
  }
}
```

### 4.3 `apps/web` FSD 디렉토리

```
apps/web/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                       # 랜딩
│   ├── (auth)/login/page.tsx
│   ├── (onboarding)/diagnosis-gate/page.tsx
│   └── api/                            # Route Handlers (BFF 최소)
├── features/
│   └── diagnosis-gate/
│       ├── ui/DiagnosisGateForm.tsx
│       ├── model/useDiagnosisGate.ts
│       └── api/diagnosisGate.ts
├── widgets/
│   └── app-shell/AppShell.tsx
├── entities/
│   └── profile/profile.ts
└── shared/
    ├── ui/                             # Button, Card, Input, Badge
    ├── lib/                            # fetcher, zod parsers
    ├── api/                            # http client
    ├── design-tokens/                  # color.ts, typography.ts (DESIGN.md 반영)
    └── config/                          # env, routes
```

### 4.4 `services/api` NestJS 모듈 골격

```
services/api/src/
├── main.ts                             # Fastify adapter
├── app.module.ts
├── common/                             # guards, filters, pipes, interceptors
├── modules/
│   ├── auth/           # AuthController, AuthService, SessionGuard
│   ├── profile/        # DiagnosisGateController, ProfileController
│   ├── recommendation/ # (S3에서 구현, S1은 빈 모듈)
│   ├── wardrobe/       # (S3)
│   ├── couple/         # (S3)
│   └── admin/          # (S4)
└── prisma/prisma.service.ts
```

### 4.5 `services/ml` FastAPI 엔드포인트 스텁

```
services/ml/app/
├── main.py                             # FastAPI app, health
├── routers/diagnosis.py                # 3 endpoints (stub)
├── schemas/diagnosis.py                # pydantic DTO (contracts와 일치)
└── core/                                # (S2에서 실제 구현)
```

```python
# services/ml/app/routers/diagnosis.py (스텁)
from fastapi import APIRouter
from app.schemas.diagnosis import (
    PersonalColorRequest, PersonalColorResponse,
    BodyMeasurementsRequest, BodyMeasurementsResponse,
    SkeletonTypeRequest, SkeletonTypeResponse,
)

router = APIRouter(prefix="/diagnosis")

@router.post("/personal-color", response_model=PersonalColorResponse)
async def personal_color(req: PersonalColorRequest): ...

@router.post("/body-measurements", response_model=BodyMeasurementsResponse)
async def body_measurements(req: BodyMeasurementsRequest): ...

@router.post("/skeleton-type", response_model=SkeletonTypeResponse)
async def skeleton_type(req: SkeletonTypeRequest): ...
```

### 4.6 Docker Compose (`infra/compose/docker-compose.dev.yml`)

| 서비스 | 포트 | 이미지/빌드 | 의존 |
|---|---|---|---|
| `web` | 3000 | build `infra/docker/Dockerfile.web` | api |
| `api` | 4000 | build `infra/docker/Dockerfile.api` | mysql, redis, ml |
| `ml` | 8000 | build `infra/docker/Dockerfile.ml` | - |
| `mysql` | 3306 | `mysql:8.0` | - |
| `redis` | 6379 | `redis:7-alpine` | - |

환경 변수 예시(`.env.example`):
```
DATABASE_URL=mysql://root:root@mysql:3306/marrytone
REDIS_URL=redis://redis:6379
ML_BASE_URL=http://ml:8000
SESSION_SECRET=change-me
WEB_ORIGIN=http://localhost:3000
```

### 4.7 공통 TypeScript 설정 (`packages/tsconfig/base.json`)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  }
}
```

워크스페이스별로 `extends: "@marrytone/tsconfig/base.json"` + `jsx`, `lib`, `outDir` 오버라이드.

---

## 5. API 계약 — 진단 게이트 DTO 초안

> 위치: `packages/contracts/src/diagnosis-gate.ts`
> 런타임: Zod, 컴파일 타임: z.infer로 타입 추출, 문서: OpenAPI 자동 생성

```ts
// packages/contracts/src/diagnosis-gate.ts
import { z } from "zod";

/** 진단 경험 여부 게이트 */
export const DiagnosisGateAnswer = z.enum([
  "EXPERIENCED",      // 기존 퍼스널컬러·골격 진단 경험 있음
  "NOT_EXPERIENCED",  // 경험 없음 → 자동 진단으로 유도
  "UNSURE",           // 불명확 → 설문 폴백
]);

export const DiagnosisGateRequest = z.object({
  answer: DiagnosisGateAnswer,
  /** 경험자가 이미 결과값을 가지고 있으면 간단히 입력 */
  priorResult: z.object({
    personalColor: z.string().max(32).optional(),   // 예: "가을 뮤트"
    skeletonType: z.enum(["STRAIGHT", "WAVE", "NATURAL"]).optional(),
  }).optional(),
});

export const DiagnosisGateResponse = z.object({
  profileId: z.string().uuid(),
  nextRoute: z.enum([
    "/onboarding/prior-result",   // 경험자 → 결과 입력/업로드
    "/onboarding/photo-upload",   // 비경험자 → 사진 업로드
    "/onboarding/survey",         // UNSURE → 설문
  ]),
  updatedAt: z.string().datetime(),
});

export type DiagnosisGateRequest = z.infer<typeof DiagnosisGateRequest>;
export type DiagnosisGateResponse = z.infer<typeof DiagnosisGateResponse>;
```

### 5.1 HTTP 인터페이스

| Method | Path | Req | Res | Auth |
|---|---|---|---|---|
| `GET` | `/profile/diagnosis-gate` | — | `DiagnosisGateResponse \| 204` | Session required |
| `POST` | `/profile/diagnosis-gate` | `DiagnosisGateRequest` | `DiagnosisGateResponse` | Session required |

### 5.2 에러 규약

```json
{
  "error": {
    "code": "VALIDATION_FAILED | UNAUTHENTICATED | PROFILE_LOCKED",
    "message": "human-readable",
    "fields": { "answer": "required" }
  }
}
```

### 5.3 DB 스키마 (Prisma, S1 분)

```prisma
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  passwordHash String
  createdAt   DateTime @default(now())
  profile     Profile?
}

model Profile {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  diagnosisGate   DiagnosisGate?
  updatedAt       DateTime @updatedAt
}

model DiagnosisGate {
  id           String   @id @default(uuid())
  profileId    String   @unique
  profile      Profile  @relation(fields: [profileId], references: [id])
  answer       String   // EXPERIENCED | NOT_EXPERIENCED | UNSURE
  priorColor   String?
  priorSkeleton String? // STRAIGHT | WAVE | NATURAL
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

---

## 6. 진단 게이트 화면 스펙

### 6.1 라우트 & 플로우

- 진입: `/(onboarding)/diagnosis-gate`
- 비로그인 접근 → `/login` 리다이렉트 후 복귀
- 선택 저장 성공 시 서버 응답의 `nextRoute`로 `router.replace`

### 6.2 레이아웃 (모바일 375 기준)

```
┌─────────────────────────────┐
│  [←]                         │  ← 56px 고정 헤더, bg-page/95 backdrop
├─────────────────────────────┤
│                              │
│  Heading 1 (Pretendard 600) │  "진단을 시작할게요"
│  Body secondary             │  "기존에 받아본 진단이 있나요?"
│                              │
│  ┌───────────────────────┐  │
│  │  네, 결과가 있어요       │  │  카드 선택형 (rounded-2xl)
│  │  (EXPERIENCED)         │  │  선택 시: border-2 stone-700 + bg-stone-800 text-white
│  └───────────────────────┘  │
│                              │
│  ┌───────────────────────┐  │
│  │  아니요, 처음이에요      │  │
│  │  (NOT_EXPERIENCED)     │  │
│  └───────────────────────┘  │
│                              │
│  ┌───────────────────────┐  │
│  │  잘 모르겠어요           │  │
│  │  (UNSURE)              │  │
│  └───────────────────────┘  │
│                              │
├─────────────────────────────┤
│  [   다음    ]               │  ← Primary CTA, full-width, bg-stone-800
└─────────────────────────────┘
```

### 6.3 상호작용 규칙

| 상태 | 시각 | 동작 |
|---|---|---|
| 기본 | `bg-white border-stone-100 rounded-2xl` | 탭 시 선택 |
| 선택됨 | `bg-stone-800 text-white border-2 border-stone-700` | 다른 카드 선택 시 해제 |
| 다음 비활성 | `bg-stone-100 text-stone-300` | 선택 없으면 탭 무시 |
| 다음 활성 | `bg-stone-800 text-white` | 탭 시 `POST` → 분기 라우팅 |
| 제출 중 | 버튼 내부 스피너 (`ring-2 ring-stone-200`) | 중복 제출 차단 |
| 에러 | 상단 토스트 + 카드 `border-red-400` | 재시도 가능 |

### 6.4 분기 규칙

| 응답 | 다음 라우트 | S2 연계 |
|---|---|---|
| EXPERIENCED | `/onboarding/prior-result` | 결과 직접 입력/결과지 업로드 |
| NOT_EXPERIENCED | `/onboarding/photo-upload` | 맨얼굴·전신 사진 업로드 |
| UNSURE | `/onboarding/survey` | 설문 기반 수동 진단 |

### 6.5 접근성

- 각 카드는 `role="radio"`, 그룹은 `role="radiogroup" aria-labelledby`
- 키보드: 화살표로 이동, Space/Enter로 선택
- `prefers-reduced-motion` 준수 (카드 scale-in 애니메이션 생략)

---

## 7. Sprint 1 완료 체크리스트

### 7.1 구현
- [ ] T1 pnpm + Turborepo 부팅
- [ ] T2 TS/ESLint/Prettier preset
- [ ] T3 `packages/contracts` 초기화
- [ ] T4 `apps/web` FSD 스캐폴드
- [ ] T5 DESIGN 토큰 Tailwind 매핑 + 기본 컴포넌트
- [ ] T6 `services/api` 6개 모듈 골격
- [ ] T7 Prisma 초기 스키마 + 마이그레이션
- [ ] T8 `services/ml` FastAPI 3개 엔드포인트 스텁
- [ ] T9 Docker Compose 전 스택 기동
- [ ] T10 공통 인증 + `/api/me`
- [ ] T11 DiagnosisGate DTO 확정
- [ ] T12 진단 게이트 API
- [ ] T13 진단 게이트 UI
- [ ] T14 FE↔BE 연결 + TanStack Query 훅
- [ ] T15 Playwright E2E
- [ ] T16 CI 파이프라인
- [ ] T17 보안 기본선

### 7.2 품질 게이트
- [ ] `pnpm lint` / `pnpm typecheck` / `pnpm test` 전부 green
- [ ] Playwright smoke (login → gate → branch) 통과
- [ ] 이미지 업로드 경로 미존재 확인 (S1은 업로드 기능 없음)
- [ ] `DESIGN.md` 토큰 외 hex 값 코드 없음 (grep 스캔)
- [ ] 모든 PR에 롤백 노트·테스트 근거 기재

### 7.3 문서
- [ ] `README.md` 루트: "시작하기" 5줄 이내로 정리
- [ ] `docs/screens/diagnosis-gate.md` 화면 정의서 커밋
- [ ] `docs/plans/open-questions.md`에 미해결 질문 추가

---

## 8. 리스크 & 오픈 이슈

| 항목 | 대응 |
|---|---|
| 소셜 로그인 제공자 미정 | S1은 이메일 로그인만, 소셜은 S2 초 결정 |
| MySQL vs PostgreSQL | AGENTS.md 기준 MySQL 확정 |
| 세션 저장소 (쿠키 vs Redis) | 초기 쿠키 + `SameSite=Lax`, S3 트래픽 기반 재평가 |
| ML 엔드포인트의 contracts 동기화 방식 | OpenAPI 생성기 확정 필요 (후보: `openapi-typescript`, `datamodel-code-generator`) |

