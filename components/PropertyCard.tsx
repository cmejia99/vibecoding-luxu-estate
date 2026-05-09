'use client';

import { Property } from '../lib/properties';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function PropertyCard({ property }: { property: Property }) {
  const { t } = useTranslation();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/properties/${property.slug}`} className="block h-full">
      <article className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 group cursor-pointer h-full flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          src={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
        />
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-nordic-dark hover:bg-mosque hover:text-white transition-all">
          <span className="material-icons text-xl">favorite_border</span>
        </button>
        <div className={`absolute bottom-3 left-3 ${property.status === 'FOR RENT' ? 'bg-mosque/90' : 'bg-nordic-dark/90'} text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider`}>
          {property.status === 'FOR RENT' ? t('details.for_rent') : t('nav.buy')}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="font-bold text-lg text-nordic-dark">
            {property.status === 'FOR RENT' && property.price_per_month ? (
              <>{formatPrice(property.price_per_month)}<span className="text-sm font-normal text-nordic-muted">{t('details.per_month')}</span></>
            ) : (
              formatPrice(property.price)
            )}
          </h3>
        </div>
        <h4 className="text-nordic-dark font-medium truncate mb-1">{property.title}</h4>
        <p className="text-nordic-muted text-xs mb-4">{property.location}</p>
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">king_bed</span> {property.beds}
          </div>
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">bathtub</span> {property.baths}
          </div>
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">square_foot</span> {property.area}m²
          </div>
        </div>
      </div>
    </article>
    </Link>
  );
}
