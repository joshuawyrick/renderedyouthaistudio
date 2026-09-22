/*
# Add design archiving support

1. Modified Tables
   - `designs`
     - `archived_at` (timestamptz, nullable) — when non-null the creator has archived the design;
       null means active. Creators set this to archive/unarchive; only admin can hard-delete
       a design that has passed the early workflow stages.

2. Security
   - No policy changes needed — existing owner-scoped CRUD policies already allow
     the owner to UPDATE (set archived_at) and DELETE their own rows.
     Stage-gating (only early-stage designs may be deleted) is enforced in the
     application layer because admin must bypass that rule.

3. Notes
   - Archived-but-published designs remain sellable under the Rendered Youth brand.
   - The column is nullable so existing rows default to null (active).
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'designs' AND column_name = 'archived_at'
  ) THEN
    ALTER TABLE designs ADD COLUMN archived_at timestamptz;
  END IF;
END $$;
