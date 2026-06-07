import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1440px' },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A0A0A',
          2: '#525252',
        },
        paper: '#FFFFFF',
        ash: '#F4F4F4',
        hair: {
          d: '#262626',
          l: '#E5E5E5',
        },
        brand: {
          DEFAULT: '#E11D2A',
          dk: '#B5141F',
        },
        // shadcn-style aliases (на будущее под shadcn-компоненты)
        border: '#E5E5E5',
        background: '#FFFFFF',
        foreground: '#0A0A0A',
        primary: { DEFAULT: '#E11D2A', foreground: '#FFFFFF' },
        secondary: { DEFAULT: '#F4F4F4', foreground: '#0A0A0A' },
        muted: { DEFAULT: '#F4F4F4', foreground: '#525252' },
        accent: { DEFAULT: '#F4F4F4', foreground: '#0A0A0A' },
        destructive: { DEFAULT: '#E11D2A', foreground: '#FFFFFF' },
        card: { DEFAULT: '#FFFFFF', foreground: '#0A0A0A' },
        input: '#E5E5E5',
        ring: '#E11D2A',
      },
      fontFamily: {
        display: ['var(--ff-display)', 'sans-serif'],
        body: ['var(--ff-body)', 'sans-serif'],
        mono: ['var(--ff-mono)', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter2: '-0.03em',
        tight2: '-0.02em',
        mono: '0.16em',
        monoXl: '0.2em',
        monoXxl: '0.26em',
      },
      transitionTimingFunction: {
        ease: 'cubic-bezier(.22,.61,.36,1)',
      },
      borderRadius: {
        none: '0',
        DEFAULT: '0',
        lg: '0',
        md: '0',
        sm: '0',
      },
      maxWidth: {
        wrap: '1440px',
      },
    },
  },
  plugins: [animate],
};

export default config;
