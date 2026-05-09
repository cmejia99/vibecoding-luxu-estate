'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-white border-t border-slate-200 mt-12 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-nordic-dark rounded-lg flex items-center justify-center">
            <span className="material-icons text-white text-lg">castle</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-nordic-dark">LuxeEstate</span>
        </div>
        <div className="text-sm text-nordic-dark/50">
          {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
}
