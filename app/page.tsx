import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import FeaturedPropertyCard from '@/components/FeaturedPropertyCard';
import PropertyCard from '@/components/PropertyCard';
import Pagination from '@/components/Pagination';
import SearchSection from '@/components/SearchSection';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getFeaturedProperties, getMarketProperties, PAGE_SIZE, PropertyFilters } from '@/lib/properties';
import { getTranslations } from '@/lib/i18n';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const t = await getTranslations();

  const getParam = (key: string) =>
    Array.isArray(params[key]) ? (params[key] as string[])[0] : (params[key] as string | undefined);
// ... existing logic ...
  const currentPage = Math.max(1, parseInt(getParam('page') ?? '1', 10));

  const filters: PropertyFilters = {
    query: getParam('query'),
    type: getParam('type'),
    minPrice: getParam('minPrice') ? Number(getParam('minPrice')) : undefined,
    maxPrice: getParam('maxPrice') ? Number(getParam('maxPrice')) : undefined,
    minBeds: getParam('minBeds') ? Number(getParam('minBeds')) : undefined,
    minBaths: getParam('minBaths') ? Number(getParam('minBaths')) : undefined,
    amenities: getParam('amenities') ? getParam('amenities')!.split(',') : undefined,
    status: getParam('status'),
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (value === undefined || value === '' || value === 'All') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  });

  const [featuredPropertiesRaw, { properties: marketProperties, total }] = await Promise.all([
    getFeaturedProperties(),
    getMarketProperties(currentPage, PAGE_SIZE, filters),
  ]);

  const featuredProperties = featuredPropertiesRaw.slice(0, 2);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Helper to get nested translation keys server-side
  const tr = (key: string, params?: { [key: string]: any }) => {
    const keys = key.split('.');
    let value = t;
    for (const k of keys) value = value?.[k];
    if (typeof value !== 'string') return key;
    if (params) {
      let result = value;
      Object.entries(params).forEach(([pk, pv]) => {
        if (result.includes('{count, plural')) {
          const pluralRegex = /\{count, plural, =1 \{(.*?)\} other \{(.*?)\}\}/;
          const match = result.match(pluralRegex);
          if (match) {
            const replacement = pv === 1 ? match[1] : match[2];
            result = result.replace(match[0], replacement);
          }
        }
        result = result.replace(`{${pk}}`, String(pv));
      });
      return result;
    }
    return value;
  };

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <section className="py-12 md:py-16">
          <Suspense>
            <SearchSection totalCount={total} />
          </Suspense>
        </section>

        {!hasActiveFilters && (
          <section className="mb-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-light text-nordic-dark">{tr('home.featured_title')}</h2>
                <p className="text-nordic-muted mt-1 text-sm">{tr('home.featured_subtitle')}</p>
              </div>
              <a className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity" href="#">
                {tr('home.view_all')} <span className="material-icons text-sm">arrow_forward</span>
              </a>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProperties.map(property => (
                <FeaturedPropertyCard key={property.id} property={property} />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark">{tr('home.market_title')}</h2>
              <p className="text-nordic-muted mt-1 text-sm">
                {tr('home.market_subtitle')}
                {total > 0 && (
                  <span className="ml-2 text-mosque font-medium">
                    {tr('home.property_count', { count: total })}
                  </span>
                )}
              </p>
            </div>
            <div className="hidden md:flex bg-white p-1 rounded-lg shadow-sm border border-nordic-dark/5">
              <Link 
                href={`/?${(() => {
                  const p = new URLSearchParams(params as any);
                  p.delete('status');
                  p.set('page', '1');
                  return p.toString();
                })()}`}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  (!filters.status || filters.status === 'All') 
                    ? 'bg-nordic-dark text-white' 
                    : 'text-nordic-muted hover:text-nordic-dark'
                }`}
              >
                {tr('home.status_all')}
              </Link>
              <Link 
                href={`/?${(() => {
                  const p = new URLSearchParams(params as any);
                  p.set('status', 'Buy');
                  p.set('page', '1');
                  return p.toString();
                })()}`}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filters.status === 'Buy' 
                    ? 'bg-nordic-dark text-white' 
                    : 'text-nordic-muted hover:text-nordic-dark'
                }`}
              >
                {tr('nav.buy')}
              </Link>
              <Link 
                href={`/?${(() => {
                  const p = new URLSearchParams(params as any);
                  p.set('status', 'Rent');
                  p.set('page', '1');
                  return p.toString();
                })()}`}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filters.status === 'Rent' 
                    ? 'bg-nordic-dark text-white' 
                    : 'text-nordic-muted hover:text-nordic-dark'
                }`}
              >
                {tr('nav.rent')}
              </Link>
            </div>
          </div>

          {marketProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {marketProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-nordic-muted">
              <span className="material-icons text-5xl mb-4 block opacity-30">home_work</span>
              <p className="text-lg font-medium">{tr('home.no_properties')}</p>
              <p className="text-sm mt-1 opacity-70">{tr('home.no_properties_sub')}</p>
            </div>
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </section>
      </main>
      <Footer />
    </>
  );
}
