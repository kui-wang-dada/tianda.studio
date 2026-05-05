import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0e1116',
        panel: '#151a22',
        line: '#1f2630',
        ink: '#e6edf3',
        muted: '#8b95a5',
        brand: '#3b82f6',
      },
    },
  },
  plugins: [],
} satisfies Config
