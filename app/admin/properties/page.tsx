import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import TogglePropertyButton from '@/components/admin/TogglePropertyButton';
import Link from 'next/link';
import { getTranslations } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;
  const t = await getTranslations();
  const currentPage = parseInt(params.page || '1');
  const pageSize = 10;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  // Fetch ALL properties (active + inactive) for admin — no is_active filter
  const { data: properties, error, count } = await supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching properties:', error);
  }

  const totalPages = Math.ceil((count || 0) / pageSize);

  // Fetch stats (total counts regardless of page)
  const { data: allStats } = await supabase
    .from('properties')
    .select('status, is_active');

  const activeCount = allStats?.filter(p => p.status === 'FOR SALE' || p.status === 'FOR RENT').length || 0;
  const soldCount = allStats?.filter(p => p.status === 'SOLD').length || 0;
  const inactiveCount = allStats?.filter(p => p.is_active === false).length || 0;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'FOR SALE': return t.admin.status_for_sale;
      case 'FOR RENT': return t.admin.status_for_rent;
      case 'SOLD': return t.admin.status_sold;
      default: return status;
    }
  };

  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 font-display">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#19322F] dark:text-white tracking-tight">{t.admin.my_properties}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t.admin.my_properties_subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white dark:bg-[#152e2a] border border-gray-200 dark:border-[#006655]/30 text-[#19322F] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#006655]/10 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-2">
            <span className="material-icons text-base">filter_list</span> {t.admin.filter}
          </button>
          
          <Link 
            href="/admin/properties/add"
            className="inline-flex items-center justify-center px-5 py-2.5 border border-[#006655] text-sm font-semibold rounded-lg text-[#006655] bg-transparent hover:bg-[#006655]/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006655] transition-all whitespace-nowrap shadow-sm"
          >
            <span className="material-icons text-lg mr-2 font-bold">add</span>
            {t.admin.add_property}
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-[#006655]/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.admin.total_listings}</p>
            <p className="text-2xl font-bold text-[#19322F] dark:text-white mt-1">{count || 0}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#006655]/10 flex items-center justify-center text-[#006655]">
            <span className="material-icons">apartment</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-[#006655]/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.admin.active_properties}</p>
            <p className="text-2xl font-bold text-[#19322F] dark:text-white mt-1">{activeCount}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#D9ECC8] flex items-center justify-center text-[#006655]">
            <span className="material-icons">check_circle</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-[#006655]/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.admin.sold_pending}</p>
            <p className="text-2xl font-bold text-[#19322F] dark:text-white mt-1">{soldCount}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <span className="material-icons">pending</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-[#006655]/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Inactivas</p>
            <p className="text-2xl font-bold text-[#19322F] dark:text-white mt-1">{inactiveCount}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <span className="material-icons">visibility_off</span>
          </div>
        </div>
      </div>

      {/* Property List Container */}
      <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-200 dark:border-[#006655]/20 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 dark:bg-[#006655]/5 border-b border-gray-100 dark:border-[#006655]/10 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <div className="col-span-5">{t.admin.property_details}</div>
          <div className="col-span-2">{t.admin.price}</div>
          <div className="col-span-2">{t.admin.status}</div>
          <div className="col-span-1">Visibilidad</div>
          <div className="col-span-2 text-right">{t.admin.actions}</div>
        </div>

        {properties?.map((property) => (
          <div
            key={property.id}
            className={`group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-gray-100 dark:border-[#006655]/10 transition-colors items-center ${
              property.is_active
                ? 'hover:bg-[#EEF6F6] dark:hover:bg-[#006655]/5'
                : 'bg-gray-50/60 dark:bg-gray-900/30 opacity-70'
            }`}
          >
            {/* Property Details */}
            <div className="col-span-12 md:col-span-5 flex gap-4 items-center">
              <div className="relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 shadow-sm">
                <Image 
                  src={property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'} 
                  alt={property.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {!property.is_active && (
                  <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
                    <span className="material-icons text-white text-2xl">visibility_off</span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#19322F] dark:text-white group-hover:text-[#006655] transition-colors cursor-pointer">
                  {property.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{property.location}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1"><span className="material-icons text-[14px]">bed</span> {property.beds} {t.admin.beds}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="flex items-center gap-1"><span className="material-icons text-[14px]">bathtub</span> {property.baths} {t.admin.baths}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span>{property.area.toLocaleString()} {t.admin.sqft}</span>
                </div>
              </div>
            </div>
            {/* Price */}
            <div className="col-span-6 md:col-span-2">
              <div className="text-base font-semibold text-[#19322F] dark:text-gray-200">${property.price.toLocaleString()}</div>
              {property.price_per_month && (
                <div className="text-xs text-gray-400">{t.admin.monthly}: ${property.price_per_month.toLocaleString()}</div>
              )}
            </div>
            {/* Status */}
            <div className="col-span-6 md:col-span-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                property.status === 'FOR SALE' || property.status === 'FOR RENT'
                  ? 'bg-[#D9ECC8] text-[#006655] border-[#006655]/10'
                  : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                  property.status === 'FOR SALE' || property.status === 'FOR RENT' ? 'bg-[#006655]' : 'bg-orange-500'
                }`}></span>
                {getStatusLabel(property.status)}
              </span>
            </div>
            {/* Visibility badge */}
            <div className="col-span-6 md:col-span-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                property.is_active
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                  property.is_active ? 'bg-emerald-500' : 'bg-gray-400'
                }`}></span>
                {property.is_active ? 'Activa' : 'Inactiva'}
              </span>
            </div>
            {/* Actions */}
            <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
              <Link 
                href={`/admin/properties/edit/${property.id}`}
                className="p-2 rounded-lg text-gray-400 hover:text-[#006655] hover:bg-[#D9ECC8]/30 transition-all" 
                title="Editar propiedad"
              >
                <span className="material-icons text-xl">edit</span>
              </Link>
              <TogglePropertyButton propertyId={property.id} isActive={property.is_active} />
            </div>
          </div>
        ))}

        {/* Pagination Section */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-[#006655]/20 flex items-center justify-between bg-gray-50/50 dark:bg-[#006655]/5">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t.admin.showing_results.replace('{from}', Math.min(from + 1, count || 0).toString()).replace('{to}', Math.min(to + 1, count || 0).toString()).replace('{total}', (count || 0).toString())}
          </div>
          <div className="flex gap-2">
            <Link
              href={`/admin/properties?page=${currentPage - 1}`}
              className={`px-3 py-1 text-sm border border-gray-200 dark:border-[#006655]/30 rounded-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#006655]/20 transition-all ${
                currentPage <= 1 ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              {t.admin.previous}
            </Link>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/admin/properties?page=${page}`}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-all ${
                    page === currentPage
                      ? 'bg-[#006655] text-white'
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  {page}
                </Link>
              ))}
            </div>
            <Link
              href={`/admin/properties?page=${currentPage + 1}`}
              className={`px-3 py-1 text-sm border border-gray-200 dark:border-[#006655]/30 rounded-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#006655]/20 transition-all ${
                currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              {t.admin.next}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
