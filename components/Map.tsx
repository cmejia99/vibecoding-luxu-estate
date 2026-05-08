"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

interface MapProps {
  location: string;
  className?: string;
}

export default function Map({ location, className }: MapProps) {
  // We use standard coordinates for demo purposes if geocoding isn't implemented.
  const [position, setPosition] = useState<[number, number]>([37.4419, -122.1430]); // Default Palo Alto

  useEffect(() => {
    // Basic mock geocoding based on location string
    if (location.toLowerCase().includes('miami')) {
      setPosition([25.7617, -80.1918]);
    } else if (location.toLowerCase().includes('new york')) {
      setPosition([40.7128, -74.0060]);
    } else if (location.toLowerCase().includes('aspen')) {
      setPosition([39.1911, -106.8175]);
    } else if (location.toLowerCase().includes('beverly')) {
      setPosition([34.0736, -118.4004]);
    } else if (location.toLowerCase().includes('hawaii')) {
      setPosition([21.3069, -157.8583]);
    } else if (location.toLowerCase().includes('lake tahoe')) {
      setPosition([39.0968, -120.0324]);
    }
  }, [location]);

  return (
    <div className={className}>
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            {location}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
