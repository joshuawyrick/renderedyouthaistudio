
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';

const EmptyState = () => {
  return (
    <div className="pt-16 flex items-center justify-center min-h-screen">
      <RYCard className="p-8 text-center">
        <h1 className="text-2xl font-bold text-ry-black mb-4">
          Designs Not Ready Yet
        </h1>
        <p className="text-gray-600">
          We're still working on your mockups. You'll get an email when they're ready!
        </p>
      </RYCard>
    </div>
  );
};

export default EmptyState;
