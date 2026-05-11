'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon in Next.js
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapPickerProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
}

// Component to handle map clicks
function MapEvents({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to handle map movement when props change
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapPicker({ latitude, longitude, onChange }: MapPickerProps) {
  const position: [number, number] = [latitude || 0, longitude || 0];

  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden border border-gray-200 dark:border-[#006655]/30 shadow-inner z-0">
      <MapContainer 
        center={position} 
        zoom={latitude === 0 && longitude === 0 ? 2 : 13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={position} />
        <MapEvents onChange={onChange} />
        <Marker position={position} icon={customIcon} draggable={true}
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const position = marker.getLatLng();
              onChange(position.lat, position.lng);
            },
          }}
        />
      </MapContainer>
      <div className="bg-gray-50 dark:bg-[#0f2320] px-3 py-1.5 text-[10px] text-gray-500 dark:text-gray-400 font-medium border-t border-gray-100 dark:border-[#006655]/10 flex justify-between items-center">
        <span>Click on map or drag marker to set coordinates</span>
        <span className="flex items-center gap-1">
          <span className="material-icons text-[12px]">info</span>
          Interactive Map
        </span>
      </div>
    </div>
  );
}
