
-- First, let's check what RLS policies exist and fix them for admin access

-- Allow admins to view ALL designs (not just their own)
CREATE POLICY "Admin users can view all designs" 
  ON public.designs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Allow admins to update ALL designs (for status changes)
CREATE POLICY "Admin users can update all designs" 
  ON public.designs 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Allow admins to manage all mockups
CREATE POLICY "Admin users can manage all mockups" 
  ON public.design_mockups 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );
