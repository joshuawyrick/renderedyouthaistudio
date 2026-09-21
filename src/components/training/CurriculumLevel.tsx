
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface Module {
  title: string;
  subModules: string[];
}

interface CurriculumLevelProps {
  id: string;
  level: string;
  icon: React.ReactNode;
  profitShare: string;
  description: string;
  modules: Module[];
  isOpen: boolean;
  onToggle: () => void;
}

const CurriculumLevel: React.FC<CurriculumLevelProps> = ({
  id,
  level,
  icon,
  profitShare,
  description,
  modules,
  isOpen,
  onToggle
}) => {
  return (
    <RYCard className="overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger className="w-full p-6 text-left hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {icon}
              <div>
                <h3 className="text-xl font-bold text-ry-black mb-2">
                  {level}
                </h3>
                <p className="text-gray-600 mb-2">
                  {description}
                </p>
                <div className="inline-block bg-ry-yellow text-ry-black px-3 py-1 rounded-full text-sm font-medium">
                  Profit Share: {profitShare}
                </div>
              </div>
            </div>
            <ChevronDown 
              className={`h-6 w-6 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
            />
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-6 pb-6 border-t border-gray-200">
            <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-ry-black mb-4 text-lg">
                    {module.title}
                  </h4>
                  <div className="space-y-2">
                    {module.subModules.map((subModule, subIndex) => (
                      <RYButton
                        key={subIndex}
                        variant="outline"
                        size="sm"
                        className="w-full text-left justify-start h-auto py-3 px-4 text-sm font-normal border-gray-300 hover:border-ry-yellow hover:bg-ry-yellow/5"
                        onClick={() => {
                          // Future functionality for opening lesson
                        }}
                      >
                        <span className="w-2 h-2 bg-ry-yellow rounded-full mr-3 flex-shrink-0"></span>
                        {subModule}
                      </RYButton>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </RYCard>
  );
};

export default CurriculumLevel;
