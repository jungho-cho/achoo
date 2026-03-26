'use client';

import type { DustResponse, PollenResponse } from '@repo/shared-types';
import { selectHero } from '@repo/normalizer';

const BG: Record<string, string> = {
  low:        'from-green-400 to-green-600',
  moderate:   'from-yellow-400 to-yellow-500',
  high:       'from-orange-400 to-orange-600',
  'very-high':'from-red-500 to-red-700',
  good:       'from-green-400 to-green-600',
  bad:        'from-orange-400 to-orange-600',
  'very-bad': 'from-red-500 to-red-700',
};

const ADVICE: Record<string, string> = {
  low:        '야외 활동하기 좋은 날이에요 🌿',
  moderate:   '민감한 분은 마스크를 챙기세요 😷',
  high:       '외출 시 KF94 마스크 착용 권장 ⚠️',
  'very-high':'가능하면 외출을 삼가세요 🚫',
  good:       '공기 맑은 날이에요 🌿',
  bad:        '미세먼지 마스크를 착용하세요 😷',
  'very-bad': '외출 자제, 환기 금지 🚫',
};

interface Props {
  pollen: PollenResponse;
  dust: DustResponse | null;
}

export function HeroCard({ pollen, dust }: Props) {
  const hero = dust
    ? selectHero(pollen.current.readings, dust.current)
    : {
        metric: 'pollen' as const,
        level: pollen.current.overallLevel,
        displayValue: pollen.current.readings[0]?.displayValue ?? '',
        numericValue: 0,
      };

  const bg = BG[hero.level] ?? BG.low;
  const advice = ADVICE[hero.level] ?? '';
  const metricLabel = hero.metric === 'pollen' ? '꽃가루' : '미세먼지';

  return (
    <div className={`rounded-3xl bg-gradient-to-br ${bg} p-8 text-white shadow-lg`}>
      <p className="text-sm font-medium opacity-80">{metricLabel} 지수</p>
      <p className="mt-1 text-7xl font-bold tracking-tight">{hero.displayValue}</p>
      <p className="mt-4 text-sm opacity-90">{advice}</p>
    </div>
  );
}
