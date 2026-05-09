'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import LanguageSelector from '../LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';

interface AdminNavbarProps {
  initialUser: {
    email: string | null;
    full_name: string | null;
    avatar_url: string | null;
    role: string | null;
  };
}

export default function AdminNavbar({ initialUser }: AdminNavbarProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const supabase = createClient();
  const [user, setUser] = useState(initialUser);

  const navLinks = [
    { name: t('admin.dashboard'), href: '/admin/dashboard' },
    { name: t('admin.properties'), href: '/admin/properties' },
    { name: t('admin.users'), href: '/admin/users' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-[#152e2a] border-b border-[#006655]/10 dark:border-[#006655]/20 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Primary Nav */}
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded bg-[#006655] flex items-center justify-center text-white font-bold text-lg">L</div>
              <span className="font-bold text-xl tracking-tight text-[#19322F] dark:text-white">LuxeEstate</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/admin/dashboard' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`inline-flex items-center px-4 pt-1 border-b-2 text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? 'border-[#006655] text-[#006655] bg-[#006655]/5'
                        : 'border-transparent text-gray-500 hover:text-[#006655] hover:bg-[#006655]/5 dark:text-gray-400'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Secondary Nav / Profile */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
            
            <button className="p-2 rounded-full text-gray-400 hover:text-[#006655] hover:bg-[#006655]/5 transition-colors">
              <span className="material-icons text-xl">notifications_none</span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700 ml-2">
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 focus:outline-none group"
                >
                  <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-sm font-semibold text-[#19322F] dark:text-white">
                      {user.full_name || 'Admin User'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {user.role || 'Admin'}
                    </span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent group-hover:ring-[#006655] transition-all relative shadow-sm">
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#006655]/10 text-[#006655]">
                        <span className="material-icons text-xl">person</span>
                      </div>
                    )}
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-nordic-dark/5 z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-6 py-4 border-b border-nordic-dark/5 bg-[#F8FAFA] dark:bg-white/5">
                      <p className="text-[11px] font-bold text-[#9BA3A2] uppercase tracking-[0.05em] mb-1.5">Cuenta</p>
                      <p className="text-[15px] font-bold text-[#19322F] dark:text-white truncate">{user.email}</p>
                    </div>
                    <div className="py-2">
                      <Link 
                        href="/profile" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-4 px-6 py-3.5 text-[15px] font-medium text-[#19322F] dark:text-white hover:bg-[#F2F7F7] dark:hover:bg-white/5 transition-colors"
                      >
                        <span className="material-icons text-xl text-[#9BA3A2]">person_outline</span>
                        {t('auth.profile')}
                      </Link>
                      <Link 
                        href="/admin/dashboard" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-4 px-6 py-3.5 text-[15px] font-medium text-[#19322F] dark:text-white hover:bg-[#F2F7F7] dark:hover:bg-white/5 transition-colors"
                      >
                        <span className="material-icons text-xl text-[#9BA3A2]">dashboard</span>
                        Admin Dashboard
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
                        className="flex items-center gap-4 w-full text-left px-6 py-4 text-[15px] font-medium text-[#E53935] hover:bg-[#FEECEB] dark:hover:bg-red-900/10 transition-colors"
                      >
                        <span className="material-icons text-xl">logout</span>
                        {t('auth.sign_out')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
