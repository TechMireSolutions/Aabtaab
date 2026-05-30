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
        primary: {
          50:  '#eef2ff',
          100: '#dce8ff',
          200: '#bad0ff',
          500: '#1e4080',
          600: '#1a3570',
          700: '#162d60',
          800: '#112350',
          900: '#0d1a3f',
        },
        gold: {
          400: '#e2b84a',
          500: '#d4a020',
          600: '#b88a10',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1a1a2e',
            a: { color: '#1e4080' },
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
