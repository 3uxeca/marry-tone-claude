'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import type { PersonalColor, BodyFrame, Mood, ShootingStyle } from '@/lib/types'

const TOTAL_STEPS = 5

// ─── 퀴즈 데이터 ──────────────────────────────────────────────────────────────

const steps = [
  {
    step: 1,
    key: 'role',
    title: '먼저, 누구의 스타일을\n찾고 계신가요?',
    subtitle: '각자의 진단 결과에 맞춰 추천드려요',
    type: 'single',
    options: [
      { value: 'bride', label: '예비 신부', emoji: '👰', desc: '드레스, 헤어, 메이크업 추천' },
      { value: 'groom', label: '예비 신랑', emoji: '🤵', desc: '턱시도, 그루밍 스타일 추천' },
    ],
  },
  {
    step: 2,
    key: 'personalColor',
    title: '내 퍼스널 컬러는\n무엇인가요?',
    subtitle: '모르시면 피부 톤 느낌으로 선택해도 OK',
    type: 'single',
    options: [
      {
        value: 'spring-warm',
        label: '봄 웜톤',
        emoji: '🌸',
        desc: '맑고 밝은 피부, 노란 베이스\n코랄·피치·아이보리가 잘 어울림',
        palette: ['#F9C5A1', '#F4A76A', '#E88A6A'],
      },
      {
        value: 'summer-cool',
        label: '여름 쿨톤',
        emoji: '🌊',
        desc: '분홍빛 피부, 붉은 베이스\n라벤더·로즈·파우더 블루가 잘 어울림',
        palette: ['#EDD5E0', '#D4A8C7', '#B8D4D4'],
      },
      {
        value: 'autumn-warm',
        label: '가을 웜톤',
        emoji: '🍂',
        desc: '황금빛 피부, 깊은 노란 베이스\n버건디·카멜·올리브가 잘 어울림',
        palette: ['#E8C9A0', '#C4875A', '#A0644A'],
      },
      {
        value: 'winter-cool',
        label: '겨울 쿨톤',
        emoji: '❄️',
        desc: '창백하거나 선명한 피부, 푸른 베이스\n순백·블랙·선명한 레드가 잘 어울림',
        palette: ['#E8E8F0', '#C8C8E8', '#D4B8D4'],
      },
    ],
  },
  {
    step: 3,
    key: 'bodyFrame',
    title: '내 골격 타입은\n어떤가요?',
    subtitle: '뼈대와 체형 특징으로 구분해요',
    type: 'single',
    options: [
      {
        value: 'straight',
        label: '스트레이트',
        emoji: '📐',
        desc: '어깨·허리·힙이 균형잡히고\n두께감과 탄력이 있는 체형',
        traits: ['허리가 높음', '상체 두께감', '근육질 라인'],
      },
      {
        value: 'wave',
        label: '웨이브',
        emoji: '〰️',
        desc: '어깨가 좁고 허리·힙 곡선이\n뚜렷하게 드러나는 체형',
        traits: ['좁은 어깨', '가는 허리', '뚜렷한 힙 라인'],
      },
      {
        value: 'natural',
        label: '내추럴',
        emoji: '🌿',
        desc: '어깨가 넓고 뼈대감이 있어\n키가 크고 여유있어 보이는 체형',
        traits: ['넓은 어깨', '긴 팔다리', '각진 라인'],
      },
    ],
  },
  {
    step: 4,
    key: 'mood',
    title: '원하는 웨딩 분위기는\n무엇인가요?',
    subtitle: '여러 개 중 가장 끌리는 하나를 선택하세요',
    type: 'single',
    options: [
      { value: 'romantic', label: '로맨틱', emoji: '🌹', desc: '꽃, 레이스, 달콤하고 사랑스러운 분위기' },
      { value: 'classic', label: '클래식', emoji: '🏛️', desc: '우아하고 품격 있는 전통적인 아름다움' },
      { value: 'modern', label: '모던', emoji: '◻️', desc: '심플하고 세련된 현대적 스타일' },
      { value: 'bohemian', label: '보헤미안', emoji: '🌾', desc: '자유롭고 자연스러운 야외 감성' },
      { value: 'vintage', label: '빈티지', emoji: '📷', desc: '필름 감성, 레트로한 복고풍 무드' },
      { value: 'minimal', label: '미니멀', emoji: '🤍', desc: '군더더기 없이 절제된 깔끔한 스타일' },
    ],
  },
  {
    step: 5,
    key: 'shootingStyle',
    title: '어떤 사진을\n남기고 싶으세요?',
    subtitle: '스튜디오 & 촬영 스타일을 선택해주세요',
    type: 'single',
    options: [
      { value: 'film', label: '필름 감성', emoji: '🎞️', desc: 'grain감과 따뜻한 색감의 아날로그 스냅' },
      { value: 'clean', label: '깔끔 화이트', emoji: '🤍', desc: '깨끗한 배경에 드레스가 돋보이는 정통 스튜디오' },
      { value: 'outdoor', label: '야외 내추럴', emoji: '🌿', desc: '자연 속에서 계절감을 담은 야외 촬영' },
      { value: 'dramatic', label: '드라마틱', emoji: '🎬', desc: '강한 조명과 무드로 화보 같은 사진' },
    ],
  },
]

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────

export default function QuizPage() {
  const router = useRouter()
  const { quizAnswers, setQuizAnswer } = useStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [animating, setAnimating] = useState(false)

  const stepData = steps[currentStep - 1]
  const progress = (currentStep / TOTAL_STEPS) * 100

  const currentValue = quizAnswers[stepData.key as keyof typeof quizAnswers]

  const handleSelect = (value: string) => {
    setQuizAnswer(stepData.key as keyof typeof quizAnswers, value as never)
  }

  const handleNext = () => {
    if (!currentValue) return
    if (currentStep === TOTAL_STEPS) {
      router.push('/results')
      return
    }
    setAnimating(true)
    setTimeout(() => {
      setCurrentStep(s => s + 1)
      setAnimating(false)
    }, 200)
  }

  const handleBack = () => {
    if (currentStep === 1) {
      router.push('/')
      return
    }
    setAnimating(true)
    setTimeout(() => {
      setCurrentStep(s => s - 1)
      setAnimating(false)
    }, 200)
  }

  return (
    <div className="flex flex-col min-h-screen bg-cream-50">
      {/* 상단 헤더 */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={handleBack}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 text-stone-500 hover:bg-white"
          >
            ←
          </button>
          <span className="text-xs text-stone-400 font-medium">
            {currentStep} / {TOTAL_STEPS}
          </span>
          <div className="w-9" />
        </div>

        {/* 프로그레스 바 */}
        <div className="w-full bg-stone-100 rounded-full h-1.5">
          <div
            className="bg-stone-700 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 퀴즈 콘텐츠 */}
      <div
        className={`flex-1 px-5 transition-opacity duration-200 ${animating ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* 질문 */}
        <div className="mb-6 pt-2">
          <h2 className="font-display text-2xl font-medium text-stone-800 leading-snug mb-2 whitespace-pre-line">
            {stepData.title}
          </h2>
          <p className="text-sm text-stone-400">{stepData.subtitle}</p>
        </div>

        {/* 선택지 */}
        <div className="space-y-3">
          {stepData.options.map((option) => {
            const isSelected = currentValue === option.value
            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 ${
                  isSelected
                    ? 'border-stone-700 bg-stone-800 text-white shadow-md scale-[1.01]'
                    : 'border-stone-100 bg-white hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">{option.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-stone-800'}`}>
                        {option.label}
                      </p>
                      {isSelected && (
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">선택됨</span>
                      )}
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed whitespace-pre-line ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                      {'desc' in option ? option.desc : ''}
                    </p>

                    {/* 퍼스널 컬러 팔레트 */}
                    {'palette' in option && option.palette && (
                      <div className="flex gap-1.5 mt-2">
                        {option.palette.map((color, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full border border-white/50"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    )}

                    {/* 골격 특징 태그 */}
                    {'traits' in option && option.traits && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {option.traits.map((trait) => (
                          <span
                            key={trait}
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              isSelected ? 'bg-white/20 text-stone-200' : 'bg-stone-100 text-stone-500'
                            }`}
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="px-5 pb-10 pt-4">
        <button
          onClick={handleNext}
          disabled={!currentValue}
          className={`w-full py-4 rounded-2xl font-medium text-base transition-all duration-200 ${
            currentValue
              ? 'bg-stone-800 text-white hover:bg-stone-700 active:scale-95'
              : 'bg-stone-100 text-stone-300 cursor-not-allowed'
          }`}
        >
          {currentStep === TOTAL_STEPS ? '결과 보기 ✨' : '다음으로 →'}
        </button>
      </div>
    </div>
  )
}
