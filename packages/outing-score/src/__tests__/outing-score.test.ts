import { describe, expect, it } from 'vitest';
import type { DustResponse, PollenResponse } from '@repo/shared-types';
import { calculateOutingScore } from '../index';

function makePollen(overallLevel: 'low' | 'moderate' | 'high' | 'very-high'): PollenResponse {
  return {
    sido: '서울',
    lat: 37.5665,
    lng: 126.978,
    source: 'open-meteo',
    current: {
      date: '2026-03-28',
      readings: [],
      overallLevel,
    },
    forecast: [],
    cachedAt: new Date().toISOString(),
  };
}

function makeDust(level: 'good' | 'moderate' | 'bad' | 'very-bad'): DustResponse {
  return {
    sido: '서울',
    lat: 37.5665,
    lng: 126.978,
    source: 'airkorea',
    current: { pm10: 30, pm25: 15, level },
    cachedAt: new Date().toISOString(),
  };
}

describe('calculateOutingScore', () => {
  it('returns 100 for low pollen + good dust', () => {
    const result = calculateOutingScore(makePollen('low'), makeDust('good'));
    expect(result.score).toBe(100);
    expect(result.grade).toBe('good');
  });

  it('returns 0 for very-high pollen + very-bad dust', () => {
    const result = calculateOutingScore(makePollen('very-high'), makeDust('very-bad'));
    expect(result.score).toBe(0);
    expect(result.grade).toBe('very-bad');
  });

  it('returns moderate for mixed levels', () => {
    const result = calculateOutingScore(makePollen('moderate'), makeDust('moderate'));
    expect(result.score).toBe(70);
    expect(result.grade).toBe('moderate');
  });

  it('defaults dust to 25 when null (outside Korea)', () => {
    const result = calculateOutingScore(makePollen('low'), null);
    expect(result.score).toBe(75);
    expect(result.grade).toBe('moderate');
  });

  it('defaults pollen to 25 when null', () => {
    const result = calculateOutingScore(null, makeDust('good'));
    expect(result.score).toBe(75);
    expect(result.grade).toBe('moderate');
  });

  it('returns 50 when both are null', () => {
    const result = calculateOutingScore(null, null);
    expect(result.score).toBe(50);
    expect(result.grade).toBe('bad');
  });

  it('does not include label or advice (i18n: set by UI layer)', () => {
    const result = calculateOutingScore(makePollen('low'), makeDust('good'));
    expect(result.label).toBeUndefined();
    expect(result.advice).toBeUndefined();
  });
});
