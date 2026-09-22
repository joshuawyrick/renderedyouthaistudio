-- Fix: Set search_path on all SECURITY DEFINER functions to prevent
-- signup failures when the auth trigger can't resolve the profiles table.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, display_name, onboarding_step)
  VALUES (NEW.id, 'parent', COALESCE(NEW.raw_user_meta_data->>'display_name', ''), 'account')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Also fix the other SECURITY DEFINER functions for the same issue
CREATE OR REPLACE FUNCTION public.protect_profile_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN
      NEW.role := OLD.role;
    END IF;
  END IF;
  IF NEW.payout_ready IS DISTINCT FROM OLD.payout_ready THEN
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN
      NEW.payout_ready := OLD.payout_ready;
    END IF;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_design_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  IF NEW.stage IS DISTINCT FROM OLD.stage THEN
    NEW.history := OLD.history || jsonb_build_object(
      'stage', NEW.stage,
      'at', now()
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Also fix the non-SECURITY DEFINER function
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
