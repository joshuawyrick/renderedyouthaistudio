/*
# AI Mockup Generation Support

## Purpose
Adds the database infrastructure needed for the AI image generation flow:
status tracking columns on `designs`, a `design_mockups` table to store the
four generated style options, and a public storage bucket for generated images.

## Changes

1. **designs table** — add AI generation tracking columns:
   - `ai_status` (text, default 'pending') — 'pending' | 'generating' | 'ready' | 'failed'
   - `ai_error` (text, nullable) — error message if generation failed
   - `ai_generation_count` (int, default 0) — how many batches have been generated
   - `ai_generated_at` (timestamptz, nullable) — when the last batch completed

2. **design_mockups table** — stores the four AI-generated style options per design:
   - `id` (uuid, PK)
   - `design_id` (uuid, FK to designs.id, ON DELETE CASCADE)
   - `mockup_url` (text) — public URL of the generated image
   - `mockup_order` (int) — 1-4, display order
   - `style_key` (text) — 'bold_vector' | 'retro_print' | 'playful_cartoon' | 'painted'
   - `style_label` (text) — human-readable label
   - `is_ai_generated` (boolean, default true)
   - `generation_batch` (int, default 1) — which batch this belongs to
   - `created_at` (timestamptz)

3. **Storage** — create a public bucket `designs` for generated mockup images.
   The edge function writes here with the service role key; no client storage
   policies needed (server-side only writes, public reads).

4. **RLS** — design_mockups is readable by the design owner (parent_id = auth.uid())
   or admins. No client inserts/updates/deletes — only the edge function (service role)
   writes to this table.

5. **Security**
   - designs table: the new ai_* columns are writable by the owning parent through
     existing RLS policies (no new policies needed).
   - design_mockups: SELECT-only for authenticated users, scoped to design ownership.
   - Storage bucket `designs` is public for reads (generated images are meant to be
     displayed on the storefront) but writes are server-side only (no storage policies
     for client writes — the edge function uses the service role key which bypasses RLS).
*/

-- 1. Add AI tracking columns to designs
ALTER TABLE public.designs
  ADD COLUMN IF NOT EXISTS ai_status text NOT NULL DEFAULT 'pending'
  CHECK (ai_status IN ('pending', 'generating', 'ready', 'failed'));
ALTER TABLE public.designs
  ADD COLUMN IF NOT EXISTS ai_error text;
ALTER TABLE public.designs
  ADD COLUMN IF NOT EXISTS ai_generation_count int NOT NULL DEFAULT 0;
ALTER TABLE public.designs
  ADD COLUMN IF NOT EXISTS ai_generated_at timestamptz;

-- 2. Create design_mockups table
CREATE TABLE IF NOT EXISTS design_mockups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id uuid NOT NULL REFERENCES public.designs(id) ON DELETE CASCADE,
  mockup_url text NOT NULL,
  mockup_order int NOT NULL,
  style_key text NOT NULL,
  style_label text NOT NULL,
  is_ai_generated boolean NOT NULL DEFAULT true,
  generation_batch int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.design_mockups ENABLE ROW LEVEL SECURITY;

-- Owners can read mockups for their own designs
DROP POLICY IF EXISTS "select_own_design_mockups" ON public.design_mockups;
CREATE POLICY "select_own_design_mockups" ON public.design_mockups
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.designs
      WHERE designs.id = design_mockups.design_id
      AND designs.parent_id = auth.uid()
    )
  );

-- Index for querying mockups by design
CREATE INDEX IF NOT EXISTS idx_design_mockups_design_id ON public.design_mockups(design_id);

-- 3. Create public storage bucket for generated mockup images
INSERT INTO storage.buckets (id, name, public)
VALUES ('designs', 'designs', true)
ON CONFLICT (id) DO NOTHING;
