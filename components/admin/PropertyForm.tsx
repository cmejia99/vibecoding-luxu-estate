'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { uploadPropertyImage, deletePropertyImage } from '@/utils/supabase/storage';
import { Property } from '@/lib/properties';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('./MapPicker'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] rounded-lg bg-gray-100 dark:bg-[#0f2320] animate-pulse flex items-center justify-center border border-gray-200 dark:border-[#006655]/30">
      <div className="flex flex-col items-center gap-2">
        <span className="material-icons text-gray-300 dark:text-gray-700 text-4xl">map</span>
        <span className="text-xs text-gray-400 font-sf-pro">Loading map...</span>
      </div>
    </div>
  )
});

interface PropertyFormProps {
  initialData?: Property | null;
  mode: 'create' | 'edit';
}

export default function PropertyForm({ initialData, mode }: PropertyFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    price: initialData?.price || 0,
    status: initialData?.status || 'FOR SALE',
    type: initialData?.type || 'House',
    description: initialData?.description || '',
    location: initialData?.location || '',
    area: initialData?.area || 0,
    year_built: initialData?.year_built || new Date().getFullYear(),
    beds: initialData?.beds || 0,
    baths: initialData?.baths || 0,
    parking: initialData?.parking || 0,
    amenities: initialData?.amenities || [],
    is_exclusive: initialData?.is_exclusive || false,
    is_new: initialData?.is_new || false,
    is_featured: initialData?.is_featured || false,
    section: initialData?.section || 'market',
    latitude: initialData?.latitude || 0,
    longitude: initialData?.longitude || 0,
  });

  const availableAmenities = [
    'Swimming Pool', 'Garden', 'Air Conditioning', 'Smart Home', 
    'Gym', 'Security', 'Parking', 'Ocean View'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const handleAmenityChange = (amenity: string) => {
    setFormData(prev => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const url = await uploadPropertyImage(files[i]);
      if (url) {
        newImages.push(url);
      }
    }

    setImages(prev => [...prev, ...newImages]);
    setUploading(false);
  };

  const handleRemoveImage = async (url: string) => {
    const success = await deletePropertyImage(url);
    if (success) {
      setImages(prev => prev.filter(img => img !== url));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const propertyData = {
        ...formData,
        images,
        slug: mode === 'create' ? `${slug}-${Date.now()}` : initialData?.slug,
      };

      if (mode === 'create') {
        const { error } = await supabase.from('properties').insert([{
          ...propertyData,
          id: `prop-${Date.now()}`
        }]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', initialData?.id);
        if (error) throw error;
      }

      router.push('/admin/properties');
      router.refresh();
    } catch (error) {
      console.error('Error saving property:', error);
      alert('Error saving property');
    } finally {
      setLoading(false);
    }
  };

  const increment = (field: 'beds' | 'baths' | 'parking') => {
    setFormData(prev => ({ ...prev, [field]: (prev[field] || 0) + 1 }));
  };

  const decrement = (field: 'beds' | 'baths' | 'parking') => {
    setFormData(prev => ({ ...prev, [field]: Math.max(0, (prev[field] || 0) - 1) }));
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      <div className="xl:col-span-8 space-y-8">
        {/* Basic Information */}
        <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-100 dark:border-[#006655]/20 overflow-hidden">
          <div className="px-8 py-6 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-[#D9ECC8]/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-[#D9ECC8] flex items-center justify-center text-[#19322F]">
              <span className="material-icons text-lg">info</span>
            </div>
            <h2 className="text-xl font-bold text-[#19322F] dark:text-white">Basic Information</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="group">
              <label className="block text-sm font-medium text-[#19322F] dark:text-gray-300 mb-1.5 font-sf-pro" htmlFor="title">
                Property Title <span className="text-red-500">*</span>
              </label>
              <input 
                className="w-full text-base px-4 py-2.5 rounded-md border border-gray-200 dark:border-[#006655]/30 bg-white dark:bg-[#0f2320] text-[#19322F] dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all font-sf-pro" 
                id="title" 
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Modern Penthouse with Ocean View" 
                type="text"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#19322F] dark:text-gray-300 mb-1.5 font-sf-pro" htmlFor="price">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-sf-pro text-sm">$</span>
                  <input 
                    className="w-full pl-7 pr-4 py-2.5 rounded-md border border-gray-200 dark:border-[#006655]/30 bg-white dark:bg-[#0f2320] text-[#19322F] dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all text-base font-medium font-sf-pro" 
                    id="price" 
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00" 
                    type="number"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#19322F] dark:text-gray-300 mb-1.5 font-sf-pro" htmlFor="status">Status</label>
                <select 
                  className="w-full px-4 py-2.5 rounded-md border border-gray-200 dark:border-[#006655]/30 bg-white dark:bg-[#0f2320] text-[#19322F] dark:text-white focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all text-base font-sf-pro cursor-pointer" 
                  id="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="FOR SALE">For Sale</option>
                  <option value="FOR RENT">For Rent</option>
                  <option value="SOLD">Sold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#19322F] dark:text-gray-300 mb-1.5 font-sf-pro" htmlFor="type">Property Type</label>
                <select 
                  className="w-full px-4 py-2.5 rounded-md border border-gray-200 dark:border-[#006655]/30 bg-white dark:bg-[#0f2320] text-[#19322F] dark:text-white focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all text-base font-sf-pro cursor-pointer" 
                  id="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Studio">Studio</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-100 dark:border-[#006655]/20 overflow-hidden">
          <div className="px-8 py-6 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-[#D9ECC8]/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-[#D9ECC8] flex items-center justify-center text-[#19322F]">
              <span className="material-icons text-lg">description</span>
            </div>
            <h2 className="text-xl font-bold text-[#19322F] dark:text-white">Description</h2>
          </div>
          <div className="p-8">
            <textarea 
              className="w-full px-4 py-3 rounded-md border border-gray-200 dark:border-[#006655]/30 bg-white dark:bg-[#0f2320] text-[#19322F] dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all text-base font-sf-pro leading-relaxed resize-y min-h-[200px]" 
              id="description" 
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the property features, neighborhood, and unique selling points..."
            ></textarea>
            <div className="mt-2 text-right text-xs text-gray-400 font-sf-pro">
              {formData.description.length} / 2000 characters
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-100 dark:border-[#006655]/20 overflow-hidden">
          <div className="px-8 py-6 border-b border-hint-green/30 flex justify-between items-center bg-gradient-to-r from-[#D9ECC8]/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#D9ECC8] flex items-center justify-center text-[#19322F]">
                <span className="material-icons text-lg">image</span>
              </div>
              <h2 className="text-xl font-bold text-[#19322F] dark:text-white">Gallery</h2>
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-[#0f2320] px-2 py-1 rounded font-sf-pro">JPG, PNG, WEBP</span>
          </div>
          <div className="p-8">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative border-2 border-dashed border-gray-300 dark:border-[#006655]/30 rounded-xl bg-gray-50/50 dark:bg-[#0f2320]/50 p-10 text-center hover:bg-[#D9ECC8]/10 hover:border-[#006655]/40 transition-colors cursor-pointer group"
            >
              <input 
                className="hidden" 
                multiple 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 bg-white dark:bg-[#006655] rounded-full flex items-center justify-center shadow-sm text-[#006655] dark:text-white group-hover:scale-110 transition-transform duration-300">
                  <span className="material-icons text-2xl">cloud_upload</span>
                </div>
                <div className="space-y-1">
                  <p className="text-base font-medium text-[#19322F] dark:text-white font-sf-pro">
                    {uploading ? 'Uploading...' : 'Click or drag images here'}
                  </p>
                  <p className="text-xs text-gray-400 font-sf-pro">Max file size 5MB per image</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {images.map((url, index) => (
                <div key={url} className="aspect-square rounded-lg overflow-hidden relative group shadow-sm">
                  <Image 
                    src={url} 
                    alt={`Property ${index}`} 
                    fill
                    className="object-cover" 
                  />
                  <div className="absolute inset-0 bg-[#19322F]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    <button 
                      onClick={(e) => { e.preventDefault(); handleRemoveImage(url); }}
                      className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors" 
                      type="button"
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </div>
                  {index === 0 && (
                    <span className="absolute top-2 left-2 bg-[#006655] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm font-sf-pro uppercase tracking-wider">Main</span>
                  )}
                </div>
              ))}
              {images.length > 0 && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border border-dashed border-gray-300 dark:border-[#006655]/30 flex flex-col items-center justify-center text-gray-400 hover:text-[#006655] hover:border-[#006655] hover:bg-[#D9ECC8]/20 transition-all group" 
                  type="button"
                >
                  <span className="material-icons group-hover:scale-110 transition-transform">add</span>
                  <span className="text-xs mt-1 font-medium font-sf-pro">Add More</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="xl:col-span-4 space-y-8">
        {/* Location */}
        <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-100 dark:border-[#006655]/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-[#D9ECC8]/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-[#D9ECC8] flex items-center justify-center text-[#19322F]">
              <span className="material-icons text-lg">place</span>
            </div>
            <h2 className="text-lg font-bold text-[#19322F] dark:text-white">Location</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#19322F] dark:text-gray-300 mb-1.5 font-sf-pro" htmlFor="location">Address</label>
              <input 
                className="w-full px-4 py-2.5 rounded-md border border-gray-200 dark:border-[#006655]/30 bg-white dark:bg-[#0f2320] text-[#19322F] dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all text-sm font-sf-pro" 
                id="location" 
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Street Address, City, Zip" 
                type="text"
              />
            </div>
            {/* Coordinate inputs as placeholders for the map preview in the design */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 font-sf-pro">Latitude</label>
                <input 
                  className="w-full px-3 py-2 rounded border border-gray-200 dark:border-[#006655]/30 bg-gray-50 dark:bg-[#0f2320] text-sm" 
                  id="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  type="number"
                  step="any"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 font-sf-pro">Longitude</label>
                <input 
                  className="w-full px-3 py-2 rounded border border-gray-200 dark:border-[#006655]/30 bg-gray-50 dark:bg-[#0f2320] text-sm" 
                  id="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  type="number"
                  step="any"
                />
              </div>
            </div>
            
            <div className="pt-2">
              <label className="block text-sm font-medium text-[#19322F] dark:text-gray-300 mb-2 font-sf-pro">Map Preview</label>
              <MapPicker 
                latitude={formData.latitude} 
                longitude={formData.longitude} 
                onChange={(lat, lng) => {
                  setFormData(prev => ({
                    ...prev,
                    latitude: parseFloat(lat.toFixed(6)),
                    longitude: parseFloat(lng.toFixed(6))
                  }));
                }} 
              />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-100 dark:border-[#006655]/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-[#D9ECC8]/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-[#D9ECC8] flex items-center justify-center text-[#19322F]">
              <span className="material-icons text-lg">straighten</span>
            </div>
            <h2 className="text-lg font-bold text-[#19322F] dark:text-white">Details</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block" htmlFor="area">Area (m²)</label>
                <input 
                  className="w-full text-left px-3 py-2 rounded border border-gray-200 dark:border-[#006655]/30 bg-gray-50 dark:bg-[#0f2320] text-[#19322F] dark:text-white focus:bg-white focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all font-sf-pro text-sm" 
                  id="area" 
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="0" 
                  type="number"
                />
              </div>
              <div className="group">
                <label className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block" htmlFor="year_built">Year Built</label>
                <input 
                  className="w-full text-left px-3 py-2 rounded border border-gray-200 dark:border-[#006655]/30 bg-gray-50 dark:bg-[#0f2320] text-[#19322F] dark:text-white focus:bg-white focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all font-sf-pro text-sm" 
                  id="year_built" 
                  value={formData.year_built}
                  onChange={handleInputChange}
                  placeholder="YYYY" 
                  type="number"
                />
              </div>
            </div>
            <hr className="border-gray-100 dark:border-[#006655]/10"/>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#19322F] dark:text-gray-300 font-sf-pro flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">bed</span> Bedrooms
                </label>
                <div className="flex items-center border border-gray-200 dark:border-[#006655]/30 rounded-md overflow-hidden bg-white dark:bg-[#0f2320] shadow-sm">
                  <button 
                    onClick={() => decrement('beds')}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 transition-colors border-r border-gray-100 dark:border-[#006655]/10" 
                    type="button"
                  >-</button>
                  <input 
                    className="w-10 text-center border-none bg-transparent text-[#19322F] dark:text-white p-0 focus:ring-0 text-sm font-medium font-sf-pro" 
                    readOnly 
                    type="text" 
                    value={formData.beds}
                  />
                  <button 
                    onClick={() => increment('beds')}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 transition-colors border-l border-gray-100 dark:border-[#006655]/10" 
                    type="button"
                  >+</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#19322F] dark:text-gray-300 font-sf-pro flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">shower</span> Bathrooms
                </label>
                <div className="flex items-center border border-gray-200 dark:border-[#006655]/30 rounded-md overflow-hidden bg-white dark:bg-[#0f2320] shadow-sm">
                  <button 
                    onClick={() => decrement('baths')}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 transition-colors border-r border-gray-100 dark:border-[#006655]/10" 
                    type="button"
                  >-</button>
                  <input 
                    className="w-10 text-center border-none bg-transparent text-[#19322F] dark:text-white p-0 focus:ring-0 text-sm font-medium font-sf-pro" 
                    readOnly 
                    type="text" 
                    value={formData.baths}
                  />
                  <button 
                    onClick={() => increment('baths')}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 transition-colors border-l border-gray-100 dark:border-[#006655]/10" 
                    type="button"
                  >+</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#19322F] dark:text-gray-300 font-sf-pro flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">directions_car</span> Parking
                </label>
                <div className="flex items-center border border-gray-200 dark:border-[#006655]/30 rounded-md overflow-hidden bg-white dark:bg-[#0f2320] shadow-sm">
                  <button 
                    onClick={() => decrement('parking')}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 transition-colors border-r border-gray-100 dark:border-[#006655]/10" 
                    type="button"
                  >-</button>
                  <input 
                    className="w-10 text-center border-none bg-transparent text-[#19322F] dark:text-white p-0 focus:ring-0 text-sm font-medium font-sf-pro" 
                    readOnly 
                    type="text" 
                    value={formData.parking}
                  />
                  <button 
                    onClick={() => increment('parking')}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 transition-colors border-l border-gray-100 dark:border-[#006655]/10" 
                    type="button"
                  >+</button>
                </div>
              </div>
            </div>
            <hr className="border-gray-100 dark:border-[#006655]/10"/>
            <div>
              <h3 className="text-sm font-bold text-[#19322F] dark:text-white mb-3 font-sf-pro uppercase tracking-wider text-xs text-gray-500">Amenities</h3>
              <div className="space-y-2">
                {availableAmenities.map(amenity => (
                  <label key={amenity} className="flex items-center gap-2.5 cursor-pointer group">
                    <input 
                      className="w-4 h-4 text-[#006655] border-gray-300 rounded focus:ring-[#006655]" 
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-400 font-sf-pro group-hover:text-[#19322F] dark:group-hover:text-white transition-colors">
                      {amenity}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <hr className="border-gray-100 dark:border-[#006655]/10"/>
            
            <div className="space-y-3">
               <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input 
                    className="w-4 h-4 text-[#006655] border-gray-300 rounded focus:ring-[#006655]" 
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={handleCheckboxChange}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-400 font-sf-pro group-hover:text-[#19322F] dark:group-hover:text-white transition-colors">
                    Featured Property
                  </span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input 
                    className="w-4 h-4 text-[#006655] border-gray-300 rounded focus:ring-[#006655]" 
                    type="checkbox"
                    id="is_exclusive"
                    checked={formData.is_exclusive}
                    onChange={handleCheckboxChange}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-400 font-sf-pro group-hover:text-[#19322F] dark:group-hover:text-white transition-colors">
                    Exclusive Listing
                  </span>
                </label>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#152e2a] border-t border-gray-200 dark:border-[#006655]/20 shadow-xl z-40 flex gap-3 md:relative md:bg-transparent md:border-0 md:shadow-none md:p-0 md:col-span-12 md:justify-end md:mt-8">
        <button 
          onClick={() => router.back()}
          className="flex-1 md:flex-none md:px-8 py-3 rounded-lg border border-gray-300 dark:border-[#006655]/30 bg-white dark:bg-transparent text-[#19322F] dark:text-white font-medium font-sf-pro hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          type="button"
        >
          Cancel
        </button>
        <button 
          className="hidden md:flex px-8 py-3 rounded-lg border border-gray-300 dark:border-[#006655]/30 bg-white dark:bg-transparent text-[#19322F] dark:text-white font-medium font-sf-pro hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          type="button"
          onClick={() => alert('Draft saved successfully!')}
        >
          Save Draft
        </button>
        <button 
          className="flex-1 md:flex-none md:px-8 py-3 rounded-lg bg-[#006655] text-white font-medium font-sf-pro flex justify-center items-center gap-2 hover:bg-[#19322F] transition-colors disabled:opacity-50 shadow-md hover:shadow-lg"
          type="submit"
          disabled={loading || uploading}
        >
          <span className="material-icons text-sm">save</span>
          {loading ? 'Saving...' : mode === 'create' ? 'Save Property' : 'Update Property'}
        </button>
      </div>
    </form>
  );
}
