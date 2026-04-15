import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'MarryTone',
  description: '나만의 스타일 어드바이저',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-page font-sans text-stone-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
