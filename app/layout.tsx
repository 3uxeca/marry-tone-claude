import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '마리톤 | 나에게 맞는 웨딩 스타일 찾기',
  description: '퍼스널 컬러와 골격 진단으로 찾는 나만의 웨딩 스타일. 드레스, 헤어, 메이크업, 스튜디오까지 한번에.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-cream-50">
        <div className="mx-auto max-w-md min-h-screen relative">
          {children}
        </div>
      </body>
    </html>
  )
}
