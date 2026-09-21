
-- First, let's see what statuses exist and update them to valid ones
UPDATE public.designs 
SET status = CASE 
  WHEN status = 'mockups_ready' THEN 'mockups_ready'
  WHEN status = 'pending_review' THEN 'pending_review'
  WHEN status = 'approved' THEN 'selected'
  WHEN status = 'pending' THEN 'pending_review'
  WHEN status IS NULL THEN 'pending_review'
  ELSE 'pending_review'
END;

-- Create products table to track published designs as sellable products
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  design_id UUID REFERENCES public.designs(id) NOT NULL,
  title TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 25.00,
  creator_commission_rate DECIMAL(5,4) NOT NULL DEFAULT 0.15, -- 15% default
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sales table to track individual shirt sales
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  customer_email TEXT,
  customer_name TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  creator_commission DECIMAL(10,2) NOT NULL,
  admin_revenue DECIMAL(10,2) NOT NULL,
  sale_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  order_status TEXT NOT NULL DEFAULT 'completed' CHECK (order_status IN ('pending', 'completed', 'refunded', 'cancelled'))
);

-- Create revenue_distributions table to track payouts to creators
CREATE TABLE public.revenue_distributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_user_id UUID NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_sales_amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  payout_status TEXT NOT NULL DEFAULT 'pending' CHECK (payout_status IN ('pending', 'paid', 'failed')),
  payout_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_products_design_id ON public.products(design_id);
CREATE INDEX idx_sales_product_id ON public.sales(product_id);
CREATE INDEX idx_sales_sale_date ON public.sales(sale_date);
CREATE INDEX idx_revenue_distributions_creator ON public.revenue_distributions(creator_user_id);
CREATE INDEX idx_revenue_distributions_period ON public.revenue_distributions(period_start, period_end);

-- Enable RLS on new tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_distributions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (admins can manage, creators can view their own)
CREATE POLICY "Admins can manage all products" ON public.products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Creators can view their own products" ON public.products
  FOR SELECT USING (
    design_id IN (SELECT id FROM public.designs WHERE user_id = auth.uid())
  );

-- RLS Policies for sales (admins only)
CREATE POLICY "Admins can manage all sales" ON public.sales
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

-- RLS Policies for revenue_distributions (admins can manage, creators can view their own)
CREATE POLICY "Admins can manage all revenue distributions" ON public.revenue_distributions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Creators can view their own revenue distributions" ON public.revenue_distributions
  FOR SELECT USING (creator_user_id = auth.uid());

-- Now update designs table to add more status options (after fixing existing data)
ALTER TABLE public.designs 
  DROP CONSTRAINT IF EXISTS designs_status_check;

ALTER TABLE public.designs 
  ADD CONSTRAINT designs_status_check 
  CHECK (status IN ('pending_review', 'mockups_ready', 'selected', 'published', 'rejected'));

-- Create a view for admin dashboard stats
CREATE OR REPLACE VIEW public.admin_dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.designs WHERE status = 'pending_review') as pending_review_count,
  (SELECT COUNT(*) FROM public.designs WHERE status = 'mockups_ready') as mockups_ready_count,
  (SELECT COUNT(*) FROM public.designs WHERE status = 'selected') as selected_count,
  (SELECT COUNT(*) FROM public.designs WHERE status = 'published') as published_count,
  (SELECT COUNT(*) FROM public.products WHERE status = 'active') as active_products_count,
  (SELECT COALESCE(SUM(total_amount), 0) FROM public.sales WHERE sale_date >= CURRENT_DATE - INTERVAL '30 days') as revenue_last_30_days,
  (SELECT COALESCE(SUM(admin_revenue), 0) FROM public.sales WHERE sale_date >= CURRENT_DATE - INTERVAL '30 days') as admin_revenue_last_30_days,
  (SELECT COALESCE(SUM(creator_commission), 0) FROM public.sales WHERE sale_date >= CURRENT_DATE - INTERVAL '30 days') as creator_commissions_last_30_days,
  (SELECT COALESCE(SUM(quantity), 0) FROM public.sales WHERE sale_date >= CURRENT_DATE - INTERVAL '30 days') as units_sold_last_30_days;
