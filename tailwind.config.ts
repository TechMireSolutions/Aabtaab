import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['var(--font-jakarta,system-ui)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['var(--font-jakarta,system-ui)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'    },
        },
        fadeInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)'     },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)'    },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)'  },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-up':   'fadeInUp   0.65s cubic-bezier(0.16,1,0.3,1) both',
        'fade-left': 'fadeInLeft 0.65s cubic-bezier(0.16,1,0.3,1) both',
        'scale-in':  'scaleIn    0.5s  cubic-bezier(0.16,1,0.3,1) both',
        shimmer:     'shimmer 3s linear infinite',
        float:       'floatY  4s ease-in-out infinite',
      },
      boxShadow: {
        card:         '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 12px 32px -4px rgb(0 0 0 / 0.11), 0 4px 12px -2px rgb(0 0 0 / 0.06)',
        'cyan-glow':  '0 6px 24px rgba(8,145,178,0.38)',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#0f172a',
            a: { color: '#0891b2' },
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
