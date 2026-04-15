import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full text-center flex flex-col gap-8">
        {/* Wordmark */}
        <div>
          <h1 className="font-display text-4xl text-stone-800 tracking-tight">MarryTone</h1>
          <p className="mt-2 text-sm text-stone-500">나만의 웨딩 스타일을 찾아드려요</p>
        </div>

        {/* Blush accent decoration */}
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-blush" />
          <div className="w-2 h-2 rounded-full bg-accent-sage" />
          <div className="w-2 h-2 rounded-full bg-accent-blush" />
        </div>

        {/* Feature bullets */}
        <div className="text-left flex flex-col gap-3">
          {[
            { icon: '🎨', text: '퍼스널 컬러 & 골격 진단' },
            { icon: '👗', text: '나에게 맞는 스드메 추천' },
            { icon: '💑', text: '커플 스타일 합의' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <span className="text-lg">{icon}</span>
              <span className="text-sm text-stone-700">{text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="w-full py-4 bg-stone-800 text-white rounded-full text-sm font-semibold text-center active:scale-95 transition-transform"
          >
            시작하기
          </Link>
          <Link
            href="/login"
            className="text-xs text-stone-400 text-center"
          >
            이미 계정이 있으신가요? 로그인
          </Link>
        </div>
      </div>
    </main>
  )
}
