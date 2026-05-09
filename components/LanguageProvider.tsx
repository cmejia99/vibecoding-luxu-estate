'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { type Locale } from '@/lib/i18n-config';

type Translations = { [key: string]: any };

interface LanguageContextType {
  locale: Locale;
  t: (key: string, params?: { [key: string]: any }) => string;
  setLocale: (locale: Locale) => void;
  translations: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ 
  children, 
  initialLocale, 
  initialMessages 
}: { 
  children: React.ReactNode;
  initialLocale: Locale;
  initialMessages: Translations;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [translations, setTranslations] = useState<Translations>(initialMessages);

  const setLocale = async (newLocale: Locale) => {
    // Set cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    setLocaleState(newLocale);
    
    // Refresh page to apply changes server-side
    window.location.reload();
  };

  const t = (key: string, params?: { [key: string]: any }) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      value = value?.[k];
    }

    if (typeof value !== 'string') return key;

    if (params) {
      let result = value;
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        // Simple pluralization support
        if (result.includes('{count, plural')) {
          const pluralRegex = /\{count, plural, =1 \{(.*?)\} other \{(.*?)\}\}/;
          const match = result.match(pluralRegex);
          if (match) {
            const replacement = paramValue === 1 ? match[1] : match[2];
            result = result.replace(match[0], replacement);
          }
        }
        result = result.replace(`{${paramKey}}`, String(paramValue));
      });
      return result;
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ locale, t, setLocale, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
