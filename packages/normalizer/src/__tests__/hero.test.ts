import { describe, expect, it } from 'vitest';
import type { DustReading, PollenReading } from '@repo/shared-types';
import { selectHero } from '../hero.js';

function pollenReading(level: PollenReading['level'], numeric: number): PollenReading {
  return { species: 'tree', level, numericValue: numeric, range: '' };
}

function dustReading(level: DustReading['level']): DustReading {
  return { pm10: 0, pm25: 0, level };
}

describe('selectHero — seasonal swap rule', () => {
  it('dust > pollen → hero is dust', () => {
    const pollen = [pollenReading('low', 15)];       // numeric 15
    const dust = dustReading('bad');                  // numeric 65
    const hero = selectHero(pollen, dust);
    expect(hero.metric).toBe('dust');
    expect(hero.level).toBe('bad');
    expect(hero.numericValue).toBe(65);
    expect(hero.displayValue).toBeUndefined();
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
