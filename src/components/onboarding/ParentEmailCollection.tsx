
import React, { useState } from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { useAgeVerification } from '@/hooks/useAgeVerification';

interface ParentEmailCollectionProps {
  sessionToken: string;
  onEmailSubmitted: () => void;
}

const ParentEmailCollection = ({ sessionToken, onEmailSubmitted }: ParentEmailCollectionProps) => {
  const [parentEmail, setParentEmail] = useState('');
  const { submitParentEmail, loading } = useAgeVerification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!parentEmail) {
      return;
    }

    const success = await submitParentEmail(sessionToken, parentEmail);
    
    if (success) {
      onEmailSubmitted();
    }
  };

  return (
    <div className="min-h-screen bg-ry-white flex items-center justify-center px-4">
      <RYCard className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
          <h1 className="text-3xl font-bold text-ry-black mb-2">
            Parent Permission Required
          </h1>
          <p className="text-gray-600">
            To keep you safe online, we need a parent or guardian to complete your sign-up.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-ry-black mb-2">
              Parent or Guardian Email
            </label>
            <input
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              placeholder="parent@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent"
              required
            />
            <p className="text-sm text-gray-600 mt-2">
              Ask a parent to check their email to finish sign-up.
            </p>
          </div>

          <RYButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading || !parentEmail}
          >
            {loading ? 'Sending...' : 'Send to Parent'}
          </RYButton>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>What happens next?</strong><br />
            Your parent will receive an email with instructions to verify their identity and complete your account setup.
          </p>
        </div>
      </RYCard>
    </div>
  );
};

export default ParentEmailCollection;
