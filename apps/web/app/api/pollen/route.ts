import { fetchPollenAmbee } from '@repo/api-client';
import { NextRequest, NextResponse } from 'next/server';
import { cacheGet, cacheSet } from '../../../lib/cache';
import { withCircuitBreaker } from '../../../lib/circuit-breaker';

export const runtime = 'nodejs';

// GET /api/pollen?lat=37.5665&lng=126.9780
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const lat = parseFloat(searchParams.get('lat') ?? '37.5665');
  const lng = parseFloat(searchParams.get('lng') ?? '126.9780');

  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json({ error: 'Invalid lat/lng' }, { status: 400 });
  }

  const cacheKey = `pollen:${lat.toFixed(2)}:${lng.toFixed(2)}`;

  // L1+L2 cache check
  const cached = await cacheGet(cacheKey);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, s-maxage=10800' },
    });
  }

  try {
    const data = await withCircuitBreaker(
      'ambee',
      () => fetchPollenAmbee(lat, lng),
      () => null,
    );

    if (!data) {
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
    return NextResponse.json({ error: 'Failed to fetch pollen data' }, { status: 502 });
  }
}
