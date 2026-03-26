import { fetchDustAirkorea } from '@repo/api-client';
import { NextRequest, NextResponse } from 'next/server';
import { cacheGet, cacheSet } from '../../../lib/cache';
import { withCircuitBreaker } from '../../../lib/circuit-breaker';

export const runtime = 'nodejs';

// GET /api/dust?sido=서울
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const sido = searchParams.get('sido') ?? '서울';

  if (!sido.trim()) {
    return NextResponse.json({ error: 'sido is required' }, { status: 400 });
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
      () => fetchDustAirkorea(sido),
      () => null,
    );

    if (!data) {
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
    return NextResponse.json({ error: 'Failed to fetch dust data' }, { status: 502 });
  }
}
