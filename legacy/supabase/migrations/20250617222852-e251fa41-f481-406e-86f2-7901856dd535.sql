
-- Add account_type column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN account_type text DEFAULT 'customer' CHECK (account_type IN ('creator', 'customer'));

-- Update existing profiles to be customers by default (since they haven't gone through creator flow)
UPDATE public.profiles 
SET account_type = 'customer' 
WHERE account_type IS NULL;

-- Make account_type not nullable
ALTER TABLE public.profiles 
ALTER COLUMN account_type SET NOT NULL;
