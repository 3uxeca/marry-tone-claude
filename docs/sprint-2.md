# Sprint 2 실행 계획 (Week 3–4)

> **작성일**: 2026-04-15
> **버전**: v1.0
> **테마**: 진단 플로우 완성 · 추천 엔진 기초 · 상태 관리
> **관련 문서**: `docs/implementation-plan.md`, `AGENTS.md`, `DESIGN.md`, `docs/sprint-1.md`

---

## 1. Sprint 2 목표

Sprint 1에서 완성된 기반 위에 **진단 3개 경로를 완성**하고, 인증 상태를 전역으로 관리하며, 진단 결과를 추천으로 연결하는 기초 엔진을 구축한다.

1. 진단 3개 경로 완성 (`/diagnosis/manual`, `/diagnosis/photo`, `/diagnosis/survey`)
2. 인증 상태 전역 관리 + protected routes
3. 추천 엔진 기초 (진단 결과 → 스드메 추천 매핑)
4. E2E 테스트 + 단위 테스트 셋업

---

## 2. Exit Criteria

- [ ] 진단 경로 3개 완성: `/diagnosis/manual`, `/diagnosis/photo`, `/diagnosis/survey`
- [ ] 비로그인 접근 시 `/login` redirect (protected routes)
- [ ] Zustand authStore: 로그인 유저 전역 상태, 세션 복원 (`/api/auth/me`)
- [ ] `GET /recommendation` — 진단 결과 기반 추천 3안 + 메인 1안 API
- [ ] 추천 결과 화면 (카드 3개 + 대표 1개)
- [ ] Jest 단위 테스트: AuthService, ProfileService 최소 커버리지
- [ ] Playwright E2E: `docker compose`와 연동하여 CI에서 실행

---

## 3. 태스크 목록

> 작업량 단위: **S**=0.5d, **M**=1d, **L**=2d, **XL**=3d+

| # | 태스크 | 담당 | 작업량 | 의존 |
|---|---|---|---|---|
| T1 | 인증 상태 전역 관리 (Zustand authStore + `/api/auth/me` 연동) | frontend-engineer | S | - |
| T2 | Protected routes 미들웨어 (비로그인 → `/login` redirect) | frontend-engineer | S | T1 |
| T3 | E2E + 단위 테스트 환경 셋업 (Jest for api, Playwright docker 연동) | qa-engineer | M | - |
| T4 | `/diagnosis/manual` 화면 (퍼스널컬러 시즌 + 골격 타입 직접 선택) | ui-designer + frontend-engineer | M | - |
| T5 | `/diagnosis/photo` 화면 (사진 업로드 UI + ML 연동 API) | frontend-engineer + ml-engineer | L | - |
| T6 | `/diagnosis/survey` 화면 (5~7개 설문 → 결과 추정) | ui-designer + frontend-engineer | M | - |
| T7 | 진단 결과 저장 API (`Profile.personalColorSeason` + `skeletonType` 업데이트) | backend-engineer | S | - |
| T8 | 추천 매핑 로직 (퍼스널컬러 × 골격 → 스드메 카테고리 필터) | backend-engineer | M | T7 |
| T9 | 추천 API (`GET /recommendation`) — 3안 + 메인 1안 | backend-engineer | M | T8 |
| T10 | 추천 결과 UI (카드 레이아웃, 태그, 이유 설명) | ui-designer + frontend-engineer | M | T9 |
| T11 | AuthService 단위 테스트 (register/login/me) | qa-engineer | S | T3 |
| T12 | Playwright E2E CI 연동 (e2e-smoke job에 `docker compose` 추가) | qa-engineer | M | T3 |

---

## 4. 진단 화면 스펙

### T4 `/diagnosis/manual`

- 퍼스널컬러: 4개 시즌 카드 선택 (봄 웜 / 여름 쿨 / 가을 웜 / 겨울 쿨) — 색상 swatch 포함
- 골격: 3개 타입 선택 (스트레이트 / 웨이브 / 내추럴) — 실루엣 아이콘 포함
- 저장 → 추천 결과로 이동

레이아웃 (모바일 375 기준):

```
┌─────────────────────────────┐
│  [←]  진단 — 직접 입력        │  ← 56px 고정 헤더
├─────────────────────────────┤
│  퍼스널컬러 시즌을 선택하세요    │
│  ┌──────────┐ ┌──────────┐  │
│  │ [swatch] │ │ [swatch] │  │  봄 웜 / 여름 쿨
│  └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐  │
│  │ [swatch] │ │ [swatch] │  │  가을 웜 / 겨울 쿨
│  └──────────┘ └──────────┘  │
│                              │
│  골격 타입을 선택하세요          │
│  ┌──────┐ ┌──────┐ ┌──────┐ │
│  │ 스트  │ │ 웨이  │ │ 내추  │ │
│  │ 레이  │ │ 브    │ │ 럴    │ │
│  └──────┘ └──────┘ └──────┘ │
├─────────────────────────────┤
│  [   저장하고 추천 받기   ]    │
└─────────────────────────────┘
```

### T5 `/diagnosis/photo`

단계별 플로우:

1. **사진 가이드** — 촬영 조건(조명·배경·자세) 안내 + 개인정보 처리 동의
2. **업로드** — 맨얼굴 사진(퍼스널컬러) + 전신 사진(골격) 파일 선택 또는 카메라
3. **AI 분석 중** — 로딩 인디케이터, 진행 단계 표시 (p95 12초 이내)
4. **결과 확인** — confidence 표시, 시즌·타입 라벨 노출

저신뢰(C정책) 처리:

- `confidence < 0.6` → 재촬영 유도 (최대 2회)
- 2회 재시도 후에도 미달 → `/diagnosis/survey` 폴백 전환

연동 ML API:

| 엔드포인트 | 용도 |
|---|---|
| `POST /diagnosis/personal-color` | 맨얼굴 이미지 → 시즌 + confidence |
| `POST /diagnosis/skeleton-type` | 전신 이미지 → 골격 타입 + confidence |

### T6 `/diagnosis/survey`

- 5개 질문 (피부톤 계열, 혈관 색, 머리카락 색, 눈동자 색, 이상적인 분위기)
- 1문항 1화면 방식, 진행률 바 표시
- 답변 조합 → 퍼스널컬러 추정 알고리즘 (규칙 기반)
- 결과 화면에서 추정 시즌 확인 후 진행

---

## 5. 추천 엔진 매핑 규칙 (기초)

퍼스널컬러(4) × 골격(3) 조합을 스드메 스타일 태그로 매핑한다. Sprint 2에서는 규칙 기반 하드 매핑으로 구현하고, Sprint 3에서 LLM 설명 생성을 추가한다.

| 퍼스널컬러 | 골격 | 드레스 스타일 | 메이크업 톤 |
|---|---|---|---|
| SPRING_WARM | STRAIGHT | 클래식 A라인, 아이보리 | 코럴 계열 |
| SPRING_WARM | WAVE | 플로럴 프릴, 크림 화이트 | 피치 계열 |
| SPRING_WARM | NATURAL | 보헤미안 레이스, 샴페인 | 살몬 계열 |
| SUMMER_COOL | STRAIGHT | 엘레강스 시스, 소프트 화이트 | 로즈 계열 |
| SUMMER_COOL | WAVE | 로맨틱 프릴, 소프트 화이트 | 모브 계열 |
| SUMMER_COOL | NATURAL | 에스닉 드레이프, 오프 화이트 | 라벤더 계열 |
| AUTUMN_WARM | STRAIGHT | 클래식 머메이드, 아이보리 골드 | 브라운 계열 |
| AUTUMN_WARM | WAVE | 빈티지 레이스, 베이지 | 테라코타 계열 |
| AUTUMN_WARM | NATURAL | 보헤미안, 샴페인 골드 | 테라코타 계열 |
| WINTER_COOL | STRAIGHT | 미니멀 슬림, 퓨어 화이트 | 버건디 계열 |
| WINTER_COOL | WAVE | 드라마틱 볼룸, 아이스 화이트 | 플럼 계열 |
| WINTER_COOL | NATURAL | 모던 오버사이즈, 퓨어 화이트 | 딥 레드 계열 |

추천 응답 구조 (`GET /recommendation`):

```json
{
  "main": { "id": "...", "style": "...", "reason": "...", "tags": [...] },
  "candidates": [
    { "id": "...", "style": "...", "reason": "...", "tags": [...] },
    { "id": "...", "style": "...", "reason": "...", "tags": [...] }
  ],
  "personalColorSeason": "AUTUMN_WARM",
  "skeletonType": "NATURAL"
}
```

---

## 6. Sprint 2 완료 체크리스트

### 6.1 구현

- [ ] T1 Zustand authStore 구현 + `/api/auth/me` 세션 복원
- [ ] T2 Protected routes 미들웨어 (비로그인 → `/login` redirect)
- [ ] T3 Jest 테스트 환경 셋업 (`services/api`) + Playwright docker 연동
- [ ] T4 `/diagnosis/manual` 화면 (시즌 카드 + 골격 선택)
- [ ] T5 `/diagnosis/photo` 화면 (업로드 → AI 분석 → 결과 + C정책)
- [ ] T6 `/diagnosis/survey` 화면 (5문항 설문 → 시즌 추정)
- [ ] T7 진단 결과 저장 API (`PATCH /profile/diagnosis-result`)
- [ ] T8 추천 매핑 로직 (퍼스널컬러 × 골격 → 스타일 태그)
- [ ] T9 추천 API (`GET /recommendation`, 3안 + 메인 1안)
- [ ] T10 추천 결과 UI (카드 레이아웃, 태그, 이유 설명)
- [ ] T11 AuthService 단위 테스트 (register / login / me)
- [ ] T12 Playwright E2E CI 연동 (`e2e-smoke` job + `docker compose`)

### 6.2 품질 게이트

- [ ] `pnpm lint` green
- [ ] `pnpm typecheck` green
- [ ] `pnpm build` green (전 패키지)
- [ ] `pnpm test` — AuthService / ProfileService 단위 테스트 통과
- [ ] Playwright E2E: 진단 게이트 → manual 진단 → 추천 결과 smoke 통과
- [ ] p95 진단(photo) 응답 12초 이내
- [ ] `confidence < 0.6` 재촬영 플로우 통합 테스트 통과
- [ ] `GET /recommendation` p95 응답 3초 이내 (LLM 미포함, 규칙 기반)

### 6.3 문서

- [ ] `docs/sprint-2.md` 업데이트 완료
- [ ] `packages/contracts`에 `DiagnosisResult`, `RecommendationResponse` DTO 추가
- [ ] `services/ml/openapi.yaml` 스냅샷 업데이트
- [ ] `docs/sprint-3.md` 작성

---

## 7. 리스크 & 오픈 이슈

| 항목 | 대응 |
|---|---|
| ML sidecar confidence 기준 미검증 | 0.6 임계값은 가정값 — 샘플 이미지 10개 이상으로 보정 후 확정 |
| 추천 매핑 테이블 카탈로그 데이터 부재 | Sprint 2는 하드코딩 매핑으로 구현, Sprint 3에서 DB 카탈로그로 전환 |
| Playwright docker compose 연동 CI 시간 증가 | `e2e-smoke` job을 별도 runner에서 병렬 실행, timeout 5분 설정 |
| Zustand SSR 하이드레이션 불일치 | `persist` 미들웨어 + `skipHydration` 패턴 적용 |
