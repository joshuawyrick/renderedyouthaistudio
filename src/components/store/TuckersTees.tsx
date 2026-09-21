
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import TuckersTeesHeader from './TuckersTeesHeader';
import TuckersTeesContent from './TuckersTeesContent';

interface TuckersProduct {
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
  design?: {
    file_url: string;
  };
  variants?: Array<{
    id: string;
    size: string;
    color: string;
    price_adjustment: number;
    is_available: boolean;
  }>;
}

const TuckersTees: React.FC = () => {
  const [tuckersProducts, setTuckersProducts] = useState<TuckersProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTuckersProducts();
  }, []);

  const fetchTuckersProducts = async () => {
    try {
      // First get the Tucker's Tees collection
      const { data: collection, error: collectionError } = await supabase
        .from('collections')
        .select('id')
        .eq('slug', 'tuckers-tees')
        .single();

      if (collectionError || !collection) {
        setLoading(false);
        return;
      }

      // Fetch products in Tucker's Tees collection
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          id,
          title,
          description,
          base_price,
          price,
          collection_id,
          design_id,
          status,
          designs!inner (
            id,
            file_url,
            user_id,
            status
          ),
          product_variants (
            id,
            size,
            color,
            price_adjustment,
            is_available
          )
        `)
        .eq('status', 'active')
        .eq('collection_id', collection.id)
        .eq('designs.status', 'published')
        .limit(3); // Show only first 3 products

      if (productsError) {
        console.error('Error fetching Tucker\'s products:', productsError);
        setLoading(false);
        return;
      }

      if (!products || products.length === 0) {
        setLoading(false);
        return;
      }

      // Get creator profiles
      const designUserIds = products.map(product => product.designs?.user_id).filter(Boolean);
      let profilesData = [];
      
      if (designUserIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, age_bracket')
          .in('id', designUserIds);

        if (!profilesError) {
          profilesData = profiles || [];
        }
      }

      // Format products for display
      const formattedProducts: TuckersProduct[] = products.map((product: any) => {
        const profile = profilesData.find(p => p.id === product.designs?.user_id);
        return {
          id: product.id,
          title: product.title,
          slug: product.title.toLowerCase().replace(/\s+/g, '-'),
          price: Number(product.base_price || product.price),
          creatorName: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Tucker',
          creatorAge: profile?.age_bracket || 'Co-Founder',
          creatorState: 'Unknown',
          creatorUserId: product.designs?.user_id || '',
          imageUrl: product.designs?.file_url,
          collectionId: product.collection_id,
          design: {
            file_url: product.designs?.file_url || ''
          },
          variants: product.product_variants || []
        };
      });

      setTuckersProducts(formattedProducts);
    } catch (error) {
      console.error('Error in fetchTuckersProducts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllClick = () => {
    // Filter to show only Tucker's Tees collection products
    const searchParams = new URLSearchParams();
    searchParams.set('collection', 'tuckers-tees');
    window.location.href = `/store?${searchParams.toString()}`;
  };

  return (
    <div className="mb-16">
      <TuckersTeesHeader />
      <TuckersTeesContent 
        products={tuckersProducts}
        loading={loading}
        onViewAllClick={handleViewAllClick}
      />
    </div>
  );
};

export default TuckersTees;
