'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-cream-100 to-cream-50">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8 text-center">
        {/* 로고 & 타이틀 */}
        <div className="mb-8">
          <div className="text-5xl mb-4">💍</div>
          <h1 className="font-display text-4xl font-medium text-stone-800 leading-tight mb-2">
            마리톤
          </h1>
          <p className="text-sm tracking-[0.3em] text-stone-400 uppercase">Marry Tone</p>
        </div>

        {/* 메인 카피 */}
        <div className="mb-10">
          <h2 className="text-xl font-medium text-stone-700 leading-relaxed mb-3">
            나에게 가장 어울리는<br />
            웨딩 스타일을 찾아드려요
          </h2>
          <p className="text-sm text-stone-500 leading-relaxed max-w-xs mx-auto">
            퍼스널 컬러와 골격 진단을 바탕으로<br />
            드레스·헤어·메이크업·스튜디오까지<br />
            딱 맞는 스타일을 추천해드릴게요
          </p>
        </div>

        {/* 특징 카드 3개 */}
        <div className="w-full space-y-3 mb-10">
          {[
            { emoji: '🎨', title: '퍼스널 컬러 분석', desc: '내 피부 톤에 맞는 색상 가이드' },
            { emoji: '✨', title: '골격별 스타일 추천', desc: '내 체형을 가장 예쁘게 보이는 드레스' },
            { emoji: '📋', title: '스타일보드 정리', desc: '마음에 드는 것 저장하고 비교하기' },
          ].map((feature) => (
            <div
              key={feature.title}
              className="flex items-center gap-4 bg-white/70 rounded-2xl px-4 py-3 text-left"
            >
              <span className="text-2xl">{feature.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-stone-700">{feature.title}</p>
                <p className="text-xs text-stone-400">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="w-full space-y-3">
          <Link
            href="/quiz"
            className="block w-full bg-stone-800 text-white text-center py-4 rounded-2xl font-medium text-base hover:bg-stone-700 active:scale-95"
          >
            퀴즈 시작하기 →
          </Link>
          <Link
            href="/board"
            className="block w-full bg-white/80 text-stone-600 text-center py-3.5 rounded-2xl text-sm border border-stone-200 hover:bg-white active:scale-95"
          >
            스타일보드 보기 💖
          </Link>
        </div>
      </div>

      {/* 하단 힌트 */}
      <div className="text-center pb-8">
        <p className="text-xs text-stone-300">약 3분이면 완성 · 결과는 저장됩니다</p>
      </div>
    </main>
  )
}
