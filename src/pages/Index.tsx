
import React from 'react';
import TopNav from '@/components/navigation/TopNav';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedSection from '@/components/sections/FeaturedSection';
import ProcessSection from '@/components/sections/ProcessSection';
import Footer from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      {/* Add top padding to account for fixed navbar with proper mobile spacing */}
      <div className="pt-40">
        <main className="overflow-x-hidden">
          <HeroSection />
          <FeaturedSection />
          <ProcessSection />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
