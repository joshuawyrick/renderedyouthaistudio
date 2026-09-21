
-- Fix 1: Restrict parent_verification_tokens SELECT to prevent public email harvesting
DROP POLICY IF EXISTS "Anyone can verify tokens" ON public.parent_verification_tokens;

-- Only allow token verification via service role (edge functions use service role key)
-- No public SELECT needed since verification happens server-side in edge functions

-- Fix 2: Restrict user_consents SELECT to admins only
DROP POLICY IF EXISTS "Admin and parents can view consents" ON public.user_consents;

CREATE POLICY "Admins can view consents"
ON public.user_consents
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
  )
);

-- Fix 3: Recreate creator_earnings_summary view with security_invoker=on
DROP VIEW IF EXISTS public.creator_earnings_summary;

CREATE VIEW public.creator_earnings_summary
WITH (security_invoker=on) AS
SELECT 
  ce.creator_user_id,
  p.first_name,
  p.last_name,
  p.stripe_connect_account_id,
  p.stripe_onboarding_completed,
  count(ce.id) AS total_sales,
  sum(ce.gross_amount) AS total_gross,
  sum(ce.creator_share) AS total_earnings,
  sum(
    CASE
      WHEN ce.payout_status = 'pending' THEN ce.creator_share
      ELSE 0::numeric
    END
  ) AS pending_earnings,
  sum(
    CASE
      WHEN ce.payout_status = 'paid' THEN ce.creator_share
      ELSE 0::numeric
    END
  ) AS paid_earnings
FROM creator_earnings ce
JOIN profiles p ON p.id = ce.creator_user_id
GROUP BY ce.creator_user_id, p.first_name, p.last_name, p.stripe_connect_account_id, p.stripe_onboarding_completed;
