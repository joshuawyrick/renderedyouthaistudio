
import React from 'react';
import { User, Settings } from 'lucide-react';
import { useNavigationData } from '@/hooks/useNavigationData';

interface DesktopNavLinksProps {
  user: any;
  profileLoading: boolean;
  isCreator: boolean;
  isAdmin: boolean;
}

const DesktopNavLinks: React.FC<DesktopNavLinksProps> = ({
  user,
  profileLoading,
  isCreator,
  isAdmin
}) => {
  const { collections, showAgeGroups } = useNavigationData();

  return (
    <div className="hidden lg:flex flex-1 min-w-0 items-center justify-center">
      <div className="flex items-center space-x-2 xl:space-x-6 2xl:space-x-10">
        <a href="/" className="text-ry-yellow hover:text-ry-white px-2 py-2 text-lg xl:text-xl 2xl:text-2xl font-medium whitespace-nowrap transition-colors">
          Home
        </a>
        <div className="relative group">
          <a href="/store" className="text-ry-yellow hover:text-ry-white px-2 py-2 text-lg xl:text-xl 2xl:text-2xl font-medium whitespace-nowrap transition-colors">
            Shop
          </a>
          {/* Shop dropdown */}
          <div className="absolute left-0 mt-1 w-48 bg-ry-white border border-ry-black rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="py-2">
              {/* Age groups section */}
              {showAgeGroups && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Shop by Age
                  </div>
                  <a href="/store?age=4-7" className="block px-4 py-2 text-base text-ry-black hover:bg-ry-yellow hover:text-ry-black">Ages 4-7</a>
                  <a href="/store?age=8-10" className="block px-4 py-2 text-base text-ry-black hover:bg-ry-yellow hover:text-ry-black">Ages 8-10</a>
                  <a href="/store?age=11-13" className="block px-4 py-2 text-base text-ry-black hover:bg-ry-yellow hover:text-ry-black">Ages 11-13</a>
                  <a href="/store?age=14-17" className="block px-4 py-2 text-base text-ry-black hover:bg-ry-yellow hover:text-ry-black">Ages 14-17</a>
                  {collections.length > 0 && <hr className="my-2 border-gray-200" />}
                </>
              )}
              
              {/* Collections section */}
              {collections.length > 0 && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Collections
                  </div>
                  {collections.map((collection) => (
                    <a 
                      key={collection.id}
                      href={`/collections/${collection.slug}`} 
                      className="block px-4 py-2 text-base text-ry-black hover:bg-ry-yellow hover:text-ry-black"
                    >
                      {collection.name}
                    </a>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
        <a href="/creators" className="text-ry-yellow hover:text-ry-white px-2 py-2 text-lg xl:text-xl 2xl:text-2xl font-medium whitespace-nowrap transition-colors">
          Creators
        </a>
        <a href="/training-program" className="text-ry-yellow hover:text-ry-white px-2 py-2 text-lg xl:text-xl 2xl:text-2xl font-medium whitespace-nowrap transition-colors">
          Future Founders
        </a>
        <a href="/how-it-works" className="text-ry-yellow hover:text-ry-white px-2 py-2 text-lg xl:text-xl 2xl:text-2xl font-medium whitespace-nowrap transition-colors">
          How It Works
        </a>
        <a href="/about" className="text-ry-yellow hover:text-ry-white px-2 py-2 text-lg xl:text-xl 2xl:text-2xl font-medium whitespace-nowrap transition-colors">
          About
        </a>
        
        {/* Dashboard Links for authenticated users */}
        {user && !profileLoading && (
          <>
            {isCreator && (
              <a href="/creator/dashboard" className="text-ry-yellow hover:text-ry-white px-2 py-2 text-lg xl:text-xl 2xl:text-2xl font-medium whitespace-nowrap transition-colors flex items-center">
                <User className="h-4 w-4 mr-1" />
                Creator Dashboard
              </a>
            )}
            {isAdmin && (
              <a href="/admin" className="text-ry-yellow hover:text-ry-white px-2 py-2 text-lg xl:text-xl 2xl:text-2xl font-medium whitespace-nowrap transition-colors flex items-center">
                <Settings className="h-4 w-4 mr-1" />
                Admin Dashboard
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DesktopNavLinks;
