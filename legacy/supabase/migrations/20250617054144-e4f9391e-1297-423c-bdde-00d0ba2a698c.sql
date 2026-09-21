
-- Check current RLS policies on products table and related tables
-- and create public read access for store functionality

-- Allow public read access to products table for active products
CREATE POLICY "Public can view active products" ON public.products
  FOR SELECT 
  USING (status = 'active');

-- Allow public read access to designs that are published and associated with active products
CREATE POLICY "Public can view published designs" ON public.designs
  FOR SELECT 
  USING (
    status = 'published' AND 
    id IN (SELECT design_id FROM public.products WHERE status = 'active')
  );

-- Allow public read access to product variants for active products
CREATE POLICY "Public can view product variants" ON public.product_variants
  FOR SELECT 
  USING (
    product_id IN (SELECT id FROM public.products WHERE status = 'active')
  );

-- Allow public read access to collections
CREATE POLICY "Public can view active collections" ON public.collections
  FOR SELECT 
  USING (is_active = true);

-- Allow public read access to profiles for creator information display
CREATE POLICY "Public can view creator profiles" ON public.profiles
  FOR SELECT 
  USING (
    id IN (
      SELECT d.user_id 
      FROM public.designs d 
      JOIN public.products p ON d.id = p.design_id 
      WHERE d.status = 'published' AND p.status = 'active'
    )
  );
