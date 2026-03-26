/**
 * Module-level Redis singleton — avoids re-instantiation on every request.
 * Returns null when Upstash env vars are not configured (dev / local).
 */
import { Redis } from '@upstash/redis';

let _redis: Redis | null | undefined;

export function getRedis(): Redis | null {
  if (_redis !== undefined) return _redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  _redis = url && token ? new Redis({ url, token }) : null;
  return _redis;
}
