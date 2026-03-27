import { normalizeDustReading } from '@repo/normalizer';
import type { DustResponse } from '@repo/shared-types';

interface AirkoreaDustItem {
  stationName: string;
  pm10Value: string;
  pm25Value: string;
}

interface AirkoreaResponse {
  response: {
    body: {
      items: AirkoreaDustItem[];
    };
  };
}

export async function fetchDustAirkorea(sido: string): Promise<DustResponse> {
  const apiKey = process.env.AIRKOREA_API_KEY;
  if (!apiKey) throw new Error('AIRKOREA_API_KEY not set');

  const params = new URLSearchParams({
    serviceKey: apiKey,
    returnType: 'json',
    numOfRows: '10',
    pageNo: '1',
    sidoName: sido,
    ver: '1.0',
  });

  const url = `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?${params}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`AirKorea API error: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as AirkoreaResponse;
  const items = json.response?.body?.items;

  if (!items?.length) {
    throw new Error('AirKorea returned empty data');
  }

  // Average across stations, skip '-' and non-numeric values
  const validItems = items.filter((item) => {
    const pm10 = parseFloat(item.pm10Value);
    const pm25 = parseFloat(item.pm25Value);
    return isFinite(pm10) && isFinite(pm25) && pm10 >= 0 && pm25 >= 0;
  });

  if (!validItems.length) {
    throw new Error('AirKorea: no valid station values');
  }

  const avgPm10 =
    validItems.reduce((sum, item) => sum + parseFloat(item.pm10Value), 0) / validItems.length;
  const avgPm25 =
    validItems.reduce((sum, item) => sum + parseFloat(item.pm25Value), 0) / validItems.length;

  return {
    sido,
    lat: 0, // AirKorea doesn't return lat/lng for city-level queries
    lng: 0,
    source: 'airkorea',
    current: normalizeDustReading(Math.round(avgPm10), Math.round(avgPm25)),
    cachedAt: new Date().toISOString(),
  };
}
