
-- Check if RLS is enabled on platform_settings and create a policy for anonymous access
-- First, let's see the current state and then add a policy to allow anonymous reads for navigation settings

-- Create a policy that allows anyone (including anonymous users) to read navigation settings
CREATE POLICY "Allow anonymous read for navigation settings" 
ON platform_settings 
FOR SELECT 
USING (setting_key IN ('show_age_groups_in_nav'));

-- If the table doesn't have RLS enabled, let's enable it first and then add the policy
DO $$
BEGIN
  -- Enable RLS if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'platform_settings' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;
