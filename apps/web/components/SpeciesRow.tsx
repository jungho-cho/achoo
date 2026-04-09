'use client';

import type { PollenReading } from '@repo/shared-types';
import { useTranslations } from 'next-intl';
import { levelColor } from './LevelBadge';

const LEVEL_TEXT: Record<string, string> = {
  low: 'text-[#5C7252]',
  moderate: 'text-[#9A7B20]',
  high: 'text-[#9A3B1A]',
  'very-high': 'text-[#3A2535]',
};

export function SpeciesRow({ reading }: { reading: PollenReading }) {
  const t = useTranslations('ui');
  const dot = levelColor(reading.level);
  return (
    <div className="flex items-center justify-between border-b border-[var(--ach-line)] py-3 last:border-0" aria-label={`${t(`species.${reading.species}` as 'species.tree')}: ${t(`pollenLevel.${reading.level}` as 'pollenLevel.low')}`}>
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
        <span className="text-sm font-medium text-[var(--ach-text-primary)]">{t(`species.${reading.species}` as 'species.tree')}</span>
      </div>
      <div className="flex items-center gap-3">
        {/* 3-segment bar */}
        <div className="flex gap-0.5">
          {(['low', 'moderate', 'high', 'very-high'] as const).map((lvl, i) => {
            const levels = ['low', 'moderate', 'high', 'very-high'];
            const currentIdx = levels.indexOf(reading.level);
            const filled = i <= currentIdx;
            const colors = ['bg-[var(--ach-data-low)]', 'bg-[var(--ach-data-moderate)]', 'bg-[var(--ach-data-high)]', 'bg-[var(--ach-data-extreme)]'];
            return (
              <div
                key={lvl}
                className={`h-2 w-6 rounded-sm ${filled ? colors[i] : 'bg-[var(--ach-line-light)]'}`}
              />
            );
          })}
        </div>
        <span className={`w-14 text-right text-xs font-semibold ${LEVEL_TEXT[reading.level] ?? 'text-[var(--ach-text-secondary)]'}`}>
          {t(`pollenLevel.${reading.level}` as 'pollenLevel.low')}
        </span>
      </div>
    </div>
  );
}
