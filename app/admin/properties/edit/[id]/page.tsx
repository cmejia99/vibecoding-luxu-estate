import PropertyForm from '@/components/admin/PropertyForm';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !property) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 dark:border-[#006655]/20 pb-8">
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium font-sf-pro">
              <li><Link className="hover:text-[#006655] transition-colors" href="/admin/properties">Properties</Link></li>
              <li><span className="material-icons text-xs text-gray-400">chevron_right</span></li>
              <li aria-current="page" className="text-[#19322F] dark:text-white">Edit Property</li>
            </ol>
          </nav>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#19322F] dark:text-white tracking-tight mb-2">Edit Property</h1>
            <p className="text-base text-gray-500 dark:text-gray-400 max-w-2xl font-normal font-sf-pro">
              Update the details of the property listing.
            </p>
          </div>
        </div>
      </header>

      <PropertyForm mode="edit" initialData={property} />
    </main>
  );
}
