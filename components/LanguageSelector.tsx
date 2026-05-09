'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { languages, type Locale } from '@/lib/i18n-config';

export default function LanguageSelector() {
  const { locale, setLocale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(l => l.code === locale) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-nordic-dark/5 transition-all border border-nordic-dark/10 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md"
      >
        <div className="w-5 h-3.5 overflow-hidden rounded-sm shadow-sm border border-black/5">
          <img src={currentLanguage.flag} alt={currentLanguage.name} className="w-full h-full object-cover" />
        </div>
        <span className="text-sm font-semibold text-nordic-dark">{currentLanguage.name}</span>
        <span className={`material-icons text-lg text-nordic-dark/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-nordic-dark/5 py-3 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code as Locale);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-6 py-3 text-[15px] transition-colors hover:bg-nordic-dark/5 ${
                locale === lang.code ? 'text-mosque font-bold bg-mosque/5' : 'text-nordic-dark/70 font-medium'
              }`}
            >
              <div className="w-5 h-3.5 overflow-hidden rounded-sm shadow-sm border border-black/5">
                <img src={lang.flag} alt={lang.name} className="w-full h-full object-cover" />
              </div>
              <span>{lang.name}</span>
              {locale === lang.code && (
                <span className="material-icons text-sm ml-auto text-mosque">check_circle</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
