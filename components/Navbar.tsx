'use client';

import Link from 'next/link';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { signOut } from '@/app/auth/actions';

export default function Navbar() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <nav className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-nordic-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-nordic-dark flex items-center justify-center">
              <span className="material-icons text-white text-lg">apartment</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-nordic-dark">LuxeEstate</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-mosque font-medium text-sm border-b-2 border-mosque px-1 py-1" href="#">{t('nav.buy')}</a>
            <a className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">{t('nav.rent')}</a>
            <a className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">{t('nav.sell')}</a>
            <a className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">{t('nav.saved_homes')}</a>
          </div>
          <div className="flex items-center space-x-6">
            <button className="text-nordic-dark hover:text-mosque transition-colors">
              <span className="material-icons">search</span>
            </button>
            <button className="text-nordic-dark hover:text-mosque transition-colors relative">
              <span className="material-icons">notifications_none</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light"></span>
            </button>
            
            <div className="relative border-l border-nordic-dark/10 ml-2 pl-2">
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all shadow-sm">
                      <img 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                        src={user.user_metadata.avatar_url || user.user_metadata.picture || 'https://www.gravatar.com/avatar/?d=mp'}
                      />
                    </div>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-nordic-dark/5 py-2 z-[60] overflow-hidden">
                      <div className="px-4 py-2 border-b border-nordic-dark/5 mb-1">
                        <p className="text-xs text-nordic-muted truncate">{user.email}</p>
                      </div>
                      <Link 
                        href="/profile" 
                        className="flex items-center gap-3 px-4 py-2 text-sm text-nordic-dark hover:bg-mosque/5 transition-colors"
                      >
                        <span className="material-icons text-lg text-nordic-muted">person_outline</span>
                        {t('auth.profile')}
                      </Link>
                      <Link 
                        href="/saved" 
                        className="flex items-center gap-3 px-4 py-2 text-sm text-nordic-dark hover:bg-mosque/5 transition-colors"
                      >
                        <span className="material-icons text-lg text-nordic-muted">favorite_border</span>
                        {t('auth.saved')}
                      </Link>
                      <button 
                        onClick={() => signOut()}
                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1"
                      >
                        <span className="material-icons text-lg">logout</span>
                        {t('auth.sign_out')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="bg-nordic-dark text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-mosque transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                  {t('auth.sign_in')}
                </Link>
              )}
            </div>

            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden border-t border-nordic-dark/5 bg-background-light overflow-hidden h-0 transition-all duration-300">
        <div className="px-4 py-2 space-y-1">
          <a className="block px-3 py-2 rounded-md text-base font-medium text-mosque bg-mosque/10" href="#">{t('nav.buy')}</a>
          <a className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">{t('nav.rent')}</a>
          <a className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">{t('nav.sell')}</a>
          <a className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">{t('nav.saved_homes')}</a>
        </div>
      </div>
    </nav>
  );
}
