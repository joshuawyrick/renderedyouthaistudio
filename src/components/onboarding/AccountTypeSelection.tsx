
import React, { useState } from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Palette, ShoppingBag } from 'lucide-react';

interface AccountTypeSelectionProps {
  onAccountTypeSelected: (accountType: 'creator' | 'customer') => void;
}

const AccountTypeSelection = ({ onAccountTypeSelected }: AccountTypeSelectionProps) => {
  const [selectedType, setSelectedType] = useState<'creator' | 'customer' | null>(null);

  const handleContinue = () => {
    if (selectedType) {
      onAccountTypeSelected(selectedType);
    }
  };

  return (
    <div className="p-8">
      <RYCard className="w-full max-w-2xl mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ry-black mb-2">
            Welcome to Rendered Youth
          </h1>
          <p className="text-gray-600">
            Choose how you'd like to use our platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Creator Option */}
          <div 
            className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
              selectedType === 'creator' 
                ? 'border-ry-yellow bg-ry-yellow bg-opacity-10' 
                : 'border-gray-300 hover:border-ry-yellow hover:bg-ry-yellow hover:bg-opacity-5'
            }`}
            onClick={() => setSelectedType('creator')}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-ry-yellow rounded-full flex items-center justify-center">
                <Palette className="h-8 w-8 text-ry-black" />
              </div>
              <h3 className="text-xl font-bold text-ry-black mb-2">Become a Creator</h3>
              <p className="text-gray-600 text-sm mb-4">
                Upload your artwork, see it on products, and earn commissions from sales
              </p>
              <ul className="text-left text-sm text-gray-600 space-y-1">
                <li>• Upload and submit designs</li>
                <li>• Track your submissions</li>
                <li>• Earn 15% commission on sales</li>
                <li>• Access creator dashboard</li>
                <li>• Shop all products</li>
              </ul>
            </div>
          </div>

          {/* Customer Option */}
          <div 
            className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
              selectedType === 'customer' 
                ? 'border-ry-yellow bg-ry-yellow bg-opacity-10' 
                : 'border-gray-300 hover:border-ry-yellow hover:bg-ry-yellow hover:bg-opacity-5'
            }`}
            onClick={() => setSelectedType('customer')}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-ry-black rounded-full flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-ry-yellow" />
              </div>
              <h3 className="text-xl font-bold text-ry-black mb-2">Shop Products</h3>
              <p className="text-gray-600 text-sm mb-4">
                Browse and purchase unique youth-designed apparel and accessories
              </p>
              <ul className="text-left text-sm text-gray-600 space-y-1">
                <li>• Shop all products</li>
                <li>• Save shipping addresses</li>
                <li>• Track order history</li>
                <li>• Discover new creators</li>
                <li>• Quick checkout process</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <RYButton
            variant="primary"
            size="lg"
            className="w-full max-w-xs"
            disabled={!selectedType}
            onClick={handleContinue}
          >
            Continue
          </RYButton>
          
          {selectedType && (
            <p className="text-sm text-gray-500 mt-4">
              {selectedType === 'creator' 
                ? "You'll go through age verification and creator onboarding"
                : "You'll create a simple account to start shopping"
              }
            </p>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            You can always upgrade to a creator account later from your profile settings.
          </p>
        </div>
      </RYCard>
    </div>
  );
};

export default AccountTypeSelection;
