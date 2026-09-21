
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useTopNavLogic = () => {
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showOnboardingDialog, setShowOnboardingDialog] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const checkUserRoles = useCallback(async () => {
    if (!user) return;
    
    setProfileLoading(true);

    try {
      // Fetch both admin status and profile data in parallel for better performance
      const [adminResponse, profileResponse] = await Promise.all([
        supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('profiles')
          .select('account_type')
          .eq('id', user.id)
          .maybeSingle()
      ]);

      // Handle admin status
      if (adminResponse.error && adminResponse.error.code !== 'PGRST116') {
        console.error('Error checking admin status:', adminResponse.error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!adminResponse.data);
      }

      // Handle creator status
      if (profileResponse.error && profileResponse.error.code !== 'PGRST116') {
        console.error('Error checking profile:', profileResponse.error);
        setIsCreator(false);
      } else {
        setIsCreator(profileResponse.data?.account_type === 'creator');
      }
    } catch (error) {
      console.error('Error in checkUserRoles:', error);
      setIsAdmin(false);
      setIsCreator(false);
    } finally {
      setProfileLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      checkUserRoles();
    } else {
      setIsAdmin(false);
      setIsCreator(false);
      setProfileLoading(false);
    }
  }, [user, checkUserRoles]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleBecomeCreatorClick = () => {
    setShowOnboardingDialog(true);
    closeMobileMenu();
  };

  const handleSignInClick = () => {
    window.location.href = '/auth';
    closeMobileMenu();
  };

  return {
    user,
    signOut,
    isAdmin,
    isCreator,
    isMobileMenuOpen,
    showOnboardingDialog,
    profileLoading,
    toggleMobileMenu,
    closeMobileMenu,
    handleBecomeCreatorClick,
    handleSignInClick,
    setShowOnboardingDialog
  };
};
