
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { CheckCircle } from 'lucide-react';

interface CompletedStateProps {
  designTitle: string;
}

const CompletedState = ({ designTitle }: CompletedStateProps) => {
  return (
    <div className="pt-16 flex items-center justify-center min-h-screen">
      <RYCard className="p-12 text-center max-w-2xl">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-ry-black mb-4">
          You're All Set!
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Thanks for choosing your favorite design for "{designTitle}". 
          It will go live in our store soon!
        </p>
        <RYButton
          variant="primary"
          size="lg"
          onClick={() => window.location.href = '/creator/dashboard'}
        >
          Back to Dashboard
        </RYButton>
      </RYCard>
    </div>
  );
};

export default CompletedState;
