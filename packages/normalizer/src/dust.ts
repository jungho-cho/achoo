import type { DustLevel, DustReading } from '@repo/shared-types';

const LEVEL_DISPLAY_KO: Record<DustLevel, string> = {
  good: '좋음',
  moderate: '보통',
  bad: '나쁨',
  'very-bad': '매우나쁨',
};

// WHO / 에어코리아 기준 (PM2.5 μg/m³)
export function pm25ToLevel(pm25: number): DustLevel {
  if (pm25 <= 15) return 'good';
  if (pm25 <= 35) return 'moderate';
  if (pm25 <= 75) return 'bad';
  return 'very-bad';
}

// PM10 μg/m³
export function pm10ToLevel(pm10: number): DustLevel {
  if (pm10 <= 30) return 'good';
  if (pm10 <= 80) return 'moderate';
  if (pm10 <= 150) return 'bad';
  return 'very-bad';
}

export function normalizeDustReading(pm10: number, pm25: number): DustReading {
  const level25 = pm25ToLevel(pm25);
  const level10 = pm10ToLevel(pm10);
  // Use whichever is worse
  const levelOrder: DustLevel[] = ['very-bad', 'bad', 'moderate', 'good'];
  const level = levelOrder.find((l) => l === level25 || l === level10) ?? 'good';
  return {
    pm10,
    pm25,
    level,
    displayValue: LEVEL_DISPLAY_KO[level],
  };
}
