import React, { useState } from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { AgeFilterChips } from '@/components/ui/age-filter-chips';

const HeroSection = () => {
  const [selectedAge, setSelectedAge] = useState<string | undefined>();

  const handleAgeChange = (age: string | undefined) => {
    setSelectedAge(age);
    if (age) {
      // Navigate to creators page with age filter
      window.location.href = `/creators?age=${age}`;
    }
  };

  const handleBecomeCreator = () => {
    window.location.href = '/onboarding/parent';
  };

  return (
    <section className="bg-ry-white pt-4 sm:pt-6 lg:pt-8 xl:pt-12 pb-6 sm:pb-8 lg:pb-10 xl:pb-12 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-9xl font-bold text-ry-black mb-6 sm:mb-8 leading-tight">
            Kids Draw It
            <span className="block text-ry-yellow mt-2">We Render It</span>
            <span className="block mt-2">You Wear It</span>
          </h1>
          
          <p className="text-3xl sm:text-4xl md:text-5xl text-gray-600 mb-8 sm:mb-10 lg:mb-12 max-w-3xl mx-auto px-4 leading-relaxed">
            A magical marketplace where children's black marker masterpieces 
            become real T-shirts. Upload, create, and wear imagination.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-7 lg:mb-8 px-4">
            <RYButton 
              variant="primary" onClick={() => { window.location.href = '/store'; }}
              size="lg"
              className="w-full sm:w-auto min-w-[240px] px-12 py-6 text-xl"
            >
              Shop Designs
            </RYButton>
            <RYButton 
              variant="outline" 
              size="lg" 
              onClick={handleBecomeCreator}
              className="bg-ry-black text-ry-yellow hover:bg-gray-800 w-full sm:w-auto min-w-[240px] px-12 py-6 text-xl"
            >
              Become a Creator
            </RYButton>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
