import { dominantLevel, normalizeOpenMeteoReading } from '@repo/normalizer';
import type { PollenForecastDay, PollenResponse } from '@repo/shared-types';

// Open-Meteo Air Quality API — no API key required, CAMS model, global coverage
// https://open-meteo.com/en/docs/air-quality-api
const BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  hourly_units: Record<string, string>;
  hourly: {
    time: string[];
    alder_pollen: (number | null)[];
    birch_pollen: (number | null)[];
    grass_pollen: (number | null)[];
    mugwort_pollen: (number | null)[];
    ragweed_pollen: (number | null)[];
  };
}

function safePollen(values: (number | null)[], index: number): number {
  return Math.max(0, values[index] ?? 0);
}

// Aggregate hourly → daily: pick daily max for each pollen type
function aggregateDay(
  data: OpenMeteoResponse['hourly'],
  dayIndex: number,
  hoursPerDay = 24,
): PollenForecastDay {
  const start = dayIndex * hoursPerDay;
  const end = start + hoursPerDay;

  let maxAlder = 0, maxBirch = 0, maxGrass = 0, maxMugwort = 0, maxRagweed = 0;
  for (let i = start; i < end && i < data.time.length; i++) {
    maxAlder   = Math.max(maxAlder,   safePollen(data.alder_pollen,   i));
    maxBirch   = Math.max(maxBirch,   safePollen(data.birch_pollen,   i));
    maxGrass   = Math.max(maxGrass,   safePollen(data.grass_pollen,   i));
    maxMugwort = Math.max(maxMugwort, safePollen(data.mugwort_pollen, i));
    maxRagweed = Math.max(maxRagweed, safePollen(data.ragweed_pollen, i));
  }

  // Map to 3 species: tree = max(alder, birch), grass, weed = max(mugwort, ragweed)
  const treeMax  = Math.max(maxAlder, maxBirch);
  const weedMax  = Math.max(maxMugwort, maxRagweed);

  const readings = [
    normalizeOpenMeteoReading(treeMax,  'tree'),
    normalizeOpenMeteoReading(maxGrass, 'grass'),
    normalizeOpenMeteoReading(weedMax,  'weed'),
  ];

  const date = data.time[start]!.slice(0, 10);
  return { date, readings, overallLevel: dominantLevel(readings) };
}

export async function fetchPollenOpenMeteo(lat: number, lng: number): Promise<PollenResponse> {
  const params = new URLSearchParams({
    latitude:  lat.toFixed(4),
    longitude: lng.toFixed(4),
    hourly: 'alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,ragweed_pollen',
    forecast_days: '7',
    timezone: 'auto',
  });

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) {
    throw new Error(`Open-Meteo API error: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as OpenMeteoResponse;

  const totalDays = Math.floor(json.hourly.time.length / 24);
  const current = aggregateDay(json.hourly, 0);
  const forecast = Array.from({ length: Math.min(totalDays - 1, 6) }, (_, i) =>
    aggregateDay(json.hourly, i + 1),
  );

  return {
    sido: '',
    lat: json.latitude,
    lng: json.longitude,
    source: 'open-meteo',
    current,
    forecast,
    cachedAt: new Date().toISOString(),
  };
}
