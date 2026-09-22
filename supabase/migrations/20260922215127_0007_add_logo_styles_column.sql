/*
# Add logo_styles column to designs table

## Summary
Adds a `logo_styles` text array column to the `designs` table so creators can
select one or more art styles (e.g. "nineties-neon", "synthwave") when submitting
a design. The AI mockup generator reads these values to tailor the generated
artwork to the creator's preferences.

## Modified Tables
- `designs`
  - New column: `logo_styles` (text[], nullable, defaults to empty array)

## Security
- No RLS changes. Existing policies already cover all CRUD on the designs table
  scoped to the owning parent_id.

## Notes
1. Nullable with a default of '{}' so existing rows are unaffected.
2. The edge function falls back to default styles when the array is empty/null.
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'designs'
      AND column_name = 'logo_styles'
  ) THEN
    ALTER TABLE public.designs
      ADD COLUMN logo_styles text[] NOT NULL DEFAULT '{}';
  END IF;
END $$;
