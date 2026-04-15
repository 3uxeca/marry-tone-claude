'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/store/useStore'
import type { SavedItem } from '@/lib/types'

const categoryLabel: Record<string, string> = {
  dress: '웨딩드레스',
  hair: '헤어스타일',
  makeup: '메이크업',
  studio: '촬영 스타일',
  bouquet: '부케',
  tuxedo: '턱시도',
}

const rankLabel = { 1: '🥇 1순위', 2: '🥈 2순위', 3: '🥉 3순위' }
const rankColors = {
  1: 'bg-amber-50 border-amber-200 text-amber-700',
  2: 'bg-stone-50 border-stone-200 text-stone-600',
  3: 'bg-orange-50 border-orange-200 text-orange-600',
}

function BoardCard({
  saved,
  onRemove,
  onNoteChange,
  onRankChange,
  compareSelected,
  onCompareToggle,
}: {
  saved: SavedItem
  onRemove: () => void
  onNoteChange: (note: string) => void
  onRankChange: (rank: 1 | 2 | 3) => void
  compareSelected: boolean
  onCompareToggle: () => void
}) {
  const [editingNote, setEditingNote] = useState(false)
  const [noteText, setNoteText] = useState(saved.note ?? '')
  const [showRankMenu, setShowRankMenu] = useState(false)

  const handleNoteSave = () => {
    onNoteChange(noteText)
    setEditingNote(false)
  }

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden border-2 transition-all ${
        compareSelected ? 'border-stone-700 shadow-md' : 'border-stone-100'
      }`}
    >
      {/* 카드 상단 */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{saved.item.emoji}</span>
            <div>
              <span className="text-xs text-stone-400">{categoryLabel[saved.item.category]}</span>
              <h3 className="text-sm font-semibold text-stone-800">{saved.item.title}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* 비교 선택 */}
            <button
              onClick={onCompareToggle}
              className={`text-xs px-2 py-1 rounded-full border transition-all ${
                compareSelected
                  ? 'bg-stone-800 text-white border-stone-800'
                  : 'border-stone-200 text-stone-400'
              }`}
            >
              비교
            </button>
            {/* 삭제 */}
            <button
              onClick={onRemove}
              className="w-7 h-7 flex items-center justify-center text-stone-300 hover:text-blush-400"
            >
              ✕
            </button>
          </div>
        </div>

        <p className="text-xs text-stone-500 leading-relaxed mb-3">{saved.item.description}</p>

        {/* 키워드 태그 */}
        <div className="flex flex-wrap gap-1 mb-3">
          {saved.item.keywords.map(kw => (
            <span key={kw} className="text-xs bg-cream-100 text-stone-500 px-2 py-0.5 rounded-full">
              #{kw}
            </span>
          ))}
        </div>

        {/* 순위 설정 */}
        <div className="relative">
          <button
            onClick={() => setShowRankMenu(v => !v)}
            className={`text-xs px-3 py-1 rounded-full border ${
              saved.rank ? rankColors[saved.rank] : 'border-stone-200 text-stone-400'
            }`}
          >
            {saved.rank ? rankLabel[saved.rank] : '+ 순위 설정'}
          </button>
          {showRankMenu && (
            <div className="absolute top-8 left-0 z-10 bg-white rounded-xl shadow-lg border border-stone-100 p-2 flex gap-1">
              {([1, 2, 3] as const).map(r => (
                <button
                  key={r}
                  onClick={() => { onRankChange(r); setShowRankMenu(false) }}
                  className={`text-xs px-3 py-1.5 rounded-lg border ${rankColors[r]}`}
                >
                  {rankLabel[r]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 메모 영역 */}
      <div className="border-t border-stone-50 px-4 py-3">
        {editingNote ? (
          <div className="space-y-2">
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="이 스타일에 대한 메모를 남겨요..."
              className="w-full text-xs text-stone-600 bg-stone-50 rounded-lg p-2 resize-none border border-stone-200 focus:outline-none focus:border-stone-400"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleNoteSave}
                className="text-xs bg-stone-800 text-white px-3 py-1 rounded-lg"
              >
                저장
              </button>
              <button
                onClick={() => { setNoteText(saved.note ?? ''); setEditingNote(false) }}
                className="text-xs text-stone-400"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setEditingNote(true)}
            className="w-full text-left"
          >
            {saved.note ? (
              <p className="text-xs text-stone-500 leading-relaxed">{saved.note}</p>
            ) : (
              <p className="text-xs text-stone-300">+ 메모 추가하기...</p>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── 비교 뷰 ─────────────────────────────────────────────────────────────────

function CompareView({ items, onClose }: { items: SavedItem[]; onClose: () => void }) {
  if (items.length !== 2) return null
  const [a, b] = items

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end">
      <div className="w-full max-w-md mx-auto bg-cream-50 rounded-t-3xl p-5 pb-10 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-medium text-stone-800">나란히 비교</h2>
          <button onClick={onClose} className="text-stone-400 text-xl">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[a, b].map((saved, idx) => (
            <div key={saved.id} className="bg-white rounded-2xl p-3 border border-stone-100">
              <div className={`text-center mb-2 text-xs font-bold ${idx === 0 ? 'text-blush-400' : 'text-sage-500'}`}>
                {idx === 0 ? '옵션 A' : '옵션 B'}
              </div>
              <div className="text-center mb-2">
                <span className="text-2xl">{saved.item.emoji}</span>
                <p className="text-xs font-semibold text-stone-700 mt-1">{saved.item.title}</p>
                <p className="text-[10px] text-stone-400 mt-0.5">{categoryLabel[saved.item.category]}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-semibold text-stone-400 uppercase">키워드</p>
                {saved.item.keywords.map(kw => (
                  <span key={kw} className="inline-block text-[10px] bg-cream-100 text-stone-500 px-1.5 py-0.5 rounded-full mr-1 mb-1">
                    #{kw}
                  </span>
                ))}
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-[10px] font-semibold text-sage-500">추천</p>
                {saved.item.tips.slice(0, 2).map(tip => (
                  <p key={tip} className="text-[10px] text-stone-400">• {tip}</p>
                ))}
              </div>
              {saved.note && (
                <div className="mt-2 bg-cream-50 rounded-lg p-2">
                  <p className="text-[10px] text-stone-500 italic">💬 {saved.note}</p>
                </div>
              )}
              {saved.rank && (
                <div className={`mt-2 text-center text-[10px] py-1 rounded-full border ${rankColors[saved.rank]}`}>
                  {rankLabel[saved.rank]}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 bg-stone-800 text-white py-3 rounded-2xl text-sm font-medium"
        >
          닫기
        </button>
      </div>
    </div>
  )
}

// ─── 메인 보드 페이지 ─────────────────────────────────────────────────────────

export default function BoardPage() {
  const { savedItems, removeItem, updateNote, setRank, compareItems, toggleCompare, clearCompare } = useStore()
  const [showCompare, setShowCompare] = useState(false)
  const [filterCategory, setFilterCategory] = useState('all')

  const categories = ['all', ...Array.from(new Set(savedItems.map(s => s.item.category)))]

  const filtered = filterCategory === 'all'
    ? savedItems
    : savedItems.filter(s => s.item.category === filterCategory)

  // 순위별 정렬: 1→2→3→없음
  const sorted = [...filtered].sort((a, b) => {
    if (a.rank && b.rank) return a.rank - b.rank
    if (a.rank) return -1
    if (b.rank) return 1
    return 0
  })

  const compareSelectedItems = savedItems.filter(s => compareItems.includes(s.id))

  return (
    <div className="flex flex-col min-h-screen bg-cream-50 pb-24">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-cream-50/95 backdrop-blur-sm px-5 pt-12 pb-3">
        <div className="flex items-center justify-between mb-3">
          <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 text-stone-500">
            ←
          </Link>
          <h1 className="font-display text-base font-medium text-stone-700">스타일보드</h1>
          <Link href="/results" className="text-xs text-stone-500 bg-white/80 px-3 py-1.5 rounded-full border border-stone-200">
            결과 ✨
          </Link>
        </div>

        {/* 카테고리 필터 */}
        {savedItems.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full transition-all ${
                  filterCategory === cat
                    ? 'bg-stone-800 text-white'
                    : 'bg-white text-stone-500 border border-stone-200'
                }`}
              >
                {cat === 'all' ? `전체 (${savedItems.length})` : categoryLabel[cat]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 space-y-4">
        {/* 비교 플로팅 배너 */}
        {compareItems.length > 0 && (
          <div className="bg-stone-800 text-white rounded-2xl p-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold">
                {compareItems.length === 2 ? '비교 준비 완료 ✓' : `비교할 항목 1개 더 선택`}
              </p>
              <p className="text-[10px] text-stone-300 mt-0.5">{compareSelectedItems.map(s => s.item.title).join(' vs ')}</p>
            </div>
            <div className="flex gap-2">
              {compareItems.length === 2 && (
                <button
                  onClick={() => setShowCompare(true)}
                  className="text-xs bg-white text-stone-800 px-3 py-1.5 rounded-xl font-medium"
                >
                  비교하기
                </button>
              )}
              <button onClick={clearCompare} className="text-xs text-stone-400">
                취소
              </button>
            </div>
          </div>
        )}

        {/* 빈 상태 */}
        {savedItems.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">💝</div>
            <p className="text-stone-500 font-medium mb-2">아직 저장된 스타일이 없어요</p>
            <p className="text-xs text-stone-400 mb-6">퀴즈를 완료하고 마음에 드는 스타일을 저장해보세요</p>
            <Link
              href="/quiz"
              className="inline-block bg-stone-800 text-white px-6 py-3 rounded-2xl text-sm font-medium"
            >
              스타일 퀴즈 시작 →
            </Link>
          </div>
        )}

        {/* 카드 목록 */}
        {sorted.map(saved => (
          <BoardCard
            key={saved.id}
            saved={saved}
            onRemove={() => removeItem(saved.id)}
            onNoteChange={note => updateNote(saved.id, note)}
            onRankChange={rank => setRank(saved.id, rank)}
            compareSelected={compareItems.includes(saved.id)}
            onCompareToggle={() => toggleCompare(saved.id)}
          />
        ))}

        {/* 더 탐색하기 */}
        {savedItems.length > 0 && (
          <div className="text-center py-4">
            <Link href="/results" className="text-xs text-stone-400 underline underline-offset-2">
              + 더 많은 스타일 탐색하기
            </Link>
          </div>
        )}
      </div>

      {/* 비교 뷰 모달 */}
      {showCompare && (
        <CompareView
          items={compareSelectedItems}
          onClose={() => { setShowCompare(false); clearCompare() }}
        />
      )}

      {/* 하단 탭바 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur border-t border-stone-100 px-5 py-3">
        <div className="flex justify-around">
          <Link href="/" className="flex flex-col items-center gap-0.5 text-stone-400">
            <span className="text-lg">🏠</span>
            <span className="text-[10px]">홈</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center gap-0.5 text-stone-400">
            <span className="text-lg">✨</span>
            <span className="text-[10px]">퀴즈</span>
          </Link>
          <Link href="/results" className="flex flex-col items-center gap-0.5 text-stone-400">
            <span className="text-lg">🎯</span>
            <span className="text-[10px]">결과</span>
          </Link>
          <Link href="/board" className="flex flex-col items-center gap-0.5 text-stone-800">
            <span className="text-lg">💖</span>
            <span className="text-[10px] font-semibold">보드</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
