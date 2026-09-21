
import React, { useState } from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { useAgeVerification } from '@/hooks/useAgeVerification';

interface AgeGateProps {
  onAgeVerified: (data: {
    age: number;
    isMinor: boolean;
    requiresParentConsent: boolean;
    sessionToken?: string;
  }) => void;
}

const AgeGate = ({ onAgeVerified }: AgeGateProps) => {
  const [dateOfBirth, setDateOfBirth] = useState('');
  const { verifyAge, loading } = useAgeVerification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dateOfBirth) {
      return;
    }

    const result = await verifyAge(dateOfBirth);
    
    if (result) {
      onAgeVerified(result);
    }
  };

  // Calculate max date (today) for date input
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-ry-white flex items-center justify-center px-4">
      <RYCard className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ry-black mb-2">
            Welcome to Rendered Youth
          </h1>
          <p className="text-gray-600">
            To get started, we need to verify your age for safety and compliance.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-ry-black mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              max={today}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              We use this to determine the appropriate sign-up process for your age group.
            </p>
          </div>

          <RYButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading || !dateOfBirth}
          >
            {loading ? 'Verifying...' : 'Continue'}
          </RYButton>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            We're committed to protecting young creators. 
            <br />
            <a href="/privacy" className="text-ry-yellow hover:underline">
              Learn about our privacy practices
            </a>
          </p>
        </div>
      </RYCard>
    </div>
  );
};

export default AgeGate;
