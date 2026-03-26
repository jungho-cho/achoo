/**
 * Circuit breaker: 3 failures → open for 5 minutes
 * Uses Upstash Redis for distributed state; falls back to in-memory.
 */

const FAILURE_THRESHOLD = 3;
const OPEN_TTL_SEC = 5 * 60; // 5 minutes

const inMemoryCircuits: Map<string, { failures: number; openUntil: number }> = new Map();

async function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const { Redis } = await import('@upstash/redis');
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

export async function withCircuitBreaker<T>(
  key: string,
  fn: () => Promise<T>,
  fallback: () => T | null,
): Promise<T | null> {
  const redis = await getRedis();

  if (redis) {
    const status = await redis.get<string>(`circuit:${key}:status`);
    if (status === 'open') return fallback();

    try {
      const result = await fn();
      await redis.del(`circuit:${key}:failures`);
      return result;
    } catch (err) {
      const failures = ((await redis.get<number>(`circuit:${key}:failures`)) ?? 0) + 1;
      if (failures >= FAILURE_THRESHOLD) {
        await redis.set(`circuit:${key}:status`, 'open', { ex: OPEN_TTL_SEC });
        await redis.del(`circuit:${key}:failures`);
      } else {
        await redis.set(`circuit:${key}:failures`, failures, { ex: OPEN_TTL_SEC });
      }
      throw err;
    }
  } else {
    const now = Date.now();
    const state = inMemoryCircuits.get(key) ?? { failures: 0, openUntil: 0 };

    if (now < state.openUntil) return fallback();

    try {
      const result = await fn();
      inMemoryCircuits.set(key, { failures: 0, openUntil: 0 });
      return result;
    } catch (err) {
      const failures = state.failures + 1;
      const openUntil = failures >= FAILURE_THRESHOLD ? now + OPEN_TTL_SEC * 1000 : 0;
      inMemoryCircuits.set(key, { failures, openUntil });
      throw err;
    }
  }
}
