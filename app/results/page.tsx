'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { generateRecommendations } from '@/lib/recommendations'
import { personalColorMeta } from '@/lib/recommendations'
import type { StyleItem, RecommendationResult } from '@/lib/types'

const categoryLabel: Record<string, string> = {
  dress: '웨딩드레스',
  hair: '헤어스타일',
  makeup: '메이크업',
  studio: '촬영 스타일',
  bouquet: '부케',
  tuxedo: '턱시도',
}

const categoryColor: Record<string, string> = {
  dress: 'bg-blush-100 text-blush-500',
  hair: 'bg-sage-100 text-sage-500',
  makeup: 'bg-cream-200 text-amber-600',
  studio: 'bg-stone-100 text-stone-500',
  bouquet: 'bg-green-50 text-green-600',
  tuxedo: 'bg-slate-100 text-slate-600',
}

function StyleCard({ item, onSave, isSaved }: {
  item: StyleItem
  onSave: (item: StyleItem) => void
  isSaved: boolean
}) {
  const [showDetail, setShowDetail] = useState(false)

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100">
      {/* 카드 헤더 */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{item.emoji}</span>
            <div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor[item.category] ?? 'bg-stone-100 text-stone-500'}`}>
                {categoryLabel[item.category]}
              </span>
              <h3 className="font-semibold text-stone-800 text-sm mt-1">{item.title}</h3>
            </div>
          </div>
          <button
            onClick={() => onSave(item)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isSaved
                ? 'bg-blush-100 text-blush-500'
                : 'bg-stone-50 text-stone-300 hover:bg-stone-100'
            }`}
          >
            {isSaved ? '❤️' : '🤍'}
          </button>
        </div>

        <p className="text-xs text-stone-500 leading-relaxed">{item.description}</p>

        {/* 키워드 태그 */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {item.keywords.map(kw => (
            <span key={kw} className="text-xs bg-cream-100 text-stone-600 px-2 py-0.5 rounded-full">
              #{kw}
            </span>
          ))}
        </div>
      </div>

      {/* 상세 토글 */}
      <button
        onClick={() => setShowDetail(v => !v)}
        className="w-full px-4 py-2.5 text-xs text-stone-400 border-t border-stone-50 flex items-center justify-between hover:bg-stone-50"
      >
        <span>{showDetail ? '접기' : '팁 & 주의사항 보기'}</span>
        <span>{showDetail ? '↑' : '↓'}</span>
      </button>

      {showDetail && (
        <div className="px-4 pb-4 space-y-3">
          {/* 팁 */}
          <div>
            <p className="text-xs font-semibold text-sage-500 mb-1.5">✓ 이렇게 해보세요</p>
            <ul className="space-y-1">
              {item.tips.map(tip => (
                <li key={tip} className="text-xs text-stone-500 flex gap-2">
                  <span className="text-sage-400 flex-shrink-0">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* 주의 */}
          {item.avoid.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-blush-400 mb-1.5">✗ 이건 피하세요</p>
              <ul className="space-y-1">
                {item.avoid.map(av => (
                  <li key={av} className="text-xs text-stone-400 flex gap-2">
                    <span className="text-blush-300 flex-shrink-0">•</span>
                    <span>{av}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* 컬러 팔레트 */}
          {item.colorPalette && (
            <div>
              <p className="text-xs font-semibold text-stone-400 mb-1.5">추천 컬러 팔레트</p>
              <div className="flex gap-2">
                {item.colorPalette.map((color, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className="w-8 h-8 rounded-full border border-stone-100 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[10px] text-stone-300">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ResultsPage() {
  const router = useRouter()
  const { quizAnswers, saveItem, removeItem, isItemSaved } = useStore()
  const [result, setResult] = useState<RecommendationResult | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  useEffect(() => {
    if (!quizAnswers.personalColor) {
      router.push('/quiz')
      return
    }
    const r = generateRecommendations(quizAnswers)
    setResult(r)
  }, [quizAnswers, router])

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">✨</div>
          <p className="text-stone-400 text-sm">스타일 분석 중...</p>
        </div>
      </div>
    )
  }

  const pcMeta = personalColorMeta[quizAnswers.personalColor!]

  const categories = ['all', ...Array.from(new Set(result.items.map(i => i.category)))]

  const filteredItems = activeCategory === 'all'
    ? result.items
    : result.items.filter(i => i.category === activeCategory)

  const handleSaveToggle = (item: StyleItem) => {
    const saved = isItemSaved(item.id)
    if (saved) {
      const { savedItems } = useStore.getState()
      const match = savedItems.find(s => s.item.id === item.id)
      if (match) removeItem(match.id)
    } else {
      saveItem(item)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-cream-50 pb-24">
      {/* 상단 헤더 */}
      <div className="sticky top-0 z-10 bg-cream-50/95 backdrop-blur-sm px-5 pt-12 pb-3">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push('/quiz')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 text-stone-500"
          >
            ←
          </button>
          <h1 className="font-display text-base font-medium text-stone-700">내 웨딩 스타일</h1>
          <Link
            href="/board"
            className="text-xs text-stone-500 bg-white/80 px-3 py-1.5 rounded-full border border-stone-200"
          >
            보드 💖
          </Link>
        </div>
      </div>

      <div className="px-5 space-y-5">
        {/* 진단 요약 카드 */}
        <div className="bg-gradient-to-br from-stone-800 to-stone-700 text-white rounded-3xl p-5">
          <p className="text-xs text-stone-400 mb-3 uppercase tracking-wider">나의 웨딩 프로필</p>

          <div className="flex gap-2 mb-4">
            {/* 퍼스널 컬러 팔레트 */}
            <div className="flex gap-1">
              {pcMeta.palette.map((color, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full border border-white/20"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 w-16 flex-shrink-0">퍼스널 컬러</span>
              <span className="text-sm font-semibold">{result.personalColorLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 w-16 flex-shrink-0">골격 타입</span>
              <span className="text-sm font-semibold">{result.bodyFrameLabel}</span>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-xs text-stone-300 leading-relaxed">{result.personalColorDesc}</p>
          </div>

          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-sm font-medium">🎯 {result.overallVibe}</p>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full transition-all ${
                activeCategory === cat
                  ? 'bg-stone-800 text-white'
                  : 'bg-white text-stone-500 border border-stone-200'
              }`}
            >
              {cat === 'all' ? '전체' : categoryLabel[cat]}
            </button>
          ))}
        </div>

        {/* 스타일 카드 목록 */}
        <div className="space-y-3">
          {filteredItems.map(item => (
            <StyleCard
              key={item.id}
              item={item}
              onSave={handleSaveToggle}
              isSaved={isItemSaved(item.id)}
            />
          ))}
        </div>

        {/* 스타일보드 이동 배너 */}
        <div className="bg-blush-50 border border-blush-200 rounded-2xl p-4 text-center">
          <p className="text-sm font-medium text-stone-700 mb-1">마음에 드는 스타일을 저장했나요?</p>
          <p className="text-xs text-stone-400 mb-3">스타일보드에서 저장한 항목을 비교하고 정리할 수 있어요</p>
          <Link
            href="/board"
            className="inline-block bg-stone-800 text-white text-sm px-6 py-2.5 rounded-xl"
          >
            스타일보드 보기 →
          </Link>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-5 pb-6 pt-3 bg-gradient-to-t from-cream-50 to-transparent">
        <Link
          href="/board"
          className="block w-full bg-stone-800 text-white text-center py-4 rounded-2xl font-medium"
        >
          저장한 스타일 보드 보기 💖
        </Link>
      </div>
    </div>
  )
}
