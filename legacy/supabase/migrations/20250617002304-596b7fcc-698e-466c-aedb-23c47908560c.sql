
-- First create the profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  age_bracket TEXT,
  is_minor BOOLEAN DEFAULT false,
  parent_email TEXT,
  requires_parent_consent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create age verification table to track DOB collection
CREATE TABLE public.age_verification (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token UUID NOT NULL DEFAULT gen_random_uuid(),
  date_of_birth DATE NOT NULL,
  is_minor BOOLEAN NOT NULL,
  requires_parent_consent BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  parent_email TEXT
);

-- Enable RLS on age_verification
ALTER TABLE public.age_verification ENABLE ROW LEVEL SECURITY;

-- Create policy for age verification access
CREATE POLICY "Users can manage their age verification" 
  ON public.age_verification 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Create consent tracking table for COPPA compliance
CREATE TABLE public.user_consents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_user_id UUID REFERENCES auth.users,
  parent_email TEXT NOT NULL,
  consent_method TEXT NOT NULL DEFAULT 'email_verification',
  consent_given_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  consent_ip_address INET,
  notice_version TEXT NOT NULL DEFAULT '1.0',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_consents
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

-- Create policy for consent access
CREATE POLICY "Admin and parents can view consents" 
  ON public.user_consents 
  FOR SELECT 
  USING (true);

-- Create trigger to auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    new.id, 
    new.raw_user_meta_data ->> 'first_name', 
    new.raw_user_meta_data ->> 'last_name'
  );
  RETURN new;
END;
$$;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
