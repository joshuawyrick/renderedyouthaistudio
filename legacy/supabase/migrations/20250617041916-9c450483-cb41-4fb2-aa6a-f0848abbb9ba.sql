
-- Add product variants table for sizes, colors, and pricing
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  variant_type TEXT NOT NULL CHECK (variant_type IN ('size', 'color', 'size_color')),
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  price_adjustment DECIMAL(10,2) DEFAULT 0.00,
  is_available BOOLEAN NOT NULL DEFAULT true,
  printful_variant_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_available ON public.product_variants(is_available);

-- Add collection_id to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS collection_id UUID REFERENCES public.collections(id);

-- Add user assignment capability to products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS assigned_user_id UUID;

-- Add description and other product details
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS base_price DECIMAL(10,2) DEFAULT 25.00;

-- Update existing products to use base_price
UPDATE public.products SET base_price = price WHERE base_price IS NULL;

-- Enable RLS on product_variants
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_variants
CREATE POLICY "Admins can manage all product variants" ON public.product_variants
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Public can view available product variants" ON public.product_variants
  FOR SELECT USING (is_available = true);

-- Add collection_id index to products
CREATE INDEX IF NOT EXISTS idx_products_collection_id ON public.products(collection_id);
