/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      colors: {
        base:     '#0a0c10',
        surface:  '#111318',
        elevated: '#181b22',
        hover:    '#1e2230',
        line:     '#252935',
        'line-subtle': '#1a1e28',
        't1': '#e8eaf0',
        't2': '#8b90a0',
        't3': '#4f5468',
        accent:  '#5b8fff',
        'accent-h': '#7aa4ff',
        jade:    '#34d399',   // present / success
        rose:    '#f87171',   // absent / error
        gold:    '#fbbf24',   // warning / unmarked
      },
      animation: {
        'fade-up':  'fadeUp 0.3s ease both',
        'fade-in':  'fadeIn 0.2s ease both',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
        'dot-pulse': 'dotPulse 1s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px) scale(0.97)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        dotPulse: {
          '0%, 100%': { opacity: '1',  transform: 'scale(1)' },
          '50%':      { opacity: '0.4', transform: 'scale(0.7)' },
        },
      },
      boxShadow: {
        'glow-accent': '0 0 20px rgba(91, 143, 255, 0.15)',
        'card':  '0 4px 16px rgba(0,0,0,0.5)',
        'modal': '0 8px 40px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}

