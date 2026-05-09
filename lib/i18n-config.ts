export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'es', 'fr'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

export const languages = [
  { code: 'en', name: 'English', flag: 'https://flagcdn.com/w40/us.png' },
  { code: 'es', name: 'Español', flag: 'https://flagcdn.com/w40/es.png' },
  { code: 'fr', name: 'Français', flag: 'https://flagcdn.com/w40/fr.png' },
];
