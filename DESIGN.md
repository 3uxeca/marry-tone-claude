# MarryTone Design System

> **Origin**: Derived from the `mockup` branch UI — cream/blush/sage/stone palette.
> This is the single source of truth for all visual decisions in this project.

---

## Creative Direction

- **North star**: Warm Editorial Coach — 쏟아지는 정보 속에서 나만의 기준을 찾아주는 따뜻하고 정돈된 코치
- **Product feeling**: 웨딩 준비 앱이 아닌, 나를 잘 아는 스타일 어드바이저
- **UX tone**: 감성적이되 구조적, 따뜻하되 실용적
- **Composition**: 여유로운 여백 + 카드 기반 정보 계층 + 부드러운 색감

---

## Color Tokens

### Base

| Token | Value | Usage |
|---|---|---|
| `--bg-page` | `#fdfbf7` | 페이지 기본 배경 (warm paper) |
| `--bg-surface` | `#ffffff` | 카드·시트 표면 |
| `--bg-surface-muted` | `#f5f0e8` | 눌린 카드·비활성 영역 |

### Brand

| Token | Value | Usage |
|---|---|---|
| `--brand-dark` | `#292524` | 주요 CTA 버튼, 강조 텍스트 (stone-800) |
| `--brand-cream-100` | `#faf5ec` | 섹션 배경, 선택 영역 틴트 |
| `--brand-cream-200` | `#f5ead8` | 호버 배경, 강조 카드 배경 |
| `--brand-cream-400` | `#e0c99a` | 스크롤바, 보조 액센트 |

### Semantic Accents

| Token | Value | Usage |
|---|---|---|
| `--accent-blush` | `#f6d0d0` | 저장됨·하트·관심 표시 |
| `--accent-blush-light` | `#fbe8e8` | 블러쉬 틴트 배경 |
| `--accent-sage` | `#c8d9c8` | 팁·추천 OK 표시 |
| `--accent-sage-light` | `#e6ede6` | 세이지 틴트 배경 |
| `--accent-mauve` | `#c9a9c9` | 파트너·커플 관련 요소 |

### Text

| Token | Value | Usage |
|---|---|---|
| `--text-primary` | `#1c1917` | 본문 주요 텍스트 (stone-900) |
| `--text-secondary` | `#78716c` | 보조 텍스트 (stone-500) |
| `--text-muted` | `#a8a29e` | 힌트·비활성 텍스트 (stone-400) |
| `--text-on-dark` | `#ffffff` | 어두운 배경 위 텍스트 |

### State

| Token | Value | Usage |
|---|---|---|
| `--state-danger` | `#dc2626` | 에러 |
| `--state-warning` | `#d97706` | 경고 |
| `--state-success` | `#16a34a` | 완료·성공 |

---

## Typography

### Font Family

- **Korean UI**: `Pretendard Variable` → fallback: `system-ui`, `sans-serif`
- **Display/Heading**: `Playfair Display` (영문 헤드라인, 브랜드 워드마크)

### Scale

| Role | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| Display | 32–40px | 500 | 1.2 | 랜딩 히어로, 온보딩 타이틀 |
| Heading 1 | 24–28px | 600 | 1.3 | 페이지 제목, 퀴즈 질문 |
| Heading 2 | 18–20px | 600 | 1.4 | 섹션 제목, 카드 제목 |
| Body | 14–15px | 400–500 | 1.6 | 설명 텍스트, 카드 본문 |
| Label | 12–13px | 500 | 1.4 | 태그, 뱃지, 메타 정보 |
| Caption | 11–12px | 400 | 1.4 | 힌트, 타임스탬프, 부가 설명 |

### Rules

- 한국어 UI는 `-webkit-font-smoothing: antialiased` 적용
- 긴 본문 `line-height: 1.6` 유지
- Label/meta에만 `letter-spacing: 0.02–0.05em` 허용
- **Display 헤드라인은 Playfair Display, 나머지 모든 텍스트는 Pretendard**

---

## Layout

### Breakpoints (Mobile-First)

| Name | Min Width | Notes |
|---|---|---|
| `base` | 0px | 모바일 (375px 기준 설계) |
| `sm` | 480px | 대형 모바일 |
| `md` | 768px | 태블릿 |
| `lg` | 1024px | 데스크톱 |

### Container

- 모바일: `max-width: 448px`, 좌우 padding `20px`
- 데스크톱: `max-width: 1200px`, 좌우 padding `24px`
- 앱 shell 최대 너비: `448px` (모바일 앱 감성 유지)

### Spacing Scale (8px base)

`4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64`

---

## Component Rules

### Buttons

| Type | Background | Text | Border | Radius |
|---|---|---|---|---|
| Primary | `--brand-dark` (#292524) | white | none | 16px |
| Secondary | white | `--text-secondary` | 1px `stone-200` | 16px |
| Ghost | transparent | `--text-secondary` | none | 16px |
| Destructive | `#dc2626` | white | none | 16px |

- 터치 타겟 최소 44×44px
- `active:scale-95` 피드백 (0.15s ease)
- 비활성: `bg-stone-100 text-stone-300 cursor-not-allowed`
- Primary는 full-width가 기본 (모바일 퀴즈 플로우)

### Cards

- `border-radius: 20px` (Tailwind `rounded-2xl`)
- `background: white`
- `border: 1px solid stone-100` (subtle boundary)
- **no drop-shadow** — 깊이는 톤 차이와 배경색으로 표현
- 호버: `translateY(-2px)` + box-shadow `0 8px 24px rgba(0,0,0,0.06)` (0.2s)
- 선택된 카드: `border: 2px solid --brand-dark` + `bg-stone-800 text-white`

### Tags & Badges

- 키워드 태그: `bg-cream-100 text-stone-600` rounded-full, px-2 py-0.5
- 카테고리 뱃지: 카테고리별 틴트 컬러 사용 (아래 카테고리 색상 참조)
- 상태 뱃지: 텍스트 + 컬러 동시 표현 (색상만 사용 금지)

#### 카테고리 색상 매핑

| 카테고리 | 뱃지 배경 | 뱃지 텍스트 |
|---|---|---|
| 드레스 | `#fbe8e8` | `#c85555` |
| 헤어 | `#e6ede6` | `#4a744a` |
| 메이크업 | `#f5ead8` | `#92620e` |
| 촬영 스타일 | `#f5f5f4` | `#78716c` |
| 부케 | `#f0fdf4` | `#166534` |
| 턱시도 | `#f1f5f9` | `#475569` |

### Inputs

- 배경: `stone-50` (tonal filled)
- 포커스: `border-stone-400` + 부드러운 ring (`ring-2 ring-stone-200`)
- 에러: `border-red-400` + 에러 메시지 텍스트 (색상만 표현 금지)
- `border-radius: 12px`
- 텍스트 컬러: `--text-primary`

### Navigation / Header

- 고정 헤더: `bg-page/95 backdrop-blur-sm` (frosted glass)
- 높이: `56px`
- 타이틀: Playfair Display 또는 Pretendard, optically centered
- 뒤로가기: `w-9 h-9 rounded-full bg-white/80` 버튼
- **하단 탭바**: 4탭 (홈 / 퀴즈 / 결과 / 보드), 아이콘 + 라벨

### Progress Bar

- 높이: `6px`
- 배경: `stone-100`
- 활성: `stone-700`
- `border-radius: full`
- 전환: `transition-all duration-500`

---

## Structural Rules

### No Hard Divider Lines

- 섹션 구분은 spacing과 배경 톤 차이로 표현
- 1px `<hr>` 또는 border-top 사용 금지 (카드 내부 구분선 예외: `border-stone-50`)

### Tonal Layering

```
페이지 배경 (#fdfbf7)
  └── 카드 (white)
        └── 내부 서브섹션 (stone-50 / cream-100)
              └── 강조 요소 (brand-dark / accent-blush)
```

### Glass Floating Elements

헤더·모달 배경막·하단 CTA 영역에만 적용:
```css
background: rgba(253, 251, 247, 0.95);
backdrop-filter: blur(8px);
```

---

## Motion & Interaction

| Pattern | Spec | Usage |
|---|---|---|
| Fade in | `opacity 0→1`, 300ms ease | 페이지 전환, 카드 등장 |
| Slide up | `translateY(16px)→0 + opacity`, 400ms ease-out | 퀴즈 스텝 전환, 모달 |
| Scale in | `scale(0.96)→1 + opacity`, 250ms ease-out | 선택 피드백, 팝업 |
| Active press | `scale(0.95)`, 150ms | 버튼 탭 피드백 |

- 장식적 루핑 애니메이션 금지
- 전환은 항목당 1가지 모션만 사용
- `prefers-reduced-motion` 미디어 쿼리 준수

---

## Accessibility

- WCAG AA 텍스트 대비 기준 준수
- 터치 타겟 최소 44×44px
- 상태 표현: 색상 + 텍스트/아이콘 병행 (색상 단독 금지)
- 포커스 visible: `ring-2 ring-stone-400`
- 스크린리더를 위한 `aria-label` 필수 (아이콘 전용 버튼)

---

## Do & Don't

### Do
- 여백을 충분히 — 카드 내부 padding `16–20px` 유지
- 키워드 태그로 정보 밀도 조절 (`#로맨틱`, `#클래식`)
- 퀴즈 선택 시 선택된 카드를 `brand-dark`로 반전 (강한 시각적 피드백)
- 저장 상태는 항상 하트 이모지 + 배경색 변화로 명확히 표현

### Don't
- `stone-800` 외의 색을 Primary CTA 버튼 배경으로 쓰지 말 것
- 카드에 강한 그림자 (`box-shadow` > `0 4px 12px`) 사용 금지
- 하드코딩된 hex 값 컴포넌트 내 직접 사용 금지 — Tailwind 토큰 또는 CSS 변수 사용
- 페이지 배경 `#fdfbf7` 변경 금지
