
import React, { useState } from 'react';
import CurriculumLevel from './CurriculumLevel';
import { curriculumLevelsData } from './curriculumData';

const CurriculumSection = () => {
  const [openLevels, setOpenLevels] = useState<{ [key: string]: boolean }>({});

  const toggleLevel = (levelId: string) => {
    setOpenLevels(prev => ({
      ...prev,
      [levelId]: !prev[levelId]
    }));
  };

  return (
    <section className="bg-ry-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-ry-black text-center mb-12">
          Complete Entrepreneur Curriculum
        </h2>
        <div className="space-y-6">
          {curriculumLevelsData.map((level) => (
            <CurriculumLevel
              key={level.id}
              {...level}
              isOpen={openLevels[level.id]}
              onToggle={() => toggleLevel(level.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;
