import { fetchPollenKma, fetchPollenOpenMeteo } from '@repo/api-client';
import type { PollenLevel, PollenResponse } from '@repo/shared-types';
import { isInKorea, latLngToSido, sidoToKmaAreaNo } from '@repo/geo';
import { NextRequest, NextResponse } from 'next/server';
import { cacheGet, cacheSet } from '../../../lib/cache';
import { withCircuitBreaker } from '../../../lib/circuit-breaker';
import { checkRateLimit, getClientIp } from '../../../lib/rate-limit';

export const runtime = 'nodejs';

// Restore displayValue for API consumers (urikiri Flutter app depends on this)
const POLLEN_DISPLAY_KO: Record<PollenLevel, string> = {
  low: '낮음',
  moderate: '보통',
  high: '높음',
  'very-high': '매우높음',
};

function addDisplayValues(data: PollenResponse): PollenResponse {
  return {
    ...data,
    current: {
      ...data.current,
      readings: data.current.readings.map((r) => ({
        ...r,
        displayValue: r.displayValue ?? POLLEN_DISPLAY_KO[r.level],
      })),
    },
    forecast: data.forecast.map((day) => ({
      ...day,
      readings: day.readings.map((r) => ({
        ...r,
        displayValue: r.displayValue ?? POLLEN_DISPLAY_KO[r.level],
      })),
    })),
  };
}

// GET /api/pollen?lat=37.5665&lng=126.9780
export async function GET(req: NextRequest) {
  const { allowed, remaining, resetAt } = await checkRateLimit(getClientIp(req));
  if (!allowed) {
    return NextResponse.json(
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

  if (!latStr || !lngStr) {
    return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 });
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json({ error: 'Invalid lat/lng' }, { status: 400 });
  }

  const korea = isInKorea(lat, lng);
  const sido = korea ? latLngToSido(lat, lng) : null;
  const cacheKey = korea && sido
    ? `pollen:kma:${sido}`
    : `pollen:${lat.toFixed(2)}:${lng.toFixed(2)}`;

  const cached = await cacheGet<PollenResponse>(cacheKey);
  if (cached) {
    return NextResponse.json(addDisplayValues(cached), {
      headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, s-maxage=10800' },
    });
  }

  try {
    let data: PollenResponse | null = null;

    if (korea && sido) {
      const areaNo = sidoToKmaAreaNo(sido);
      data = await withCircuitBreaker(
        'kma-pollen',
        () => fetchPollenKma(areaNo, sido),
        () => null,
      );

      if (!data) {
        data = await fetchPollenOpenMeteo(lat, lng).catch(() => null);
      }
    } else {
      data = await withCircuitBreaker(
        'open-meteo',
        () => fetchPollenOpenMeteo(lat, lng),
        () => null,
      );
    }

    if (!data) {
      const stale = await cacheGet<PollenResponse>(cacheKey);
      if (stale) {
        return NextResponse.json({ ...addDisplayValues(stale), stale: true }, {
          headers: { 'X-Cache': 'STALE', 'Cache-Control': 'public, s-maxage=600' },
        });
      }
      return NextResponse.json(
        { error: 'Pollen service temporarily unavailable' },
        { status: 503 },
      );
    }

    await cacheSet(cacheKey, data);

    return NextResponse.json(addDisplayValues(data), {
      headers: { 'X-Cache': 'MISS', 'Cache-Control': 'public, s-maxage=10800' },
    });
  } catch (err) {
    console.error('[/api/pollen]', err);
    const stale = await cacheGet<PollenResponse>(cacheKey);
    if (stale) {
      return NextResponse.json({ ...addDisplayValues(stale), stale: true }, {
        headers: { 'X-Cache': 'STALE', 'Cache-Control': 'public, s-maxage=600' },
      });
    }
    return NextResponse.json({ error: 'Failed to fetch pollen data' }, { status: 502 });
  }
}
