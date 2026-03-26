import { normalizeAmbeeReading, snapToNearestCity } from '@repo/normalizer';
import type { PollenForecastDay, PollenResponse, PollenSpecies } from '@repo/shared-types';
import { dominantLevel } from '@repo/normalizer';

interface AmbeePollenDay {
  time: string;
  Count: {
    tree_pollen: number;
    grass_pollen: number;
    weed_pollen: number;
  };
  Risk: {
    tree_pollen: string;
    grass_pollen: string;
    weed_pollen: string;
  };
}

interface AmbeePollenResponse {
  data: AmbeePollenDay[];
  message: string;
}

function parseAmbeeDay(day: AmbeePollenDay, date: string): PollenForecastDay {
  const species: [PollenSpecies, number][] = [
    ['tree', day.Count.tree_pollen],
    ['grass', day.Count.grass_pollen],
    ['weed', day.Count.weed_pollen],
  ];

  const readings = species.map(([s, score]) => normalizeAmbeeReading(score, s));
  return {
    date,
    readings,
    overallLevel: dominantLevel(readings),
  };
}

export async function fetchPollenAmbee(lat: number, lng: number): Promise<PollenResponse> {
  const apiKey = process.env.AMBEE_API_KEY;
  if (!apiKey) throw new Error('AMBEE_API_KEY not set');

  const snapped = snapToNearestCity(lat, lng);
  const url = `https://api.getambee.com/pollen/v2/forecast/daily/by-lat-lng?lat=${snapped.lat}&lng=${snapped.lng}`;

  const res = await fetch(url, {
    headers: { 'x-api-key': apiKey },
  });

  if (!res.ok) {
    throw new Error(`Ambee API error: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as AmbeePollenResponse;

  if (!json.data?.length) {
    throw new Error('Ambee returned empty data');
  }

  const [today, ...rest] = json.data;
  const todayDate = new Date().toISOString().slice(0, 10);

  const current = parseAmbeeDay(today!, todayDate);
  const forecast = rest.slice(0, 6).map((d, i) => {
    const date = new Date(Date.now() + (i + 1) * 86400000).toISOString().slice(0, 10);
    return parseAmbeeDay(d, date);
  });

  return {
    sido: snapped.name,
    lat: snapped.lat,
    lng: snapped.lng,
    source: 'ambee',
    current,
    forecast,
    cachedAt: new Date().toISOString(),
  };
}
