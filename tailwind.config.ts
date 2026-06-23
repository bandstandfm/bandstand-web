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
        // Marquee display lockup: tall narrow caps. Used for "BANDSTAND"
        // wordmark and big page H1s.
        display: ['var(--font-display)', 'Impact', 'Haettenschweiler', 'Arial Narrow Bold', 'sans-serif'],
        // Chunky condensed caps used under the wordmark for city accents
        // ("Chicago", "New York", "Washington DC", "Kansas City").
        accent: ['var(--font-accent)', 'Impact', 'Haettenschweiler', 'Arial Narrow Bold', 'sans-serif'],
        // Legacy serif — kept for the few prose accents that still want it.
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
