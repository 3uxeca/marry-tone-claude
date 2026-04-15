import type {
  PersonalColor, BodyFrame, Mood, ShootingStyle,
  StyleItem, RecommendationResult, QuizAnswers
} from './types'

// ─── 퍼스널 컬러 메타 ───────────────────────────────────────────────────────

const personalColorMeta: Record<PersonalColor, { label: string; desc: string; palette: string[] }> = {
  'spring-warm': {
    label: '봄 웜톤',
    desc: '따뜻하고 밝은 골드 베이스. 맑고 화사한 피부 톤에 코랄·피치·아이보리가 생기를 더해줘요.',
    palette: ['#F9E4C8', '#F4C99A', '#E8A87C', '#D4896A'],
  },
  'summer-cool': {
    label: '여름 쿨톤',
    desc: '차갑고 부드러운 핑크 베이스. 뮤트한 색감과 라벤더·로즈·화이트가 우아함을 완성해요.',
    palette: ['#EDD5E0', '#D4A8C7', '#B8D4D4', '#9BB8D4'],
  },
  'autumn-warm': {
    label: '가을 웜톤',
    desc: '깊고 따뜻한 어스 톤 베이스. 테라코타·버건디·카멜이 성숙하고 고급스러운 분위기를 만들어요.',
    palette: ['#E8C9A0', '#D4A574', '#C4875A', '#A0644A'],
  },
  'winter-cool': {
    label: '겨울 쿨톤',
    desc: '선명하고 차가운 블루 베이스. 순백·블랙·선명한 핑크가 드라마틱하고 시크한 인상을 줘요.',
    palette: ['#E8E8F0', '#C8C8E8', '#D4B8D4', '#B8B8D8'],
  },
}

// ─── 골격 진단 메타 ─────────────────────────────────────────────────────────

const bodyFrameMeta: Record<BodyFrame, { label: string; desc: string }> = {
  straight: {
    label: '스트레이트',
    desc: '어깨~허리~힙이 균형잡히고 두께감이 있어요. 심플하고 구조적인 실루엣이 가장 잘 어울려요.',
  },
  wave: {
    label: '웨이브',
    desc: '어깨가 좁고 허리·힙 곡선이 뚜렷해요. 여성스럽고 섬세한 디테일의 드레스가 빛나요.',
  },
  natural: {
    label: '내추럴',
    desc: '어깨가 넓고 뼈대감이 있어 키가 커 보여요. 여유롭고 자연스러운 실루엣이 핏이에요.',
  },
}

// ─── 드레스 추천 ─────────────────────────────────────────────────────────────

function getDressItems(frame: BodyFrame, mood: Mood): StyleItem[] {
  const dressMap: Record<BodyFrame, StyleItem[]> = {
    straight: [
      {
        id: 'dress-straight-1',
        category: 'dress',
        title: '슬리브리스 컬럼 드레스',
        description: '군더더기 없는 직선 실루엣으로 스트레이트 골격의 균형 잡힌 몸매를 그대로 살려줘요. 고급 새틴 소재가 포인트.',
        keywords: ['심플', '모던', '클린', '고급'],
        emoji: '👗',
        tips: ['깊은 V넥이나 스퀘어넥으로 목선 강조', '새틴·크레이프 소재 추천', '허리 라인 없는 디자인 OK'],
        avoid: ['과도한 러플', '많은 볼륨', '레이어드 스커트'],
      },
      {
        id: 'dress-straight-2',
        category: 'dress',
        title: '머메이드 드레스',
        description: '허리부터 무릎까지 몸을 따라 흐르다 하단에서 퍼지는 실루엣. 스트레이트 골격의 균형감을 극대화해요.',
        keywords: ['섹시', '우아', '드라마틱', '클래식'],
        emoji: '👗',
        tips: ['허리 강조 디테일 추가 가능', '스트레치 소재 편안함', '하이힐로 라인 완성'],
        avoid: ['과도한 퍼프 소매', '넓은 오프숄더'],
      },
    ],
    wave: [
      {
        id: 'dress-wave-1',
        category: 'dress',
        title: '볼드 볼가운 드레스',
        description: '웨이스트를 꼭 잡아주고 스커트가 풍성하게 퍼지는 실루엣. 웨이브 골격의 섬세한 상체와 곡선을 완벽하게 살려줘요.',
        keywords: ['로맨틱', '공주', '페미닌', '드라마틱'],
        emoji: '👰',
        tips: ['코르셋 허리로 곡선 강조', '오프숄더나 스위트하트 넥', '레이어드 튤 소재 추천'],
        avoid: ['너무 타이트한 바디콘', '박시한 실루엣'],
      },
      {
        id: 'dress-wave-2',
        category: 'dress',
        title: '레이스 A라인 드레스',
        description: '어깨부터 부드럽게 퍼지는 A라인. 레이스 소재가 웨이브 골격의 섬세함을 더욱 여성스럽게 표현해요.',
        keywords: ['우아', '로맨틱', '클래식', '섬세'],
        emoji: '👗',
        tips: ['레이스 소재로 여성미 극대화', '플로럴 레이스 포인트', '목선 디테일 강조'],
        avoid: ['완전 심플한 저지 소재', '와이드 벨트'],
      },
    ],
    natural: [
      {
        id: 'dress-natural-1',
        category: 'dress',
        title: '바이어스 컷 드레스',
        description: '사선으로 재단해 몸의 라인을 따라 자연스럽게 흐르는 실루엣. 내추럴 골격의 큰 키와 뼈대감을 세련되게 살려요.',
        keywords: ['미니멀', '시크', '내추럴', '보헤미안'],
        emoji: '👗',
        tips: ['실크·샤르뫼즈 소재 추천', '딥 V백 포인트', '자연스럽게 흘러내리는 실루엣'],
        avoid: ['과도한 볼륨', '짧은 기장'],
      },
      {
        id: 'dress-natural-2',
        category: 'dress',
        title: '보헤미안 플로우 드레스',
        description: '가볍고 부드러운 시폰 소재가 자유롭게 흘러내리는 스타일. 내추럴 골격에 편안하고 예술적인 느낌을 더해요.',
        keywords: ['보헤미안', '자유', '내추럴', '로맨틱'],
        emoji: '🌸',
        tips: ['시폰·오간자 소재', '야외 촬영에 최적', '헤어밴드나 화환 스타일링'],
        avoid: ['타이트한 바디콘', '과도한 구조적 디자인'],
      },
    ],
  }

  return dressMap[frame]
}

// ─── 헤어 추천 ───────────────────────────────────────────────────────────────

function getHairItems(pc: PersonalColor, mood: Mood): StyleItem[] {
  const warmTone = pc === 'spring-warm' || pc === 'autumn-warm'
  const brightTone = pc === 'spring-warm' || pc === 'winter-cool'

  const hairOptions: StyleItem[] = [
    {
      id: 'hair-updo',
      category: 'hair',
      title: '클래식 업스타일',
      description: '목선과 귀걸이를 드러내는 정갈한 업스타일. 티아라나 진주 핀으로 포인트를 주면 완벽해요.',
      keywords: ['클래식', '우아', '포멀', '고급'],
      emoji: '💍',
      tips: ['앞머리 몇 가닥 자연스럽게 내리기', '진주·크리스탈 핀 추천', '귀걸이가 돋보이는 스타일'],
      avoid: ['너무 빡빡한 꽉 묶기'],
    },
    {
      id: 'hair-halfup',
      category: 'hair',
      title: '하프업 웨이브',
      description: '반은 올리고 반은 내린 웨이브 스타일. 로맨틱하면서 자연스러운 느낌으로 어떤 드레스에도 잘 어울려요.',
      keywords: ['로맨틱', '내추럴', '페미닌', '사랑스럽'],
      emoji: '🌸',
      tips: ['S컬 웨이브 열로 만들기', '생화 헤어 액세서리 추천', '앞머리 볼륨감 주기'],
      avoid: ['너무 딱딱하게 고정'],
    },
    {
      id: 'hair-loose-wave',
      category: 'hair',
      title: '루즈 웨이브 다운',
      description: '자연스럽게 웨이브를 살린 다운 스타일. 보헤미안·야외 촬영에 특히 잘 어울리고 편안한 인상을 줘요.',
      keywords: ['보헤미안', '내추럴', '자유', '편안'],
      emoji: '🍃',
      tips: ['소금물 스프레이로 텍스처', '꽃 한 송이 핀 꽂기', '미디엄 컬로 볼륨'],
      avoid: ['과도한 고정 스프레이'],
    },
    {
      id: 'hair-sleek-bun',
      category: 'hair',
      title: '슬릭 로우번',
      description: '매끈하게 빗어 낮은 위치에 고정하는 시크한 번. 모던·미니멀 스타일에 완벽히 어울려요.',
      keywords: ['모던', '미니멀', '시크', '세련'],
      emoji: '✨',
      tips: ['광택 제품으로 매끈하게', '심플한 금속 핀 포인트', '귀걸이로 포인트'],
      avoid: ['과도한 잔머리', '컬 추가'],
    },
  ]

  // 무드에 따라 우선순위 조정
  if (mood === 'classic' || mood === 'minimal') return [hairOptions[0], hairOptions[3]]
  if (mood === 'romantic' || mood === 'vintage') return [hairOptions[1], hairOptions[0]]
  if (mood === 'bohemian') return [hairOptions[2], hairOptions[1]]
  if (mood === 'modern') return [hairOptions[3], hairOptions[0]]

  return [hairOptions[1], hairOptions[0]]
}

// ─── 메이크업 추천 ───────────────────────────────────────────────────────────

function getMakeupItems(pc: PersonalColor): StyleItem[] {
  const makeupMap: Record<PersonalColor, StyleItem[]> = {
    'spring-warm': [
      {
        id: 'makeup-spring-1',
        category: 'makeup',
        title: '피치 코랄 내추럴 메이크업',
        description: '복숭아빛 블러셔와 코랄 립으로 봄처럼 화사하고 생기 있는 얼굴을 만들어요.',
        keywords: ['화사', '밝음', '생기', '자연스럽'],
        emoji: '🍑',
        colorPalette: ['#F9C5A1', '#F4A76A', '#E88A6A'],
        tips: ['아이보리 파운데이션 베이스', '코랄 립 선택', '골드 하이라이터'],
        avoid: ['쿨한 핑크 립', '짙은 보라 아이섀도'],
      },
      {
        id: 'makeup-spring-2',
        category: 'makeup',
        title: '황금빛 글로우 메이크업',
        description: '따뜻한 골드 톤으로 피부 광채를 극대화. 봄 웜톤 특유의 맑은 피부를 환하게 살려줘요.',
        keywords: ['광채', '화사', '글로우', '고급'],
        emoji: '✨',
        colorPalette: ['#F9E4C8', '#F0CC8A', '#E8B870'],
        tips: ['글로우 파운데이션 사용', '샴페인 하이라이터', '피치 블러셔'],
        avoid: ['무광 매트 메이크업', '콜드 톤 파운데이션'],
      },
    ],
    'summer-cool': [
      {
        id: 'makeup-summer-1',
        category: 'makeup',
        title: '로즈 밀크 메이크업',
        description: '뮤트한 로즈 톤으로 여름 쿨톤의 섬세하고 우아한 아름다움을 극대화해요.',
        keywords: ['우아', '섬세', '로맨틱', '소프트'],
        emoji: '🌹',
        colorPalette: ['#EDD5E0', '#D4A8C7', '#C99AB8'],
        tips: ['핑크 베이스 파운데이션', '모브 립 선택', '라벤더 하이라이터'],
        avoid: ['오렌지 계열 립', '과도한 브론저'],
      },
      {
        id: 'makeup-summer-2',
        category: 'makeup',
        title: '소프트 글램 메이크업',
        description: '부드러운 스모키와 핑크 립의 조화. 여름 쿨톤에게 세련된 글램 룩을 선사해요.',
        keywords: ['세련', '글램', '소프트', '우아'],
        emoji: '💄',
        colorPalette: ['#C8B4C8', '#B4A4C4', '#AAAACC'],
        tips: ['라일락 아이섀도 레이어링', '쿨 핑크 립', '실버 하이라이터'],
        avoid: ['따뜻한 브라운 아이섀도', '오렌지 립'],
      },
    ],
    'autumn-warm': [
      {
        id: 'makeup-autumn-1',
        category: 'makeup',
        title: '테라코타 어스 메이크업',
        description: '깊은 어스 톤 아이섀도와 버건디 립으로 가을 웜톤의 고급스러운 분위기를 완성해요.',
        keywords: ['고급', '성숙', '깊이', '어스'],
        emoji: '🍂',
        colorPalette: ['#D4A574', '#C47850', '#A85C3C'],
        tips: ['테라코타 파운데이션', '버건디 or 테라코타 립', '구리색 하이라이터'],
        avoid: ['차가운 핑크', '실버 하이라이터'],
      },
    ],
    'winter-cool': [
      {
        id: 'makeup-winter-1',
        category: 'makeup',
        title: '클리어 시크 메이크업',
        description: '선명한 레드 or 체리 립과 깨끗한 피부 표현. 겨울 쿨톤의 드라마틱한 존재감을 살려줘요.',
        keywords: ['드라마틱', '시크', '선명', '강렬'],
        emoji: '❄️',
        colorPalette: ['#E8E8F0', '#D0D0E8', '#C050A0'],
        tips: ['포슬린 파운데이션', '레드·체리 립', '실버 하이라이터'],
        avoid: ['오렌지 립', '골드 하이라이터', '브론저'],
      },
    ],
  }

  return makeupMap[pc]
}

// ─── 스튜디오 / 촬영 스타일 추천 ────────────────────────────────────────────

function getStudioItems(style: ShootingStyle, mood: Mood): StyleItem[] {
  const studioMap: Record<ShootingStyle, StyleItem> = {
    film: {
      id: 'studio-film',
      category: 'studio',
      title: '필름 감성 스냅',
      description: '필름 카메라 특유의 grain감과 따뜻한 색감으로 빈티지하고 감성적인 사진을 남겨요.',
      keywords: ['필름', '감성', '빈티지', '따뜻'],
      emoji: '📷',
      tips: ['실제 필름 카메라 병행 촬영', '골든아워(해 질 녘) 활용', '프리셋 보정으로 필름 톤 강조'],
      avoid: ['너무 선명한 HDR 보정', '차가운 색보정'],
    },
    clean: {
      id: 'studio-clean',
      category: 'studio',
      title: '화이트 스튜디오 클린',
      description: '순백의 스튜디오 배경에 자연광 느낌의 조명. 드레스와 메이크업이 가장 돋보이는 세팅이에요.',
      keywords: ['깔끔', '화이트', '모던', '명확'],
      emoji: '🤍',
      tips: ['흰 벽 배경 활용', '소품 최소화', '자연광 모방 조명'],
      avoid: ['복잡한 배경', '짙은 컬러 소품'],
    },
    outdoor: {
      id: 'studio-outdoor',
      category: 'studio',
      title: '야외 내추럴 스냅',
      description: '숲, 들판, 바닷가 등 자연 배경에서 진행하는 야외 촬영. 계절감과 자연스러운 표정이 매력이에요.',
      keywords: ['야외', '자연', '내추럴', '계절'],
      emoji: '🌿',
      tips: ['봄이면 꽃밭, 가을이면 단풍 활용', '골든아워 세팅', '바람 활용한 드레스 연출'],
      avoid: ['직사광선 정오 타임', '도심 배경'],
    },
    dramatic: {
      id: 'studio-dramatic',
      category: 'studio',
      title: '드라마틱 조명 스튜디오',
      description: '강한 명암 대비와 특수 조명으로 화보 같은 드라마틱한 사진을 완성해요.',
      keywords: ['드라마틱', '화보', '강렬', '예술'],
      emoji: '🎬',
      tips: ['무드 있는 다크 배경', '스팟 조명 활용', '강한 포즈와 표정'],
      avoid: ['평범한 증명사진식 구도'],
    },
  }

  return [studioMap[style]]
}

// ─── 부케 추천 ───────────────────────────────────────────────────────────────

function getBouquetItem(pc: PersonalColor, mood: Mood): StyleItem {
  const warmPc = pc === 'spring-warm' || pc === 'autumn-warm'
  const coolPc = pc === 'summer-cool' || pc === 'winter-cool'

  if (mood === 'bohemian') {
    return {
      id: 'bouquet-boho',
      category: 'bouquet',
      title: '와일드 보헤미안 부케',
      description: '자연에서 갓 꺾어온 듯 자유롭게 묶은 와일드 부케. 유칼립투스와 라넌큘러스로 자연스럽게.',
      keywords: ['보헤미안', '자연', '와일드', '내추럴'],
      emoji: '🌿',
      tips: ['유칼립투스 그린 활용', '라넌큘러스·아네모네 추천', '끈 대신 리본 마무리'],
      avoid: ['정형화된 둥근 모양', '폼으로 고정된 부케'],
    }
  }

  if (warmPc) {
    return {
      id: 'bouquet-warm',
      category: 'bouquet',
      title: '피치 로즈 라운드 부케',
      description: '복숭아빛과 아이보리 로즈를 중심으로 따뜻한 색감의 꽃들을 풍성하게 모은 클래식 부케.',
      keywords: ['따뜻', '로맨틱', '클래식', '풍성'],
      emoji: '🌸',
      tips: ['피치·살구 계열 로즈', '아이보리 모란', '따뜻한 그린 잎'],
      avoid: ['선명한 레드', '차가운 퍼플'],
    }
  }

  return {
    id: 'bouquet-cool',
    category: 'bouquet',
    title: '화이트 & 라벤더 부케',
    description: '순백의 작약과 라벤더 톤 리시안서스의 조화. 여름·겨울 쿨톤의 맑고 우아한 분위기에 딱.',
    keywords: ['우아', '쿨', '로맨틱', '순수'],
    emoji: '💜',
    tips: ['화이트 작약 메인', '라벤더 리시안서스 포인트', '연보라 리본 마무리'],
    avoid: ['오렌지·옐로우 계열'],
  }
}

// ─── 메인 추천 함수 ──────────────────────────────────────────────────────────

export function generateRecommendations(answers: QuizAnswers): RecommendationResult {
  const { personalColor, bodyFrame, mood, shootingStyle } = answers

  const pc = personalColor ?? 'summer-cool'
  const frame = bodyFrame ?? 'wave'
  const moodVal = mood ?? 'romantic'
  const shooting = shootingStyle ?? 'clean'

  const pcMeta = personalColorMeta[pc]
  const frameMeta = bodyFrameMeta[frame]

  const vibeMap: Record<Mood, string> = {
    romantic: '사랑스럽고 감성적인 로맨틱 웨딩',
    classic: '품격 있고 영원한 클래식 웨딩',
    modern: '세련되고 트렌디한 모던 웨딩',
    bohemian: '자유롭고 개성 있는 보헤미안 웨딩',
    vintage: '복고풍 감성이 물씬 나는 빈티지 웨딩',
    minimal: '절제미 넘치는 미니멀 웨딩',
  }

  const items = [
    ...getDressItems(frame, moodVal),
    ...getHairItems(pc, moodVal),
    ...getMakeupItems(pc),
    ...getStudioItems(shooting, moodVal),
    getBouquetItem(pc, moodVal),
  ]

  return {
    personalColorLabel: pcMeta.label,
    personalColorDesc: pcMeta.desc,
    bodyFrameLabel: frameMeta.label,
    bodyFrameDesc: frameMeta.desc,
    overallVibe: vibeMap[moodVal],
    items,
  }
}

export { personalColorMeta, bodyFrameMeta }
