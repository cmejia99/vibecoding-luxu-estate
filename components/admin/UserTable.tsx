'use client';

import { updateUserRole } from '@/app/admin/actions';
import Image from 'next/image';
import { useState } from 'react';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
}

export default function UserTable({ users }: { users: Profile[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    setLoadingId(userId);
    try {
      await updateUserRole(userId, newRole);
    } catch (error) {
      alert('Error updating role');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <div className="col-span-5">User Info</div>
        <div className="col-span-4">Email</div>
        <div className="col-span-3 text-right">Role</div>
      </div>
      
      {users.map((user) => (
        <div key={user.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors items-center">
          <div className="col-span-12 md:col-span-5 flex gap-4 items-center">
            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
              {user.avatar_url ? (
                <Image src={user.avatar_url} alt={user.full_name || ''} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#006655] text-white font-bold">
                  {(user.full_name || user.email || '?')[0].toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="font-bold text-[#19322F]">{user.full_name || 'No Name'}</p>
              <p className="text-xs text-gray-400">ID: {user.id.slice(0, 8)}...</p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4">
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          <div className="col-span-12 md:col-span-3 flex justify-end">
            <select
              value={user.role}
              disabled={loadingId === user.id}
              onChange={(e) => handleRoleChange(user.id, e.target.value as 'user' | 'admin')}
              className="text-sm border-gray-200 rounded-lg focus:ring-[#006655] focus:border-[#006655] bg-white transition-all disabled:opacity-50"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
