
import React from 'react';
import { RYButton } from '@/components/ui/ry-button';

interface MobileMenuActionsProps {
  user: any;
  profileLoading: boolean;
  isCreator: boolean;
  closeMobileMenu: () => void;
  handleSignOut: () => void;
  handleBecomeCreatorClick: () => void;
  handleSignInClick: () => void;
}

const MobileMenuActions: React.FC<MobileMenuActionsProps> = ({
  user,
  profileLoading,
  isCreator,
  closeMobileMenu,
  handleSignOut,
  handleBecomeCreatorClick,
  handleSignInClick
}) => {
  return (
    <div className="px-3 py-4 space-y-3">
      <RYButton
        variant="outline"
        size="sm"
        onClick={() => {
          window.location.href = '/cart';
          closeMobileMenu();
        }}
        className="w-full"
      >
        View Cart
      </RYButton>

      {user ? (
        <>
          {!profileLoading && isCreator && (
            <RYButton 
              variant="secondary" 
              size="sm"
              onClick={() => {
                window.location.href = '/creator/upload';
                closeMobileMenu();
              }}
              className="w-full"
            >
              Upload Art
            </RYButton>
          )}
          <RYButton 
            variant="primary" 
            size="sm"
            onClick={handleSignOut}
            className="w-full"
          >
            Sign Out
          </RYButton>
        </>
      ) : (
        <>
          <RYButton 
            variant="secondary" 
            size="sm"
            onClick={handleBecomeCreatorClick}
            className="w-full"
          >
            Become a Creator
          </RYButton>
          <RYButton 
            variant="primary" 
            size="sm"
            onClick={handleSignInClick}
            className="w-full"
          >
            Sign In
          </RYButton>
        </>
      )}
    </div>
  );
};

export default MobileMenuActions;
