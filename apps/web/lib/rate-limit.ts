/**
 * Rate limiting: 10 req/min per IP
 * Uses Upstash Redis when configured; no-ops in dev (Redis not set).
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // unix ms
}

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  // No Redis configured → allow all (dev / local)
  if (!url || !token) {
    return { allowed: true, remaining: 10, resetAt: Date.now() + 60000 };
  }

  try {
    const { Ratelimit } = await import('@upstash/ratelimit');
    const { Redis } = await import('@upstash/redis');

    const ratelimit = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: false,
    });

    const { success, remaining, reset } = await ratelimit.limit(`ratelimit:${ip}`);
    return { allowed: success, remaining, resetAt: reset };
  } catch {
    // Non-fatal — allow request if rate limiter errors
    return { allowed: true, remaining: 10, resetAt: Date.now() + 60000 };
  }
}

export function getClientIp(req: Request): string {
  const forwarded = (req.headers as Headers).get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return 'unknown';
}
