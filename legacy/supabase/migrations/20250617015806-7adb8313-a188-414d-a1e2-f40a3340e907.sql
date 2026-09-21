
-- Create collections table for organizing designs
CREATE TABLE public.collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subcollections table
CREATE TABLE public.subcollections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(collection_id, slug)
);

-- Add collection and subcollection references to designs table
ALTER TABLE public.designs 
ADD COLUMN collection_id UUID REFERENCES public.collections(id),
ADD COLUMN subcollection_id UUID REFERENCES public.subcollections(id);

-- Create product variants table for different shirt types, sizes, colors
CREATE TABLE public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  variant_type TEXT NOT NULL, -- 't-shirt', 'hoodie', 'tank-top', etc.
  size TEXT NOT NULL, -- 'XS', 'S', 'M', 'L', 'XL', etc.
  color TEXT NOT NULL, -- 'white', 'black', 'navy', etc.
  printful_variant_id TEXT, -- Printful's variant ID for this specific combination
  price_adjustment DECIMAL(10,2) DEFAULT 0.00, -- Additional cost for this variant
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Printful integration tracking table
CREATE TABLE public.printful_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  printful_product_id TEXT NOT NULL UNIQUE,
  sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'failed', 'needs_update')),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_collections_slug ON public.collections(slug);
CREATE INDEX idx_subcollections_collection_id ON public.subcollections(collection_id);
CREATE INDEX idx_subcollections_slug ON public.subcollections(collection_id, slug);
CREATE INDEX idx_designs_collection_id ON public.designs(collection_id);
CREATE INDEX idx_designs_subcollection_id ON public.designs(subcollection_id);
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX idx_printful_products_product_id ON public.printful_products(product_id);

-- Enable RLS on new tables
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcollections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.printful_products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for collections (public read, admin write)
CREATE POLICY "Anyone can view active collections" ON public.collections
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage collections" ON public.collections
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

-- RLS Policies for subcollections (public read, admin write)
CREATE POLICY "Anyone can view active subcollections" ON public.subcollections
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage subcollections" ON public.subcollections
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

-- RLS Policies for product variants (public read, admin write)
CREATE POLICY "Anyone can view available variants" ON public.product_variants
  FOR SELECT USING (is_available = true);

CREATE POLICY "Admins can manage variants" ON public.product_variants
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

-- RLS Policies for printful products (admin only)
CREATE POLICY "Admins can manage printful products" ON public.printful_products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

-- Insert some default collections to get started
INSERT INTO public.collections (name, description, slug, sort_order) VALUES
('Kids Art', 'Original artwork by young creators', 'kids-art', 1),
('Seasonal', 'Holiday and seasonal designs', 'seasonal', 2),
('Animals', 'Animal-themed designs', 'animals', 3),
('Fantasy', 'Dragons, unicorns, and magical creatures', 'fantasy', 4);

-- Insert some default subcollections
INSERT INTO public.subcollections (collection_id, name, description, slug, sort_order) 
SELECT 
  c.id,
  sc.name,
  sc.description,
  sc.slug,
  sc.sort_order
FROM public.collections c
CROSS JOIN (VALUES
  ('Spring', 'Spring-themed designs', 'spring', 1),
  ('Summer', 'Summer vacation vibes', 'summer', 2),
  ('Fall', 'Autumn and back-to-school', 'fall', 3),
  ('Winter', 'Winter holidays and snow', 'winter', 4)
) sc(name, description, slug, sort_order)
WHERE c.slug = 'seasonal';
