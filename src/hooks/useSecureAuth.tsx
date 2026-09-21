
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { logEnhancedSecurityEvent, monitorAuthFailures } from '@/services/enhancedSecurityService';
import { sessionSecurity } from '@/services/sessionSecurity';
import { rateLimitService } from '@/services/rateLimitService';

export const useSecureAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener with enhanced security
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        
        // Enhanced security logging
        if (event === 'SIGNED_IN' && session?.user) {
          await logEnhancedSecurityEvent({
            action: 'USER_SIGNED_IN',
            resource_type: 'auth',
            resource_id: session.user.id,
            severity: 'low',
            metadata: { 
              email: session.user.email,
              provider: session.user.app_metadata?.provider || 'email'
            }
          });
          
          // Start session monitoring
          sessionSecurity.startSessionMonitoring();
          sessionSecurity.resetSession();
          
          // Record successful authentication for rate limiting
          await rateLimitService.recordSuccess('login', session.user.id);
        }
        
        if (event === 'SIGNED_OUT') {
          await logEnhancedSecurityEvent({
            action: 'USER_SIGNED_OUT',
            resource_type: 'auth',
            severity: 'low'
          });
          
          // Stop session monitoring
          sessionSecurity.stopSessionMonitoring();
          
          setSession(null);
          setUser(null);
          setLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        sessionSecurity.startSessionMonitoring();
      }
    });

    return () => {
      subscription.unsubscribe();
      sessionSecurity.stopSessionMonitoring();
    };
  }, []);

  const secureSignIn = async (email: string, password: string): Promise<{ error?: any }> => {
    try {
      // Check rate limits
      const rateLimitCheck = await rateLimitService.checkRateLimit('login');
      if (!rateLimitCheck.allowed) {
        const error = new Error(`Too many login attempts. Please try again in ${rateLimitCheck.retryAfter} seconds.`);
        await monitorAuthFailures(email, 'rate_limited');
        return { error };
      }

      // Record attempt
      await rateLimitService.recordAttempt('login');

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });

      if (error) {
        await monitorAuthFailures(email, error.message);
        return { error };
      }

      return { error: null };
    } catch (error) {
      await monitorAuthFailures(email, 'unexpected_error');
      return { error };
    }
  };

  const secureSignUp = async (email: string, password: string, metadata?: any): Promise<{ error?: any }> => {
    try {
      // Check rate limits
      const rateLimitCheck = await rateLimitService.checkRateLimit('signup');
      if (!rateLimitCheck.allowed) {
        const error = new Error(`Too many signup attempts. Please try again in ${rateLimitCheck.retryAfter} seconds.`);
        return { error };
      }

      // Record attempt
      await rateLimitService.recordAttempt('signup');

      const redirectUrl = `${window.location.origin}/`;

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata
        }
      });

      if (error) {
        await logEnhancedSecurityEvent({
          action: 'SIGNUP_FAILED',
          resource_type: 'auth',
          severity: 'medium',
          metadata: { email, error: error.message }
        });
        return { error };
      }

      if (data.user) {
        await logEnhancedSecurityEvent({
          action: 'USER_SIGNUP_SUCCESS',
          resource_type: 'auth',
          resource_id: data.user.id,
          severity: 'low',
          metadata: { email }
        });
        
        // Record successful signup for rate limiting
        await rateLimitService.recordSuccess('signup', data.user.id);
      }

      return { error: null };
    } catch (error) {
      await logEnhancedSecurityEvent({
        action: 'SIGNUP_ERROR',
        resource_type: 'auth',
        severity: 'high',
        metadata: { email, error: error instanceof Error ? error.message : 'Unknown error' }
      });
      return { error };
    }
  };

  const validateInput = (input: string, type: 'email' | 'password' | 'name'): { isValid: boolean; error?: string } => {
    if (!input || input.trim().length === 0) {
      return { isValid: false, error: 'Input cannot be empty' };
    }

    switch (type) {
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input)) {
          return { isValid: false, error: 'Invalid email format' };
        }
        break;
      }
      case 'password':
        if (input.length < 8) {
          return { isValid: false, error: 'Password must be at least 8 characters' };
        }
        break;
      case 'name': {
        const nameRegex = /^[a-zA-Z\s'-]+$/;
        if (!nameRegex.test(input)) {
          return { isValid: false, error: 'Name contains invalid characters' };
        }
        break;
      }
    }

    return { isValid: true };
  };

  // Removes XSS vectors but keeps spaces, so typing in a field feels normal.
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  };

  const signOut = async () => {
    try {
      
      await logEnhancedSecurityEvent({
        action: 'USER_SIGN_OUT_INITIATED',
        resource_type: 'auth',
        severity: 'low'
      });
      
      // Stop session monitoring
      sessionSecurity.stopSessionMonitoring();
      
      // Clean local state first
      setUser(null);
      setSession(null);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Sign out error:', error);
        await logEnhancedSecurityEvent({
          action: 'USER_SIGN_OUT_ERROR',
          resource_type: 'auth',
          severity: 'medium',
          metadata: { error: error.message }
        });
      }
      
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      await logEnhancedSecurityEvent({
        action: 'USER_SIGN_OUT_ERROR',
        resource_type: 'auth',
        severity: 'medium',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    } finally {
      // Always redirect regardless of errors
      window.location.href = '/';
    }
  };

  return {
    user,
    session,
    loading,
    signOut,
    secureSignIn,
    secureSignUp,
    validateInput,
    sanitizeInput
  };
};
