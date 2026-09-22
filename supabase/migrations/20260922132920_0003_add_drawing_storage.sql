/*
# Add drawing image storage

1. Schema Changes
- Add `drawing_url` (text, nullable) to `designs` table so each submission can store
  the path to the uploaded drawing photo in Supabase Storage.

2. Storage
- Create a private storage bucket `drawings` for parent-uploaded child artwork.
- Storage policies allow authenticated parents to upload, read, and delete
  files only within their own folder (`parent_id/...`).

3. Security
- The `drawing_url` column is writable by the owning parent through existing
  RLS policies on `designs` (no new policies needed — the column inherits the
  table-level UPDATE policy).
- Storage bucket is private; access is scoped per parent folder.
*/

-- Add drawing_url column
ALTER TABLE public.designs
  ADD COLUMN IF NOT EXISTS drawing_url text;

-- Create the drawings storage bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('drawings', 'drawings', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: parents can manage their own folder
DROP POLICY IF EXISTS "Parents upload own drawings" ON storage.objects;
CREATE POLICY "Parents upload own drawings"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'drawings'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Parents read own drawings" ON storage.objects;
CREATE POLICY "Parents read own drawings"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'drawings'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Parents delete own drawings" ON storage.objects;
CREATE POLICY "Parents delete own drawings"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'drawings'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
