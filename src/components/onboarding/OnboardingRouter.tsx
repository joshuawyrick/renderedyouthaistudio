
import React, { useState } from 'react';
import AccountTypeSelection from './AccountTypeSelection';
import AgeGate from './AgeGate';
import ParentEmailCollection from './ParentEmailCollection';
import TeenSignupForm from './TeenSignupForm';
import AdultSignupForm from './AdultSignupForm';
import CustomerSignupForm from './CustomerSignupForm';

type OnboardingStep = 'account-type' | 'age-gate' | 'parent-email' | 'pending-parent' | 'teen-signup' | 'adult-signup' | 'customer-signup';

interface OnboardingData {
  accountType?: 'creator' | 'customer';
  age?: number;
  isMinor?: boolean;
  requiresParentConsent?: boolean;
  sessionToken?: string;
}

const OnboardingRouter = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('account-type');
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});

  const handleAccountTypeSelected = (accountType: 'creator' | 'customer') => {
    setOnboardingData({ accountType });
    
    if (accountType === 'customer') {
      setCurrentStep('customer-signup');
    } else {
      setCurrentStep('age-gate');
    }
  };

  const handleAgeVerified = (data: OnboardingData) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
    
    if (data.requiresParentConsent) {
      setCurrentStep('parent-email');
    } else if (data.isMinor) {
      setCurrentStep('teen-signup');
    } else {
      setCurrentStep('adult-signup');
    }
  };

  const handleEmailSubmitted = () => {
    setCurrentStep('pending-parent');
  };

  const handleSignupComplete = () => {
    // Redirect to home page after successful signup
    window.location.href = '/';
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'account-type':
        return <AccountTypeSelection onAccountTypeSelected={handleAccountTypeSelected} />;
      
      case 'age-gate':
        return <AgeGate onAgeVerified={handleAgeVerified} />;
      
      case 'parent-email':
        return (
          <ParentEmailCollection
            sessionToken={onboardingData.sessionToken!}
            onEmailSubmitted={handleEmailSubmitted}
          />
        );
      
      case 'pending-parent':
        return (
          <div className="p-8 text-center max-w-md mx-auto">
            <div className="text-6xl mb-4">📧</div>
            <h1 className="text-3xl font-bold text-ry-black mb-4">
              Email Sent!
            </h1>
            <p className="text-gray-600 mb-6">
              We've sent instructions to your parent's email. 
              They'll need to complete the verification process before you can continue.
            </p>
            <p className="text-sm text-gray-500">
              You can close this page and return when your parent has finished the setup.
            </p>
          </div>
        );
      
      case 'teen-signup':
        return <TeenSignupForm age={onboardingData.age!} />;
      
      case 'adult-signup':
        return <AdultSignupForm age={onboardingData.age!} />;
      
      case 'customer-signup':
        return <CustomerSignupForm onSignupComplete={handleSignupComplete} />;
      
      default:
        return <AccountTypeSelection onAccountTypeSelected={handleAccountTypeSelected} />;
    }
  };

  return renderCurrentStep();
};

export default OnboardingRouter;
