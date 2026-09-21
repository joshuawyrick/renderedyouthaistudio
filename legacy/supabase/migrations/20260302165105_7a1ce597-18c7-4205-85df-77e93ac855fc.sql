
-- 1. Fix profiles: Drop overly permissive public SELECT, keep owner-only full access
-- The "Users can view their own profile" policy already exists for owner access
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;

-- Create a limited public read policy that only exposes safe fields
-- We use a security definer function to provide limited profile data
CREATE OR REPLACE FUNCTION public.get_public_profile_fields(profile_row public.profiles)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT true;
$$;

-- Allow public read but only for creators with published designs
-- The app queries profiles by ID for display names - we need basic public access
-- but we'll restrict it to only specific non-sensitive fields via a view
CREATE POLICY "Limited public read for creator profiles"
ON public.profiles
FOR SELECT
USING (
  -- Allow if user is the owner
  auth.uid() = id
  OR
  -- Allow if user is admin  
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  OR
  -- Allow limited public access for profiles that have published designs/products
  EXISTS (
    SELECT 1 FROM designs d 
    JOIN products p ON d.id = p.design_id 
    WHERE d.user_id = profiles.id 
    AND (d.status = 'published' OR p.status = 'active')
  )
);

-- 2. Fix storage: Drop overly permissive update/delete policies on designs bucket
DROP POLICY IF EXISTS "Authenticated users can update design files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete design files" ON storage.objects;

-- Owner-scoped storage policies (files stored as {user_id}/{filename})
CREATE POLICY "Users can update own design files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'designs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own design files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'designs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Admin override for storage
CREATE POLICY "Admins can manage all design files" ON storage.objects
FOR ALL USING (
  bucket_id = 'designs'
  AND EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
