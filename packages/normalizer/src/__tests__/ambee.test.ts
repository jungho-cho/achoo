import { describe, expect, it } from 'vitest';
import { ambeeScoreToLevel, normalizeAmbeeReading, snapToNearestCity } from '../ambee.js';

describe('ambeeScoreToLevel', () => {
  it('maps 0-10 Ambee scale correctly', () => {
    expect(ambeeScoreToLevel(0)).toBe('low');
    expect(ambeeScoreToLevel(3)).toBe('low');    // 30 → low
    expect(ambeeScoreToLevel(3.1)).toBe('moderate'); // 31 → moderate
    expect(ambeeScoreToLevel(6)).toBe('moderate');
    expect(ambeeScoreToLevel(6.1)).toBe('high'); // 61 → high
    expect(ambeeScoreToLevel(8)).toBe('high');
    expect(ambeeScoreToLevel(8.1)).toBe('very-high'); // 81 → very-high
    expect(ambeeScoreToLevel(10)).toBe('very-high');
  });

  it('caps at 100 for scores > 10', () => {
    expect(ambeeScoreToLevel(15)).toBe('very-high');
  });
});

describe('normalizeAmbeeReading', () => {
  it('returns Korean displayValue', () => {
    const r = normalizeAmbeeReading(7, 'tree');
    expect(r.displayValue).toBe('높음');
    expect(r.species).toBe('tree');
    expect(r.numericValue).toBe(70);
  });
});

describe('snapToNearestCity', () => {
  it('snaps Seoul coordinates to 서울', () => {
    const city = snapToNearestCity(37.5665, 126.978);
    expect(city.name).toBe('서울');
  });

  it('snaps Tokyo coordinates to 도쿄', () => {
    const city = snapToNearestCity(35.6762, 139.6503);
    expect(city.name).toBe('도쿄');
  });

  it('snaps nearby coordinates to the closest city', () => {
    // Incheon (near Seoul)
    const city = snapToNearestCity(37.4563, 126.7052);
    expect(city.name).toBe('서울');
  });
});
