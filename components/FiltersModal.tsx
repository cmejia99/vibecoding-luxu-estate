'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';

const AMENITY_OPTIONS = [
  { value: 'Swimming Pool', icon: 'pool' },
  { value: 'Gym', icon: 'fitness_center' },
  { value: 'Parking', icon: 'local_parking' },
  { value: 'Air Conditioning', icon: 'ac_unit' },
  { value: 'High-speed Wifi', icon: 'wifi' },
  { value: 'Patio / Terrace', icon: 'deck' },
];

const PROPERTY_TYPES = ['Any Type', 'House', 'Apartment', 'Villa', 'Penthouse', 'Studio'];

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalCount: number;
}

export default function FiltersModal({ isOpen, onClose, totalCount }: FiltersModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const [location, setLocation] = useState(searchParams.get('query') ?? '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');
  const [propertyType, setPropertyType] = useState(searchParams.get('type') ?? 'Any Type');
  const [beds, setBeds] = useState(parseInt(searchParams.get('minBeds') ?? '0', 10));
  const [baths, setBaths] = useState(parseInt(searchParams.get('minBaths') ?? '0', 10));
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    searchParams.get('amenities') ? searchParams.get('amenities')!.split(',') : []
  );

  const toggleAmenity = useCallback((value: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(value) ? prev.filter((a) => a !== value) : [...prev, value]
    );
  }, []);

  const handleClear = () => {
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setPropertyType('Any Type');
    setBeds(0);
    setBaths(0);
    setSelectedAmenities([]);
  };

  const handleApply = () => {
    const params = new URLSearchParams();
    params.set('page', '1');
    if (location) params.set('query', location);
    if (minPrice) params.set('minPrice', minPrice.replace(/,/g, ''));
    if (maxPrice) params.set('maxPrice', maxPrice.replace(/,/g, ''));
    if (propertyType && propertyType !== 'Any Type') params.set('type', propertyType);
    if (beds > 0) params.set('minBeds', String(beds));
    if (baths > 0) params.set('minBaths', String(baths));
    if (selectedAmenities.length > 0) params.set('amenities', selectedAmenities.join(','));

    router.push(`/?${params.toString()}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t('filters.title')}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <header className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-30">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">{t('filters.title')}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            aria-label="Close filters"
          >
            <span className="material-icons">close</span>
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {/* Location */}
          <section>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {t('filters.location')}
            </label>
            <div className="relative group">
              <span className="material-icons absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#1a3a2e] transition-colors">
                location_on
              </span>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t('filters.location_placeholder')}
                className="w-full pl-12 pr-4 py-3 bg-[#f5f8f6] border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#1a3a2e] focus:bg-white transition-all shadow-sm outline-none"
              />
            </div>
          </section>

          {/* Price Range */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('filters.price_range')}
              </label>
              {(minPrice || maxPrice) && (
                <span className="text-sm font-medium text-[#1a3a2e]">
                  {minPrice ? `$${minPrice}` : t('filters.any')} – {maxPrice ? `$${maxPrice}` : t('filters.any')}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f5f8f6] p-3 rounded-lg border border-transparent focus-within:border-[#1a3a2e]/30 transition-colors">
                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">{t('filters.min_price')}</label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">$</span>
                  <input
                    type="text"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent border-0 p-0 text-gray-900 font-medium focus:ring-0 text-sm outline-none"
                  />
                </div>
              </div>
              <div className="bg-[#f5f8f6] p-3 rounded-lg border border-transparent focus-within:border-[#1a3a2e]/30 transition-colors">
                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">{t('filters.max_price')}</label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">$</span>
                  <input
                    type="text"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder={t('filters.no_limit')}
                    className="w-full bg-transparent border-0 p-0 text-gray-900 font-medium focus:ring-0 text-sm outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Property Details */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Property Type */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('details.property_type')}
              </label>
              <div className="relative">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full bg-[#f5f8f6] border-0 rounded-lg py-3 pl-4 pr-10 text-gray-900 appearance-none focus:ring-2 focus:ring-[#1a3a2e] cursor-pointer outline-none"
                >
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type}>{t(`search.types.${type}`)}</option>
                  ))}
                </select>
                <span className="material-icons absolute right-3 top-3 text-gray-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Beds & Baths */}
            <div className="space-y-4">
              <CounterRow label={t('details.bedrooms')} value={beds} onChange={setBeds} anyLabel={t('filters.any_plus')} />
              <CounterRow label={t('details.bathrooms')} value={baths} onChange={setBaths} anyLabel={t('filters.any_plus')} />
            </div>
          </section>

          {/* Amenities */}
          <section>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              {t('filters.amenities_title')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AMENITY_OPTIONS.map(({ value, icon }) => {
                const isActive = selectedAmenities.includes(value);
                return (
                  <label key={value} className="cursor-pointer group relative">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => toggleAmenity(value)}
                      className="sr-only peer"
                    />
                    <div
                      className={`h-full px-4 py-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${
                        isActive
                          ? 'border-[#1a3a2e] bg-[#1a3a2e]/10 text-[#1a3a2e] font-medium'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <span
                        className={`material-icons text-lg transition-colors ${
                          isActive ? 'text-[#1a3a2e]' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      >
                        {icon}
                      </span>
                      {t(`filters.amenity.${value}`)}
                    </div>
                    {isActive && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-[#1a3a2e] rounded-full" />
                    )}
                  </label>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 px-8 py-6 sticky bottom-0 z-30 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors underline decoration-gray-300 underline-offset-4"
          >
            {t('filters.clear_all')}
          </button>
          <button
            onClick={handleApply}
            className="bg-[#1a3a2e] hover:bg-[#1a3a2e]/90 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-[#1a3a2e]/30 transition-all hover:shadow-[#1a3a2e]/40 flex items-center gap-2 active:scale-95"
          >
            {t('filters.show_homes', { count: totalCount })}
            <span className="material-icons text-sm">arrow_forward</span>
          </button>
        </footer>
      </div>
    </div>
  );
}

interface CounterRowProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  anyLabel: string;
}

function CounterRow({ label, value, onChange, anyLabel }: CounterRowProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-900">{label}</span>
      <div className="flex items-center space-x-3 bg-[#f5f8f6] rounded-full p-1">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value === 0}
          className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-[#1a3a2e] disabled:opacity-40 transition-colors cursor-pointer"
          aria-label={`Decrease ${label}`}
        >
          <span className="material-icons text-base">remove</span>
        </button>
        <span className="text-sm font-semibold w-8 text-center">
          {value === 0 ? anyLabel : `${value}+`}
        </span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1a3a2e] hover:bg-[#1a3a2e] hover:text-white transition-colors cursor-pointer"
          aria-label={`Increase ${label}`}
        >
          <span className="material-icons text-base">add</span>
        </button>
      </div>
    </div>
  );
}
