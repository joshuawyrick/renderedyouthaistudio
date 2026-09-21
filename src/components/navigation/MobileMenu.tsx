
import React, { useEffect } from 'react';
import { useNavigationData } from '@/hooks/useNavigationData';
import MobileMenuItems from './MobileMenuItems';
import MobileMenuActions from './MobileMenuActions';

interface MobileMenuProps {
  isMobileMenuOpen: boolean;
  user: any;
  profileLoading: boolean;
  isCreator: boolean;
  isAdmin: boolean;
  closeMobileMenu: () => void;
  signOut: () => void;
  handleBecomeCreatorClick: () => void;
  handleSignInClick: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isMobileMenuOpen,
  user,
  profileLoading,
  isCreator,
  isAdmin,
  closeMobileMenu,
  signOut,
  handleBecomeCreatorClick,
  handleSignInClick
}) => {
  const { collections, showAgeGroups } = useNavigationData();

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      closeMobileMenu();
    } catch (error) {
      console.error('Sign out error:', error);
      closeMobileMenu();
    }
  };

  if (!isMobileMenuOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={closeMobileMenu}
      />
      
      {/* Mobile menu panel */}
      <div className="absolute top-32 left-0 right-0 bottom-0 bg-ry-black border-t border-ry-yellow shadow-lg overflow-y-auto">
        <div className="px-4 py-2 space-y-1 text-center">
          <MobileMenuItems 
            collections={collections}
            showAgeGroups={showAgeGroups}
            user={user}
            profileLoading={profileLoading}
            isCreator={isCreator}
            isAdmin={isAdmin}
            closeMobileMenu={closeMobileMenu}
          />

          <MobileMenuActions 
            user={user}
            profileLoading={profileLoading}
            isCreator={isCreator}
            closeMobileMenu={closeMobileMenu}
            handleSignOut={handleSignOut}
            handleBecomeCreatorClick={handleBecomeCreatorClick}
            handleSignInClick={handleSignInClick}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
