import React from 'react';
import { RYCard } from '@/components/ui/ry-card';

import { Sparkles } from 'lucide-react';

export interface DesignVision {
  subject: string;
  description: string;
  colors: string;
  mood: string;
}

export const EMPTY_VISION: DesignVision = {
  subject: '',
  description: '',
  colors: '',
  mood: '',
};

const MOODS = [
  'Funny', 'Epic', 'Cute', 'Spooky', 'Chill',
  'Wild', 'Mysterious', 'Happy', 'Cool',
];

const LIMITS: Record<keyof DesignVision, number> = {
  subject: 120,
  description: 500,
  colors: 120,
  mood: 60,
};

interface DesignVisionFieldsProps {
  vision: DesignVision;
  setVision: (vision: DesignVision) => void;
  disabled?: boolean;
}

/**
 * The questions a young creator answers about their drawing. Their answers are
 * sent to the AI so the generated shirt designs match what they actually
 * imagined - not just what the lines look like.
 */
const DesignVisionFields = ({ vision, setVision, disabled }: DesignVisionFieldsProps) => {
  const update = (field: keyof DesignVision) => (value: string) => {
    if (value.length <= LIMITS[field]) {
      setVision({ ...vision, [field]: value });
    }
  };

  const inputClass =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent';

  return (
    <RYCard className="p-6">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-5 w-5 text-ry-yellow" />
        <h2 className="text-lg font-semibold text-ry-black">Tell Us About Your Art</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Your answers help us turn your drawing into shirt designs that match what you
        pictured in your head.
      </p>

      <div className="space-y-6">
        {/* Subject */}
        <div>
          <label htmlFor="art-subject" className="block font-semibold text-ry-black mb-2">
            What did you draw? *
          </label>
          <input
            id="art-subject"
            type="text"
            value={vision.subject}
            onChange={(e) => update('subject')(e.target.value)}
            placeholder="A dragon riding a skateboard"
            className={inputClass}
            disabled={disabled}
            maxLength={LIMITS.subject}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="art-description" className="block font-semibold text-ry-black mb-2">
            Tell us more about it{' '}
            <span className="text-sm font-normal text-gray-500">
              ({vision.description.length}/{LIMITS.description})
            </span>
          </label>
          <textarea
            id="art-description"
            value={vision.description}
            onChange={(e) => update('description')(e.target.value)}
            placeholder="He's got sunglasses and there's fire coming out behind the skateboard. His name is Blaze and he's the fastest dragon in the world."
            rows={4}
            className={`${inputClass} resize-none`}
            disabled={disabled}
            maxLength={LIMITS.description}
          />
          <p className="mt-2 text-sm text-gray-500">
            The more details you give, the better your designs will look.
          </p>
        </div>

        {/* Colors */}
        <div>
          <label htmlFor="art-colors" className="block font-semibold text-ry-black mb-2">
            What colors should it be?
          </label>
          <input
            id="art-colors"
            type="text"
            value={vision.colors}
            onChange={(e) => update('colors')(e.target.value)}
            placeholder="Green dragon, orange fire, purple board"
            className={inputClass}
            disabled={disabled}
            maxLength={LIMITS.colors}
          />
        </div>

        {/* Mood */}
        <div>
          <span className="block font-semibold text-ry-black mb-2">
            What's the vibe?
          </span>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((mood) => {
              const selected = vision.mood === mood;
              return (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setVision({ ...vision, mood: selected ? '' : mood })}
                  disabled={disabled}
                  aria-pressed={selected}
                  className={`px-4 py-2 rounded-full border-2 font-medium transition-colors disabled:opacity-50 ${
                    selected
                      ? 'bg-ry-yellow border-ry-black text-ry-black'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-ry-black'
                  }`}
                >
                  {mood}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </RYCard>
  );
};

export default DesignVisionFields;
