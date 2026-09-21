import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { verifyParentToken } from '@/services/tokenSecurity';
import { logSecurityEvent } from '@/services/securityService';

const ParentVerification = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [childInfo, setChildInfo] = useState<any>(null);
  const { toast } = useToast();

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setError('Invalid verification link');
    }
  }, [token]);

  const verifyToken = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const tokenData = await verifyParentToken(token);
      
      if (!tokenData) {
        setError('Invalid or expired verification link');
        return;
      }

      setChildInfo(tokenData.age_verification);
    } catch (err) {
      console.error('Error verifying token:', err);
      setError('Failed to verify token');
    } finally {
      setLoading(false);
    }
  };

  const handleConsent = async (giveConsent: boolean) => {
    if (!token || !childInfo) return;

    setLoading(true);
    try {
      if (giveConsent) {
        // Mark token as verified
        const tokenHash = await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(token)
        );
        const tokenHashHex = Array.from(new Uint8Array(tokenHash))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');

        const { error: updateError } = await supabase
          .from('parent_verification_tokens')
          .update({ 
            verified_at: new Date().toISOString(),
            verification_ip_address: null
          })
          .eq('token_hash', tokenHashHex);

        if (updateError) throw updateError;

        // Mark age verification as verified
        const { error: ageUpdateError } = await supabase
          .from('age_verification')
          .update({ verified_at: new Date().toISOString() })
          .eq('id', childInfo.id);

        if (ageUpdateError) throw ageUpdateError;

        // Create user consent record
        const { error: consentError } = await supabase
          .from('user_consents')
          .insert({
            parent_email: childInfo.parent_email,
            consent_method: 'email_verification',
            notice_version: '1.0',
            is_active: true
          });

        if (consentError) throw consentError;

        // Log security event
        await logSecurityEvent({
          action: 'PARENT_CONSENT_GRANTED',
          resource_type: 'consent',
          resource_id: childInfo.id,
          metadata: { parent_email: childInfo.parent_email }
        });

        setVerified(true);
        toast({
          title: "Consent Recorded",
          description: "Your child can now create their account and start uploading artwork!",
        });
      } else {
        await logSecurityEvent({
          action: 'PARENT_CONSENT_DECLINED',
          resource_type: 'consent',
          metadata: { parent_email: childInfo.parent_email }
        });

        toast({
          title: "Consent Declined",
          description: "Your child's account creation has been cancelled.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error processing consent:', err);
      setError('Failed to process consent');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !childInfo) {
    return (
      <div className="min-h-screen bg-ry-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-lg text-gray-600">Verifying your link...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ry-white flex items-center justify-center px-4">
        <RYCard className="w-full max-w-md p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-ry-black mb-4">Verification Failed</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <RYButton 
            variant="outline" 
            onClick={() => window.location.href = '/'}
          >
            Return Home
          </RYButton>
        </RYCard>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="min-h-screen bg-ry-white flex items-center justify-center px-4">
        <RYCard className="w-full max-w-md p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-ry-black mb-4">Consent Recorded</h1>
          <p className="text-gray-600 mb-6">
            Thank you for giving consent! Your child can now create their account and start sharing their amazing artwork with the world.
          </p>
          <RYButton 
            variant="primary" 
            onClick={() => window.location.href = '/auth'}
          >
            Continue to Sign Up
          </RYButton>
        </RYCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ry-white flex items-center justify-center px-4">
      <RYCard className="w-full max-w-lg p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
          <h1 className="text-3xl font-bold text-ry-black mb-2">
            Parent Verification
          </h1>
          <p className="text-gray-600">
            Your child wants to join Rendered Youth and share their artwork
          </p>
        </div>

        {childInfo && (
          <div className="mb-8">
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-ry-black mb-2">About Your Child's Request</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Date of Birth: {new Date(childInfo.date_of_birth).toLocaleDateString()}</li>
                <li>• Age: Under 13 (requires parental consent)</li>
                <li>• Requested: {new Date(childInfo.created_at).toLocaleDateString()}</li>
              </ul>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-ry-black mb-2">What This Means</h3>
              <p className="text-sm text-gray-700 mb-3">
                By giving consent, you allow your child to:
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Upload and share their black marker artwork</li>
                <li>• Have their designs turned into T-shirts</li>
                <li>• Earn commissions when their designs sell</li>
                <li>• Create a profile on our platform</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-ry-black mb-2">Safety & Privacy</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• No personal information is shared publicly</li>
                <li>• All uploads are reviewed before going live</li>
                <li>• You can withdraw consent at any time</li>
                <li>• We comply with COPPA regulations</li>
              </ul>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <RYButton
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={() => handleConsent(true)}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Give Consent'}
          </RYButton>
          <RYButton
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => handleConsent(false)}
            disabled={loading}
          >
            Decline
          </RYButton>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Questions? Contact us at{' '}
            <a href="mailto:support@renderedyouth.com" className="text-ry-yellow hover:underline">
              support@renderedyouth.com
            </a>
          </p>
        </div>
      </RYCard>
    </div>
  );
};

export default ParentVerification;
