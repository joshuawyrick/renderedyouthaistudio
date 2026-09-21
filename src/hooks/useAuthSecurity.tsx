
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { rateLimitService } from '@/services/rateLimitService';

export const useAuthSecurity = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        
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
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      
      // Clean local state first
      setUser(null);
      setSession(null);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Sign out error:', error);
      }
      
    } catch (error) {
      console.error('Unexpected sign out error:', error);
    } finally {
      // Always redirect regardless of errors
      window.location.href = '/';
    }
  };

  const logSecurityEvent = async (action: string, metadata?: any) => {
    try {
      // This is a placeholder - in a real app you'd send this to your security service
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  const checkRateLimit = async (action: string, identifier?: string): Promise<boolean> => {
    try {
      const result = await rateLimitService.checkRateLimit(action, identifier);
      return result.allowed;
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return true; // Allow by default if rate limiting fails
    }
  };

  return {
    user,
    session,
    loading,
    signOut,
    logSecurityEvent,
    checkRateLimit
  };
};
