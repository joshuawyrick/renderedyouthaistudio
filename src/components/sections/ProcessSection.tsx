
import React from 'react';
import { cn } from '@/lib/utils';

const ProcessSection = () => {
  const steps = [
    {
      number: 1,
      image: "/lovable-uploads/436f6fdb-bb40-4a63-a912-d0affa7aba5f.webp",
      title: "Draw & Upload",
      description: "Kids grab their favorite black sharpie and a plain white piece of paper, create amazing artwork, then upload it to our platform."
    },
    {
      number: 2,
      image: "/lovable-uploads/a62f0304-e913-4aba-8f6c-816c0db736c6.webp",
      title: "We Perfect It",
      description: "Our team creates beautiful mockups and prepares your child's design for printing."
    },
    {
      number: 3,
      image: "/lovable-uploads/32425366-0bed-4dd2-9953-374508b3e36a.webp",
      title: "Live on Our Site",
      description: "We put your rendered design live on our website for people to purchase as high-quality T-shirts."
    },
    {
      number: 4,
      image: "/lovable-uploads/98f40132-69fb-40d6-84ba-f3614fe24125.webp",
      title: "Kids Share in Profits",
      description: "Young creators share in the profits from each sale, encouraging their artistic journey."
    }
  ];

  return (
    <section className="bg-secondary py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From sketch to shirt in four simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className="relative text-center group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Step Number Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center",
                  "bg-accent text-accent-foreground border-[3px] border-foreground",
                  "text-2xl font-bold shadow-md",
                  "transition-transform duration-300 group-hover:scale-110"
                )}>
                  {step.number}
                </div>
              </div>
              
              {/* Card Content */}
              <div className={cn(
                "bg-card border border-border rounded-xl pt-12 pb-6 px-6",
                "transition-all duration-300",
                "hover:border-accent hover:shadow-lg hover:-translate-y-1"
              )}>
                {/* Step Image */}
                <div className="mb-6 flex justify-center">
                  <div className="w-48 h-48 rounded-lg overflow-hidden bg-background shadow-md">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
                
                {/* Step Title */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                
                {/* Step Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
