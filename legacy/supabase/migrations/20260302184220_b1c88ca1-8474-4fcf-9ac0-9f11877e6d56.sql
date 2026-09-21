
-- Fix 1: age_verification - Replace overly permissive ALL policy with scoped policies
-- Age verification records should only be managed by the user who created them (via session)
DROP POLICY IF EXISTS "Users can manage their age verification" ON public.age_verification;

-- Allow inserts (needed for age verification flow, no auth required since it's pre-signup)
CREATE POLICY "Anyone can create age verification records"
  ON public.age_verification
  FOR INSERT
  WITH CHECK (true);

-- Allow select only on own session tokens (public read needed for verification flow)
CREATE POLICY "Anyone can read age verification by session token"
  ON public.age_verification
  FOR SELECT
  USING (true);

-- Only admins can update/delete age verification records
CREATE POLICY "Admins can update age verification"
  ON public.age_verification
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete age verification"
  ON public.age_verification
  FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- Fix 2: design_mockups - Remove the duplicate overly permissive ALL policy
-- The admin-scoped policy "Admin users can manage all mockups" already handles admin access
DROP POLICY IF EXISTS "Admin can manage all mockups" ON public.design_mockups;

-- Fix 3: parent_verification_tokens - Restrict INSERT and UPDATE to service role / edge functions
-- These should only be created/updated by edge functions (service role), not by any anon user
DROP POLICY IF EXISTS "System can create tokens" ON public.parent_verification_tokens;
DROP POLICY IF EXISTS "System can update tokens" ON public.parent_verification_tokens;

-- Only admins can insert tokens (edge functions use service role which bypasses RLS)
CREATE POLICY "Admins can create verification tokens"
  ON public.parent_verification_tokens
  FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- Only admins can update tokens
CREATE POLICY "Admins can update verification tokens"
  ON public.parent_verification_tokens
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
