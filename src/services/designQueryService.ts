import { supabase } from '@/integrations/supabase/client';
import type { Design } from '@/components/admin/product/types';

export const fetchDesignsWithProfiles = async (): Promise<Design[]> => {
  // Fetch published designs that don't have products yet
  const [designsResult, productsResult] = await Promise.all([
    supabase
      .from('designs')
      .select('id, title, file_url, status, user_id, created_at')
      .eq('status', 'published'),
    supabase
      .from('products')
      .select('design_id')
  ]);

  if (designsResult.error) throw designsResult.error;
  if (productsResult.error) throw productsResult.error;

  const existingDesignIds = new Set(productsResult.data?.map(p => p.design_id) || []);
  const availableDesigns = designsResult.data?.filter(d => !existingDesignIds.has(d.id)) || [];

  if (availableDesigns.length === 0) return [];

  // Fetch profiles for available designs
  const userIds = [...new Set(availableDesigns.map(d => d.user_id))];
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .in('id', userIds);

  if (profilesError) throw profilesError;

  const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

  return availableDesigns.map(design => ({
    ...design,
    profiles: profileMap.get(design.user_id) || { first_name: 'Unknown', last_name: 'User' }
  }));
};
