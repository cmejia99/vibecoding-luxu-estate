import { createClient } from './client';

export async function uploadPropertyImage(file: File): Promise<string | null> {
  const supabase = createClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = `property-images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('properties')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return null;
  }

  const { data } = supabase.storage
    .from('properties')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deletePropertyImage(url: string): Promise<boolean> {
  const supabase = createClient();
  const fileName = url.split('/').pop();
  if (!fileName) return false;

  const { error } = await supabase.storage
    .from('properties')
    .remove([`property-images/${fileName}`]);

  if (error) {
    console.error('Error deleting image:', error);
    return false;
  }

  return true;
}
