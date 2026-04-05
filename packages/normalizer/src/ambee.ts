import type { PollenLevel, PollenReading, PollenSpecies } from '@repo/shared-types';

// Ambee returns 0-10 scale; multiply × 10 → 0–100, then bucket
// Cap at 100 (Ambee occasionally returns values > 10)

const LEVEL_RANGE: Record<PollenLevel, string> = {
  low: '0~30',
  moderate: '31~60',
  high: '61~80',
  'very-high': '81+',
};

export function ambeeScoreToLevel(score: number): PollenLevel {
  const normalized = Math.min(score * 10, 100);
  if (normalized <= 30) return 'low';
  if (normalized <= 60) return 'moderate';
  if (normalized <= 80) return 'high';
  return 'very-high';
}

export function ambeeScoreToNumeric(score: number): number {
  return Math.min(score * 10, 100);
}

export function normalizeAmbeeReading(score: number, species: PollenSpecies): PollenReading {
  const level = ambeeScoreToLevel(score);
  return {
    species,
    level,
    numericValue: ambeeScoreToNumeric(score),
    range: LEVEL_RANGE[level],
  };
}

// ─── 12-city grid for Ambee free tier (≤ 96 req/day) ─────────────────────────
// Snaps arbitrary lat/lng to nearest grid city to reuse cached results

interface GridCity {
  name: string;
  lat: number;
  lng: number;
}

export const AMBEE_GRID: GridCity[] = [
  // Korea
  { name: '서울', lat: 37.5665, lng: 126.978 },
  { name: '부산', lat: 35.1796, lng: 129.0756 },
  // Japan
  { name: '도쿄', lat: 35.6762, lng: 139.6503 },
  { name: '오사카', lat: 34.6937, lng: 135.5023 },
  { name: '삿포로', lat: 43.0618, lng: 141.3545 },
  { name: '후쿠오카', lat: 33.5904, lng: 130.4017 },
  // China
  { name: '베이징', lat: 39.9042, lng: 116.4074 },
  { name: '상하이', lat: 31.2304, lng: 121.4737 },
  // Southeast Asia
  { name: '방콕', lat: 13.7563, lng: 100.5018 },
  { name: '싱가포르', lat: 1.3521, lng: 103.8198 },
  // South Asia
  { name: '뭄바이', lat: 19.076, lng: 72.8777 },
  // Middle East
  { name: '두바이', lat: 25.2048, lng: 55.2708 },
];

export function snapToNearestCity(lat: number, lng: number): GridCity {
  let nearest = AMBEE_GRID[0]!;
  let minDist = Infinity;

  for (const city of AMBEE_GRID) {
    // Euclidean distance is sufficient for snapping (no need for haversine at this scale)
    const dist = Math.sqrt((city.lat - lat) ** 2 + (city.lng - lng) ** 2);
    if (dist < minDist) {
      minDist = dist;
      nearest = city;
    }
  }

  return nearest;
}
