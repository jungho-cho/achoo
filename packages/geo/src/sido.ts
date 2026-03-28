/**
 * Map lat/lng to Korean sido (시도) name.
 * Simple bounding-box lookup for the 17 Korean provinces/metro cities.
 * Falls back to null if no match (outside Korea).
 */

export const VALID_SIDO = [
  '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
  '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
] as const;

export type Sido = (typeof VALID_SIDO)[number];

interface SidoBounds {
  sido: Sido;
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
}

// Approximate bounding boxes (ordered so metro cities match before provinces)
const BOUNDS: SidoBounds[] = [
  { sido: '서울', latMin: 37.42, latMax: 37.70, lngMin: 126.76, lngMax: 127.18 },
  { sido: '부산', latMin: 35.05, latMax: 35.39, lngMin: 128.85, lngMax: 129.25 },
  { sido: '대구', latMin: 35.77, latMax: 36.05, lngMin: 128.42, lngMax: 128.77 },
  { sido: '인천', latMin: 37.35, latMax: 37.60, lngMin: 126.37, lngMax: 126.76 },
  { sido: '광주', latMin: 35.06, latMax: 35.24, lngMin: 126.75, lngMax: 127.00 },
  { sido: '대전', latMin: 36.25, latMax: 36.48, lngMin: 127.28, lngMax: 127.50 },
  { sido: '울산', latMin: 35.45, latMax: 35.70, lngMin: 129.05, lngMax: 129.45 },
  { sido: '세종', latMin: 36.45, latMax: 36.65, lngMin: 126.85, lngMax: 127.10 },
  { sido: '제주', latMin: 33.10, latMax: 33.60, lngMin: 126.10, lngMax: 126.98 },
  { sido: '경기', latMin: 36.90, latMax: 38.30, lngMin: 126.37, lngMax: 127.80 },
  { sido: '강원', latMin: 37.00, latMax: 38.60, lngMin: 127.70, lngMax: 129.40 },
  { sido: '충북', latMin: 36.40, latMax: 37.20, lngMin: 127.30, lngMax: 128.20 },
  { sido: '충남', latMin: 36.00, latMax: 36.90, lngMin: 125.90, lngMax: 127.30 },
  { sido: '전북', latMin: 35.40, latMax: 36.10, lngMin: 126.30, lngMax: 127.50 },
  { sido: '전남', latMin: 34.10, latMax: 35.40, lngMin: 125.90, lngMax: 127.30 },
  { sido: '경북', latMin: 35.60, latMax: 37.10, lngMin: 128.30, lngMax: 129.60 },
  { sido: '경남', latMin: 34.60, latMax: 35.90, lngMin: 127.50, lngMax: 129.05 },
];

export function latLngToSido(lat: number, lng: number): Sido | null {
  for (const b of BOUNDS) {
    if (lat >= b.latMin && lat <= b.latMax && lng >= b.lngMin && lng <= b.lngMax) {
      return b.sido;
    }
  }
  return null; // outside Korea
}

export function isInKorea(lat: number, lng: number): boolean {
  return lat >= 33.0 && lat <= 38.7 && lng >= 124.5 && lng <= 131.0;
}

export function isValidSido(value: string): value is Sido {
  return (VALID_SIDO as readonly string[]).includes(value);
}
