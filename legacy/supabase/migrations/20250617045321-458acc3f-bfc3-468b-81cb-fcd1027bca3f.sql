
-- Add additional_images column to products table to store product images
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS additional_images JSONB DEFAULT '[]'::jsonb;
