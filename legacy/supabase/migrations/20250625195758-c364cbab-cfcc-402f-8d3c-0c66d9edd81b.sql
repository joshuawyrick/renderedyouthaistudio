
-- Fix the Security Definer View issue by recreating the admin_dashboard_stats view without SECURITY DEFINER
-- This addresses the Supabase Security Advisor warning about SECURITY DEFINER views

DROP VIEW IF EXISTS public.admin_dashboard_stats;

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

-- Create a security_logs table for proper security event logging
CREATE TABLE IF NOT EXISTS public.security_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  metadata JSONB,
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on security_logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for security logs - only admins can view
CREATE POLICY "Admin users can view security logs" 
  ON public.security_logs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Allow authenticated users to insert their own security logs
CREATE POLICY "Users can insert their own security logs" 
  ON public.security_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Update storage bucket with proper security settings
UPDATE storage.buckets 
SET 
  file_size_limit = 26214400, -- 25MB limit
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']
WHERE id = 'design-uploads';

-- Create enhanced RLS policies for storage objects
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all design files" ON storage.objects;

CREATE POLICY "Users can upload their own design files" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'design-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own design files" 
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'design-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all design files" 
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'design-uploads' AND
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own design files" 
  ON storage.objects 
  FOR UPDATE 
  USING (
    bucket_id = 'design-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own design files" 
  ON storage.objects 
  FOR DELETE 
  USING (
    bucket_id = 'design-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
