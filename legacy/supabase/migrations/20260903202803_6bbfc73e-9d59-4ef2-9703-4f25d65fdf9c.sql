-- 1. age_verification: remove public read
DROP POLICY IF EXISTS "Anyone can read age verification by session token" ON public.age_verification;
CREATE POLICY "Admins can view age verification"
  ON public.age_verification FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = auth.uid()));
REVOKE SELECT ON public.age_verification FROM anon;

-- 2. admin_users: explicitly deny all client writes (management only via service role)
CREATE POLICY "No client inserts on admin_users"
  ON public.admin_users AS RESTRICTIVE FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);
CREATE POLICY "No client updates on admin_users"
  ON public.admin_users AS RESTRICTIVE FOR UPDATE
  TO anon, authenticated
  USING (false);
CREATE POLICY "No client deletes on admin_users"
  ON public.admin_users AS RESTRICTIVE FOR DELETE
  TO anon, authenticated
  USING (false);
REVOKE INSERT, UPDATE, DELETE ON public.admin_users FROM anon, authenticated;

-- 3. profiles: hide sensitive columns from clients (column-level)
REVOKE SELECT (parent_email, is_minor, requires_parent_consent, stripe_connect_account_id)
  ON public.profiles FROM anon, authenticated;

-- 4. product_variants: consolidate duplicate permissive policies
DROP POLICY IF EXISTS "Allow public read access to product variants" ON public.product_variants;
DROP POLICY IF EXISTS "Anyone can view available variants" ON public.product_variants;
DROP POLICY IF EXISTS "Admins can manage variants" ON public.product_variants;

-- 5. sales: keep admin-only, remove anon API access
REVOKE ALL ON public.sales FROM anon;

-- 6. storage: designs bucket ownership/publication check
DROP POLICY IF EXISTS "Anyone can view design files" ON storage.objects;
CREATE POLICY "Published or owned design files are viewable"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'designs'
    AND (
      (auth.uid())::text = (storage.foldername(name))[1]
      OR EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.design_mockups m
        JOIN public.designs d ON d.id = m.design_id
        WHERE m.mockup_url LIKE '%' || storage.objects.name
          AND (d.status = 'published' OR d.user_id = auth.uid())
      )
      OR EXISTS (
        SELECT 1 FROM public.designs d
        WHERE d.file_url LIKE '%' || storage.objects.name
          AND (d.status = 'published' OR d.user_id = auth.uid())
      )
    )
  );

-- 7. definer function should not be callable by clients
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;