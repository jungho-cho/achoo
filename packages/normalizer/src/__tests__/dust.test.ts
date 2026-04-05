import { describe, expect, it } from 'vitest';
import { normalizeDustReading, pm10ToLevel, pm25ToLevel } from '../dust.js';

describe('pm25ToLevel (μg/m³ WHO 기준)', () => {
  it('≤15 → good', () => {
    expect(pm25ToLevel(0)).toBe('good');
    expect(pm25ToLevel(15)).toBe('good');
  });

  it('16~35 → moderate', () => {
    expect(pm25ToLevel(16)).toBe('moderate');
    expect(pm25ToLevel(35)).toBe('moderate');
  });

  it('36~75 → bad', () => {
    expect(pm25ToLevel(36)).toBe('bad');
    expect(pm25ToLevel(75)).toBe('bad');
  });

  it('>75 → very-bad', () => {
    expect(pm25ToLevel(76)).toBe('very-bad');
    expect(pm25ToLevel(200)).toBe('very-bad');
  });
});

describe('pm10ToLevel (μg/m³)', () => {
  it('≤30 → good', () => {
    expect(pm10ToLevel(0)).toBe('good');
    expect(pm10ToLevel(30)).toBe('good');
  });

  it('31~80 → moderate', () => {
    expect(pm10ToLevel(31)).toBe('moderate');
    expect(pm10ToLevel(80)).toBe('moderate');
  });

  it('81~150 → bad', () => {
    expect(pm10ToLevel(81)).toBe('bad');
    expect(pm10ToLevel(150)).toBe('bad');
  });

  it('>150 → very-bad', () => {
    expect(pm10ToLevel(151)).toBe('very-bad');
  });
});

describe('normalizeDustReading — picks worse of pm25 / pm10', () => {
  it('pm25 worse → uses pm25 level', () => {
    // pm25=76 (very-bad), pm10=30 (good)
    const r = normalizeDustReading(30, 76);
    expect(r.level).toBe('very-bad');
    expect(r.pm25).toBe(76);
    expect(r.pm10).toBe(30);
    expect(r.displayValue).toBeUndefined();
  });

  it('pm10 worse → uses pm10 level', () => {
    // pm25=10 (good), pm10=90 (bad)
    const r = normalizeDustReading(90, 10);
    expect(r.level).toBe('bad');
    expect(r.displayValue).toBeUndefined();
  });

  it('both good → good', () => {
    const r = normalizeDustReading(20, 10);
    expect(r.level).toBe('good');
    expect(r.displayValue).toBeUndefined();
  });
});
