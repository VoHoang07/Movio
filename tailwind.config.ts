import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FFF8EE',
        surface: '#FFFFFF',
        primary: '#6F8F4E',
        'primary-dark': '#3F6B35',
        secondary: '#F4C95D',
        'accent-blue': '#A9D6E5',
        'accent-purple': '#DCC7FF',
        'accent-pink': '#FFD6E0',
        'accent-orange': '#FFB86B',
        text: '#2E2A27',
        muted: '#7A7068',
        success: '#4CAF50',
        error: '#EF5350',
        warning: '#FFB86B',
      },
      boxShadow: { card: '0 18px 45px rgba(63,107,53,.10)', soft: '0 18px 45px rgba(63,107,53,.10)' },
    },
  },
} satisfies Config;
