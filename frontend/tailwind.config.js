/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme tokens — switch via CSS variables in index.css
        'th-bg':      'var(--c-bg)',
        'th-surface': 'var(--c-surface)',
        'th-surf2':   'var(--c-surf2)',
        'th-text':    'var(--c-text1)',
        'th-text2':   'var(--c-text2)',
        'th-text3':   'var(--c-text3)',
        'th-border':  'var(--c-border)',
        'th-bord2':   'var(--c-bord2)',
        'th-glass':   'var(--c-glass)',
        'th-glassh':  'var(--c-glassh)',
        gold: {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        navy: {
          700: '#1e3a5f',
          800: '#122d4f',
          900: '#0a1e35',
          950: '#060f1d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      }
    },
  },
  plugins: [],
}
