export type PersonalColor =
  | 'spring-warm'   // 봄 웜
  | 'summer-cool'   // 여름 쿨
  | 'autumn-warm'   // 가을 웜
  | 'winter-cool'   // 겨울 쿨

export type BodyFrame =
  | 'straight'  // 스트레이트
  | 'wave'      // 웨이브
  | 'natural'   // 내추럴

export type Mood =
  | 'romantic'    // 로맨틱
  | 'classic'     // 클래식
  | 'modern'      // 모던
  | 'bohemian'    // 보헤미안
  | 'vintage'     // 빈티지
  | 'minimal'     // 미니멀

export type ShootingStyle =
  | 'film'        // 필름 감성
  | 'clean'       // 깔끔 화이트
  | 'outdoor'     // 내추럴 야외
  | 'dramatic'    // 드라마틱

export type StyleCategory =
  | 'dress'       // 웨딩드레스
  | 'hair'        // 헤어스타일
  | 'makeup'      // 메이크업
  | 'studio'      // 스튜디오 스타일
  | 'bouquet'     // 부케
  | 'tuxedo'      // 턱시도 (신랑)

export interface QuizAnswers {
  personalColor?: PersonalColor
  bodyFrame?: BodyFrame
  mood?: Mood
  shootingStyle?: ShootingStyle
  role?: 'bride' | 'groom'
}

export interface StyleItem {
  id: string
  category: StyleCategory
  title: string
  description: string
  keywords: string[]
  emoji: string
  colorPalette?: string[]  // hex colors
  tips: string[]
  avoid: string[]
}

export interface RecommendationResult {
  personalColorLabel: string
  personalColorDesc: string
  bodyFrameLabel: string
  bodyFrameDesc: string
  overallVibe: string
  items: StyleItem[]
}

export interface SavedItem {
  id: string
  item: StyleItem
  note?: string
  savedAt: string
  rank?: 1 | 2 | 3  // 우선순위
}
