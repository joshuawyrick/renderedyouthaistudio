
-- Add Stripe Connect fields to profiles table for creator onboarding
ALTER TABLE public.profiles 
ADD COLUMN stripe_connect_account_id TEXT,
ADD COLUMN stripe_onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN stripe_charges_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN stripe_payouts_enabled BOOLEAN DEFAULT FALSE;

-- Create a platform settings table to manage commission rates
CREATE TABLE public.platform_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default commission rate setting
INSERT INTO public.platform_settings (setting_key, setting_value, description)
VALUES ('creator_commission_rate', '0.70', 'Default commission rate for creators (0.70 = 70%)');

-- Create creator earnings table to track individual earnings
CREATE TABLE public.creator_earnings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_user_id UUID NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  sale_id UUID REFERENCES public.sales(id) NOT NULL,
  gross_amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  creator_share DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,4) NOT NULL,
  payout_status TEXT NOT NULL DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'paid', 'failed')),
  payout_date TIMESTAMP WITH TIME ZONE,
  stripe_transfer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payout batches table to group payouts
CREATE TABLE public.payout_batches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_name TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  creator_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'completed', 'failed')),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_creator_earnings_creator ON public.creator_earnings(creator_user_id);
CREATE INDEX idx_creator_earnings_payout_status ON public.creator_earnings(payout_status);
CREATE INDEX idx_creator_earnings_created_at ON public.creator_earnings(created_at);

-- Enable RLS on new tables
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_batches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for platform_settings (admins only)
CREATE POLICY "Admins can manage platform settings" ON public.platform_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

-- RLS Policies for creator_earnings
CREATE POLICY "Admins can manage all creator earnings" ON public.creator_earnings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Creators can view their own earnings" ON public.creator_earnings
  FOR SELECT USING (creator_user_id = auth.uid());

-- RLS Policies for payout_batches (admins only)
CREATE POLICY "Admins can manage payout batches" ON public.payout_batches
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

-- Create a view for creator earnings summary
CREATE OR REPLACE VIEW public.creator_earnings_summary AS
SELECT 
  ce.creator_user_id,
  p.first_name,
  p.last_name,
  p.stripe_connect_account_id,
  p.stripe_onboarding_completed,
  COUNT(ce.id) as total_sales,
  SUM(ce.gross_amount) as total_gross,
  SUM(ce.creator_share) as total_earnings,
  SUM(CASE WHEN ce.payout_status = 'pending' THEN ce.creator_share ELSE 0 END) as pending_earnings,
  SUM(CASE WHEN ce.payout_status = 'paid' THEN ce.creator_share ELSE 0 END) as paid_earnings
FROM public.creator_earnings ce
JOIN public.profiles p ON p.id = ce.creator_user_id
GROUP BY ce.creator_user_id, p.first_name, p.last_name, p.stripe_connect_account_id, p.stripe_onboarding_completed;
