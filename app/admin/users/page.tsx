import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import RoleSelector from '@/components/admin/RoleSelector';
import { getTranslations } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const t = await getTranslations();

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-red-600">
          <h2 className="text-lg font-bold mb-2">Error loading profiles</h2>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 font-display">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#19322F] dark:text-white tracking-tight">{t.admin.user_directory}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t.admin.user_directory_subtitle}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
            <input 
              type="text" 
              placeholder={t.admin.search_placeholder}
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-[#152e2a] border border-gray-200 dark:border-[#006655]/30 rounded-xl text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#006655]/20 transition-all shadow-sm"
            />
          </div>
          <button className="inline-flex items-center justify-center px-5 py-2.5 border border-[#006655] text-sm font-semibold rounded-lg text-[#006655] bg-transparent hover:bg-[#006655]/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006655] transition-all whitespace-nowrap shadow-sm">
            <span className="material-icons text-lg mr-2 font-bold">add</span>
            {t.admin.add_user}
          </button>
        </div>
      </div>

      {/* Tabs / Filters */}
      <div className="flex items-center gap-6 border-b border-gray-200 dark:border-[#006655]/20 mb-8 overflow-x-auto pb-px">
        <button className="px-1 py-4 border-b-2 border-[#006655] text-[#006655] text-sm font-bold whitespace-nowrap">{t.admin.all_users}</button>
        <button className="px-1 py-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 text-sm font-medium whitespace-nowrap">{t.admin.agents}</button>
        <button className="px-1 py-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 text-sm font-medium whitespace-nowrap">{t.admin.brokers}</button>
        <button className="px-1 py-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 text-sm font-medium whitespace-nowrap">{t.admin.admins}</button>
      </div>

      {/* Table Structure */}
      <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-200 dark:border-[#006655]/20 overflow-hidden">
        {/* Table Header */}
        <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 dark:bg-[#006655]/5 border-b border-gray-100 dark:border-[#006655]/10 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.05em]">
          <div className="col-span-5">{t.admin.user_details}</div>
          <div className="col-span-3">{t.admin.role_status}</div>
          <div className="col-span-3">{t.admin.performance}</div>
          <div className="col-span-1 text-right">{t.admin.actions}</div>
        </div>

        {profiles?.map((profile) => (
          <div key={profile.id} className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-6 border-b border-gray-100 dark:border-[#006655]/10 hover:bg-[#EEF6F6] dark:hover:bg-[#006655]/5 transition-colors items-center">
            {/* User Details */}
            <div className="col-span-12 lg:col-span-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 ring-2 ring-white dark:ring-gray-800 shadow-sm flex-shrink-0">
                {profile.avatar_url ? (
                  <Image 
                    src={profile.avatar_url} 
                    alt={profile.full_name || 'User'} 
                    width={48} 
                    height={48} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#006655]/10 text-[#006655]">
                    <span className="material-icons text-2xl">person</span>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-[15px] font-bold text-[#19322F] dark:text-white truncate">{profile.full_name || 'Sin nombre'}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{profile.email}</p>
              </div>
            </div>

            {/* Role & Status */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 flex flex-wrap items-center gap-3">
              <div className="flex flex-col gap-1.5">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border ${
                  profile.role === 'admin' 
                    ? 'bg-[#19322F] text-white border-transparent' 
                    : 'bg-[#D9ECC8] text-[#006655] border-[#006655]/10'
                }`}>
                  {profile.role === 'admin' ? t.admin.administrator : t.admin.agent}
                </span>
                <div className="flex items-center gap-1.5 px-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.admin.active}</span>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{t.admin.properties}</span>
                  <span className="text-sm font-bold text-[#19322F] dark:text-white mt-0.5">12</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{t.admin.sales_ytd}</span>
                  <span className="text-sm font-bold text-[#19322F] dark:text-white mt-0.5">$4.2M</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="col-span-12 lg:col-span-1 flex items-center justify-end gap-2">
              <RoleSelector 
                userId={profile.id} 
                currentRole={profile.role || 'user'} 
                t={{ change_role: t.admin.change_role, administrator: t.admin.administrator, agent: t.admin.agent }}
              />
              <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                <span className="material-icons text-xl">more_vert</span>
              </button>
            </div>
          </div>
        ))}

        {/* Footer info */}
        <div className="px-6 py-4 bg-gray-50/50 dark:bg-[#006655]/5 text-xs text-gray-500 dark:text-gray-400">
          {t.admin.showing_users.replace('{from}', '1').replace('{to}', profiles?.length.toString() || '0').replace('{total}', profiles?.length.toString() || '0')}
        </div>
      </div>
    </main>
  );
}
