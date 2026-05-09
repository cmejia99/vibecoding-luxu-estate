import { createClient } from '@/utils/supabase/server';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/admin/dashboard');
  }

  // Fetch profile to verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, role')
    .eq('id', user.id)
    .maybeSingle();

  const isAdmin = profile?.role === 'admin' || user.email === 'cmejia99@gmail.com';

  if (!isAdmin) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-[#EEF6F6] dark:bg-[#0f2320]">
      <AdminNavbar 
        initialUser={{
          email: user.email || '',
          full_name: profile?.full_name || user.email || 'Admin User',
          avatar_url: profile?.avatar_url || null,
          role: profile?.role || 'Admin'
        }} 
      />
      {children}
    </div>
  );
}
