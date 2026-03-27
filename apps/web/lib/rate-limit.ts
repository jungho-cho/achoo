/**
 * Rate limiting: 10 req/min per IP
 * Uses Upstash Redis when configured; in-memory fallback when Redis is down.
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // unix ms
}

import { getRedis } from './redis';

// ─── In-memory fallback rate limiter ──────────────────────────────────────────

const MEM_WINDOW_MS = 60_000;
const MEM_MAX = 10;
const memBuckets = new Map<string, { count: number; resetAt: number }>();

function memRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const bucket = memBuckets.get(ip);

  if (!bucket || now >= bucket.resetAt) {
    memBuckets.set(ip, { count: 1, resetAt: now + MEM_WINDOW_MS });
    return { allowed: true, remaining: MEM_MAX - 1, resetAt: now + MEM_WINDOW_MS };
  }

  bucket.count++;
  const allowed = bucket.count <= MEM_MAX;
  return { allowed, remaining: Math.max(0, MEM_MAX - bucket.count), resetAt: bucket.resetAt };
}

// ─── Upstash Ratelimit singleton ─────────────────────────────────────────────

let _ratelimit: import('@upstash/ratelimit').Ratelimit | null | undefined;

async function getRatelimit() {
  if (_ratelimit !== undefined) return _ratelimit;

  const redis = getRedis();
  if (!redis) {
    _ratelimit = null;
    return null;
  }

  const { Ratelimit } = await import('@upstash/ratelimit');
  _ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: false,
  });
  return _ratelimit;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  try {
    const rl = await getRatelimit();

    if (!rl) {
      // No Redis → use in-memory fallback
      return memRateLimit(ip);
    }

    const { success, remaining, reset } = await rl.limit(`ratelimit:${ip}`);
    return { allowed: success, remaining, resetAt: reset };
  } catch {
    // Redis error → fall back to in-memory rate limiting
    return memRateLimit(ip);
  }
}

export function getClientIp(req: Request): string {
  const forwarded = (req.headers as Headers).get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return 'unknown';
}
