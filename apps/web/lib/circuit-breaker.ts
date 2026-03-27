/**
 * Circuit breaker: 3 failures → open for 5 minutes → half-open (1 probe) → closed/open
 * Uses Upstash Redis for distributed state; falls back to in-memory.
 */

const FAILURE_THRESHOLD = 3;
const OPEN_TTL_SEC = 5 * 60; // 5 minutes

import { getRedis } from './redis';

interface CircuitState {
  failures: number;
  openUntil: number;
  halfOpen: boolean;
}

const inMemoryCircuits: Map<string, CircuitState> = new Map();

export async function withCircuitBreaker<T>(
  key: string,
  fn: () => Promise<T>,
  fallback: () => T | null,
): Promise<T | null> {
  const redis = getRedis();

  if (redis) {
    const status = await redis.get<string>(`circuit:${key}:status`);

    if (status === 'open') {
      // Check if we should try half-open
      const halfOpenKey = `circuit:${key}:half-open`;
      const isProbing = await redis.get<string>(halfOpenKey);
      if (!isProbing) {
        // Allow one probe request (half-open)
        await redis.set(halfOpenKey, 'probing', { ex: 30 }); // 30s probe window
        try {
          const result = await fn();
          // Probe succeeded — close circuit
          await redis.del(`circuit:${key}:status`);
          await redis.del(`circuit:${key}:failures`);
          await redis.del(halfOpenKey);
          return result;
        } catch {
          // Probe failed — stay open, reset TTL
          await redis.set(`circuit:${key}:status`, 'open', { ex: OPEN_TTL_SEC });
          await redis.del(halfOpenKey);
          return fallback();
        }
      }
      return fallback();
    }

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
    const state = inMemoryCircuits.get(key) ?? { failures: 0, openUntil: 0, halfOpen: false };

    if (now < state.openUntil) {
      // Check for half-open probe
      if (!state.halfOpen) {
        state.halfOpen = true;
        inMemoryCircuits.set(key, state);
        try {
          const result = await fn();
          // Probe succeeded — close
          inMemoryCircuits.set(key, { failures: 0, openUntil: 0, halfOpen: false });
          return result;
        } catch {
          // Probe failed — stay open, extend TTL
          state.halfOpen = false;
          state.openUntil = now + OPEN_TTL_SEC * 1000;
          inMemoryCircuits.set(key, state);
          return fallback();
        }
      }
      return fallback();
    }

    try {
      const result = await fn();
      inMemoryCircuits.set(key, { failures: 0, openUntil: 0, halfOpen: false });
      return result;
    } catch (err) {
      const failures = state.failures + 1;
      const openUntil = failures >= FAILURE_THRESHOLD ? now + OPEN_TTL_SEC * 1000 : 0;
      inMemoryCircuits.set(key, { failures, openUntil, halfOpen: false });
      throw err;
    }
  }
}
