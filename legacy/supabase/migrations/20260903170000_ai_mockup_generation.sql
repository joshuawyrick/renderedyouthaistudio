-- AI mockup generation support
-- Adds the creator's "vision" answers to designs, and generation metadata to mockups.

-- 1. Creator's description of their drawing, used to guide the AI ------------
ALTER TABLE public.designs
  ADD COLUMN IF NOT EXISTS art_description text,
  ADD COLUMN IF NOT EXISTS art_subject     text,
  ADD COLUMN IF NOT EXISTS art_colors      text,
  ADD COLUMN IF NOT EXISTS art_mood        text;

COMMENT ON COLUMN public.designs.art_description IS 'Creator: what their drawing shows, in their own words';
COMMENT ON COLUMN public.designs.art_subject     IS 'Creator: the main thing in the drawing';
COMMENT ON COLUMN public.designs.art_colors      IS 'Creator: colors they want';
COMMENT ON COLUMN public.designs.art_mood        IS 'Creator: the feeling/vibe (funny, epic, cute, spooky...)';

-- 2. AI generation status on the design -------------------------------------
-- pending | generating | ready | failed
ALTER TABLE public.designs
  ADD COLUMN IF NOT EXISTS ai_status           text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS ai_error            text,
  ADD COLUMN IF NOT EXISTS ai_generated_at     timestamptz,
  ADD COLUMN IF NOT EXISTS ai_generation_count integer DEFAULT 0;

CREATE INDEX IF NOT EXISTS designs_ai_status_idx ON public.designs (ai_status);

-- 3. Metadata on each generated mockup --------------------------------------
ALTER TABLE public.design_mockups
  ADD COLUMN IF NOT EXISTS style_key        text,
  ADD COLUMN IF NOT EXISTS style_label      text,
  ADD COLUMN IF NOT EXISTS is_ai_generated  boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS prompt_used      text,
  ADD COLUMN IF NOT EXISTS generation_batch integer DEFAULT 1;

COMMENT ON COLUMN public.design_mockups.style_key   IS 'Machine key of the art style used (e.g. bold_vector)';
COMMENT ON COLUMN public.design_mockups.style_label IS 'Human label shown to the creator (e.g. Bold & Graphic)';

-- 4. Let creators read their own AI status ----------------------------------
-- (Existing RLS on designs already scopes rows to the owner; nothing further
--  is required here. Kept as a no-op block for documentation purposes.)
