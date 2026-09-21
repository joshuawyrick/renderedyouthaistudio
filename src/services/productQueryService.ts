import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/components/admin/product/types';

const DEFAULT_PROFILE = { first_name: 'Unknown', last_name: 'Creator' };

export const fetchProductsWithDesigns = async (): Promise<Product[]> => {
  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select(`
      id, title, description, price, base_price, status, 
      creator_commission_rate, created_at, design_id,
      collection_id, assigned_user_id,
      collections(name, slug)
    `)
    .order('created_at', { ascending: false });

  if (productsError) throw productsError;
  if (!productsData?.length) return [];

  // Batch fetch designs and profiles
  const designIds = productsData.map(p => p.design_id);
  const { data: designs, error: designsError } = await supabase
    .from('designs')
    .select('id, title, file_url, user_id')
    .in('id', designIds);

  if (designsError) throw designsError;

  const designMap = new Map(designs?.map(d => [d.id, d]) || []);
  const userIds = [...new Set(designs?.map(d => d.user_id) || [])];
  const assignedUserIds = productsData.map(p => p.assigned_user_id).filter(Boolean) as string[];
  const allUserIds = [...new Set([...userIds, ...assignedUserIds])];

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .in('id', allUserIds);

  const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

  return productsData
    .map(product => {
      const design = designMap.get(product.design_id);
      if (!design) return null;

      const profile = profileMap.get(design.user_id);
      const assignedProfile = product.assigned_user_id 
        ? profileMap.get(product.assigned_user_id) 
        : null;

      return {
        id: product.id,
        title: product.title,
        description: product.description || '',
        price: product.price,
        base_price: product.base_price,
        status: product.status,
        creator_commission_rate: product.creator_commission_rate,
        created_at: product.created_at,
        design_id: product.design_id,
        collection_id: product.collection_id,
        assigned_user_id: product.assigned_user_id,
        collection_name: product.collections?.name || '',
        assigned_user_name: assignedProfile 
          ? `${assignedProfile.first_name} ${assignedProfile.last_name}` 
          : '',
        designs: {
          title: design.title,
          file_url: design.file_url,
          profiles: profile || DEFAULT_PROFILE
        }
      } as Product;
    })
    .filter((p): p is Product => p !== null);
};
