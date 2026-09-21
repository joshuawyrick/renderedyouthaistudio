
import React from 'react';
import { cn } from "@/lib/utils";

interface RYCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const RYCard = React.forwardRef<HTMLDivElement, RYCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-ry-white rounded-lg shadow-md border border-gray-100 p-6 transition-all duration-200 hover:shadow-xl",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

RYCard.displayName = "RYCard";

export { RYCard };
