import { supabase } from './supabase';

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  price_per_month: number | null;
  beds: number;
  baths: number;
  area: number;
  latitude: number;
  longitude: number;
  images: string[];
  slug: string;
  status: 'FOR SALE' | 'FOR RENT';
  type: 'House' | 'Apartment' | 'Villa' | 'Penthouse' | 'Studio';
  is_exclusive: boolean;
  is_new: boolean;
  is_featured: boolean;
  section: 'featured' | 'market';
  amenities: string[];
}

export interface PropertyFilters {
  query?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
  amenities?: string[];
}

export const PAGE_SIZE = 8;

export async function getFeaturedProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }

  return data as Property[];
}

export async function getMarketProperties(
  page: number,
  pageSize: number = PAGE_SIZE,
  filters: PropertyFilters = {}
): Promise<{ properties: Property[]; total: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('is_featured', false)
    .order('created_at', { ascending: true });

  if (filters.query) {
    query = query.or(`title.ilike.%${filters.query}%,location.ilike.%${filters.query}%`);
  }

  if (filters.type && filters.type !== 'All') {
    query = query.eq('type', filters.type);
  }

  if (filters.minPrice && filters.minPrice > 0) {
    query = query.gte('price', filters.minPrice);
  }

  if (filters.maxPrice && filters.maxPrice > 0) {
    query = query.lte('price', filters.maxPrice);
  }

  if (filters.minBeds && filters.minBeds > 0) {
    query = query.gte('beds', filters.minBeds);
  }

  if (filters.minBaths && filters.minBaths > 0) {
    query = query.gte('baths', filters.minBaths);
  }

  if (filters.amenities && filters.amenities.length > 0) {
    query = query.contains('amenities', filters.amenities);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error('Error fetching market properties:', error);
    return { properties: [], total: 0 };
  }

  return {
    properties: data as Property[],
    total: count ?? 0,
  };
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`Error fetching property with slug ${slug}:`, error);
    return null;
  }

  return data as Property;
}
