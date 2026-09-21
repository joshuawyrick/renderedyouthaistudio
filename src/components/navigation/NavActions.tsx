
import React from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { Search } from 'lucide-react';
import CartButton from './CartButton';

interface NavActionsProps {
  user: any;
  profileLoading: boolean;
  isCreator: boolean;
  signOut: () => void;
  handleBecomeCreatorClick: () => void;
  handleSignInClick: () => void;
}

const NavActions: React.FC<NavActionsProps> = ({
  user,
  profileLoading,
  isCreator,
  signOut,
  handleBecomeCreatorClick,
  handleSignInClick
}) => {
  return (
    <div className="hidden lg:flex items-center space-x-2 xl:space-x-3 flex-shrink-0">
      <Search className="h-5 w-5 text-ry-yellow hover:text-ry-white cursor-pointer transition-colors" />

      <CartButton />
      
      {user ? (
        <>
          {!profileLoading && isCreator && (
            <RYButton 
              variant="secondary" 
              size="sm"
              onClick={() => window.location.href = '/creator/upload'}
              className="text-xs xl:text-sm whitespace-nowrap"
            >
              Upload Art
            </RYButton>
          )}
          <RYButton 
            variant="primary" 
            size="sm"
            onClick={signOut}
            className="text-xs xl:text-sm whitespace-nowrap"
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
            className="text-xs xl:text-sm whitespace-nowrap"
          >
            Become a Creator
          </RYButton>
          <RYButton 
            variant="primary" 
            size="sm"
            onClick={handleSignInClick}
            className="text-xs xl:text-sm whitespace-nowrap"
          >
            Sign In
          </RYButton>
        </>
      )}
    </div>
  );
};

export default NavActions;
