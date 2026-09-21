
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { Star } from 'lucide-react';
import TuckersDesignCard from './TuckersDesignCard';

interface Design {
  id: string;
  title: string;
  file_url: string;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}

interface TuckersCurrentDesignsProps {
  designs: Design[];
  assigning: string | null;
  onRemoveDesign: (designId: string) => void;
}

const TuckersCurrentDesigns = ({ designs, assigning, onRemoveDesign }: TuckersCurrentDesignsProps) => {
  return (
    <RYCard className="p-6">
      <h3 className="text-xl font-semibold text-ry-black mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-ry-yellow fill-current" />
        Current Tucker's Tees Designs ({designs.length})
      </h3>
      
      {designs.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No designs in Tucker's Tees collection yet
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {designs.map((design) => (
            <TuckersDesignCard
              key={design.id}
              design={design}
              isAssigning={assigning === design.id}
              onAction={onRemoveDesign}
              actionText="Remove from Collection"
              actionLoadingText="Removing..."
              variant="secondary"
              className="bg-ry-yellow/5"
            />
          ))}
        </div>
      )}
    </RYCard>
  );
};

export default TuckersCurrentDesigns;
