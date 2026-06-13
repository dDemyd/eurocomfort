import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const htmlCatalogMatch = request.nextUrl.pathname.match(/^(\/ru)?\/catalog\/([^/]+)\.html$/);

  if (htmlCatalogMatch) {
    const url = request.nextUrl.clone();
    url.pathname = `${htmlCatalogMatch[1] || ''}/catalog/${htmlCatalogMatch[2]}`;

    return NextResponse.redirect(url, 308);
  }

  return intlMiddleware(request);
}

export const config = {
  // Локализуем всё, кроме /admin, /api, ассетов и файлов с расширением.
  matcher: [
    '/catalog/:slug*.html',
    '/ru/catalog/:slug*.html',
    '/((?!api|admin|_next|_vercel|.*\\..*).*)',
  ],
};
