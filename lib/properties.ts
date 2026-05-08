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
  image_url: string;
  status: 'FOR SALE' | 'FOR RENT';
  type: 'House' | 'Apartment' | 'Villa' | 'Penthouse' | 'Studio';
  is_exclusive: boolean;
  is_new: boolean;
  is_featured: boolean;
  section: 'featured' | 'market';
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
  pageSize: number = PAGE_SIZE
): Promise<{ properties: Property[]; total: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('is_featured', false)
    .order('created_at', { ascending: true })
    .range(from, to);

  if (error) {
    console.error('Error fetching market properties:', error);
    return { properties: [], total: 0 };
  }

  return {
    properties: data as Property[],
    total: count ?? 0,
  };
}
