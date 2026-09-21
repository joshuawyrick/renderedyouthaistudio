
import React from 'react';
import { cn } from "@/lib/utils";

interface AgeFilterChipsProps {
  selectedAge?: string;
  onAgeChange: (age: string | undefined) => void;
  className?: string;
}

const ageRanges = [
  { value: '4-7', label: 'Ages 4-7', emoji: '🎨' },
  { value: '8-10', label: 'Ages 8-10', emoji: '✏️' },
  { value: '11-13', label: 'Ages 11-13', emoji: '🖌️' },
  { value: '14-17', label: 'Ages 14-17', emoji: '🎭' }
];

const AgeFilterChips = ({ selectedAge, onAgeChange, className }: AgeFilterChipsProps) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {ageRanges.map((range) => (
        <button
          key={range.value}
          onClick={() => onAgeChange(selectedAge === range.value ? undefined : range.value)}
          className={cn(
            "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left",
            "border-2 flex items-center gap-2",
            selectedAge === range.value
              ? "bg-accent text-accent-foreground border-accent shadow-md"
              : "bg-card text-foreground border-border hover:border-accent hover:bg-secondary"
          )}
        >
          <span className="text-lg">{range.emoji}</span>
          <span>{range.label}</span>
        </button>
      ))}
    </div>
  );
};

export { AgeFilterChips };
