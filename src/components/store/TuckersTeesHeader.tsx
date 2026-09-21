
import React from 'react';
import { Star } from 'lucide-react';

const TuckersTeesHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Star className="w-6 h-6 text-ry-yellow fill-current" />
        <h2 className="text-3xl font-bold text-ry-black">Tucker's Tees</h2>
        <Star className="w-6 h-6 text-ry-yellow fill-current" />
      </div>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Special collection from our co-founder Tucker - the original inspiration behind Rendered Youth
      </p>
    </div>
  );
};

export default TuckersTeesHeader;
