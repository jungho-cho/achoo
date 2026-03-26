import type { DustLevel, DustReading, HeroData, HeroMetric, PollenLevel, PollenReading } from '@repo/shared-types';

// Seasonal hero swap rule:
// When PM2.5 index > pollen index, promote dust to hero for year-round retention

const POLLEN_NUMERIC: Record<PollenLevel, number> = {
  low: 15,
  moderate: 45,
  high: 70,
  'very-high': 90,
};

const DUST_NUMERIC: Record<DustLevel, number> = {
  good: 10,
  moderate: 40,
  bad: 65,
  'very-bad': 90,
};

export function selectHero(
  pollenReadings: PollenReading[],
  dust: DustReading,
): HeroData {
  const pollenMax = Math.max(...pollenReadings.map((r) => r.numericValue), 0);
  const dustNumeric = DUST_NUMERIC[dust.level];

  const metric: HeroMetric = dustNumeric > pollenMax ? 'dust' : 'pollen';

  if (metric === 'dust') {
    return {
      metric: 'dust',
      level: dust.level,
      displayValue: dust.displayValue,
      numericValue: dustNumeric,
    };
  }

  // Pick dominant pollen reading
  const dominant = pollenReadings.reduce((a, b) => (a.numericValue >= b.numericValue ? a : b));
  return {
    metric: 'pollen',
    level: dominant.level,
    displayValue: dominant.displayValue,
    numericValue: dominant.numericValue,
  };
}
