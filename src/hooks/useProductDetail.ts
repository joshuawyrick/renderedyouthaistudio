
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { ProductDetail } from '@/components/product/types';

export const useProductDetail = (slug: string | undefined) => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      // First, try to find the product by slug (which should be the product ID)
      // If that fails, try to find by title matching
      let productData;
      let productError;

      // Try to fetch by ID first (assuming slug might be product ID)
      const { data: productById, error: errorById } = await supabase
        .from('products')
        .select(`
          id,
          title,
          price,
          base_price,
          status,
          description,
          design_id,
          designs (
            file_url,
            title,
            user_id
          ),
          product_variants (
            id,
            size,
            color,
            price_adjustment,
            is_available
          )
        `)
        .eq('id', slug)
        .eq('status', 'active')
        .maybeSingle();

      if (productById) {
        productData = productById;
      } else {
        // Fallback: try to find by title match
        const searchTitle = slug?.replace(/-/g, ' ') || '';
        const { data: productByTitle, error: errorByTitle } = await supabase
          .from('products')
          .select(`
            id,
            title,
            price,
            base_price,
            status,
            description,
            design_id,
            designs (
              file_url,
              title,
              user_id
            ),
            product_variants (
              id,
              size,
              color,
              price_adjustment,
              is_available
            )
          `)
          .ilike('title', `%${searchTitle}%`)
          .eq('status', 'active')
          .maybeSingle();

        productData = productByTitle;
        productError = errorByTitle;
      }

      if (productError) {
        console.error('Error fetching product:', productError);
        throw productError;
      }

      if (!productData || !productData.designs) {
        throw new Error('Product not found');
      }

      // Get the profile data separately with more complete information
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, age_bracket, state, bio, profile_image_url')
        .eq('id', productData.designs.user_id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // Don't throw error, just use default values
      }

      // Combine the data
      const combinedProduct: ProductDetail = {
        id: productData.id,
        title: productData.title,
        price: productData.price,
        base_price: productData.base_price || productData.price,
        status: productData.status,
        description: productData.description || '',
        design_id: productData.design_id,
        designs: {
          file_url: productData.designs.file_url,
          title: productData.designs.title,
          user_id: productData.designs.user_id,
          profiles: {
            first_name: profileData?.first_name || 'Unknown',
            last_name: profileData?.last_name || 'Creator',
            age_bracket: profileData?.age_bracket || 'Unknown'
          }
        },
        product_variants: productData.product_variants || []
      };

      setProduct(combinedProduct);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { product, loading };
};
