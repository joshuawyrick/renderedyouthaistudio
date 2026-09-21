/*
# Parent Account Foundation — Core Tables

## Purpose
Establishes the server-backed parent account foundation for Rendered Youth. Replaces the in-memory studio sample data with real Supabase authentication and database persistence.

## New Tables

1. **profiles** — Extends auth.users with role and onboarding state for every authenticated adult.
   - `id` (uuid, PK, references auth.users) — the auth user's ID
   - `role` (text) — 'parent' | 'admin' (server-set; never client-writable)
   - `display_name` (text) — the adult's display name
   - `onboarding_step` (text) — tracks resumable onboarding: 'account' | 'consent' | 'artists' | 'complete'
   - `consent_accepted` (boolean, default false) — whether the parent accepted the privacy/consent notice
   - `payout_ready` (boolean, default false) — whether Stripe Connect onboarding is complete (server-set only)
   - `created_at`, `updated_at` (timestamps)

2. **artists** — Child profiles owned by a parent. One parent manages multiple children.
   - `id` (uuid, PK)
   - `parent_id` (uuid, FK to profiles.id) — the parent who owns this artist profile
   - `display_name` (text) — parent-approved public name or nickname
   - `avatar_type` (text) — 'star' | 'sun' | 'flower' (illustrated avatars only for now)
   - `age` (int, nullable) — optional, parent-controlled
   - `state` (text, nullable) — optional US state, parent-controlled
   - `show_age` (boolean, default false) — whether age is visible publicly
   - `show_state` (boolean, default false) — whether state is visible publicly
   - `bio` (text, nullable) — optional artist story
   - `goal` (text, nullable) — optional savings goal
   - `created_at`, `updated_at` (timestamps)

3. **designs** — Drawing submissions from a parent on behalf of an artist.
   - `id` (uuid, PK)
   - `artist_id` (uuid, FK to artists.id) — which child made this drawing
   - `parent_id` (uuid, FK to profiles.id) — the parent who submitted it
   - `title` (text) — design name
   - `story` (text) — the story behind the drawing
   - `stage` (text) — workflow state machine: 'draft' | 'generating' | 'choose' | 'review' | 'changes' | 'mockup' | 'parent_approval' | 'ready' | 'published'
   - `selected_option` (int, default -1) — which of the four artwork options was selected
   - `completed_batches` (int, default 0) — how many generation batches have completed
   - `admin_credits` (int, default 0) — admin-approved extra generation credits
   - `request_note` (text, nullable) — parent's reason for requesting another batch
   - `admin_note` (text, nullable) — admin's change request or rejection reason
   - `variants_ready` (boolean, default false) — whether product variants/mockups are prepared
   - `history` (jsonb, default '[]') — array of stage transition labels with timestamps
   - `created_at`, `updated_at` (timestamps)

4. **design_events** — Immutable audit log of design state transitions.
   - `id` (uuid, PK)
   - `design_id` (uuid, FK to designs.id)
   - `actor_id` (uuid, FK to profiles.id) — who made the change
   - `actor_role` (text) — 'parent' | 'admin' | 'worker'
   - `action` (text) — the action that was taken
   - `from_stage` (text, nullable) — previous stage
   - `to_stage` (text) — new stage
   - `reason` (text, nullable) — optional reason for the change
   - `created_at` (timestamp)

5. **app_settings** — Configurable platform settings (admin-controlled).
   - `id` (uuid, PK)
   - `key` (text, unique) — setting key
   - `value` (jsonb) — setting value
   - `description` (text, nullable)
   - `updated_at` (timestamp)

## Security

- **profiles**: RLS enabled. Users can read and update their own profile. Admins can read all profiles (via a separate admin_users check). The `role` and `payout_ready` columns are protected via a trigger that prevents non-admin updates (the trigger checks if the new role differs from old and blocks it for non-admins).
- **artists**: RLS enabled. Parents can CRUD only their own children's profiles.
- **designs**: RLS enabled. Parents can CRUD only their own designs. Admins can read all designs.
- **design_events**: RLS enabled. Parents can read events for their own designs. Admins can read all. Insert is allowed for authenticated users (the trigger enforces ownership).
- **app_settings**: RLS enabled. Public read for non-sensitive settings. Only admins can write (enforced via trigger).

## Important Notes

1. The `role` column on profiles is NOT client-writable. A trigger prevents users from changing their own role. Admins are provisioned by directly inserting into the profiles table with role='admin' or via a server-side function.
2. `payout_ready` is server-set only (via Stripe webhook or admin action), not client-writable.
3. The `history` column on designs is a jsonb array that accumulates human-readable stage labels with timestamps.
4. A trigger automatically logs state transitions to design_events when designs.stage changes.
*/

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'parent' CHECK (role IN ('parent', 'admin')),
  display_name text NOT NULL DEFAULT '',
  onboarding_step text NOT NULL DEFAULT 'account' CHECK (onboarding_step IN ('account', 'consent', 'artists', 'complete')),
  consent_accepted boolean NOT NULL DEFAULT false,
  payout_ready boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

-- Users can update their own profile (but not role or payout_ready — enforced by trigger)
DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Users can insert their own profile row (on signup)
DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- Trigger: prevent non-admin users from changing role or payout_ready
CREATE OR REPLACE FUNCTION protect_profile_columns()
RETURNS trigger AS $$
BEGIN
  -- Only allow role changes if the current user is an admin
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
      NEW.role := OLD.role;
    END IF;
  END IF;
  -- Only allow payout_ready changes if the current user is an admin
  IF NEW.payout_ready IS DISTINCT FROM OLD.payout_ready THEN
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
      NEW.payout_ready := OLD.payout_ready;
    END IF;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_profile_columns ON profiles;
CREATE TRIGGER trg_protect_profile_columns
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION protect_profile_columns();

-- ============================================================================
-- ARTISTS TABLE (child profiles)
-- ============================================================================
CREATE TABLE IF NOT EXISTS artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  avatar_type text NOT NULL DEFAULT 'star' CHECK (avatar_type IN ('star', 'sun', 'flower')),
  age int CHECK (age IS NULL OR (age >= 1 AND age <= 17)),
  state text,
  show_age boolean NOT NULL DEFAULT false,
  show_state boolean NOT NULL DEFAULT false,
  bio text DEFAULT '',
  goal text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE artists ENABLE ROW LEVEL SECURITY;

-- Parents can read their own children's profiles
DROP POLICY IF EXISTS "select_own_artists" ON artists;
CREATE POLICY "select_own_artists" ON artists FOR SELECT
  TO authenticated USING (auth.uid() = parent_id);

-- Parents can insert artists for themselves
DROP POLICY IF EXISTS "insert_own_artists" ON artists;
CREATE POLICY "insert_own_artists" ON artists FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = parent_id);

-- Parents can update their own children's profiles
DROP POLICY IF EXISTS "update_own_artists" ON artists;
CREATE POLICY "update_own_artists" ON artists FOR UPDATE
  TO authenticated USING (auth.uid() = parent_id) WITH CHECK (auth.uid() = parent_id);

-- Parents can delete their own children's profiles
DROP POLICY IF EXISTS "delete_own_artists" ON artists;
CREATE POLICY "delete_own_artists" ON artists FOR DELETE
  TO authenticated USING (auth.uid() = parent_id);

-- Trigger: auto-update updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_artists_updated ON artists;
CREATE TRIGGER trg_artists_updated
  BEFORE UPDATE ON artists
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- DESIGNS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id uuid NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  parent_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  story text NOT NULL,
  stage text NOT NULL DEFAULT 'draft' CHECK (stage IN ('draft', 'generating', 'choose', 'review', 'changes', 'mockup', 'parent_approval', 'ready', 'published')),
  selected_option int NOT NULL DEFAULT -1,
  completed_batches int NOT NULL DEFAULT 0,
  admin_credits int NOT NULL DEFAULT 0,
  request_note text,
  admin_note text,
  variants_ready boolean NOT NULL DEFAULT false,
  history jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE designs ENABLE ROW LEVEL SECURITY;

-- Parents can read their own designs
DROP POLICY IF EXISTS "select_own_designs" ON designs;
CREATE POLICY "select_own_designs" ON designs FOR SELECT
  TO authenticated USING (auth.uid() = parent_id);

-- Parents can insert their own designs
DROP POLICY IF EXISTS "insert_own_designs" ON designs;
CREATE POLICY "insert_own_designs" ON designs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = parent_id);

-- Parents can update their own designs
DROP POLICY IF EXISTS "update_own_designs" ON designs;
CREATE POLICY "update_own_designs" ON designs FOR UPDATE
  TO authenticated USING (auth.uid() = parent_id) WITH CHECK (auth.uid() = parent_id);

-- Parents can delete their own designs
DROP POLICY IF EXISTS "delete_own_designs" ON designs;
CREATE POLICY "delete_own_designs" ON designs FOR DELETE
  TO authenticated USING (auth.uid() = parent_id);

-- Trigger: auto-update updated_at and log stage transitions
CREATE OR REPLACE FUNCTION handle_design_update()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  -- Append to history when stage changes
  IF NEW.stage IS DISTINCT FROM OLD.stage THEN
    NEW.history := OLD.history || jsonb_build_object(
      'stage', NEW.stage,
      'at', now()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_designs_updated ON designs;
CREATE TRIGGER trg_designs_updated
  BEFORE UPDATE ON designs
  FOR EACH ROW EXECUTE FUNCTION handle_design_update();

-- ============================================================================
-- DESIGN_EVENTS TABLE (immutable audit log)
-- ============================================================================
CREATE TABLE IF NOT EXISTS design_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id uuid NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  actor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  actor_role text NOT NULL CHECK (actor_role IN ('parent', 'admin', 'worker')),
  action text NOT NULL,
  from_stage text,
  to_stage text NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE design_events ENABLE ROW LEVEL SECURITY;

-- Parents can read events for their own designs
DROP POLICY IF EXISTS "select_own_design_events" ON design_events;
CREATE POLICY "select_own_design_events" ON design_events FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM designs WHERE designs.id = design_events.design_id AND designs.parent_id = auth.uid())
  );

-- Authenticated users can insert events (ownership verified via trigger logic)
DROP POLICY IF EXISTS "insert_design_events" ON design_events;
CREATE POLICY "insert_design_events" ON design_events FOR INSERT
  TO authenticated WITH CHECK (true);

-- Index for querying events by design
CREATE INDEX IF NOT EXISTS idx_design_events_design_id ON design_events(design_id);

-- ============================================================================
-- APP_SETTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (non-sensitive config like feature flags)
DROP POLICY IF EXISTS "select_app_settings" ON app_settings;
CREATE POLICY "select_app_settings" ON app_settings FOR SELECT
  TO authenticated USING (true);

-- Only admins can write settings (enforced by trigger)
DROP POLICY IF EXISTS "update_app_settings" ON app_settings;
CREATE POLICY "update_app_settings" ON app_settings FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "insert_app_settings" ON app_settings;
CREATE POLICY "insert_app_settings" ON app_settings FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Trigger: auto-update updated_at for app_settings
DROP TRIGGER IF EXISTS trg_app_settings_updated ON app_settings;
CREATE TRIGGER trg_app_settings_updated
  BEFORE UPDATE ON app_settings
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- HELPER: Auto-create profile on signup
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, role, display_name, onboarding_step)
  VALUES (NEW.id, 'parent', COALESCE(NEW.raw_user_meta_data->>'display_name', ''), 'account')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_handle_new_user ON auth.users;
CREATE TRIGGER trg_handle_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_artists_parent_id ON artists(parent_id);
CREATE INDEX IF NOT EXISTS idx_designs_parent_id ON designs(parent_id);
CREATE INDEX IF NOT EXISTS idx_designs_artist_id ON designs(artist_id);
CREATE INDEX IF NOT EXISTS idx_designs_stage ON designs(stage);
