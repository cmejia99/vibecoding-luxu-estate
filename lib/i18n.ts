import { cookies } from 'next/headers';
import { i18n, type Locale } from './i18n-config';

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value;
  if (locale && i18n.locales.includes(locale as any)) {
    return locale as Locale;
  }
  return i18n.defaultLocale;
}

export async function getTranslations(locale?: Locale) {
  const targetLocale = locale || await getLocale();
  
  try {
    const messages = (await import(`../messages/${targetLocale}.json`)).default;
    return messages;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${targetLocale}`, error);
    const fallback = (await import(`../messages/${i18n.defaultLocale}.json`)).default;
    return fallback;
  }
}
