
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface AgeVerificationData {
  dateOfBirth: string;
  isMinor: boolean;
  requiresParentConsent: boolean;
  sessionToken?: string;
}

export const useAgeVerification = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const verifyAge = async (dateOfBirth: string) => {
    setLoading(true);
    
    try {
      const age = calculateAge(dateOfBirth);
      const isMinor = age < 18;
      const requiresParentConsent = age < 13;

      // Store age verification data. The session token is generated client-side so
      // we never need to read this sensitive row back from the database.
      const sessionToken = crypto.randomUUID();

      const { error } = await supabase
        .from('age_verification')
        .insert({
          session_token: sessionToken,
          date_of_birth: dateOfBirth,
          is_minor: isMinor,
          requires_parent_consent: requiresParentConsent,
        });

      if (error) {
        console.error('Age verification error:', error);
        toast({
          title: "Verification Error",
          description: "Unable to verify age. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      return {
        dateOfBirth,
        isMinor,
        requiresParentConsent,
        sessionToken,
        age,
      };
    } catch (error) {
      console.error('Age verification failed:', error);
      toast({
        title: "Verification Failed",
        description: "Please check your date of birth and try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const submitParentEmail = async (sessionToken: string, parentEmail: string) => {
    setLoading(true);
    
    try {
      // Call the edge function to send verification email
      const { data, error } = await supabase.functions.invoke('send-parent-verification', {
        body: {
          sessionToken,
          parentEmail,
        },
      });

      if (error) {
        console.error('Parent email submission error:', error);
        toast({
          title: "Submission Error",
          description: "Unable to send verification email. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      if (data?.success) {
        toast({
          title: "Verification Email Sent",
          description: "We've sent verification instructions to the parent email.",
        });
        return true;
      } else {
        throw new Error(data?.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Parent email submission failed:', error);
      toast({
        title: "Submission Failed",
        description: "Please check the email address and try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    verifyAge,
    submitParentEmail,
    loading,
  };
};
