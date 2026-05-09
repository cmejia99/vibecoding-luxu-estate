import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import FeaturedPropertyCard from '@/components/FeaturedPropertyCard';
import PropertyCard from '@/components/PropertyCard';
import Pagination from '@/components/Pagination';
import SearchSection from '@/components/SearchSection';
import { getFeaturedProperties, getMarketProperties, PAGE_SIZE, PropertyFilters } from '@/lib/properties';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const getParam = (key: string) =>
    Array.isArray(params[key]) ? (params[key] as string[])[0] : (params[key] as string | undefined);

  const currentPage = Math.max(1, parseInt(getParam('page') ?? '1', 10));

  const filters: PropertyFilters = {
    query: getParam('query'),
    type: getParam('type'),
    minPrice: getParam('minPrice') ? Number(getParam('minPrice')) : undefined,
    maxPrice: getParam('maxPrice') ? Number(getParam('maxPrice')) : undefined,
    minBeds: getParam('minBeds') ? Number(getParam('minBeds')) : undefined,
    minBaths: getParam('minBaths') ? Number(getParam('minBaths')) : undefined,
    amenities: getParam('amenities') ? getParam('amenities')!.split(',') : undefined,
  };

  const [featuredProperties, { properties: marketProperties, total }] = await Promise.all([
    getFeaturedProperties(),
    getMarketProperties(currentPage, PAGE_SIZE, filters),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <section className="py-12 md:py-16">
          <Suspense>
            <SearchSection totalCount={total} />
          </Suspense>
        </section>

        <section className="mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark">Featured Collections</h2>
              <p className="text-nordic-muted mt-1 text-sm">Curated properties for the discerning eye.</p>
            </div>
            <a className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity" href="#">
              View all <span className="material-icons text-sm">arrow_forward</span>
            </a>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredProperties.map(property => (
              <FeaturedPropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark">New in Market</h2>
              <p className="text-nordic-muted mt-1 text-sm">
                Fresh opportunities added this week.
                {total > 0 && (
                  <span className="ml-2 text-mosque font-medium">
                    {total} {total === 1 ? 'property' : 'properties'}
                  </span>
                )}
              </p>
            </div>
            <div className="hidden md:flex bg-white p-1 rounded-lg">
              <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-nordic-dark text-white shadow-sm cursor-pointer">All</button>
              <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark cursor-pointer">Buy</button>
              <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark cursor-pointer">Rent</button>
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
              <p className="text-lg font-medium">No properties found.</p>
              <p className="text-sm mt-1 opacity-70">Try adjusting your search or filters.</p>
            </div>
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </section>
      </main>
    </>
  );
}
