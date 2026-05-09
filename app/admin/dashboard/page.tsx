import { createClient } from '@/utils/supabase/server';
import PropertyTable from '@/components/admin/PropertyTable';
import UserTable from '@/components/admin/UserTable';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;
  const activeTab = params.tab || 'properties';

  // Fetch properties
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  // Fetch users
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false });

  return (
    <main className="min-h-screen bg-[#EEF6F6] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#19322F]">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your platform's properties and users.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <Link
            href="/admin/dashboard?tab=properties"
            className={`pb-4 px-2 text-sm font-medium transition-all border-b-2 ${
              activeTab === 'properties'
                ? 'border-[#006655] text-[#006655]'
                : 'border-transparent text-gray-500 hover:text-[#006655]'
            }`}
          >
            Properties ({properties?.length || 0})
          </Link>
          <Link
            href="/admin/dashboard?tab=users"
            className={`pb-4 px-2 text-sm font-medium transition-all border-b-2 ${
              activeTab === 'users'
                ? 'border-[#006655] text-[#006655]'
                : 'border-transparent text-gray-500 hover:text-[#006655]'
            }`}
          >
            Users ({profiles?.length || 0})
          </Link>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'properties' ? (
            <PropertyTable properties={properties || []} />
          ) : (
            <UserTable users={profiles as any || []} />
          )}
        </div>
      </div>
    </main>
  );
}
