
export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  price_adjustment: number;
  is_available: boolean;
}

export interface ProductDetail {
  id: string;
  title: string;
  price: number;
  base_price: number;
  status: string;
  description: string;
  design_id: string;
  designs: {
    file_url: string;
    title: string;
    user_id: string;
    profiles: {
      first_name: string;
      last_name: string;
      age_bracket: string;
    };
  };
  product_variants: ProductVariant[];
}
