
import React from 'react';
import { User, Settings } from 'lucide-react';

interface Collection {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
}

interface MobileMenuItemsProps {
  collections: Collection[];
  showAgeGroups: boolean;
  user: any;
  profileLoading: boolean;
  isCreator: boolean;
  isAdmin: boolean;
  closeMobileMenu: () => void;
}

const MobileMenuItems: React.FC<MobileMenuItemsProps> = ({
  collections,
  showAgeGroups,
  user,
  profileLoading,
  isCreator,
  isAdmin,
  closeMobileMenu
}) => {
  return (
    <>
      <a 
        href="/" 
        className="block text-ry-yellow hover:text-ry-white px-3 py-3 text-lg font-medium transition-colors border-b border-gray-700"
        onClick={closeMobileMenu}
      >
        Home
      </a>
      <a 
        href="/store" 
        className="block text-ry-yellow hover:text-ry-white px-3 py-3 text-lg font-medium transition-colors border-b border-gray-700"
        onClick={closeMobileMenu}
      >
        Shop
      </a>
      
      {/* Mobile Shop submenu */}
      <div className="pl-6 space-y-1">
        {/* Age groups */}
        {showAgeGroups && (
          <>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-2">
              Shop by Age
            </div>
            <a 
              href="/store?age=4-7" 
              className="block text-ry-yellow hover:text-ry-white px-3 py-2 text-base transition-colors"
              onClick={closeMobileMenu}
            >
              Ages 4-7
            </a>
            <a 
              href="/store?age=8-10" 
              className="block text-ry-yellow hover:text-ry-white px-3 py-2 text-base transition-colors"
              onClick={closeMobileMenu}
            >
              Ages 8-10
            </a>
            <a 
              href="/store?age=11-13" 
              className="block text-ry-yellow hover:text-ry-white px-3 py-2 text-base transition-colors"
              onClick={closeMobileMenu}
            >
              Ages 11-13
            </a>
            <a 
              href="/store?age=14-17" 
              className="block text-ry-yellow hover:text-ry-white px-3 py-2 text-base transition-colors"
              onClick={closeMobileMenu}
            >
              Ages 14-17
            </a>
          </>
        )}

        {/* Collections */}
        {collections.length > 0 && (
          <>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-2">
              Collections
            </div>
            {collections.map((collection) => (
              <a 
                key={collection.id}
                href={`/collections/${collection.slug}`} 
                className="block text-ry-yellow hover:text-ry-white px-3 py-2 text-base transition-colors"
                onClick={closeMobileMenu}
              >
                {collection.name}
              </a>
            ))}
            <div className="border-b border-gray-700 mt-2"></div>
          </>
        )}
      </div>

      <a 
        href="/creators" 
        className="block text-ry-yellow hover:text-ry-white px-3 py-3 text-lg font-medium transition-colors border-b border-gray-700"
        onClick={closeMobileMenu}
      >
        Creators
      </a>
      <a 
        href="/training-program" 
        className="block text-ry-yellow hover:text-ry-white px-3 py-3 text-lg font-medium transition-colors border-b border-gray-700"
        onClick={closeMobileMenu}
      >
        Future Founders
      </a>
      <a 
        href="/how-it-works" 
        className="block text-ry-yellow hover:text-ry-white px-3 py-3 text-lg font-medium transition-colors border-b border-gray-700"
        onClick={closeMobileMenu}
      >
        How It Works
      </a>
      <a 
        href="/about" 
        className="block text-ry-yellow hover:text-ry-white px-3 py-3 text-lg font-medium transition-colors border-b border-gray-700"
        onClick={closeMobileMenu}
      >
        About
      </a>
      
      {/* Mobile Dashboard Links for authenticated users */}
      {user && !profileLoading && (
        <>
          {isCreator && (
            <a 
              href="/creator/dashboard" 
              className="block text-ry-yellow hover:text-ry-white px-3 py-3 text-lg font-medium transition-colors border-b border-gray-700"
              onClick={closeMobileMenu}
            >
              <User className="h-4 w-4 mr-2 inline" />
              Creator Dashboard
            </a>
          )}
          {isAdmin && (
            <a 
              href="/admin" 
              className="block text-ry-yellow hover:text-ry-white px-3 py-3 text-lg font-medium transition-colors border-b border-gray-700"
              onClick={closeMobileMenu}
            >
              <Settings className="h-4 w-4 mr-2 inline" />
              Admin Dashboard
            </a>
          )}
        </>
      )}
    </>
  );
};

export default MobileMenuItems;
