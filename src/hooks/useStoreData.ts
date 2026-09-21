import { useQuery } from '@tanstack/react-query';
import { fetchProductsForStore } from '@/services/storeProductService';
import { useMemo } from 'react';

interface Collection {
  id: string;
  name: string;
  slug: string;
}

interface Product {
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

export const useStoreData = () => {
  const { data: rawData = [], isLoading: loading } = useQuery({
    queryKey: ['store-products'],
    queryFn: fetchProductsForStore,
  });

  const collections = useMemo(() => {
    return rawData
      .filter((product: any) => product.collections && product.collection_id)
      .reduce((acc: Collection[], product: any) => {
        if (!acc.find(c => c.id === product.collection_id)) {
          acc.push({
            id: product.collection_id,
            name: product.collections?.name || 'Unnamed Collection',
            slug: product.collections?.slug || ''
          });
        }
        return acc;
      }, []);
  }, [rawData]);

  const products: Product[] = useMemo(() => {
    return rawData.map((product: any) => {
      const profile = product.designs?.profiles;
      const creatorName = profile
        ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown Creator'
        : 'Unknown Creator';

      return {
        id: product.id,
        title: product.title,
        slug: product.title.toLowerCase().replace(/\s+/g, '-'),
        price: Number(product.base_price || product.price),
        creatorName,
        creatorAge: profile?.age_bracket || 'Unknown',
        creatorState: profile?.state || 'Unknown',
        creatorUserId: product.designs?.user_id || '',
        imageUrl: product.designs?.file_url,
        collectionId: product.collection_id,
        design: { file_url: product.designs?.file_url || '' },
        variants: product.product_variants || []
      };
    });
  }, [rawData]);

  return { collections, products, loading };
};
