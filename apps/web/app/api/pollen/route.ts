import { fetchPollenKma, fetchPollenOpenMeteo } from '@repo/api-client';
import { isInKorea, latLngToSido, sidoToKmaAreaNo } from '@repo/geo';
import { NextRequest, NextResponse } from 'next/server';
import { cacheGet, cacheSet } from '../../../lib/cache';
import { withCircuitBreaker } from '../../../lib/circuit-breaker';
import { checkRateLimit, getClientIp } from '../../../lib/rate-limit';

export const runtime = 'nodejs';

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

  const cached = await cacheGet(cacheKey);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, s-maxage=10800' },
    });
  }

  try {
    let data;

    if (korea && sido) {
      // 한국: 기상청 꽃가루농도위험지수
      const areaNo = sidoToKmaAreaNo(sido);
      data = await withCircuitBreaker(
        'kma-pollen',
        () => fetchPollenKma(areaNo, sido),
        () => null,
      );

      // KMA 실패 시 Open-Meteo fallback (데이터는 부정확하지만 없는 것보단 나음)
      if (!data) {
        data = await fetchPollenOpenMeteo(lat, lng).catch(() => null);
      }
    } else {
      // 해외: Open-Meteo
      data = await withCircuitBreaker(
        'open-meteo',
        () => fetchPollenOpenMeteo(lat, lng),
        () => null,
      );
    }

    if (!data) {
      const stale = await cacheGet(cacheKey);
      if (stale) {
        return NextResponse.json({ ...stale, stale: true }, {
          headers: { 'X-Cache': 'STALE', 'Cache-Control': 'public, s-maxage=600' },
        });
      }
      return NextResponse.json(
        { error: 'Pollen service temporarily unavailable' },
        { status: 503 },
      );
    }

    await cacheSet(cacheKey, data);

    return NextResponse.json(data, {
      headers: { 'X-Cache': 'MISS', 'Cache-Control': 'public, s-maxage=10800' },
    });
  } catch (err) {
    console.error('[/api/pollen]', err);
    const stale = await cacheGet(cacheKey);
    if (stale) {
      return NextResponse.json({ ...stale, stale: true }, {
        headers: { 'X-Cache': 'STALE', 'Cache-Control': 'public, s-maxage=600' },
      });
    }
    return NextResponse.json({ error: 'Failed to fetch pollen data' }, { status: 502 });
  }
}
