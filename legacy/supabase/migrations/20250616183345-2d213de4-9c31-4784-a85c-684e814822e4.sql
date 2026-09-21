
-- First, create the main designs table
CREATE TABLE public.designs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  inspiration TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  status TEXT DEFAULT 'pending_review',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on designs table
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;

-- Create policies for designs table
CREATE POLICY "Users can view their own designs" 
  ON public.designs 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own designs" 
  ON public.designs 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own designs" 
  ON public.designs 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Now create the design mockups table
CREATE TABLE public.design_mockups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  design_id UUID NOT NULL REFERENCES public.designs(id) ON DELETE CASCADE,
  mockup_url TEXT NOT NULL,
  mockup_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create the design selections table
CREATE TABLE public.design_selections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  design_id UUID NOT NULL REFERENCES public.designs(id) ON DELETE CASCADE,
  selected_mockup_id UUID NOT NULL REFERENCES public.design_mockups(id),
  selected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.design_mockups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_selections ENABLE ROW LEVEL SECURITY;

-- Policies for design_mockups
CREATE POLICY "Admin can manage all mockups" 
  ON public.design_mockups 
  FOR ALL 
  USING (true);

CREATE POLICY "Users can view mockups for their designs" 
  ON public.design_mockups 
  FOR SELECT 
  USING (
    design_id IN (
      SELECT id FROM public.designs WHERE user_id = auth.uid()
    )
  );

-- Policies for design_selections
CREATE POLICY "Users can select their own designs" 
  ON public.design_selections 
  FOR INSERT 
  WITH CHECK (
    design_id IN (
      SELECT id FROM public.designs WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own selections" 
  ON public.design_selections 
  FOR SELECT 
  USING (
    design_id IN (
      SELECT id FROM public.designs WHERE user_id = auth.uid()
    )
  );
