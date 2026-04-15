import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfbf7',
          100: '#faf5ec',
          200: '#f5ead8',
          300: '#edddc0',
          400: '#e0c99a',
          500: '#d4b578',
        },
        blush: {
          50: '#fdf4f4',
          100: '#fbe8e8',
          200: '#f6d0d0',
          300: '#eeabab',
          400: '#e07878',
          500: '#c85555',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e6ede6',
          200: '#c8d9c8',
          300: '#9db99d',
          400: '#6d966d',
          500: '#4a744a',
        },
        champagne: '#f7e7ce',
        ivory: '#fffff0',
        dustyrose: '#dcb4b4',
        mauve: '#c9a9c9',
      },
      fontFamily: {
        sans: ['var(--font-pretendard)', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config
