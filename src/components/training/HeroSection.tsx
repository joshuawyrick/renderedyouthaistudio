
import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-ry-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-block bg-ry-yellow text-ry-black px-4 py-2 rounded-full text-sm font-medium mb-6">
          Coming Soon
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-ry-black mb-8">
          Young Entrepreneurs Area
          <span className="block text-ry-yellow mt-2">Future Founders</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
          A comprehensive online learning platform designed to teach young creators the complete journey of entrepreneurship. 
          Complete courses, hit milestones, and increase your profit-sharing rate as you master each level.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
