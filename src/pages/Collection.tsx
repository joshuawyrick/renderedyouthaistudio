
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/store/ProductGrid';
import StoreFilters from '@/components/store/StoreFilters';
import MobileStoreFilters from '@/components/store/MobileStoreFilters';
import { useStoreData } from '@/hooks/useStoreData';
import { filterProducts } from '@/utils/storeFilters';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';

interface Collection {
  id: string;
  name: string;
  description: string | null;
  page_header: string | null;
  page_description: string | null;
  is_active: boolean;
}

const Collection = () => {
  const { slug } = useParams<{ slug: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  // Filter states
  const [selectedAge, setSelectedAge] = useState<string | undefined>();
  const [selectedState, setSelectedState] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { collections, products, loading: productsLoading } = useStoreData();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (slug) {
      fetchCollection();
    }
  }, [slug]);

  const fetchCollection = async () => {
    if (!slug) return;

    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setNotFound(true);
        } else {
          throw error;
        }
        return;
      }

      setCollection(data);
    } catch (error) {
      console.error('Error fetching collection:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = collection 
    ? filterProducts(products, { 
        selectedCollection: collection.id,
        selectedAge,
        selectedState,
        searchTerm
      })
    : [];

  // Count active filters (excluding collection since it's pre-selected)
  const activeFiltersCount = [selectedAge, selectedState, searchTerm].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <div className="pt-40 flex">
          {/* Desktop sidebar loading */}
          {!isMobile && (
            <div className="fixed left-0 top-40 h-[calc(100vh-10rem)] w-80 bg-white border-r border-gray-200 overflow-y-auto z-10">
              <div className="p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Main Content */}
          <div className={`flex-1 ${!isMobile ? 'ml-80' : ''}`}>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ry-yellow mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading collection...</p>
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !collection) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <div className="pt-40 flex">
          {/* Desktop Fixed Left Sidebar - Filters (hidden on mobile) */}
          {!isMobile && (
            <div className="fixed left-0 top-40 h-[calc(100vh-10rem)] w-80 bg-white border-r border-gray-200 overflow-y-auto z-10">
              <div className="p-6">
                <StoreFilters
                  selectedAge={selectedAge}
                  setSelectedAge={setSelectedAge}
                  selectedState={selectedState}
                  setSelectedState={setSelectedState}
                  selectedCollection={undefined}
                  setSelectedCollection={() => {}}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  collections={collections}
                />
              </div>
            </div>
          )}
          
          {/* Main Content */}
          <div className={`flex-1 ${!isMobile ? 'ml-80' : ''}`}>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-ry-black mb-4">Collection Not Found</h1>
                <p className="text-xl text-gray-600 mb-8">
                  The collection you're looking for doesn't exist or has been removed.
                </p>
                <a 
                  href="/store"
                  className="inline-block bg-ry-yellow text-ry-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
                >
                  Browse All Products
                </a>
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      <div className="pt-40 flex">
        {/* Desktop Fixed Left Sidebar - Filters (hidden on mobile) */}
        {!isMobile && (
          <div className="fixed left-0 top-40 h-[calc(100vh-10rem)] w-80 bg-white border-r border-gray-200 overflow-y-auto z-10">
            <div className="p-6">
              <StoreFilters
                selectedAge={selectedAge}
                setSelectedAge={setSelectedAge}
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                selectedCollection={collection.id}
                setSelectedCollection={() => {}} // Disabled since we're in a specific collection
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                collections={collections}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 ${!isMobile ? 'ml-80' : ''}`}>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Collection Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-ry-black mb-6">
                {collection.page_header || collection.name}
              </h1>
              {collection.page_description && (
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {collection.page_description}
                </p>
              )}
            </div>

            {/* Mobile Filter Button */}
            {isMobile && (
              <div className="mb-6">
                <MobileStoreFilters
                  selectedAge={selectedAge}
                  setSelectedAge={setSelectedAge}
                  selectedState={selectedState}
                  setSelectedState={setSelectedState}
                  selectedCollection={collection.id}
                  setSelectedCollection={() => {}} // Disabled since we're in a specific collection
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  collections={collections}
                  activeFiltersCount={activeFiltersCount}
                />
              </div>
            )}

            {/* Results Count */}
            <div className="mb-8">
              <p className="text-gray-600">
                Showing {filteredProducts.length} design{filteredProducts.length !== 1 ? 's' : ''} in {collection.name}
              </p>
            </div>

            {/* Products Grid */}
            <ProductGrid products={filteredProducts} loading={productsLoading} />

            {/* Empty State */}
            {!productsLoading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-ry-black mb-2">No designs found</h3>
                <p className="text-gray-600">Try adjusting your search or age filters to find more designs.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Collection;
