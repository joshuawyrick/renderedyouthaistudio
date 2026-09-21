
-- Create the storage bucket for design mockups
INSERT INTO storage.buckets (id, name, public)
VALUES ('designs', 'designs', true);

-- Create storage policies for the designs bucket
CREATE POLICY "Anyone can view design files" ON storage.objects
FOR SELECT USING (bucket_id = 'designs');

CREATE POLICY "Authenticated users can upload design files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'designs' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update design files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'designs' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete design files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'designs' 
  AND auth.role() = 'authenticated'
);
