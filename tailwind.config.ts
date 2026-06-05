import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0C10',
        surface: '#15171C',
        ink: '#F4F4F1',
        muted: '#8E8E93',
        brand: '#D4AF37',          // gold
        brandShine: '#F4D77A',
        brandDeep: '#A6831F',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        page: '1200px',
      },
    },
  },
  plugins: [typography],
} satisfies Config;
