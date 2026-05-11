'use client';

import { togglePropertyStatus } from '@/app/admin/actions';
import Image from 'next/image';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  status: string;
  type: string;
  images: string[];
}

export default function PropertyTable({ properties }: { properties: Property[] }) {
  const handleDeactivate = async (id: string) => {
    if (confirm('¿Deseas desactivar esta propiedad?')) {
      await togglePropertyStatus(id, false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <div className="col-span-6">Property Details</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>
      
      {properties.map((property) => (
        <div key={property.id} className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors items-center">
          <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
            <div className="relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
              {property.images?.[0] && (
                <Image 
                  src={property.images[0]} 
                  alt={property.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#19322F] group-hover:text-[#006655] transition-colors">
                {property.title}
              </h3>
              <p className="text-sm text-gray-500">{property.location}</p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                <span>{property.type}</span>
              </div>
            </div>
          </div>
          <div className="col-span-6 md:col-span-2">
            <div className="text-base font-semibold text-[#19322F]">
              ${property.price.toLocaleString()}
            </div>
          </div>
          <div className="col-span-6 md:col-span-2">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              property.status === 'FOR SALE' ? 'bg-[#D9ECC8] text-[#006655]' : 'bg-blue-100 text-blue-700'
            }`}>
              {property.status}
            </span>
          </div>
          <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
            <button className="p-2 rounded-lg text-gray-400 hover:text-[#006655] hover:bg-[#D9ECC8]/30 transition-all">
              <span className="material-icons text-xl">edit</span>
            </button>
            <button 
              onClick={() => handleDeactivate(property.id)}
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
            >
              <span className="material-icons text-xl">visibility_off</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
