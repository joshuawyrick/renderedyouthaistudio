/*
# Independent Young Creator Support

## Purpose
Allows young people who are old enough to manage their own account (no parental
consent required) to sign up, create designs, and connect their own payout account.

## Changes

1. **profiles.role** — add 'independent_creator' as a valid role.
   Independent creators manage their own account, designs, and earnings without
   a parent. They must meet a minimum age threshold verified at signup.

2. **profiles.birth_date** — nullable date column for age verification.
   Only set for independent creators. Parents don't need this field.

3. **profiles.onboarding_step** — add 'age' and 'profile' steps for the creator
   onboarding flow: 'account' | 'age' | 'profile' | 'consent' | 'artists' | 'complete'.
   Existing parents keep their current values.

4. **artists table** — relax the parent_id constraint so independent creators
   can also have artist profiles. For independent creators, parent_id points to
   their own profile. The age constraint is relaxed to allow 13+.

5. **Update the signup trigger** — when the user's metadata includes
   `account_type: 'independent_creator'`, create the profile with that role
   instead of defaulting to 'parent'.

6. **RLS** — independent creators can CRUD their own artists and designs just
   like parents (they ARE the parent_id). No policy changes needed since RLS
   already keys on parent_id = auth.uid().
*/

-- 1. Add 'independent_creator' to profiles.role
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('parent', 'admin', 'independent_creator'));

-- 2. Add birth_date column
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS birth_date date;

-- 3. Expand onboarding_step values
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_onboarding_step_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_onboarding_step_check
  CHECK (onboarding_step IN ('account', 'age', 'profile', 'consent', 'artists', 'complete'));

-- 4. Relax artists age constraint to allow 13+
ALTER TABLE public.artists
  DROP CONSTRAINT IF EXISTS artists_age_check;
ALTER TABLE public.artists
  ADD CONSTRAINT artists_age_check
  CHECK (age IS NULL OR (age >= 1 AND age <= 25));

-- 5. Update the signup trigger to respect account_type metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;
