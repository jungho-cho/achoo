'use client';

import type { PollenForecastDay } from '@repo/shared-types';
import { useTranslations } from 'next-intl';
import { getUtcWeekday } from '../lib/ssr-date';

const DOT: Record<string, string> = {
  low:         'bg-green-500',
  moderate:    'bg-yellow-400',
  high:        'bg-orange-500',
  'very-high': 'bg-red-500',
};

const LEVEL_TEXT: Record<string, string> = {
  low: 'text-green-700',
  moderate: 'text-amber-700',
  high: 'text-orange-700',
  'very-high': 'text-red-700',
};

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

interface Props {
  current: PollenForecastDay;
  forecast: PollenForecastDay[];
}

export function ForecastBar({ current, forecast }: Props) {
  const t = useTranslations('ui');
  const days = [current, ...forecast.slice(0, 6)];

  function dayLabel(dateStr: string, index: number): string {
    if (index === 0) return t('days.today');
    if (index === 1) return t('days.tomorrow');
    return t(`days.${DAY_KEYS[getUtcWeekday(dateStr)]}` as 'days.mon') + '요';
  }

  return (
    <div className="ach-panel px-4 py-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">{t('pollen.forecast')}</p>
      <div className="grid grid-cols-7 gap-1" role="list">
        {days.map((day, i) => {
          const levelLabel = t(`pollenLevel.${day.overallLevel}` as 'pollenLevel.low');
          return (
          <div key={day.date} className="flex flex-col items-center gap-1.5 rounded-2xl bg-gray-50 px-1 py-2" role="listitem" aria-label={`${dayLabel(day.date, i)}: ${t('pollen.title')} ${levelLabel}`}>
            <span className="text-xs font-medium text-gray-700">{dayLabel(day.date, i)}</span>
            <span className={`w-3 h-3 rounded-full ${DOT[day.overallLevel] ?? 'bg-gray-300'}`} aria-hidden="true" />
            <span className={`text-[10px] text-center leading-tight font-semibold ${LEVEL_TEXT[day.overallLevel] ?? 'text-gray-700'}`}>
              {levelLabel}
            </span>
          </div>
          );
        })}
      </div>
    </div>
  );
}
