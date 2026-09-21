
import React from 'react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/training/HeroSection';
import FeaturesSection from '@/components/training/FeaturesSection';
import CurriculumSection from '@/components/training/CurriculumSection';
import BenefitsSection from '@/components/training/BenefitsSection';

const TrainingProgram = () => {
  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      <div className="pt-40">
        <HeroSection />
        <FeaturesSection />
        <CurriculumSection />
        <BenefitsSection />
      </div>

      <Footer />
    </div>
  );
};

export default TrainingProgram;
