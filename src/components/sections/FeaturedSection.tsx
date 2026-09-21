
import React from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { ProductCard } from '@/components/ui/product-card';
import { useFeaturedProducts } from '@/hooks/useFeaturedProducts';
import FeaturedSectionHeader from './FeaturedSectionHeader';
import FeaturedSectionLoadingState from './FeaturedSectionLoadingState';
import FeaturedSectionFallbackGrid from './FeaturedSectionFallbackGrid';

const FeaturedSection = () => {
  const { featuredProducts, loading } = useFeaturedProducts();

  const handleViewAllClick = () => {
    window.location.href = '/store';
  };

  return (
    <section className="bg-ry-white pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeaturedSectionHeader />

        {loading ? (
          <FeaturedSectionLoadingState />
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} showViewButton={true} />
            ))}
          </div>
        ) : (
          <FeaturedSectionFallbackGrid />
        )}

        <div className="text-center">
          <RYButton variant="secondary" size="lg" onClick={handleViewAllClick}>
            View All Designs
          </RYButton>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
