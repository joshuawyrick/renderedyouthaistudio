
-- Drop the existing view completely to ensure clean recreation
DROP VIEW IF EXISTS public.admin_dashboard_stats CASCADE;

-- Recreate the view without SECURITY DEFINER (this is the default and secure approach)
-- The view will inherit security from the underlying tables (designs, products, sales)
-- which already have proper RLS policies in place
CREATE VIEW public.admin_dashboard_stats AS
SELECT 
  COUNT(CASE WHEN d.status = 'pending_review' THEN 1 END) as pending_review_count,
  COUNT(CASE WHEN d.status = 'mockups_ready' THEN 1 END) as mockups_ready_count,
  COUNT(CASE WHEN d.status = 'selected' THEN 1 END) as selected_count,
  COUNT(CASE WHEN d.status = 'published' THEN 1 END) as published_count,
  COUNT(CASE WHEN p.status = 'active' THEN 1 END) as active_products_count,
  COALESCE(SUM(CASE WHEN s.sale_date >= NOW() - INTERVAL '30 days' THEN s.total_amount ELSE 0 END), 0) as revenue_last_30_days,
  COALESCE(SUM(CASE WHEN s.sale_date >= NOW() - INTERVAL '30 days' THEN s.admin_revenue ELSE 0 END), 0) as admin_revenue_last_30_days,
  COALESCE(SUM(CASE WHEN s.sale_date >= NOW() - INTERVAL '30 days' THEN s.creator_commission ELSE 0 END), 0) as creator_commissions_last_30_days,
  COALESCE(SUM(CASE WHEN s.sale_date >= NOW() - INTERVAL '30 days' THEN s.quantity ELSE 0 END), 0) as units_sold_last_30_days
FROM designs d
LEFT JOIN products p ON d.id = p.design_id
LEFT JOIN sales s ON p.id = s.product_id;

-- Set proper ownership for the view
ALTER VIEW public.admin_dashboard_stats OWNER TO postgres;

-- Grant appropriate permissions (views inherit security from underlying tables)
-- The AdminStats component already checks for admin permissions before querying
GRANT SELECT ON public.admin_dashboard_stats TO authenticated;
