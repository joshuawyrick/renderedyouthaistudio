import { supabase } from '@/integrations/supabase/client';
import type { Design } from '@/components/admin/product/types';

export interface ProductCreateData {
  title: string;
  description?: string;
  design_id: string;
  price: number;
  base_price: number;
  creator_commission_rate: number;
  collection_id?: string;
  assigned_user_id?: string;
  status: string;
}

export const createProductFromDesign = async (design: Design) => {
  const { error } = await supabase
    .from('products')
    .insert({
      title: design.title,
      design_id: design.id,
      price: 25.00,
      base_price: 25.00,
      creator_commission_rate: 0.15,
      status: 'active'
    });

  if (error) throw error;
};

export const createProductWithDetails = async (productData: ProductCreateData) => {
  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateProductStatus = async (productId: string, status: string) => {
  const { error } = await supabase
    .from('products')
    .update({ status })
    .eq('id', productId);

  if (error) throw error;
};

export const updateProductDetails = async (productId: string, updates: Partial<ProductCreateData>) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
