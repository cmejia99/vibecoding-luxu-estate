'use client';

import Link from 'next/link';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

export default function Navbar() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
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

  useEffect(() => {
    const getProfile = async () => {
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(data);
      } else {
        setProfile(null);
      }
    };
    getProfile();
  }, [user, supabase]);

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
            
            <div className="flex items-center gap-4 border-l border-nordic-dark/10 ml-2 pl-4">
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all shadow-sm">
                      <img 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                        src={user.user_metadata.avatar_url || user.user_metadata.picture || 'https://www.gravatar.com/avatar/?d=mp'}
                      />
                    </div>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-nordic-dark/5 z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-6 py-4 border-b border-nordic-dark/5 bg-[#F8FAFA]">
                        <p className="text-[11px] font-bold text-[#9BA3A2] uppercase tracking-[0.05em] mb-1.5">Cuenta</p>
                        <p className="text-[15px] font-bold text-[#19322F] truncate">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <Link 
                          href="/profile" 
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-4 px-6 py-3.5 text-[15px] font-medium text-[#19322F] hover:bg-[#F2F7F7] transition-colors"
                        >
                          <span className="material-icons text-xl text-[#9BA3A2]">person_outline</span>
                          {t('auth.profile')}
                        </Link>
                        {profile?.role === 'admin' && (
                          <Link 
                            href="/admin/dashboard" 
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-4 px-6 py-3.5 text-[15px] font-medium text-[#19322F] hover:bg-[#F2F7F7] transition-colors"
                          >
                            <span className="material-icons text-xl text-[#9BA3A2]">dashboard</span>
                            Admin Dashboard
                          </Link>
                        )}
                        <Link 
                          href="/saved" 
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-4 px-6 py-3.5 text-[15px] font-medium text-[#19322F] hover:bg-[#F2F7F7] transition-colors"
                        >
                          <span className="material-icons text-xl text-[#9BA3A2]">favorite_border</span>
                          {t('auth.saved')}
                        </Link>
                      </div>
                      <div className="border-t border-nordic-dark/5">
                        <button 
                          onClick={async () => {
                            setIsProfileOpen(false);
                            const { error } = await supabase.auth.signOut();
                            if (!error) {
                              window.location.href = '/';
                            }
                          }}
                          className="flex items-center gap-4 w-full text-left px-6 py-4 text-[15px] font-medium text-[#E53935] hover:bg-[#FEECEB] transition-colors"
                        >
                          <span className="material-icons text-xl">logout</span>
                          {t('auth.sign_out')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="bg-nordic-dark text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-mosque transition-all shadow-sm hover:shadow-lg active:scale-95"
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
