import { supabase } from '@/integrations/supabase/client';

const DEFAULT_PROFILE = { first_name: 'Unknown', last_name: 'Creator', age_bracket: 'Unknown' };

export const fetchProductsForStore = async () => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, title, description, base_price, price, collection_id, design_id, status,
      designs!inner (id, file_url, user_id, status),
      collections (name, slug),
      product_variants (id, size, color, price_adjustment, is_available)
    `)
    .eq('status', 'active')
    .eq('designs.status', 'published');

  if (error) throw error;
  if (!data?.length) return [];

  // Batch fetch profiles
  const userIds = [...new Set(data.map(p => p.designs?.user_id).filter(Boolean))];
  
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, age_bracket')
    .in('id', userIds);

  const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

  return data.map(product => ({
    ...product,
    designs: {
      ...product.designs,
      profiles: profileMap.get(product.designs?.user_id) || DEFAULT_PROFILE
    }
  }));
};
