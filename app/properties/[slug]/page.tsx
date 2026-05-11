import { getPropertyBySlug } from '@/lib/properties';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MapWrapper from '@/components/MapWrapper';
import Footer from '@/components/Footer';
import { getTranslations } from '@/lib/i18n';

export default async function PropertyDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  const t_raw = await getTranslations();

  if (!property) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Helper to get nested translation keys server-side
  const tr = (key: string, params?: { [key: string]: any }) => {
    const keys = key.split('.');
    let value = t_raw;
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

  // Ensure we have at least 1 image, falling back to a placeholder if images array is empty or undefined
  const images = property.images && property.images.length > 0 ? property.images : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'];
  const mainImage = images[0];
  const galleryImages = images.slice(1, 5); // Take up to 4 more images

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-sm group">
              <img 
                alt={property.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src={mainImage} 
              />
              <div className="absolute top-4 left-4 flex gap-2">
                {property.is_exclusive && <span className="bg-mosque text-white text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">{tr('details.exclusive')}</span>}
                {property.is_new && <span className="bg-white/90 backdrop-blur text-nordic-dark text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">{tr('details.new')}</span>}
                {property.status === 'FOR RENT' && <span className="bg-mosque text-white text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">{tr('details.for_rent')}</span>}
              </div>
              <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-nordic-dark px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur transition-all flex items-center gap-2 cursor-pointer">
                <span className="material-icons text-sm">grid_view</span>
                {tr('details.view_photos')}
              </button>
            </div>
            
            {galleryImages.length > 0 && (
              <div className="flex gap-4 overflow-x-auto hide-scroll pb-2 snap-x">
                {galleryImages.map((img, index) => (
                  <div key={index} className={`flex-none w-48 aspect-[4/3] rounded-lg overflow-hidden cursor-pointer snap-start transition-opacity ${index === 0 ? 'ring-2 ring-mosque ring-offset-2 ring-offset-background-light' : 'opacity-70 hover:opacity-100'}`}>
                    <img alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" src={img} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-mosque/5">
                <div className="mb-4">
                  <h1 className="text-4xl font-light text-nordic-dark mb-2">
                    {property.status === 'FOR RENT' && property.price_per_month ? (
                      <>{formatPrice(property.price_per_month)}<span className="text-xl font-normal text-nordic-muted">{tr('details.per_month')}</span></>
                    ) : (
                      formatPrice(property.price)
                    )}
                  </h1>
                  <p className="text-nordic-dark/60 font-medium flex items-center gap-1">
                    <span className="material-icons text-mosque text-sm">location_on</span>
                    {property.location}
                  </p>
                </div>
                <div className="h-px bg-slate-100 my-6"></div>
                <div className="flex items-center gap-4 mb-6">
                  <img alt="Agent" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4TxUmdQRb2VMjuaNxLEwLorv_dgHzoET2_wL5toSvew6nhtziaR3DX-U69DBN7J74yO6oKokpw8tqEFutJf13MeXghCy7FwZuAxnoJel6FYcKeCRUVinpZtrNnkZvXd-MY5_2MAtRD7JP5BieHixfCaeAPW04jm-y-nvF3HIrwcZ_HRDk_MrNP5WiPV3u9zNrEgM-SQoWGh4xLVSV444aZAbVl03mjjsW5WBpIeodCyqJxprTDp6Q157D06VxcdUSCf-l9UKQT-w"/>
                  <div>
                    <h3 className="font-semibold text-nordic-dark">Sarah Jenkins</h3>
                    <div className="flex items-center gap-1 text-xs text-mosque font-medium">
                      <span className="material-icons text-[14px]">star</span>
                      <span>{tr('details.top_agent')}</span>
                    </div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors cursor-pointer">
                      <span className="material-icons text-sm">chat</span>
                    </button>
                    <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors cursor-pointer">
                      <span className="material-icons text-sm">call</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <button className="w-full bg-mosque hover:bg-primary-hover text-white py-4 px-6 rounded-lg font-medium transition-all shadow-lg shadow-mosque/20 flex items-center justify-center gap-2 group cursor-pointer">
                    <span className="material-icons text-xl group-hover:scale-110 transition-transform">calendar_today</span>
                    {tr('details.schedule_visit')}
                  </button>
                  <button className="w-full bg-transparent border border-nordic-dark/10 hover:border-mosque text-nordic-dark/80 hover:text-mosque py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 cursor-pointer">
                    <span className="material-icons text-xl">mail_outline</span>
                    {tr('details.contact_agent')}
                  </button>
                </div>
              </div>
              <div className="bg-white p-2 rounded-xl shadow-sm border border-mosque/5">
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 z-0">
                  <MapWrapper location={property.location} latitude={property.latitude} longitude={property.longitude} className="w-full h-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 lg:row-start-2 lg:-mt-8 space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
              <h2 className="text-lg font-semibold mb-6 text-nordic-dark">{tr('details.features_title', { title: property.title })}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">square_foot</span>
                  <span className="text-xl font-bold text-nordic-dark">{property.area}</span>
                  <span className="text-xs uppercase tracking-wider text-nordic-dark/50">{tr('details.sq_meters')}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">bed</span>
                  <span className="text-xl font-bold text-nordic-dark">{property.beds}</span>
                  <span className="text-xs uppercase tracking-wider text-nordic-dark/50">{tr('details.bedrooms')}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">shower</span>
                  <span className="text-xl font-bold text-nordic-dark">{property.baths}</span>
                  <span className="text-xs uppercase tracking-wider text-nordic-dark/50">{tr('details.bathrooms')}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">home</span>
                  <span className="text-xl font-bold text-nordic-dark capitalize">{tr(`search.types.${property.type}`)}</span>
                  <span className="text-xs uppercase tracking-wider text-nordic-dark/50">{tr('details.property_type')}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
              <h2 className="text-lg font-semibold mb-4 text-nordic-dark">{tr('details.about_title')}</h2>
              <div className="prose prose-slate max-w-none text-nordic-dark/70 leading-relaxed">
                {property.description ? (
                  <div className="whitespace-pre-line">{property.description}</div>
                ) : (
                  <>
                    <p className="mb-4">
                      {tr('details.about_desc', { type: tr(`search.types.${property.type}`).toLowerCase(), location: property.location })}
                    </p>
                    <p>
                      {tr('details.about_desc_2')}
                    </p>
                  </>
                )}
              </div>
              <button className="mt-4 text-mosque font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
                {tr('details.read_more')}
                <span className="material-icons text-sm">arrow_forward</span>
              </button>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
                <h2 className="text-lg font-semibold mb-6 text-nordic-dark">{tr('details.amenities')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 text-nordic-dark/70">
                      <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.status === 'FOR SALE' && (
              <div className="bg-mosque/5 p-6 rounded-xl border border-mosque/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-full text-mosque shadow-sm">
                    <span className="material-icons">calculate</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-nordic-dark">{tr('details.est_payment')}</h3>
                    <p className="text-sm text-nordic-dark/60">{tr('details.starting_from')} <strong className="text-mosque">{formatPrice(property.price * 0.005)}{tr('details.per_month')}</strong> {tr('details.with_down')}</p>
                  </div>
                </div>
                <button className="whitespace-nowrap px-4 py-2 bg-white border border-nordic-dark/10 rounded-lg text-sm font-semibold hover:border-mosque transition-colors text-nordic-dark cursor-pointer">
                  {tr('details.calc_mortgage')}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
