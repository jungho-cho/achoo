import type { PollenLevel, PollenReading, PollenSpecies } from '@repo/shared-types';

// KMA uses 4-stage categorical levels (낮음/보통/높음/매우높음)
// Internal numeric values are midpoints — NEVER display raw numbers to users
const KMA_LEVEL_MAP: Record<string, PollenLevel> = {
  낮음: 'low',
  보통: 'moderate',
  높음: 'high',
  매우높음: 'very-high',
  // English aliases from API variants
  low: 'low',
  moderate: 'moderate',
  high: 'high',
  'very-high': 'very-high',
  '1': 'low',
  '2': 'moderate',
  '3': 'high',
  '4': 'very-high',
};

const LEVEL_NUMERIC: Record<PollenLevel, number> = {
  low: 15,
  moderate: 45,
  high: 70,
  'very-high': 90,
};

const LEVEL_RANGE: Record<PollenLevel, string> = {
  low: '0~30',
  moderate: '31~60',
  high: '61~80',
  'very-high': '81+',
};

export function normalizeKmaLevel(raw: string): PollenLevel {
  const level = KMA_LEVEL_MAP[raw.trim()];
  if (!level) throw new Error(`Unknown KMA level: "${raw}"`);
  return level;
}

export function normalizeKmaReading(raw: string, species: PollenSpecies): PollenReading {
  const level = normalizeKmaLevel(raw);
  return {
    species,
    level,
    numericValue: LEVEL_NUMERIC[level],
    range: LEVEL_RANGE[level],
  };
}

export function dominantLevel(readings: PollenReading[]): PollenLevel {
  const order: PollenLevel[] = ['very-high', 'high', 'moderate', 'low'];
  for (const lvl of order) {
    if (readings.some((r) => r.level === lvl)) return lvl;
  }
  return 'low';
}
