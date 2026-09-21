
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from './securityService';

// Generate obfuscated token for parent verification
export const generateObfuscatedToken = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2);
  return `${timestamp}-${random}`;
};

// Hash token for secure storage using Web Crypto API
export const hashToken = async (token: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Create secure parent verification token
export const createSecureVerificationToken = async (
  parentEmail: string,
  ageVerificationId: string
): Promise<{ token: string; obfuscatedToken: string } | null> => {
  try {
    const originalToken = crypto.randomUUID();
    const obfuscatedToken = generateObfuscatedToken();
    const tokenHash = await hashToken(originalToken);

    const { error } = await supabase
      .from('parent_verification_tokens')
      .insert({
        parent_email: parentEmail,
        age_verification_id: ageVerificationId,
        token_hash: tokenHash,
        obfuscated_token: obfuscatedToken,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      });

    if (error) throw error;

    await logSecurityEvent({
      action: 'PARENT_VERIFICATION_TOKEN_CREATED',
      resource_type: 'token',
      metadata: { parent_email: parentEmail, obfuscated_token: obfuscatedToken }
    });

    return { token: originalToken, obfuscatedToken };
  } catch (error) {
    console.error('Error creating verification token:', error);
    await logSecurityEvent({
      action: 'PARENT_VERIFICATION_TOKEN_ERROR',
      resource_type: 'token',
      metadata: { parent_email: parentEmail, error: error instanceof Error ? error.message : 'Unknown error' }
    });
    return null;
  }
};

// Verify parent token securely
export const verifyParentToken = async (token: string): Promise<any> => {
  try {
    const tokenHash = await hashToken(token);

    const { data: tokenData, error } = await supabase
      .from('parent_verification_tokens')
      .select(`
        *,
        age_verification (*)
      `)
      .eq('token_hash', tokenHash)
      .is('verified_at', null)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !tokenData) {
      await logSecurityEvent({
        action: 'PARENT_VERIFICATION_TOKEN_INVALID',
        resource_type: 'token',
        metadata: { token_provided: !!token }
      });
      return null;
    }

    // Mark token as verified
    const { error: updateError } = await supabase
      .from('parent_verification_tokens')
      .update({ verified_at: new Date().toISOString() })
      .eq('id', tokenData.id);

    if (updateError) {
      console.error('Error marking token as verified:', updateError);
    }

    await logSecurityEvent({
      action: 'PARENT_VERIFICATION_TOKEN_VERIFIED',
      resource_type: 'token',
      resource_id: tokenData.id,
      metadata: { parent_email: tokenData.parent_email }
    });

    return tokenData;
  } catch (error) {
    console.error('Error verifying token:', error);
    await logSecurityEvent({
      action: 'PARENT_VERIFICATION_TOKEN_ERROR',
      resource_type: 'token',
      metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
    return null;
  }
};

// Clean up expired tokens (should be called periodically)
export const cleanupExpiredTokens = async (): Promise<void> => {
  try {
    const { error } = await supabase
      .from('parent_verification_tokens')
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (error) {
      console.error('Error cleaning up expired tokens:', error);
    } else {
      await logSecurityEvent({
        action: 'EXPIRED_TOKENS_CLEANUP',
        resource_type: 'token',
        metadata: { cleanup_date: new Date().toISOString() }
      });
    }
  } catch (error) {
    console.error('Error during token cleanup:', error);
  }
};
