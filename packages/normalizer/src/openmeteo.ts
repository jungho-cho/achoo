import type { PollenLevel, PollenReading, PollenSpecies } from '@repo/shared-types';

// Open-Meteo returns pollen concentration in grains/m³ (CAMS model)
// Thresholds based on ECAC (European Aeroallergen Network) standards

const LEVEL_DISPLAY_KO: Record<PollenLevel, string> = {
  low: '낮음',
  moderate: '보통',
  high: '높음',
  'very-high': '매우높음',
};

const LEVEL_RANGE: Record<PollenLevel, string> = {
  low: '0~30',
  moderate: '31~60',
  high: '61~80',
  'very-high': '81+',
};

// Per-species grains/m³ thresholds
const THRESHOLDS: Record<PollenSpecies, [number, number, number]> = {
  // [moderate, high, very-high]
  tree: [10, 50, 100],
  grass: [5, 25, 50],
  weed: [5, 15, 30],
};

export function grainsTolevel(grainsPerM3: number, species: PollenSpecies): PollenLevel {
  const [moderate, high, veryHigh] = THRESHOLDS[species];
  if (grainsPerM3 >= veryHigh) return 'very-high';
  if (grainsPerM3 >= high) return 'high';
  if (grainsPerM3 >= moderate) return 'moderate';
  return 'low';
}

// Normalize to 0-100 range for internal use
export function grainsToNumeric(grainsPerM3: number, species: PollenSpecies): number {
  const [, , veryHigh] = THRESHOLDS[species];
  return Math.min(Math.round((grainsPerM3 / veryHigh) * 100), 100);
}

export function normalizeOpenMeteoReading(
  grainsPerM3: number,
  species: PollenSpecies,
): PollenReading {
  const level = grainsTolevel(grainsPerM3, species);
  return {
    species,
    level,
    numericValue: grainsToNumeric(grainsPerM3, species),
    displayValue: LEVEL_DISPLAY_KO[level],
    range: LEVEL_RANGE[level],
  };
}
