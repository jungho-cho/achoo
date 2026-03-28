import { describe, expect, it } from 'vitest';
import { isInKorea, isValidSido, latLngToSido } from '../sido';

describe('latLngToSido', () => {
  it('returns 서울 for Seoul coordinates', () => {
    expect(latLngToSido(37.5665, 126.978)).toBe('서울');
  });

  it('returns 부산 for Busan coordinates', () => {
    expect(latLngToSido(35.1796, 129.0756)).toBe('부산');
  });

  it('returns 제주 for Jeju coordinates', () => {
    expect(latLngToSido(33.4996, 126.5312)).toBe('제주');
  });

  it('returns null for coordinates outside Korea', () => {
    expect(latLngToSido(35.6762, 139.6503)).toBeNull(); // Tokyo
  });

  it('returns null for coordinates in the ocean', () => {
    expect(latLngToSido(0, 0)).toBeNull();
  });

  it('returns a metro city before a province for overlapping bounds', () => {
    // Seoul center should match 서울, not 경기
    expect(latLngToSido(37.55, 126.98)).toBe('서울');
  });
});

describe('isInKorea', () => {
  it('returns true for Korean coordinates', () => {
    expect(isInKorea(37.5665, 126.978)).toBe(true);
  });

  it('returns false for Tokyo', () => {
    expect(isInKorea(35.6762, 139.6503)).toBe(false);
  });

  it('returns false for Berlin', () => {
    expect(isInKorea(52.52, 13.405)).toBe(false);
  });
});

describe('isValidSido', () => {
  it('returns true for valid sido names', () => {
    expect(isValidSido('서울')).toBe(true);
    expect(isValidSido('부산')).toBe(true);
    expect(isValidSido('제주')).toBe(true);
  });

  it('returns false for invalid strings', () => {
    expect(isValidSido('도쿄')).toBe(false);
    expect(isValidSido('')).toBe(false);
    expect(isValidSido('Seoul')).toBe(false);
  });
});
