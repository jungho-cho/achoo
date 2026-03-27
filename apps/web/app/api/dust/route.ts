import { fetchDustAirkorea } from '@repo/api-client';
import { NextRequest, NextResponse } from 'next/server';
import { cacheGet, cacheSet } from '../../../lib/cache';
import { withCircuitBreaker } from '../../../lib/circuit-breaker';
import { checkRateLimit, getClientIp } from '../../../lib/rate-limit';
import { isValidSido, latLngToSido } from '../../../lib/sido';

export const runtime = 'nodejs';

// GET /api/dust?sido=서울  OR  /api/dust?lat=37.5&lng=127.0
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

  // Resolve sido: prefer explicit sido param, else derive from lat/lng
  let sido = searchParams.get('sido');
  if (!sido) {
    const lat = parseFloat(searchParams.get('lat') ?? '');
    const lng = parseFloat(searchParams.get('lng') ?? '');
    if (!isNaN(lat) && !isNaN(lng)) {
      sido = latLngToSido(lat, lng);
    }
  }

  if (!sido || !sido.trim()) {
    return NextResponse.json({ error: 'sido or lat/lng is required' }, { status: 400 });
  }

  if (!isValidSido(sido)) {
    return NextResponse.json({ error: `Invalid sido: ${sido}` }, { status: 400 });
  }

  const cacheKey = `dust:${sido}`;

  const cached = await cacheGet(cacheKey);
  if (cached) {
    return NextResponse.json(cached, {
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
      // Circuit open — serve stale cache if available
      const stale = await cacheGet(cacheKey);
      if (stale) {
        return NextResponse.json({ ...stale, stale: true }, {
          headers: { 'X-Cache': 'STALE', 'Cache-Control': 'public, s-maxage=600' },
        });
      }
      return NextResponse.json(
        { error: 'Dust service temporarily unavailable' },
        { status: 503 },
      );
    }

    await cacheSet(cacheKey, data);

    return NextResponse.json(data, {
      headers: { 'X-Cache': 'MISS', 'Cache-Control': 'public, s-maxage=3600' },
    });
  } catch (err) {
    console.error('[/api/dust]', err);
    // Serve stale cache on upstream failure
    const stale = await cacheGet(cacheKey);
    if (stale) {
      return NextResponse.json({ ...stale, stale: true }, {
        headers: { 'X-Cache': 'STALE', 'Cache-Control': 'public, s-maxage=600' },
      });
    }
    return NextResponse.json({ error: 'Failed to fetch dust data' }, { status: 502 });
  }
}
