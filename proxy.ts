import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './lib/i18n-config';
import { updateSession } from '@/utils/supabase/middleware';

export async function proxy(request: NextRequest) {
  const locale = request.cookies.get('NEXT_LOCALE')?.value;

  // Update Supabase session
  const { supabaseResponse, supabase } = await updateSession(request);

  // Protected Admin Routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', request.nextUrl.pathname);
      const response = NextResponse.redirect(url);
      // Ensure session cookies are preserved
      supabaseResponse.cookies.getAll().forEach(({ name, value, ...options }) => response.cookies.set(name, value, options));
      return response;
    }

    // Fetch profile with error handling
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const isAdmin = profile?.role === 'admin' || user.email === 'cmejia99@gmail.com';

    if (!isAdmin) {
      const response = NextResponse.redirect(new URL('/', request.url));
      // Ensure session cookies are preserved
      supabaseResponse.cookies.getAll().forEach(({ name, value, ...options }) => response.cookies.set(name, value, options));
      return response;
    }
  }

  // If locale is already set and valid, just return the supabaseResponse
  if (locale && i18n.locales.includes(locale as any)) {
    return supabaseResponse;
  }

  // Otherwise, detect from headers or use default
  const acceptLanguage = request.headers.get('accept-language');
  let detectedLocale = i18n.defaultLocale;

  if (acceptLanguage) {
    const languages = acceptLanguage.split(',').map(l => l.split(';')[0].split('-')[0]);
    const matched = languages.find(l => i18n.locales.includes(l as any));
    if (matched) detectedLocale = matched;
  }

  supabaseResponse.cookies.set('NEXT_LOCALE', detectedLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return supabaseResponse;
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
