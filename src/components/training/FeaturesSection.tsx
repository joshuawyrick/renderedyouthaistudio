
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { GraduationCap, Trophy, Users } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <GraduationCap className="h-12 w-12 text-ry-yellow" />,
      title: "Interactive Online Courses",
      description: "Age-appropriate lessons designed specifically for young entrepreneurs, covering everything from idea generation to scaling a business."
    },
    {
      icon: <Trophy className="h-12 w-12 text-ry-yellow" />,
      title: "Milestone-Based Rewards",
      description: "Complete courses and achieve milestones to unlock higher profit-sharing rates on your creative works."
    },
    {
      icon: <Users className="h-12 w-12 text-ry-yellow" />,
      title: "Peer Community",
      description: "Connect with other young entrepreneurs, share ideas, and learn from each other's experiences."
    }
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-ry-black text-center mb-12">
          Learn, Grow, Earn More
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <RYCard key={index} className="text-center p-8">
              <div className="flex justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-ry-black mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </RYCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
