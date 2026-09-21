
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';

interface Mockup {
  id: string;
  mockup_url: string;
  mockup_order: number;
  style_label?: string | null;
}

interface MockupGridProps {
  mockups: Mockup[];
  selectedMockup: string | null;
  onSelectMockup: (mockupId: string) => void;
}

const MockupGrid = ({ mockups, selectedMockup, onSelectMockup }: MockupGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      {mockups.map((mockup) => (
        <RYCard
          key={mockup.id}
          className={`p-6 cursor-pointer transition-all duration-200 hover:scale-105 ${
            selectedMockup === mockup.id
              ? 'ring-4 ring-ry-yellow bg-yellow-50'
              : 'hover:shadow-lg'
          }`}
          onClick={() => onSelectMockup(mockup.id)}
        >
          <div className="relative">
            <img
              src={mockup.mockup_url}
              alt={`Design option ${mockup.mockup_order}`}
              className="w-full h-96 object-contain rounded-lg bg-white"
              onError={(e) => {
                console.error('Failed to load mockup image:', mockup.mockup_url);
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            {selectedMockup === mockup.id && (
              <div className="absolute top-4 right-4 bg-ry-yellow text-ry-black px-3 py-1 rounded-full font-bold">
                ✓ PICKED!
              </div>
            )}
          </div>
          <div className="text-center mt-4">
            <h3 className="text-lg font-semibold text-ry-black">
              {mockup.style_label || `Option ${mockup.mockup_order}`}
            </h3>
          </div>
        </RYCard>
      ))}
    </div>
  );
};

export default MockupGrid;
