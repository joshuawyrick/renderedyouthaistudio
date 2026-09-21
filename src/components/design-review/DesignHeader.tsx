
import React from 'react';

interface DesignHeaderProps {
  designTitle: string;
}

const DesignHeader = ({ designTitle }: DesignHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-ry-black mb-6">
        Pick Your Favorite!
      </h1>
      <p className="text-xl text-gray-600 mb-4">
        We made 4 awesome designs for "{designTitle}"
      </p>
      <p className="text-lg text-ry-yellow font-semibold">
        Click on your favorite one below ⬇️
      </p>
    </div>
  );
};

export default DesignHeader;
