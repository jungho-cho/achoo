/**
 * 2-tier cache: L1 (in-memory LRU) + L2 (Upstash Redis)
 * Falls back gracefully to L1-only when Redis is not configured.
 */

// ─── L1: In-memory with TTL ────────────────────────────────────────────────

interface L1Entry<T> {
  value: T;
  expiresAt: number;
}

const L1_MAX_SIZE = 200;
const l1: Map<string, L1Entry<unknown>> = new Map();

function l1Get<T>(key: string): T | null {
  const entry = l1.get(key) as L1Entry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    l1.delete(key);
    return null;
  }
  return entry.value;
}

function l1Set<T>(key: string, value: T, ttlMs: number): void {
  if (l1.size >= L1_MAX_SIZE) {
    const firstKey = l1.keys().next().value;
    if (firstKey !== undefined) l1.delete(firstKey);
  }
  l1.set(key, { value, expiresAt: Date.now() + ttlMs });
}

// ─── L2: Upstash Redis ────────────────────────────────────────────────────

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

async function redisGet<T>(key: string): Promise<T | null> {
  const config = getRedis();
  if (!config) return null;
  try {
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis(config);
    return await redis.get<T>(key);
  } catch {
    return null;
  }
}

async function redisSet<T>(key: string, value: T, ttlSec: number): Promise<void> {
  const config = getRedis();
  if (!config) return;
  try {
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis(config);
    await redis.set(key, value, { ex: ttlSec });
  } catch {
    // Non-fatal — L1 still serves
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

const TTL_MS = 3 * 60 * 60 * 1000; // 3 hours
const TTL_SEC = 3 * 60 * 60;

export async function cacheGet<T>(key: string): Promise<T | null> {
  const l1val = l1Get<T>(key);
  if (l1val !== null) return l1val;

  const l2val = await redisGet<T>(key);
  if (l2val !== null) {
    l1Set(key, l2val, TTL_MS);
    return l2val;
  }

  return null;
}

export async function cacheSet<T>(key: string, value: T): Promise<void> {
  l1Set(key, value, TTL_MS);
  await redisSet(key, value, TTL_SEC);
}
