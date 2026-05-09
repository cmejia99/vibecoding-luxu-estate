'use client';

import { useState } from 'react';
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

  const roles = [
    { id: 'admin', label: t.administrator, icon: 'shield' },
    { id: 'user', label: t.agent, icon: 'support_agent' },
  ];

  const handleRoleChange = async (newRole: string) => {
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
    <div className="relative w-full md:w-auto">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className={`inline-flex items-center px-4 py-2 border border-[#19322F]/10 shadow-sm text-xs font-medium rounded-lg transition-colors w-full md:w-auto justify-center ${
          loading ? 'opacity-50 cursor-not-allowed' : 'bg-white dark:bg-gray-800 text-[#19322F] hover:bg-[#19322F] hover:text-white dark:hover:text-[#19322F]'
        }`}
      >
        {loading ? 'Updating...' : t.change_role}
        <span className="material-icons text-[16px] ml-2">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] bg-[#006655] ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-50 origin-top-right animate-in fade-in slide-in-from-top-1">
          <div className="py-1">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleChange(role.id)}
                className={`w-full group flex items-center px-4 py-3 text-xs transition-colors ${
                  currentRole === role.id 
                    ? 'text-white bg-white/10 font-medium' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className={`material-icons text-sm mr-3 ${
                  currentRole === role.id ? 'text-white' : 'text-white/50 group-hover:text-white'
                }`}>
                  {role.icon}
                </span>
                {role.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
