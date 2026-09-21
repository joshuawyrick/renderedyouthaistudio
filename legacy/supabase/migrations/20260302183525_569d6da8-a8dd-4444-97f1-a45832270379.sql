
-- Fix: Recreate admin_dashboard_stats view with security_invoker=on
-- This ensures the view respects RLS on underlying tables (sales requires admin)
DROP VIEW IF EXISTS public.admin_dashboard_stats;

CREATE VIEW public.admin_dashboard_stats
WITH (security_invoker=on) AS
SELECT 
  COUNT(CASE WHEN d.status = 'pending_review' THEN 1 END) as pending_review_count,
  COUNT(CASE WHEN d.status = 'mockups_ready' THEN 1 END) as mockups_ready_count,
  COUNT(CASE WHEN d.status = 'published' THEN 1 END) as published_count,
  COUNT(CASE WHEN d.status = 'selected' THEN 1 END) as selected_count,
  COUNT(DISTINCT CASE WHEN p.status = 'active' THEN p.id END) as active_products_count,
  COALESCE(SUM(CASE WHEN s.sale_date >= NOW() - INTERVAL '30 days' THEN s.total_amount ELSE 0 END), 0) as revenue_last_30_days,
  COALESCE(SUM(CASE WHEN s.sale_date >= NOW() - INTERVAL '30 days' THEN s.admin_revenue ELSE 0 END), 0) as admin_revenue_last_30_days,
  COALESCE(SUM(CASE WHEN s.sale_date >= NOW() - INTERVAL '30 days' THEN s.creator_commission ELSE 0 END), 0) as creator_commissions_last_30_days,
  COALESCE(SUM(CASE WHEN s.sale_date >= NOW() - INTERVAL '30 days' THEN s.quantity ELSE 0 END), 0) as units_sold_last_30_days
FROM designs d
LEFT JOIN products p ON d.id = p.design_id
LEFT JOIN sales s ON p.id = s.product_id;
