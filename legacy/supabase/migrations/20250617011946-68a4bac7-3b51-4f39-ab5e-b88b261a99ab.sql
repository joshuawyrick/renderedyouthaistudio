
-- Create parent verification tokens table
CREATE TABLE public.parent_verification_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  age_verification_id UUID NOT NULL REFERENCES public.age_verification(id) ON DELETE CASCADE,
  parent_email TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verification_ip_address INET
);

-- Enable RLS on parent verification tokens
ALTER TABLE public.parent_verification_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy for parent verification tokens (public access for verification links)
CREATE POLICY "Anyone can verify tokens" 
  ON public.parent_verification_tokens 
  FOR SELECT 
  USING (true);

-- Create policy for inserting tokens (system only)
CREATE POLICY "System can create tokens" 
  ON public.parent_verification_tokens 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for updating tokens (system only)
CREATE POLICY "System can update tokens" 
  ON public.parent_verification_tokens 
  FOR UPDATE 
  USING (true);

-- Add index for efficient token lookups
CREATE INDEX idx_parent_verification_tokens_hash ON public.parent_verification_tokens(token_hash);
CREATE INDEX idx_parent_verification_tokens_expires ON public.parent_verification_tokens(expires_at);
