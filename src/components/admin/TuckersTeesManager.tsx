
import React from 'react';
import { Star, Heart } from 'lucide-react';
import { useTuckersTeesManager } from '@/hooks/useTuckersTeesManager';
import TuckersCurrentDesigns from './TuckersCurrentDesigns';
import TuckersAvailableDesigns from './TuckersAvailableDesigns';

const TuckersTeesManager = () => {
  const {
    designs,
    tuckersDesigns,
    loading,
    assigning,
    assignToTuckers,
    removeFromTuckers
  } = useTuckersTeesManager();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading Tucker's Tees manager...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Star className="w-6 h-6 text-ry-yellow fill-current" />
        <h2 className="text-2xl font-semibold text-ry-black">Tucker's Tees Collection Manager</h2>
        <Heart className="w-5 h-5 text-red-500 fill-current" />
      </div>

      {/* Tucker's Current Designs */}
      <TuckersCurrentDesigns
        designs={tuckersDesigns}
        assigning={assigning}
        onRemoveDesign={removeFromTuckers}
      />

      {/* Available Designs to Add */}
      <TuckersAvailableDesigns
        designs={designs}
        assigning={assigning}
        onAddDesign={assignToTuckers}
      />
    </div>
  );
};

export default TuckersTeesManager;
