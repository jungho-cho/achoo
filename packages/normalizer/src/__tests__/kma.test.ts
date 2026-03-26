import { describe, expect, it } from 'vitest';
import { dominantLevel, normalizeKmaLevel, normalizeKmaReading } from '../kma.js';

describe('normalizeKmaLevel', () => {
  it('maps Korean labels', () => {
    expect(normalizeKmaLevel('낮음')).toBe('low');
    expect(normalizeKmaLevel('보통')).toBe('moderate');
    expect(normalizeKmaLevel('높음')).toBe('high');
    expect(normalizeKmaLevel('매우높음')).toBe('very-high');
  });

  it('maps numeric string codes', () => {
    expect(normalizeKmaLevel('1')).toBe('low');
    expect(normalizeKmaLevel('4')).toBe('very-high');
  });

  it('throws on unknown level', () => {
    expect(() => normalizeKmaLevel('unknown')).toThrow();
  });
});

describe('normalizeKmaReading', () => {
  it('returns correct displayValue — never raw number', () => {
    const reading = normalizeKmaReading('높음', 'tree');
    expect(reading.displayValue).toBe('높음');
    expect(reading.numericValue).toBe(70);
    expect(reading.range).toBe('61~80');
    expect(reading.species).toBe('tree');
  });

  it('midpoints: low=15, moderate=45, high=70, very-high=90', () => {
    expect(normalizeKmaReading('낮음', 'grass').numericValue).toBe(15);
    expect(normalizeKmaReading('보통', 'grass').numericValue).toBe(45);
    expect(normalizeKmaReading('높음', 'grass').numericValue).toBe(70);
    expect(normalizeKmaReading('매우높음', 'grass').numericValue).toBe(90);
  });
});

describe('dominantLevel', () => {
  it('returns the worst level among readings', () => {
    const readings = [
      normalizeKmaReading('낮음', 'tree'),
      normalizeKmaReading('높음', 'grass'),
      normalizeKmaReading('보통', 'weed'),
    ];
    expect(dominantLevel(readings)).toBe('high');
  });

  it('returns very-high when any reading is very-high', () => {
    const readings = [
      normalizeKmaReading('매우높음', 'tree'),
      normalizeKmaReading('낮음', 'grass'),
    ];
    expect(dominantLevel(readings)).toBe('very-high');
  });
});
