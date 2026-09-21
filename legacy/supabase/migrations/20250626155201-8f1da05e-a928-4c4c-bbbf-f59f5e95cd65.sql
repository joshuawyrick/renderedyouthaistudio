
-- Add header and page description fields to collections table
ALTER TABLE public.collections 
ADD COLUMN page_header TEXT,
ADD COLUMN page_description TEXT;

-- Update existing collections with some default content
UPDATE public.collections 
SET 
  page_header = name || ' Collection',
  page_description = 'Discover amazing designs in our ' || name || ' collection.'
WHERE page_header IS NULL;
