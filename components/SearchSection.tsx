'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const FiltersModal = dynamic(() => import('./FiltersModal'), { ssr: false });

const PROPERTY_TYPES = ['All', 'House', 'Apartment', 'Villa', 'Penthouse', 'Studio'];

interface SearchSectionProps {
  totalCount: number;
}

export default function SearchSection({ totalCount }: SearchSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') ?? '');
  const [activeType, setActiveType] = useState(searchParams.get('type') ?? 'All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasActiveFilters = !!(
    searchParams.get('minPrice') ||
    searchParams.get('maxPrice') ||
    searchParams.get('minBeds') ||
    searchParams.get('minBaths') ||
    searchParams.get('amenities')
  );

  const buildParams = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');
      for (const [key, value] of Object.entries(overrides)) {
        if (value === undefined || value === '' || value === 'All') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = () => {
    router.push(`${pathname}?${buildParams({ query: searchQuery })}`);
  };

  const handleTypeSelect = (type: string) => {
    setActiveType(type);
    router.push(`${pathname}?${buildParams({ type, page: '1' })}`);
  };

  return (
    <>
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark leading-tight">
          Find your{' '}
          <span className="relative inline-block">
            <span className="relative z-10 font-medium">sanctuary</span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0" />
          </span>
          .
        </h1>

        {/* Search Bar */}
        <div className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-icons text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors">
              search
            </span>
          </div>
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="block w-full pl-12 pr-4 py-4 rounded-xl border-none bg-white text-nordic-dark shadow-soft placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white transition-all text-lg outline-none"
            placeholder="Search by city, neighborhood, or address..."
          />
          <button
            id="search-button"
            onClick={handleSearch}
            className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20 cursor-pointer"
          >
            Search
          </button>
        </div>

        {/* Type Filter Chips + Filters Button */}
        <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type}
              id={`filter-type-${type.toLowerCase()}`}
              onClick={() => handleTypeSelect(type)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer ${
                activeType === type
                  ? 'bg-nordic-dark text-white shadow-nordic-dark/10'
                  : 'bg-white border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 hover:bg-mosque/5'
              }`}
            >
              {type}
            </button>
          ))}
          <div className="w-px h-6 bg-nordic-dark/10 mx-2" />
          <button
            id="filters-button"
            onClick={() => setIsModalOpen(true)}
            className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              hasActiveFilters
                ? 'bg-nordic-dark text-white shadow-lg shadow-nordic-dark/10'
                : 'text-nordic-dark hover:bg-black/5'
            }`}
          >
            <span className="material-icons text-base">tune</span>
            Filters
            {hasActiveFilters && (
              <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-mosque text-white text-[10px] font-bold">
                ✓
              </span>
            )}
          </button>
        </div>
      </div>

      <FiltersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        totalCount={totalCount}
      />
    </>
  );
}
