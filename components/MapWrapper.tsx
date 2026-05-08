"use client";

import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./Map'), { 
  ssr: false, 
  loading: () => (
    <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center">
      <span className="material-icons text-mosque/50">map</span>
    </div>
  ) 
});

interface MapWrapperProps {
  location: string;
  className?: string;
}

export default function MapWrapper({ location, className }: MapWrapperProps) {
  return <DynamicMap location={location} className={className} />;
}
