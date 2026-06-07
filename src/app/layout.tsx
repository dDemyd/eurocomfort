import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter_Tight, Jost, JetBrains_Mono } from 'next/font/google';

const display = Inter_Tight({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700', '800', '900'],
  variable: '--ff-display',
  display: 'swap',
});

const body = Jost({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500'],
  variable: '--ff-body',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  variable: '--ff-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ЄВРО КОМФОРТ — преміальні алюмінієві системи',
  description:
    'Виробництво та монтаж преміальних алюмінієвих і скляних систем: панорамне скління, фасади, розсувні та нестандартні конструкції.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="uk"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
