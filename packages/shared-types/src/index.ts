// ─── Pollen ──────────────────────────────────────────────────────────────────

export type PollenLevel = 'low' | 'moderate' | 'high' | 'very-high';

export type PollenSpecies = 'tree' | 'grass' | 'weed' | 'pine' | 'oak';

export interface PollenReading {
  species: PollenSpecies;
  level: PollenLevel;
  /** Internal numeric value — do NOT display directly to users */
  numericValue: number;
  /** Localized label — set by the UI layer, not the normalizer */
  displayValue?: string;
  /** Range label e.g. "0~30" */
  range: string;
}

export interface PollenForecastDay {
  date: string; // YYYY-MM-DD
  readings: PollenReading[];
  /** Dominant pollen level across all species */
  overallLevel: PollenLevel;
}

export interface PollenResponse {
  sido: string;
  lat: number;
  lng: number;
  source: 'kma' | 'ambee' | 'open-meteo';
  current: PollenForecastDay;
  forecast: PollenForecastDay[]; // up to 7 days
  cachedAt: string; // ISO timestamp
  /** true when KMA has no pollen data (July, Nov-Feb) */
  offSeason?: boolean;
}

// ─── Dust (미세먼지) ──────────────────────────────────────────────────────────

export type DustLevel = 'good' | 'moderate' | 'bad' | 'very-bad';

export interface DustReading {
  pm10: number;
  pm25: number;
  level: DustLevel;
  displayValue?: string;
}

export interface DustResponse {
  sido: string;
  lat: number;
  lng: number;
  source: 'airkorea' | 'open-meteo';
  current: DustReading;
  cachedAt: string; // ISO timestamp
}

// ─── Hero metric (seasonal swap rule) ────────────────────────────────────────

export type HeroMetric = 'pollen' | 'dust';

export interface HeroData {
  metric: HeroMetric;
  level: PollenLevel | DustLevel;
  displayValue?: string;
  numericValue: number;
}
