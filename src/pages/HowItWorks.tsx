
import React from 'react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYCard } from '@/components/ui/ry-card';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      image: "/lovable-uploads/436f6fdb-bb40-4a63-a912-d0affa7aba5f.webp",
      title: "Draw & Upload",
      description: "Kids grab their favorite black sharpie and a plain white piece of paper, create amazing artwork, then upload it to our platform.",
      details: "A parent or guardian creates the account, gives permission, and helps their artist submit a clear drawing and its story."
    },
    {
      number: 2,
      image: "/lovable-uploads/a62f0304-e913-4aba-8f6c-816c0db736c6.webp",
      title: "We Perfect It",
      description: "Our team creates beautiful mockups and prepares your child's design for printing.",
      details: "AI creates four artwork interpretations. The family selects one, then our team reviews it and prepares a shirt preview. Additional generations require approval."
    },
    {
      number: 3,
      image: "/lovable-uploads/32425366-0bed-4dd2-9953-374508b3e36a.webp",
      title: "Live on Our Site",
      description: "We put your rendered design live on our website for people to purchase as high-quality T-shirts.",
      details: "The parent approves the final product preview before publication. Each product page shows the available Printful sizes, colors, and garment details."
    },
    {
      number: 4,
      image: "/lovable-uploads/98f40132-69fb-40d6-84ba-f3614fe24125.webp",
      title: "Kids Share in Profits",
      description: "Young creators share in the profits from each sale, encouraging their artistic journey.",
      details: "The agreed creator share is calculated after defined fulfillment and payment costs. Parents manage earnings and payout setup; the agreement is shown before a shop goes live."
    }
  ];

  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      {/* Add top padding to account for fixed navbar */}
      <div className="pt-40">
        {/* Hero Section */}
        <section className="bg-ry-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-ry-black mb-8">
              How It Works
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              From sketch to shirt in four simple steps. Join young artists 
              who are turning their creativity into wearable art and sharing in the profits.
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {steps.map((step) => (
                <RYCard key={step.number} className="relative p-8">
                  <div className="absolute -top-4 left-8">
                    <div className="bg-ry-yellow text-ry-black w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                  </div>
                  
                  <div className="mb-6 mt-4 flex justify-center">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-56 h-56 object-contain rounded-lg shadow-md bg-white p-2"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-ry-black mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-4">
                    {step.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {step.details}
                  </p>
                </RYCard>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-ry-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-ry-black mb-8">
              Ready to Start Creating?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our community of young artists and start sharing in the profits from your creativity today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/auth/sign-up" className="bg-ry-yellow text-ry-black px-8 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors">
                Become a Creator
              </a>
              <a href="/store" className="border-2 border-ry-yellow text-ry-yellow px-8 py-3 rounded-lg font-medium hover:bg-ry-yellow hover:text-ry-black transition-colors">
                Shop Designs
              </a>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default HowItWorks;
