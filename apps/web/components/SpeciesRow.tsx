'use client';

import type { PollenReading } from '@repo/shared-types';
import { levelColor } from './LevelBadge';

const SPECIES_LABEL: Record<string, string> = {
  tree:  '나무',
  grass: '잔디',
  weed:  '잡초',
  pine:  '소나무',
  oak:   '참나무',
};

export function SpeciesRow({ reading }: { reading: PollenReading }) {
  const dot = levelColor(reading.level);
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
        <span className="text-sm text-gray-700">{SPECIES_LABEL[reading.species] ?? reading.species}</span>
      </div>
      <div className="flex items-center gap-3">
        {/* 3-segment bar */}
        <div className="flex gap-0.5">
          {(['low', 'moderate', 'high', 'very-high'] as const).map((lvl, i) => {
            const levels = ['low', 'moderate', 'high', 'very-high'];
            const currentIdx = levels.indexOf(reading.level);
            const filled = i <= currentIdx;
            const colors = ['bg-green-400', 'bg-yellow-400', 'bg-orange-400', 'bg-red-500'];
            return (
              <div
                key={lvl}
                className={`h-2 w-6 rounded-sm ${filled ? colors[i] : 'bg-gray-200'}`}
              />
            );
          })}
        </div>
        <span className="text-xs font-medium text-gray-500 w-14 text-right">
          {reading.displayValue}
        </span>
      </div>
    </div>
  );
}
