import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    './widgets/**/*.{js,ts,jsx,tsx,mdx}',
    './entities/**/*.{js,ts,jsx,tsx,mdx}',
    './shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base backgrounds
        page: '#fdfbf7',
        surface: '#ffffff',
        'surface-muted': '#f5f0e8',

        // Brand cream palette
        cream: {
          100: '#faf5ec',
          200: '#f5ead8',
          400: '#e0c99a',
        },

        // Semantic accents
        blush: {
          DEFAULT: '#f6d0d0',
          light: '#fbe8e8',
        },
        sage: {
          DEFAULT: '#c8d9c8',
          light: '#e6ede6',
        },
        mauve: {
          DEFAULT: '#c9a9c9',
        },

        // Extended stone palette (Tailwind already has stone, but custom overrides)
        stone: {
          50:  '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
      },
      backgroundColor: {
        page: '#fdfbf7',
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
