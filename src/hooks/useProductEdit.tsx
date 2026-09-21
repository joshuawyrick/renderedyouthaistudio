
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { fetchProductImages, saveProductImages, type ProductImage } from '@/services/productImageService';
import type { Product } from '@/components/admin/product/types';

interface ProductVariant {
  id?: string;
  size: string;
  color: string;
  priceAdjustment: number;
  isAvailable: boolean;
}

export const useProductEdit = (product: Product | null, open: boolean) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState(25.00);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [originalImages, setOriginalImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (product && open) {
      setTitle(product.title);
      setDescription(product.description || '');
      setBasePrice(Number(product.base_price || product.price));
      fetchProductVariants();
      loadProductImages();
    }
  }, [product, open]);

  const loadProductImages = async () => {
    if (!product) return;
    
    try {
      const productImages = await fetchProductImages(product.id);
      setImages(productImages);
      setOriginalImages([...productImages]);
    } catch (error) {
      console.error('Error loading product images:', error);
      if (product.designs?.file_url) {
        const fallbackImages = [{
          url: product.designs.file_url,
          altText: product.title,
          sortOrder: 1
        }];
        setImages(fallbackImages);
        setOriginalImages([...fallbackImages]);
      }
    }
  };

  const fetchProductVariants = async () => {
    if (!product) return;

    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', product.id)
        .order('size', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setVariants(data.map(v => ({
          id: v.id,
          size: v.size,
          color: v.color,
          priceAdjustment: Number(v.price_adjustment),
          isAvailable: v.is_available
        })));
      } else {
        setVariants([]);
      }
    } catch (error) {
      console.error('Error fetching variants:', error);
      setVariants([]);
    }
  };

  const handleSave = async (onComplete: () => void, onOpenChange: (open: boolean) => void) => {
    if (!product) return;

    setLoading(true);
    try {
      // Update product basic info
      const { error: productError } = await supabase
        .from('products')
        .update({
          title,
          description: description || null, // Ensure description is saved
          base_price: basePrice,
          price: basePrice,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);

      if (productError) throw productError;

      // Save product images with cleanup of removed images
      await saveProductImages(product.id, images, originalImages);

      // Delete existing variants
      const { error: deleteError } = await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', product.id);

      if (deleteError) throw deleteError;

      // Insert new variants (including both available and unavailable)
      const variantInserts = variants.map(variant => ({
        product_id: product.id,
        variant_type: 'size_color',
        size: variant.size,
        color: variant.color,
        price_adjustment: variant.priceAdjustment,
        is_available: variant.isAvailable
      }));

      if (variantInserts.length > 0) {
        const { error: variantsError } = await supabase
          .from('product_variants')
          .insert(variantInserts);

        if (variantsError) throw variantsError;
      }

      toast({
        title: "Success",
        description: "Product updated successfully!",
      });

      onComplete();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    basePrice,
    setBasePrice,
    variants,
    setVariants,
    images,
    setImages,
    loading,
    handleSave
  };
};
