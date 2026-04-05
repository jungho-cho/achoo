'use client';

import type { DustResponse, PollenResponse } from '@repo/shared-types';
import { selectHero } from '@repo/normalizer';
import { useTranslations } from 'next-intl';

const BG: Record<string, string> = {
  low:        'from-green-400 to-green-600',
  moderate:   'from-yellow-400 to-yellow-500',
  high:       'from-orange-400 to-orange-600',
  'very-high':'from-red-500 to-red-700',
  good:       'from-green-400 to-green-600',
  bad:        'from-orange-400 to-orange-600',
  'very-bad': 'from-red-500 to-red-700',
};

const POLLEN_LEVELS = ['low', 'moderate', 'high', 'very-high'];

interface Props {
  pollen: PollenResponse;
  dust: DustResponse | null;
}

export function HeroCard({ pollen, dust }: Props) {
  const t = useTranslations('ui');
  const hero = dust
    ? selectHero(pollen.current.readings, dust.current)
    : {
        metric: 'pollen' as const,
        level: pollen.current.overallLevel,
        displayValue: pollen.current.readings[0]?.displayValue ?? '',
        numericValue: pollen.current.readings.reduce((max, r) => Math.max(max, r.numericValue), 0),
      };

  const bg = BG[hero.level] ?? BG.low;
  const isPollen = POLLEN_LEVELS.includes(hero.level);
  const advice = isPollen
    ? t(`hero.${hero.level}` as 'hero.low')
    : t(`outingGrade.${hero.level}.advice` as 'outingGrade.good.advice');
  const displayLabel = isPollen
    ? t(`pollenLevel.${hero.level}` as 'pollenLevel.low')
    : t(`dustLevel.${hero.level}` as 'dustLevel.good');
  const metricLabel = hero.metric === 'pollen' ? t('pollen.title').replace('오늘의 ', '') : t('dust.title');

  return (
    <div className={`rounded-3xl bg-gradient-to-br ${bg} p-8 text-white shadow-lg`} role="status" aria-live="polite" aria-label={`${metricLabel}: ${hero.numericValue}, ${displayLabel}. ${advice}`}>
      <p className="text-sm font-medium opacity-80">{metricLabel} 지수</p>
      <div className="mt-1 flex items-baseline gap-3">
        <p className="text-7xl font-bold tracking-tight">{hero.numericValue}</p>
        <p className="text-lg font-medium opacity-80">{displayLabel}</p>
      </div>
      <p className="mt-4 text-sm opacity-90">{advice}</p>
    </div>
  );
}
