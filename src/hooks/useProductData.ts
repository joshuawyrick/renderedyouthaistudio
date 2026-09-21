import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { fetchDesignsWithProfiles, fetchProductsWithDesigns } from '@/services/productService';
import type { Design, Product } from '@/components/admin/product/types';

export const useProductData = () => {
  const [availableDesigns, setAvailableDesigns] = useState<Design[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    
    try {
      setAvailableDesigns([]);
      setProducts([]);
      
      const [designs, productsData] = await Promise.all([
        fetchDesignsWithProfiles(),
        fetchProductsWithDesigns()
      ]);

      setAvailableDesigns(designs);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching product data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    availableDesigns,
    products,
    loading,
    fetchData,
    setProducts
  };
};
