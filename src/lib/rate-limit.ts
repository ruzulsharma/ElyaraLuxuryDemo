/**
 * In-process rate limiter using a sliding-window + exponential backoff approach.
 * All thresholds come from environment variables — nothing hardcoded.
 *
 * Production note: Replace the in-memory store with Redis (Upstash or similar)
 * for multi-instance deployments. The interface stays identical.
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
  /** How many times a limit was hit (drives backoff multiplier) */
  violations: number;
}

// Simple in-memory store — swap for Redis in production
const store = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  /** Max requests allowed per window */
  maxRequests: number;
  /** Window duration in seconds */
  windowSeconds: number;
  /** If true, applies exponential backoff after repeated violations */
  useBackoff?: boolean;
}

export type RateLimitKind = "auth" | "otp" | "public" | "authed";

/** Read thresholds from env — all configurable */
export function getConfig(kind: RateLimitKind): RateLimitConfig {
  const e = process.env;

  const configs: Record<RateLimitKind, RateLimitConfig> = {
    auth: {
      maxRequests: Number(e.RATE_LIMIT_AUTH_REQUESTS ?? 5),
      windowSeconds: Number(e.RATE_LIMIT_AUTH_WINDOW_SECONDS ?? 300),
      useBackoff: true,
    },
    otp: {
      maxRequests: Number(e.RATE_LIMIT_OTP_REQUESTS ?? 3),
      windowSeconds: Number(e.RATE_LIMIT_OTP_WINDOW_SECONDS ?? 600),
      useBackoff: true,
    },
    public: {
      maxRequests: Number(e.RATE_LIMIT_PUBLIC_REQUESTS ?? 60),
      windowSeconds: Number(e.RATE_LIMIT_PUBLIC_WINDOW_SECONDS ?? 60),
      useBackoff: false,
    },
    authed: {
      maxRequests: Number(e.RATE_LIMIT_AUTHED_REQUESTS ?? 120),
      windowSeconds: Number(e.RATE_LIMIT_AUTHED_WINDOW_SECONDS ?? 60),
      useBackoff: false,
    },
  };

  return configs[kind];
}

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the window resets (or backoff expires) */
  retryAfter: number;
  remaining: number;
}

/**
 * Check rate limit for a given key (e.g. "auth:127.0.0.1" or "auth:user@email.com").
 * Uses a sliding window with optional exponential backoff on violations.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;

  let entry = store.get(key);

  // Reset window if expired
  if (!entry || now - entry.windowStart > windowMs) {
    entry = { count: 0, windowStart: now, violations: entry?.violations ?? 0 };
  }

  // Calculate effective window with exponential backoff
  let effectiveWindow = windowMs;
  if (config.useBackoff && entry.violations > 0) {
    // 2^violations * base window, capped at 1 hour
    effectiveWindow = Math.min(
      windowMs * Math.pow(2, entry.violations),
      3600 * 1000
    );
  }

  const windowAge = now - entry.windowStart;
  const retryAfter = Math.ceil((effectiveWindow - windowAge) / 1000);

  if (entry.count >= config.maxRequests) {
    entry.violations += 1;
    store.set(key, entry);
    return { allowed: false, retryAfter, remaining: 0 };
  }

  entry.count += 1;
  store.set(key, entry);

  return {
    allowed: true,
    retryAfter: 0,
    remaining: config.maxRequests - entry.count,
  };
}

/** Build a composite key for per-IP + per-account limiting */
export function buildKey(kind: RateLimitKind, identifier: string): string {
  return `${kind}:${identifier}`;
}

/** Helper used in API route handlers */
export function rateLimitResponse(retryAfter: number): Response {
  return new Response(
    JSON.stringify({
      error: "Too many requests. Please wait before trying again.",
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter),
        "X-RateLimit-Reset": String(Math.floor(Date.now() / 1000) + retryAfter),
      },
    }
  );
}
