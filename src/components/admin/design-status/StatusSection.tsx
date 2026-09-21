
import React from 'react';
import DesignCard from './DesignCard';
import type { Design, StatusInfo } from './types';

interface StatusSectionProps {
  status: string;
  designs: Design[];
  statusInfo: StatusInfo;
  onDesignClick: (design: Design) => void;
  onPublishClick: (design: Design) => void;
}

const StatusSection: React.FC<StatusSectionProps> = ({
  status,
  designs,
  statusInfo,
  onDesignClick,
  onPublishClick
}) => {
  return (
    <div id={`status-${status}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${statusInfo.color}`}>
          {statusInfo.icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-ry-black">
            {statusInfo.label} ({designs.length})
          </h3>
          <p className="text-sm text-gray-600">{statusInfo.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {designs.map((design) => (
          <DesignCard
            key={design.id}
            design={design}
            statusInfo={statusInfo}
            onDesignClick={onDesignClick}
            onPublishClick={onPublishClick}
          />
        ))}
      </div>
    </div>
  );
};

export default StatusSection;
