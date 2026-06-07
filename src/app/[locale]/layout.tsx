import '@/styles/globals.css';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { fontVariables } from '@/app/fonts';
import { routing, type Locale } from '@/i18n/routing';

const siteUrl = 'https://https://eurocomfort.vercel.app/';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const path = isRu ? '/ru' : '/';

  return {
    metadataBase: new URL(siteUrl),
    title: isRu
      ? 'ЕВРО КОМФОРТ — премиальные алюминиевые системы'
      : 'ЄВРО КОМФОРТ — преміальні алюмінієві системи',
    description: isRu
      ? 'Производство и монтаж премиальных алюминиевых и стеклянных систем: панорамное остекление, фасады, раздвижные и нестандартные конструкции.'
      : 'Виробництво та монтаж преміальних алюмінієвих і скляних систем: панорамне скління, фасади, розсувні та нестандартні конструкції.',
    alternates: {
      canonical: path,
      languages: {
        uk: '/',
        ru: '/ru',
        'x-default': '/',
      },
    },
    manifest: '/site.webmanifest',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '48x48' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    openGraph: {
      title: isRu
        ? 'ЕВРО КОМФОРТ — премиальные алюминиевые системы'
        : 'ЄВРО КОМФОРТ — преміальні алюмінієві системи',
      description: isRu
        ? 'Панорамное остекление, фасады, раздвижные и нестандартные алюминиевые системы.'
        : 'Панорамне скління, фасади, розсувні та нестандартні алюмінієві системи.',
      url: path,
      siteName: 'Euro Comfort',
      locale: isRu ? 'ru_UA' : 'uk_UA',
      type: 'website',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={fontVariables}
    >
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
