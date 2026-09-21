import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface FeaturedProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  creatorName: string;
  creatorAge: string;
  creatorState: string;
  creatorUserId: string;
  imageUrl?: string;
  collectionId?: string;
  design?: { file_url: string };
  variants?: Array<{
    id: string;
    size: string;
    color: string;
    price_adjustment: number;
    is_available: boolean;
  }>;
}

const fetchFeaturedProducts = async (): Promise<FeaturedProduct[]> => {
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id, title, base_price, price, collection_id, design_id, status, created_at,
      designs!inner (id, file_url, user_id, status),
      product_variants (id, size, color, price_adjustment, is_available)
    `)
    .eq('status', 'active')
    .eq('designs.status', 'published')
    .order('created_at', { ascending: false })
    .limit(4);

  if (error) throw error;
  if (!products?.length) return [];

  const userIds = [...new Set(products.map(p => p.designs?.user_id).filter(Boolean))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, age_bracket, state')
    .in('id', userIds);

  const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

  return products.map((product: any) => {
    const profile = profileMap.get(product.designs?.user_id);
    return {
      id: product.id,
      title: product.title,
      slug: product.id,
      price: Number(product.base_price || product.price),
      creatorName: profile
        ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Young Creator'
        : 'Young Creator',
      creatorAge: profile?.age_bracket || 'Unknown',
      creatorState: profile?.state || 'Unknown',
      creatorUserId: product.designs?.user_id || '',
      imageUrl: product.designs?.file_url,
      collectionId: product.collection_id,
      design: { file_url: product.designs?.file_url || '' },
      variants: product.product_variants || []
    };
  });
};

export const useFeaturedProducts = () => {
  const { data: featuredProducts = [], isLoading: loading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: fetchFeaturedProducts,
  });

  return { featuredProducts, loading };
};
