import { createHash } from "node:crypto";
import { sql } from "./db";

/**
 * Rate limit for anonymous letter generation.
 *
 * Storage: Postgres `rate_limits` table keyed on (ip_hash, day).
 * Hash: SHA-256(ip + salt) so we don't store raw IPs (GDPR friendly).
 *
 * Caller passes the raw IP from request headers; we hash here.
 *
 * Defaults to 2 letters/day per IP. Override via FREE_LETTER_LIMIT env.
 */

export const FREE_LETTER_LIMIT = Number(
  process.env.FREE_LETTER_LIMIT || 2,
);

function hashIp(ip: string): string {
  const salt = process.env.RATE_LIMIT_SALT || "herday-default-salt";
  return createHash("sha256").update(`${ip}::${salt}`).digest("hex").slice(0, 32);
}

export function extractIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "0.0.0.0";
}

export type RateLimitState = {
  used: number;
  remaining: number;
  limit: number;
  blocked: boolean;
};

/**
 * Check current state without incrementing.
 */
export async function peekRateLimit(ip: string): Promise<RateLimitState> {
  const ipHash = hashIp(ip);
  const rows = await sql<{ count: number }[]>`
    select count from rate_limits
    where ip_hash = ${ipHash} and day = current_date
  `;
  const used = rows[0]?.count ?? 0;
  return {
    used,
    remaining: Math.max(0, FREE_LETTER_LIMIT - used),
    limit: FREE_LETTER_LIMIT,
    blocked: used >= FREE_LETTER_LIMIT,
  };
}

/**
 * Atomically increment and return new state. Returns blocked=true if the
 * increment would exceed the limit — caller should not consume the action.
 */
export async function consumeRateLimit(ip: string): Promise<RateLimitState> {
  const ipHash = hashIp(ip);
  // Atomic upsert. We always insert/increment, then check.
  const rows = await sql<{ count: number }[]>`
    insert into rate_limits (ip_hash, day, count)
    values (${ipHash}, current_date, 1)
    on conflict (ip_hash, day)
    do update set count = rate_limits.count + 1
    returning count
  `;
  const used = rows[0].count;
  return {
    used,
    remaining: Math.max(0, FREE_LETTER_LIMIT - used),
    limit: FREE_LETTER_LIMIT,
    blocked: used > FREE_LETTER_LIMIT,
  };
}
