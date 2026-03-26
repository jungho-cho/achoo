import { describe, expect, it } from 'vitest';
import type { DustReading, PollenReading } from '@repo/shared-types';
import { selectHero } from '../hero.js';

function pollenReading(level: PollenReading['level'], numeric: number): PollenReading {
  return { species: 'tree', level, numericValue: numeric, displayValue: '', range: '' };
}

function dustReading(level: DustReading['level']): DustReading {
  const numeric: Record<DustReading['level'], number> = {
    good: 10,
    moderate: 40,
    bad: 65,
    'very-bad': 90,
  };
  const display: Record<DustReading['level'], string> = {
    good: '좋음',
    moderate: '보통',
    bad: '나쁨',
    'very-bad': '매우나쁨',
  };
  return { pm10: 0, pm25: 0, level, displayValue: display[level] };
}

describe('selectHero — seasonal swap rule', () => {
  it('dust > pollen → hero is dust', () => {
    const pollen = [pollenReading('low', 15)];       // numeric 15
    const dust = dustReading('bad');                  // numeric 65
    const hero = selectHero(pollen, dust);
    expect(hero.metric).toBe('dust');
    expect(hero.level).toBe('bad');
    expect(hero.displayValue).toBe('나쁨');
    expect(hero.numericValue).toBe(65);
  });

  it('pollen > dust → hero is pollen', () => {
    const pollen = [pollenReading('very-high', 90)]; // numeric 90
    const dust = dustReading('moderate');              // numeric 40
    const hero = selectHero(pollen, dust);
    expect(hero.metric).toBe('pollen');
    expect(hero.level).toBe('very-high');
    expect(hero.numericValue).toBe(90);
  });

  it('pollen == dust → hero is pollen (not dust)', () => {
    const pollen = [pollenReading('moderate', 40)];  // numeric 40
    const dust = dustReading('moderate');              // numeric 40
    const hero = selectHero(pollen, dust);
    expect(hero.metric).toBe('pollen');
  });

  it('picks dominant (highest numeric) pollen species', () => {
    const pollen = [
      pollenReading('low', 15),
      pollenReading('high', 70),
      pollenReading('moderate', 45),
    ];
    const dust = dustReading('good'); // numeric 10
    const hero = selectHero(pollen, dust);
    expect(hero.metric).toBe('pollen');
    expect(hero.numericValue).toBe(70);
  });

  it('empty pollen array → dust wins by default', () => {
    const hero = selectHero([], dustReading('moderate'));
    expect(hero.metric).toBe('dust');
  });
});
