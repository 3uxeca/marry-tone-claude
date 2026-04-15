# MarryTone Agent Operating Guide

> 이 문서는 AI 에이전트 및 개발자가 이 프로젝트에서 작업할 때 따라야 할 운영 규칙을 정의합니다.
> `DESIGN.md`와 `docs/blueprint.md`와 함께 읽어야 합니다.

---

## Core Principles

1. **Design-First**: 구현 전 `DESIGN.md` 토큰 기준을 반드시 확인한다.
2. **Contract-First**: FE/BE/ML 경계 변경은 DTO·스키마 PR을 먼저 올린다.
3. **Test-Driven**: 신규 기능은 단위·통합 테스트 최소 1개 이상 포함한다.
4. **Security-First**: 이미지 원본 미보관, 암호화 전송, 민감정보 로그 금지.
5. **Mobile-First**: 모든 UI는 375px 기준으로 설계하고 데스크톱으로 확장한다.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript 5, App Router, FSD |
| State | TanStack Query 5, Zustand |
| Styling | Tailwind CSS 3 + `DESIGN.md` 토큰 기준 |
| Backend | NestJS + Fastify, TypeScript |
| Database | MySQL 8 + Prisma |
| Queue | Redis + BullMQ |
| Storage | S3 호환 (개발: MinIO) |
| ML Sidecar | Python FastAPI |
| Infra | Docker Compose (개발), k8s/ECS (확장) |

---

## Monorepo Structure

```
marry-tone-claude/
├── apps/
│   └── web/              # Next.js frontend (FSD)
│       ├── app/          # App Router pages
│       ├── features/     # FSD features
│       ├── widgets/      # FSD widgets
│       ├── entities/     # FSD entities
│       └── shared/       # design tokens, ui, lib, api
├── services/
│   ├── api/              # NestJS backend
│   │   └── prisma/       # DB schema & migrations
│   └── ml/               # Python FastAPI sidecar
├── docs/                 # 기획·설계 문서
├── DESIGN.md             # 디자인 시스템 (단일 진실 소스)
└── AGENTS.md             # 이 문서
```

---

## Agent Roles

| Agent | Primary Responsibility | Write Scope |
|---|---|---|
| `planner` | 작업 분해, 의존성 지도, 리스크 관리 | `docs/` |
| `ui-designer` | 디자인 토큰, 화면 스펙, 컴포넌트 시각 일관성 | `DESIGN.md`, `apps/web/shared/ui/**` |
| `frontend-engineer` | 라우팅, 상태, 데이터 페칭, API 연결 | `apps/web/**` (시각 레이어 제외) |
| `backend-engineer` | 도메인 API, 인증, 추천 모듈 | `services/api/src/**` |
| `database-engineer` | 스키마, 인덱스, 마이그레이션 | `services/api/prisma/**` |
| `ml-inference-engineer` | Python sidecar 모델 서빙 | `services/ml/**` |
| `qa-engineer` | 테스트 전략, E2E, 회귀 | `tests/**` |

### File Ownership Rules

- `apps/web/**`는 `ui-designer`와 `frontend-engineer`만 수정 가능
- `ui-designer`는 시각 결정 소유 (레이아웃, 토큰, 인터랙션 모양)
- `frontend-engineer`는 기능 구현 소유 (라우팅, 상태, API 연결)
- `frontend-engineer`는 `ui-designer` 승인 없이 시각 토큰 변경 금지
- 다른 에이전트는 `apps/web/**` 읽기 전용

---

## UI Rules

### Design Token 사용

- `DESIGN.md`에 정의된 토큰만 사용
- 하드코딩 hex 값 컴포넌트 내 직접 사용 금지
- Tailwind 유틸리티로 표현 불가한 경우에만 CSS 변수 사용

### Component Visual Rules

- 카드 radius: `rounded-2xl` (20px)
- Primary CTA: `bg-stone-800 text-white`
- 선택 상태: `border-2 border-stone-700 bg-stone-800 text-white`
- 저장된 항목: `bg-blush-100` 배경 + 하트 이모지
- **페이지 배경 `#fdfbf7`는 변경 금지**

### Screen Reference

기존 Stitch HTML 파일 없음 — `mockup` 브랜치의 구현이 시각적 기준선.
신규 화면 설계 시:
1. `DESIGN.md` 토큰 기준으로 컴포넌트 구성
2. `docs/screens/` 아래 화면 정의서 작성 후 구현

---

## Screen → Module Mapping

| Priority | Screen | NestJS Module | ML Sidecar |
|---|---|---|---|
| P0 | 진단 게이트 | `profile` | No |
| P0 | 온보딩 퀴즈 | `profile` | No |
| P0 | 사진 업로드 진단 | `profile` | **Yes** |
| P0 | 퍼스널컬러 결과 | `profile` | **Yes** |
| P0 | 체형 결과 | `profile` | **Yes** |
| P0 | 추천 결과 피드 | `recommendation` | No |
| P1 | 나의 보관함 | `wardrobe` | No |
| P1 | 스타일 비교 보드 | `wardrobe`, `recommendation` | No |
| P1 | 커플 합의 보드 | `couple` | No |
| P2 | 웨딩 준비 체크리스트 | `profile` | No |
| P2 | 마이페이지 | `profile`, `couple` | No |
| P2 | 관리자 대시보드 | `admin` | No |

---

## Implementation Sequence

모든 기능 작업은 이 순서를 반드시 따른다:

```
1. API 계약 (OpenAPI / DTO) FE ↔ BE 합의
2. DB 스키마 / 마이그레이션 머지
3. 백엔드 구현 + 단위 테스트 통과
4. ML sidecar 계약 확정 (해당 시)
5. UI 연결 (기존 컴포넌트 활용)
```

UI 연결은 항상 마지막 단계. UI보다 스키마·API가 먼저다.

---

## Quality Gates

모든 Sprint 공통:
1. FE/BE/ML 경계 변경 → DTO·스키마 PR 선행
2. 신규 기능 → 단위·통합 테스트 최소 1개
3. 이미지 원본 미보관, 암호화 전송, 민감정보 로그 금지
4. 첫 추천 로딩 10초 이내 목표 — 벗어나면 릴리스 후보 제외
5. DB 마이그레이션·추천 룰셋 → 롤백 절차 PR에 명시

---

## Commit & PR Rules

- Conventional commit: `<type>: <description>`
- Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
- PR body 필수 항목:
  - 사용자 관점 변경 요약
  - 기술적 결정과 트레이드오프
  - 테스트 근거
  - 알려진 리스크와 롤백 노트

---

## Security & Privacy

- 업로드 이미지: TLS 전송 암호화 + 저장 구간 암호화
- 원본 이미지: 진단 완료 즉시 삭제, 감사 로그 기록
- 운영자 원본 이미지 접근 불가
- 민감 정보(얼굴·체형·취향)는 최소 수집·명시 동의·삭제 가능
- 자격증명·키 하드코딩 절대 금지
