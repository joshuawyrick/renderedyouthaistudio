
import React, { useState, useEffect } from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { useStripeConnect } from '@/hooks/useStripeConnect';
import { CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

const StripeConnectSetup = () => {
  const { checkStripeConnectStatus, startStripeConnectOnboarding, loading } = useStripeConnect();
  const [stripeStatus, setStripeStatus] = useState<any>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    loadStripeStatus();
  }, []);

  const loadStripeStatus = async () => {
    const status = await checkStripeConnectStatus();
    setStripeStatus(status);
    setStatusLoading(false);
  };

  if (statusLoading) {
    return (
      <RYCard className="p-6">
        <div className="text-center">Loading payment setup...</div>
      </RYCard>
    );
  }

  const isConnected = stripeStatus?.stripe_onboarding_completed
    || stripeStatus?.stripe_charges_enabled
    || stripeStatus?.stripe_payouts_enabled;
  const isOnboardingComplete = stripeStatus?.stripe_onboarding_completed;
  const canReceivePayments = stripeStatus?.stripe_charges_enabled && stripeStatus?.stripe_payouts_enabled;

  return (
    <RYCard className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <CreditCard className="h-6 w-6 text-ry-yellow" />
        <h3 className="text-xl font-semibold text-ry-black">Payment Setup</h3>
      </div>

      {!isConnected ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 mb-1">Payment Setup Required</h4>
              <p className="text-sm text-amber-700 mb-3">
                To receive earnings from your design sales, you'll need to connect a payment account. 
                This is secure and handled by Stripe.
              </p>
              <RYButton
                onClick={startStripeConnectOnboarding}
                loading={loading}
                className="bg-ry-yellow hover:bg-ry-yellow/80 text-ry-black"
              >
                Set Up Payments
              </RYButton>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800 mb-1">Payment Account Connected</h4>
              <div className="space-y-2 text-sm text-green-700">
                <div className="flex items-center justify-between">
                  <span>Onboarding:</span>
                  <span className={isOnboardingComplete ? 'text-green-600' : 'text-amber-600'}>
                    {isOnboardingComplete ? '✓ Complete' : '⚠ Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Can Receive Payments:</span>
                  <span className={canReceivePayments ? 'text-green-600' : 'text-amber-600'}>
                    {canReceivePayments ? '✓ Yes' : '⚠ Not Yet'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> Stripe Connect integration is currently being prepared. 
          Once enabled, you'll be able to receive direct payments for your design sales.
        </p>
      </div>
    </RYCard>
  );
};

export default StripeConnectSetup;
