import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { createProductFromDesign, updateProductStatus } from '@/services/productService';
import type { Design, Product } from '@/components/admin/product/types';

type ProductsSetter = (updater: (prev: Product[]) => Product[]) => void;

export const useProductActions = (onDataChange: () => void, setProducts: ProductsSetter) => {
  const [creating, setCreating] = useState<string | null>(null);
  const { toast } = useToast();

  const createProduct = useCallback(async (design: Design) => {
    setCreating(design.id);
    try {
      await createProductFromDesign(design);

      toast({
        title: "Success",
        description: "Product created successfully",
      });

      onDataChange();
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setCreating(null);
    }
  }, [onDataChange, toast]);

  const toggleProductStatus = useCallback(async (product: Product) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    
    try {
      await updateProductStatus(product.id, newStatus);

      setProducts(prev => 
        prev.map(p => 
          p.id === product.id ? { ...p, status: newStatus } : p
        )
      );

      toast({
        title: "Success",
        description: `Product ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  }, [setProducts, toast]);

  return {
    creating,
    createProduct,
    toggleProductStatus
  };
};
