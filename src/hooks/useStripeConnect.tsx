
import { useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useStripeConnect = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const checkStripeConnectStatus = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('stripe_onboarding_completed, stripe_charges_enabled, stripe_payouts_enabled')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking Stripe Connect status:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in checkStripeConnectStatus:', error);
      return null;
    }
  };

  const startStripeConnectOnboarding = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // This will be implemented when Stripe Connect is enabled
      // For now, we'll just log that the user wants to start onboarding
      
      // Placeholder for future Stripe Connect account creation
      alert('Stripe Connect onboarding will be available once Stripe Connect is enabled on the platform.');
      
    } catch (error) {
      console.error('Error starting Stripe Connect onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    checkStripeConnectStatus,
    startStripeConnectOnboarding,
    loading
  };
};
