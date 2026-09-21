// Product-specific types for admin product management

export interface DesignProfile {
  first_name: string;
  last_name: string;
}

export interface Design {
  id: string;
  title: string;
  file_url: string;
  status: string;
  user_id: string;
  created_at?: string;
  profiles: DesignProfile;
}

export interface ProductDesign {
  title: string;
  file_url: string;
  profiles: DesignProfile;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  base_price: number | null;
  status: string;
  creator_commission_rate: number;
  created_at: string;
  design_id: string;
  collection_id: string | null;
  assigned_user_id: string | null;
  collection_name?: string;
  assigned_user_name?: string;
  designs: ProductDesign;
}

export interface ProductVariant {
  size: string;
  color: string;
  priceAdjustment: number;
  isAvailable: boolean;
}
