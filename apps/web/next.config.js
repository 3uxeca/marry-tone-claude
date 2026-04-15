/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // 서버→서버 프록시: 브라우저는 /api/* 호출 → Next.js가 API 서버로 중계
    // NEXT_PUBLIC_API_URL 빌드타임 bake-in 문제를 우회하고 CORS도 해결
    const apiBase = process.env.API_URL ?? 'http://localhost:4060'
    return [
      {
        source: '/api/:path*',
        destination: `${apiBase}/api/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
