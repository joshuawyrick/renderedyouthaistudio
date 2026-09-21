
import React from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { Upload, User } from 'lucide-react';

const QuickActionsSection = () => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-ry-black mb-6">Quick Actions</h2>
      <div className="flex flex-wrap gap-4">
        <RYButton 
          variant="primary" 
          size="lg"
          onClick={() => window.location.href = '/creator/upload'}
        >
          <Upload className="h-5 w-5 mr-2" />
          Upload New Design
        </RYButton>
        <RYButton 
          variant="secondary" 
          size="lg"
          onClick={() => window.location.href = '/creator/profile'}
        >
          <User className="h-5 w-5 mr-2" />
          Edit Profile
        </RYButton>
      </div>
    </div>
  );
};

export default QuickActionsSection;
