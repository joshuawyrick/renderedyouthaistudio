
import React from 'react';

const BenefitsSection = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-ry-black mb-6">
              Why This Program Matters
            </h2>
            <div className="space-y-4 text-lg text-gray-600">
              <p>
                Our Young Entrepreneurs Area: Future Founders goes beyond just creating art. We're building 
                the next generation of business leaders, innovators, and creative entrepreneurs through a 
                comprehensive 6-level curriculum.
              </p>
              <p>
                As young creators progress through each level—from Idea Explorer to Operations & Scaling—they'll 
                earn higher profit-sharing rates on their designs, rewarding learning with increased earning potential.
              </p>
              <p>
                This program embodies our mission: to inspire children to become entrepreneurs, 
                teach them real business skills along the way, and allow them to earn money from an early age 
                while building a foundation for lifelong success.
              </p>
            </div>
          </div>
          <div className="bg-ry-white rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-ry-black mb-4">
              Coming Soon
            </h3>
            <p className="text-gray-600 mb-6">
              We're currently developing this comprehensive curriculum. Sign up to be notified 
              when enrollment opens!
            </p>
            <div className="space-y-3">
              <a href="/age-verification" className="block bg-ry-yellow text-ry-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors">
                Join the Waitlist
              </a>
              <a href="/how-it-works" className="block border-2 border-ry-yellow text-ry-yellow px-6 py-3 rounded-lg font-medium hover:bg-ry-yellow hover:text-ry-black transition-colors">
                Learn How It Works
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
