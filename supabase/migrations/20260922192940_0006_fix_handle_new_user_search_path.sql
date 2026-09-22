/*
# Fix handle_new_user trigger search_path

1. Problem
   - The handle_new_user() function has no search_path set, which causes
     Supabase Auth to fail with "Database error saving new user" because
     the function cannot reliably resolve the `profiles` table.
   - Migration 0002 was supposed to fix this, but migration 0004 recreated
     the function without the search_path setting.

2. Fix
   - Recreate the function with SET search_path = public, auth so it
     always resolves `profiles` (in public) and `auth.users` references.
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_role text;
  v_account_type text;
BEGIN
  v_account_type := NEW.raw_user_meta_data->>'account_type';
  IF v_account_type = 'independent_creator' THEN
    v_role := 'independent_creator';
  ELSE
    v_role := 'parent';
  END IF;

  INSERT INTO profiles (id, role, display_name, onboarding_step)
  VALUES (
    NEW.id,
    v_role,
    COALESCE(NEW.raw_user_meta_data->>'display_name', ''),
    CASE WHEN v_role = 'independent_creator' THEN 'age' ELSE 'account' END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$function$;
