
-- Create the storage bucket for design uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('design-uploads', 'design-uploads', true);

-- Create storage policies for the design-uploads bucket
CREATE POLICY "Anyone can view uploaded designs" ON storage.objects
FOR SELECT USING (bucket_id = 'design-uploads');

CREATE POLICY "Authenticated users can upload designs" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'design-uploads' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own uploads" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'design-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own uploads" ON storage.objects
FOR DELETE USING (
  bucket_id = 'design-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create admin role for managing the system
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admin users can view admin table
CREATE POLICY "Admin users can view admin table" 
  ON public.admin_users 
  FOR SELECT 
  USING (user_id = auth.uid());

-- Add email notification settings table
CREATE TABLE public.notification_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  email_on_review_ready BOOLEAN DEFAULT true,
  email_on_selection_complete BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notification_settings
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

-- Users can manage their own notification settings
CREATE POLICY "Users can manage their notification settings" 
  ON public.notification_settings 
  FOR ALL 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
