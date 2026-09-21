
import { supabase } from '@/integrations/supabase/client';

export interface DiscountCode {
  id: string;
  code: string;
  name: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_amount: number;
  is_active: boolean;
  usage_limit?: number;
  usage_count: number;
  valid_from?: string;
  valid_until?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export const fetchDiscountCode = async (code: string): Promise<DiscountCode | null> => {
  const { data, error } = await supabase
    .from('discount_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching discount code:', error);
    return null;
  }

  // Check if code is still valid based on dates
  const now = new Date();
  if (data.valid_from && new Date(data.valid_from) > now) {
    return null;
  }
  if (data.valid_until && new Date(data.valid_until) < now) {
    return null;
  }

  // Check usage limit
  if (data.usage_limit && data.usage_count >= data.usage_limit) {
    return null;
  }

  return data as DiscountCode;
};

export const fetchAllDiscountCodes = async (): Promise<DiscountCode[]> => {
  const { data, error } = await supabase
    .from('discount_codes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching discount codes:', error);
    return [];
  }

  return (data || []) as DiscountCode[];
};

export const createDiscountCode = async (discountCode: Omit<DiscountCode, 'id' | 'created_at' | 'updated_at' | 'usage_count'>): Promise<DiscountCode | null> => {
  const { data, error } = await supabase
    .from('discount_codes')
    .insert([{
      ...discountCode,
      code: discountCode.code.toUpperCase(),
      created_by: (await supabase.auth.getUser()).data.user?.id
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating discount code:', error);
    return null;
  }

  return data as DiscountCode;
};

export const updateDiscountCode = async (id: string, updates: Partial<DiscountCode>): Promise<DiscountCode | null> => {
  const { data, error } = await supabase
    .from('discount_codes')
    .update({
      ...updates,
      code: updates.code ? updates.code.toUpperCase() : undefined,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating discount code:', error);
    return null;
  }

  return data as DiscountCode;
};

export const deleteDiscountCode = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('discount_codes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting discount code:', error);
    return false;
  }

  return true;
};
