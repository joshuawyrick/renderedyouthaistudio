
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="space-y-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg"></div>
      ))}
    </div>
  );
};

export default LoadingState;
