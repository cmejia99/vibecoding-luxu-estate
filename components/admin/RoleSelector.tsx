'use client';

import { useState, useRef, useEffect } from 'react';
import { updateUserRole } from '@/app/admin/actions';

interface RoleSelectorProps {
  userId: string;
  currentRole: string;
  t: {
    change_role: string;
    administrator: string;
    agent: string;
  };
}

export default function RoleSelector({ userId, currentRole, t }: RoleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const roles = [
    { id: 'admin', label: t.administrator, icon: 'shield' },
    { id: 'user', label: t.agent, icon: 'support_agent' },
  ];

  const currentLabel = currentRole === 'admin' ? t.administrator : t.agent;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = async (newRole: string) => {
    if (newRole === currentRole) {
      setIsOpen(false);
      return;
    }
    setLoading(true);
    setIsOpen(false);
    try {
      await updateUserRole(userId, newRole as 'user' | 'admin');
    } catch (error) {
      alert('Error updating role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all border ${
          loading 
            ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200' 
            : isOpen
              ? 'bg-[#006655] text-white border-transparent shadow-md'
              : 'bg-white dark:bg-[#19322F] text-[#006655] border-[#006655]/20 hover:border-[#006655] hover:bg-[#006655]/5'
        }`}
      >
        <span className="whitespace-nowrap">{loading ? '...' : t.change_role}</span>
        <span className={`material-icons text-[16px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#19322F] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-[#006655]/10 py-1.5 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleChange(role.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors ${
                currentRole === role.id 
                  ? 'text-[#006655] bg-[#006655]/10 font-bold' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#006655]'
              }`}
            >
              <span className={`material-icons text-lg ${currentRole === role.id ? 'text-[#006655]' : 'text-gray-400'}`}>
                {role.icon}
              </span>
              {role.label}
              {currentRole === role.id && (
                <span className="material-icons text-sm ml-auto text-[#006655]">check_circle</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
