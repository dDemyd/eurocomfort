import { Inter_Tight, JetBrains_Mono, Onest } from 'next/font/google';

export const display = Inter_Tight({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700', '800', '900'],
  variable: '--ff-display',
  display: 'swap',
});

export const body = Onest({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  variable: '--ff-body',
  display: 'swap',
});

export const mono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  variable: '--ff-mono',
  display: 'swap',
});

export const fontVariables = `${display.variable} ${body.variable} ${mono.variable}`;
