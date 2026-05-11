'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateUserRole(userId: string, role: 'user' | 'admin') {
  const supabase = await createClient();

  // Check if current user is admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/dashboard');
}

export async function togglePropertyStatus(propertyId: string, isActive: boolean) {
  const supabase = await createClient();

  // Check admin
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id)
    .single();

  if (profile?.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabase
    .from('properties')
    .update({ is_active: isActive })
    .eq('id', propertyId);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/properties');
  revalidatePath('/');
}
