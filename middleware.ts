import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './lib/i18n-config';

export function middleware(request: NextRequest) {
  const locale = request.cookies.get('NEXT_LOCALE')?.value;

  // If locale is already set and valid, do nothing
  if (locale && i18n.locales.includes(locale as any)) {
    return NextResponse.next();
  }

  // Otherwise, detect from headers or use default
  const acceptLanguage = request.headers.get('accept-language');
  let detectedLocale = i18n.defaultLocale;

  if (acceptLanguage) {
    const languages = acceptLanguage.split(',').map(l => l.split(';')[0].split('-')[0]);
    const matched = languages.find(l => i18n.locales.includes(l as any));
    if (matched) detectedLocale = matched;
  }

  const response = NextResponse.next();
  response.cookies.set('NEXT_LOCALE', detectedLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return response;
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
