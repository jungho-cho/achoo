import { fetchDustAirkorea, fetchOpenMeteoAirQuality } from '@repo/api-client';
import type { DustLevel, DustResponse } from '@repo/shared-types';
import { isInKorea } from '@repo/geo';
import { NextRequest, NextResponse } from 'next/server';
import { cacheGet, cacheSet } from '../../../lib/cache';
import { withCircuitBreaker } from '../../../lib/circuit-breaker';
import { checkRateLimit, getClientIp } from '../../../lib/rate-limit';
import { isValidSido, latLngToSido } from '../../../lib/sido';

export const runtime = 'nodejs';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Restore displayValue for API consumers
const DUST_DISPLAY_KO: Record<DustLevel, string> = {
  good: '좋음',
  moderate: '보통',
  bad: '나쁨',
  'very-bad': '매우나쁨',
};

function addDustDisplayValue(data: DustResponse): DustResponse {
  return {
    ...data,
    current: {
      ...data.current,
      displayValue: data.current.displayValue ?? DUST_DISPLAY_KO[data.current.level],
    },
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

function jsonWithCors(data: unknown, init?: { status?: number; headers?: Record<string, string> }) {
  return NextResponse.json(data, {
    ...init,
    headers: { ...CORS_HEADERS, ...init?.headers },
  });
}

// GET /api/dust?sido=서울  OR  /api/dust?lat=37.5&lng=127.0
export async function GET(req: NextRequest) {
  const { allowed, resetAt } = await checkRateLimit(getClientIp(req));
  if (!allowed) {
    return jsonWithCors(
      { error: '요청이 너무 많습니다. 잠시 후 다시 시도하세요.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
          'X-RateLimit-Remaining': '0',
        },
      },
    );
  }

  const { searchParams } = req.nextUrl;
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');
  const lat = latStr ? parseFloat(latStr) : NaN;
  const lng = lngStr ? parseFloat(lngStr) : NaN;

  const korea = !isNaN(lat) && !isNaN(lng) && isInKorea(lat, lng);

  // Korea path: use AirKorea (sido-based)
  if (korea) {
    let sido = searchParams.get('sido');
    if (!sido && !isNaN(lat) && !isNaN(lng)) {
      sido = latLngToSido(lat, lng);
    }

    if (!sido || !sido.trim()) {
      return jsonWithCors({ error: 'sido or lat/lng is required' }, { status: 400 });
    }

    if (!isValidSido(sido)) {
      return jsonWithCors({ error: `Invalid sido: ${sido}` }, { status: 400 });
    }

    const cacheKey = `dust:${sido}`;
    const cached = await cacheGet<DustResponse>(cacheKey);
    if (cached) {
      return jsonWithCors(addDustDisplayValue(cached), {
        headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, s-maxage=3600' },
      });
    }

    try {
      const data = await withCircuitBreaker(
        'airkorea',
        () => fetchDustAirkorea(sido!),
        () => null,
      );

      if (!data) {
        const stale = await cacheGet<DustResponse>(cacheKey);
        if (stale) {
          return jsonWithCors({ ...addDustDisplayValue(stale), stale: true }, {
            headers: { 'X-Cache': 'STALE', 'Cache-Control': 'public, s-maxage=600' },
          });
        }
        return jsonWithCors({ error: 'Dust service temporarily unavailable' }, { status: 503 });
      }

      await cacheSet(cacheKey, data);
      return jsonWithCors(addDustDisplayValue(data), {
        headers: { 'X-Cache': 'MISS', 'Cache-Control': 'public, s-maxage=3600' },
      });
    } catch (err) {
      console.error('[/api/dust] AirKorea error', err);
      const stale = await cacheGet<DustResponse>(cacheKey);
      if (stale) {
        return jsonWithCors({ ...addDustDisplayValue(stale), stale: true }, {
          headers: { 'X-Cache': 'STALE', 'Cache-Control': 'public, s-maxage=600' },
        });
      }
      return jsonWithCors({ error: 'Failed to fetch dust data' }, { status: 502 });
    }
  }

  // Non-Korea path: use Open-Meteo Air Quality
  if (isNaN(lat) || isNaN(lng)) {
    return jsonWithCors({ error: 'lat and lng are required for non-Korean locations' }, { status: 400 });
  }

  const cacheKey = `dust:om:${lat.toFixed(2)}:${lng.toFixed(2)}`;
  const cached = await cacheGet<DustResponse>(cacheKey);
  if (cached) {
    return jsonWithCors(addDustDisplayValue(cached), {
      headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, s-maxage=3600' },
    });
  }

  try {
    const result = await withCircuitBreaker(
      'open-meteo-dust',
      async () => {
        const aq = await fetchOpenMeteoAirQuality(lat, lng);
        return aq.dust;
      },
      () => null,
    );

    if (!result) {
      return jsonWithCors({ error: 'Dust service temporarily unavailable' }, { status: 503 });
    }

    await cacheSet(cacheKey, result);
    return jsonWithCors(addDustDisplayValue(result), {
      headers: { 'X-Cache': 'MISS', 'Cache-Control': 'public, s-maxage=3600' },
    });
  } catch (err) {
    console.error('[/api/dust] Open-Meteo error', err);
    return jsonWithCors({ error: 'Failed to fetch dust data' }, { status: 502 });
  }
}
