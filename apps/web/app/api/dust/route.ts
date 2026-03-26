import { fetchDustAirkorea } from '@repo/api-client';
import { NextRequest, NextResponse } from 'next/server';
import { cacheGet, cacheSet } from '../../../lib/cache';
import { withCircuitBreaker } from '../../../lib/circuit-breaker';
import { checkRateLimit, getClientIp } from '../../../lib/rate-limit';

export const runtime = 'nodejs';

// GET /api/dust?sido=서울
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
