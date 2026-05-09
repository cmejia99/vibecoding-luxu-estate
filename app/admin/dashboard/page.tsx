import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { getTranslations } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const t = await getTranslations();

  // Fetch counts
  const { count: propertyCount } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true });

  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const stats = [
    { name: t.admin.total_listings, value: propertyCount || 0, icon: 'apartment', href: '/admin/properties', color: 'bg-blue-500' },
    { name: t.admin.all_users, value: userCount || 0, icon: 'people', href: '/admin/users', color: 'bg-green-500' },
    { name: t.admin.total_revenue, value: '$12.4M', icon: 'payments', href: '#', color: 'bg-purple-500' },
    { name: t.admin.inquiries, value: '42', icon: 'chat', href: '#', color: 'bg-orange-500' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-display">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#19322F] dark:text-white tracking-tight">{t.admin.overview}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t.admin.overview_subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <Link 
            key={stat.name} 
            href={stat.href}
            className="bg-white dark:bg-[#152e2a] p-6 rounded-2xl border border-[#006655]/10 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`h-12 w-12 rounded-xl ${stat.color} bg-opacity-10 flex items-center justify-center text-current group-hover:scale-110 transition-transform`}>
                <span className={`material-icons ${stat.color.replace('bg-', 'text-')}`}>{stat.icon}</span>
              </div>
              <span className="material-icons text-gray-300 group-hover:text-[#006655] transition-colors">arrow_forward</span>
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
            <p className="text-2xl font-bold text-[#19322F] dark:text-white mt-1">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#152e2a] p-8 rounded-2xl border border-[#006655]/10 shadow-sm">
          <h2 className="text-xl font-bold text-[#19322F] dark:text-white mb-4">{t.admin.recent_activity}</h2>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-white/5 flex-shrink-0 flex items-center justify-center">
                  <span className="material-icons text-sm text-gray-400">history</span>
                </div>
                <div>
                  <p className="text-sm text-[#19322F] dark:text-white">
                    <span className="font-bold">New property</span> listed by Sarah Miller
                  </p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/admin/properties" className="mt-8 block text-center text-sm font-semibold text-[#006655] hover:underline">
            {t.admin.view_all_activity}
          </Link>
        </div>

        <div className="bg-white dark:bg-[#152e2a] p-8 rounded-2xl border border-[#006655]/10 shadow-sm">
          <h2 className="text-xl font-bold text-[#19322F] dark:text-white mb-4">{t.admin.platform_health}</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t.admin.storage_usage}</span>
                <span className="font-medium text-[#19322F] dark:text-white">65%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#006655] w-[65%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t.admin.active_sessions}</span>
                <span className="font-medium text-[#19322F] dark:text-white">82%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[82%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
