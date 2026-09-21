
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { cn } from "@/lib/utils";

interface StatsWidgetProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  className?: string;
}

const StatsWidget = ({ label, value, icon, className }: StatsWidgetProps) => {
  return (
    <RYCard className={cn(
      "p-6 text-center border border-ry-black",
      className
    )}>
      {icon && (
        <div className="flex justify-center mb-3 text-ry-yellow">
          {icon}
        </div>
      )}
      <div className="text-3xl font-bold text-ry-black mb-2">
        {value}
      </div>
      <div className="text-sm text-gray-600">
        {label}
      </div>
    </RYCard>
  );
};

export { StatsWidget };
