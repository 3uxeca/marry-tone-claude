# MarryTone 구현 계획 (Phase 1)

> **작성일**: 2026-04-15
> **버전**: v1.0
> **대상**: Phase 1 (Week 0–8) MVP 완성
> **관련 문서**: `AGENTS.md`, `DESIGN.md`, `docs/blueprint.md`, `docs/sprint-1.md`

---

## 1. 목적과 범위

본 문서는 MarryTone Phase 1(8주) 동안 **모노레포 구조 확정 → 진단 → 추천 → 보관/비교 → 커플 합의 → 체크리스트 완료**까지 이어지는 MVP를 개발·배포하기 위한 전체 실행 계획을 정의한다.

- 범위 내 (In-scope): Phase 1 전 구간, 4개 스프린트(각 2주)
- 범위 외 (Out-of-scope): 제휴 리드 전송, 프리미엄 구독, B2B 기능 (Phase 3+)

---

## 2. 모노레포 구조 확정

### 2.1 기술 선택

| 항목 | 결정 | 근거 |
|---|---|---|
| 패키지 매니저 | **pnpm 9.x workspace** | 디스크 효율, 워크스페이스 hoisting 제어 |
| 빌드 오케스트레이터 | **Turborepo 2.x** | 원격 캐시·증분 빌드, Next/NestJS 친화적 |
| Node 버전 | 20.x LTS | Next 14 / NestJS 10 공통 기준 |
| Python 버전 | 3.11 | MediaPipe·OpenCV 4.5+ 안정 조합 |

### 2.2 디렉토리 레이아웃

```
marry-tone-claude/
├── apps/
│   └── web/                   # Next.js 14 (App Router + FSD)
│       ├── app/               # 라우팅 엔트리
│       ├── features/          # 사용 사례 단위 (diagnosis-gate, recommendation-feed, ...)
│       ├── widgets/           # 합성 UI 블록
│       ├── entities/          # 도메인 모델 바인딩
│       └── shared/            # ui/, lib/, api/, config/, design-tokens/
├── services/
│   ├── api/                   # NestJS + Fastify
│   │   ├── src/modules/       # auth, profile, recommendation, wardrobe, couple, admin
│   │   ├── src/common/        # guards, filters, interceptors
│   │   └── prisma/            # schema.prisma, migrations
│   └── ml/                    # Python FastAPI sidecar
│       ├── app/
│       │   ├── routers/       # diagnosis/*.py
│       │   ├── core/          # image, color, landmark 유틸
│       │   └── schemas/       # pydantic DTO
│       └── tests/
├── packages/
│   ├── contracts/             # 공유 DTO (Zod + OpenAPI 생성)
│   ├── tsconfig/              # 공통 tsconfig preset
│   └── eslint-config/         # 공통 lint 규칙
├── docs/                      # 기획·설계 문서
├── infra/
│   ├── docker/                # Dockerfile.web, Dockerfile.api, Dockerfile.ml
│   └── compose/               # docker-compose.dev.yml
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

### 2.3 의존성 경계

```
apps/web  ─┐
           ├─► packages/contracts ◄─┐
services/api ─────────────────────── services/ml
```

- 모든 FE↔BE DTO는 `packages/contracts`에서 Zod 스키마로 단일 정의 → 런타임 검증 + OpenAPI 자동 생성
- `services/api` ↔ `services/ml` 경계는 OpenAPI 3.1 스펙을 `services/ml/openapi.yaml`에 커밋하여 스냅샷 관리

---

## 3. Phase 1 스프린트 계획표 (8주)

| Sprint | 기간 | 테마 | 핵심 산출물 | Exit Criteria |
|---|---|---|---|---|
| **S1** | W1–2 | 기반 안정화 | 모노레포 부팅, 인증 골격, 진단 게이트 UI/API | `docker compose up`으로 전 스택 기동, 진단 게이트 E2E 통과 |
| **S2** | W3–4 | 진단 파이프라인 | 퍼스널컬러·골격 자동 진단, C정책, 보안 로그 | 사진 업로드 → 결과 저장·원본 삭제 감사로그, confidence 표시 |
| **S3** | W5–6 | 추천·비교 | 추천 엔진(3안+메인1안), 보관함, 비교보드, 커플 합의 초안 | 첫 추천 로딩 10초 이내, 비교보드 2~4개 병렬 렌더 |
| **S4** | W7–8 | 완료·릴리스 | 체크리스트 완료 처리, 운영 도구, 성능/회귀, 스테이징 릴리스 | MVP 완료 기준 4개 항목 체크, p95 TTI < 3.5s |

### 3.1 Sprint별 세부

#### Sprint 1 (Week 1–2) — 기반
- 담당: `planner`, `frontend-engineer`, `backend-engineer`, `database-engineer`, `ui-designer`
- 상세: `docs/sprint-1.md` 참조

#### Sprint 2 (Week 3–4) — 진단 파이프라인
- 담당: `ml-inference-engineer`(주), `backend-engineer`, `frontend-engineer`, `qa-engineer`
- 목표
  - `services/ml`: `/diagnosis/personal-color`, `/diagnosis/body-measurements`, `/diagnosis/skeleton-type` 실제 구현 (MediaPipe + OpenCV + KMeans)
  - `services/api`: 업로드 프리사인드 URL, ML 프록시, 결과 영속화, **원본 즉시 삭제 + 감사 로그**
  - `apps/web`: 사진 업로드 UI, confidence 시각화, 저신뢰 C정책(재촬영 → 설문 폴백)
- Exit
  - p95 진단 응답 12초 이내
  - confidence < 0.6 시 재촬영 플로우 유도, 2회 재시도 후 설문 진단 fallback
  - 업로드 원본 파일이 S3/MinIO에 존재하지 않는 것을 통합 테스트로 검증

#### Sprint 3 (Week 5–6) — 추천 / 보관함 / 비교
- 담당: `backend-engineer`(주), `frontend-engineer`, `database-engineer`, `ui-designer`
- 목표
  - 하드필터 + 스코어링 + LLM 설명 생성 파이프라인 (`recommendation` 모듈)
  - 카테고리별 최대 3안 + 메인 1안 강조 (드레스/턱시도/헤어/메이크업/촬영/예식장)
  - 보관함(상태: 검토중/보류/확정), 비교보드(2~4개), 커플 공유 링크 + 코멘트
  - LLM 실패 폴백: 규칙 기반 상위 3안 + "추천 근거 생성 중" 표시
- Exit
  - **첫 추천 로딩 10초 이내** (품질 게이트 #4)
  - 비교보드 반응 시간 1초 이내
  - 커플 합의 이벤트 로그 기록 (누가/언제/왜)

#### Sprint 4 (Week 7–8) — 완료·운영·릴리스
- 담당: `qa-engineer`(주), `backend-engineer`, `frontend-engineer`, `planner`
- 목표
  - 준비 체크리스트 자동 생성 + 진행률 100% → `MVP_COMPLETE` 이벤트
  - 운영 도구: 관리자 대시보드 (카탈로그 큐레이션, 추천 룰셋 버전)
  - 성능 회귀 테스트 (Lighthouse, k6), E2E 회귀 스위트
  - 스테이징 릴리스 + 롤백 절차 문서화
- Exit
  - MVP 완료 기준 4개 항목(blueprint §MVP 완료 기준) 전부 체크
  - Lighthouse Performance ≥ 85 (모바일)
  - 추천 룰셋·DB 마이그레이션 롤백 런북 작성

---

## 4. 에이전트 병렬 작업 소유권 테이블

| Sprint | `ui-designer` | `frontend-engineer` | `backend-engineer` | `database-engineer` | `ml-inference-engineer` | `qa-engineer` |
|---|---|---|---|---|---|---|
| S1 | 토큰 동기화, 진단 게이트 시각 | 라우팅·FSD 골격, 게이트 연결 | Nest 모듈 스캐폴드, auth/profile | Prisma 초안, user/profile | ML 엔드포인트 스텁 | 테스트 러너 셋업 |
| S2 | 업로드/결과 화면 시각 | 업로드 UX, confidence UI | 업로드 프록시, 감사 로그 | diagnosis_result 테이블 | 실제 추론 구현 | 진단 E2E |
| S3 | 피드/비교/보관함 시각 | 카드 UI, 비교 그리드 | 추천·보관·커플 API | wardrobe/comparison 스키마 | (대기) | 추천 성능 부하 |
| S4 | 체크리스트·관리자 시각 | 체크리스트 상호작용 | 체크리스트·admin API | 감사·이벤트 로그 인덱스 | 모델 경량화 | 회귀 전체 |

> **파일 소유권 규칙** (AGENTS.md §File Ownership Rules)
> - `apps/web/**` 수정은 `ui-designer` + `frontend-engineer` 전용
> - `ui-designer` 승인 없이 시각 토큰 변경 금지
> - 다른 에이전트는 `apps/web/**` 읽기 전용

---

## 5. 공통 품질 게이트 체크리스트

모든 PR이 통과해야 하는 게이트(스프린트 무관):

- [ ] **계약 우선**: FE/BE/ML DTO 변경은 `packages/contracts` 또는 OpenAPI PR이 먼저 머지됨
- [ ] **테스트**: 신규 기능 단위 + 통합 테스트 최소 1개
- [ ] **보안**: 이미지 원본 미보관, TLS 전송, 민감정보 로그 금지 (정적 스캔 통과)
- [ ] **성능**: 추천 엔드포인트 p95 ≤ 10s, FE TTI p95 ≤ 3.5s
- [ ] **롤백**: DB 마이그레이션 / 추천 룰셋 변경에 롤백 절차 명시
- [ ] **디자인 토큰**: 하드코딩 hex 금지, `DESIGN.md` 토큰만 사용
- [ ] **커밋**: Conventional Commit (`feat|fix|refactor|docs|test|chore`)
- [ ] **PR 본문**: 사용자 관점 요약 / 기술 트레이드오프 / 테스트 근거 / 리스크·롤백

---

## 6. 의존성 순서 다이어그램

### 6.1 전체 Phase 1 의존성

```
[S1] 모노레포 부팅
   ├─► 공통 인증 골격 ──────────┐
   ├─► Prisma 스키마 초판 ────┐ │
   └─► DTO·계약 패키지 ─────┐ │ │
                           ▼ ▼ ▼
                      [S1] 진단 게이트 API/UI
                           │
                           ▼
                 [S2] 사진 업로드 · ML 실제 추론
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
     퍼스널컬러        골격 측정       보안·감사로그
           └───────────────┬───────────────┘
                           ▼
                   [S2] 통합 프로필 생성
                           │
                           ▼
            [S3] 추천 엔진 (필터→스코어→LLM)
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
       보관함          비교보드        커플 합의
           └───────────────┬───────────────┘
                           ▼
                [S4] 체크리스트 자동 생성
                           │
                           ▼
               [S4] MVP_COMPLETE 이벤트
                           │
                           ▼
             [S4] 운영 대시보드 + 릴리스
```

### 6.2 구현 순서 불변식 (AGENTS.md §Implementation Sequence)

기능별로 반드시 이 순서를 지킨다:

```
1. API 계약 (OpenAPI / DTO) 합의
        ↓
2. DB 스키마 / 마이그레이션 머지
        ↓
3. 백엔드 구현 + 단위 테스트
        ↓
4. ML sidecar 계약 확정 (해당 시)
        ↓
5. UI 연결 (기존 컴포넌트 활용)
```

> **UI 연결은 항상 마지막 단계.**

---

## 7. 리스크 & 롤백

| 리스크 | 영향 | 대응 |
|---|---|---|
| ML 모델 저신뢰율 과다 | 사용자 이탈 | C정책(재촬영 2회 → 설문 폴백), confidence 노출 |
| LLM 설명 생성 실패·지연 | 추천 10초 SLA 초과 | 규칙 기반 상위 3안 폴백, "근거 생성 중" 배지 + 1회 재시도 |
| 이미지 원본 잔존 | 개인정보 사고 | 업로드 → 추론 완료 훅에서 즉시 삭제, 주간 감사 스크립트 |
| 모노레포 빌드 지연 | 개발 속도 저하 | Turborepo 원격 캐시, CI에서 affected 빌드만 |

---

## 8. 승인·변경 관리

- 본 문서의 변경은 `planner`만 PR 가능 (`docs/` write scope)
- 스프린트 범위 변경 시 관련 에이전트 sign-off 필수
- 주간 금요일 15분 체크인에서 진척·리스크 업데이트

