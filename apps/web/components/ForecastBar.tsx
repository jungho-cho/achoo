'use client';

import type { PollenForecastDay } from '@repo/shared-types';
import { useTranslations } from 'next-intl';

const DOT: Record<string, string> = {
  low:         'bg-green-500',
  moderate:    'bg-yellow-400',
  high:        'bg-orange-500',
  'very-high': 'bg-red-500',
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
    const d = new Date(dateStr);
    return t(`days.${DAY_KEYS[d.getDay()]}` as 'days.mon') + '요';
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{t('pollen.forecast')}</p>
      <div className="grid grid-cols-7 gap-1" role="list">
        {days.map((day, i) => {
          const levelLabel = t(`pollenLevel.${day.overallLevel}` as 'pollenLevel.low');
          return (
          <div key={day.date} className="flex flex-col items-center gap-1.5" role="listitem" aria-label={`${dayLabel(day.date, i)}: ${t('pollen.title')} ${levelLabel}`}>
            <span className="text-xs text-gray-500">{dayLabel(day.date, i)}</span>
            <span className={`w-3 h-3 rounded-full ${DOT[day.overallLevel] ?? 'bg-gray-300'}`} aria-hidden="true" />
            <span className="text-[10px] text-gray-500 text-center leading-tight">
              {levelLabel}
            </span>
          </div>
          );
        })}
      </div>
    </div>
  );
}
