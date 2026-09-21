
-- First, drop the existing problematic policies
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
DROP POLICY IF EXISTS "Public can view published designs" ON public.designs;
DROP POLICY IF EXISTS "Public can view product variants" ON public.product_variants;
DROP POLICY IF EXISTS "Public can view active collections" ON public.collections;
DROP POLICY IF EXISTS "Public can view creator profiles" ON public.profiles;

-- Create simple, non-recursive policies for public access
CREATE POLICY "Allow public read access to active products" ON public.products
  FOR SELECT 
  USING (status = 'active');

CREATE POLICY "Allow public read access to published designs" ON public.designs
  FOR SELECT 
  USING (status = 'published');

CREATE POLICY "Allow public read access to product variants" ON public.product_variants
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access to collections" ON public.collections
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Allow public read access to profiles" ON public.profiles
  FOR SELECT 
  USING (true);
