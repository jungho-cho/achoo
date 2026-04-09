import { describe, expect, it } from 'vitest';
import { grainsToNumeric, grainsTolevel, normalizeOpenMeteoReading } from '../openmeteo.js';

describe('grainsTolevel — tree (thresholds: 10/50/100)', () => {
  it('below moderate → low', () => {
    expect(grainsTolevel(0, 'tree')).toBe('low');
    expect(grainsTolevel(9.9, 'tree')).toBe('low');
  });

  it('at moderate boundary → moderate', () => {
    expect(grainsTolevel(10, 'tree')).toBe('moderate');
    expect(grainsTolevel(49, 'tree')).toBe('moderate');
  });

  it('at high boundary → high', () => {
    expect(grainsTolevel(50, 'tree')).toBe('high');
    expect(grainsTolevel(99, 'tree')).toBe('high');
  });

  it('at very-high boundary → very-high', () => {
    expect(grainsTolevel(100, 'tree')).toBe('very-high');
    expect(grainsTolevel(999, 'tree')).toBe('very-high');
  });
});

describe('grainsTolevel — pine and oak follow tree thresholds', () => {
  it('treats pine as a tree alias', () => {
    expect(grainsTolevel(9.9, 'pine')).toBe('low');
    expect(grainsTolevel(10, 'pine')).toBe('moderate');
    expect(grainsTolevel(50, 'pine')).toBe('high');
    expect(grainsTolevel(100, 'pine')).toBe('very-high');
  });

  it('treats oak as a tree alias', () => {
    expect(grainsTolevel(9.9, 'oak')).toBe('low');
    expect(grainsTolevel(10, 'oak')).toBe('moderate');
    expect(grainsTolevel(50, 'oak')).toBe('high');
    expect(grainsTolevel(100, 'oak')).toBe('very-high');
  });
});

describe('grainsTolevel — grass (thresholds: 5/25/50)', () => {
  it('maps correctly across all levels', () => {
    expect(grainsTolevel(0, 'grass')).toBe('low');
    expect(grainsTolevel(5, 'grass')).toBe('moderate');
    expect(grainsTolevel(25, 'grass')).toBe('high');
    expect(grainsTolevel(50, 'grass')).toBe('very-high');
  });
});

describe('grainsTolevel — weed (thresholds: 5/15/30)', () => {
  it('maps correctly across all levels', () => {
    expect(grainsTolevel(0, 'weed')).toBe('low');
    expect(grainsTolevel(5, 'weed')).toBe('moderate');
    expect(grainsTolevel(15, 'weed')).toBe('high');
    expect(grainsTolevel(30, 'weed')).toBe('very-high');
  });
});

describe('grainsToNumeric', () => {
  it('caps at 100 for values above very-high threshold', () => {
    expect(grainsToNumeric(200, 'tree')).toBe(100);
  });

  it('scales linearly up to threshold', () => {
    expect(grainsToNumeric(0, 'tree')).toBe(0);
    expect(grainsToNumeric(50, 'tree')).toBe(50); // 50/100 * 100
    expect(grainsToNumeric(25, 'grass')).toBe(50); // 25/50 * 100
  });
});

describe('normalizeOpenMeteoReading', () => {
  it('returns correct level and species', () => {
    const r = normalizeOpenMeteoReading(0, 'tree');
    expect(r.species).toBe('tree');
    expect(r.level).toBe('low');
    expect(r.displayValue).toBeUndefined();
  });

  it('very-high level', () => {
    const r = normalizeOpenMeteoReading(100, 'tree');
    expect(r.level).toBe('very-high');
    expect(r.numericValue).toBe(100);
    expect(r.displayValue).toBeUndefined();
  });

  it('includes range string', () => {
    const r = normalizeOpenMeteoReading(10, 'tree'); // moderate
    expect(r.range).toBe('31~60');
  });
});
