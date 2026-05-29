import "server-only";

import { createHash } from "node:crypto";
import { sql } from "./db";

/**
 * Per-tool, per-IP, per-day generation counter.
 *
 * Storage: Postgres `rate_limits` table keyed on (ip_hash, day, tool).
 * Hash: SHA-256(ip + salt) truncated to 32 chars so we don't store
 * raw IPs (GDPR friendly).
 *
 * Defaults:
 *   - letter: 2/day      (FREE_LETTER_LIMIT)
 *   - affirmation: 2/day (FREE_AFFIRMATION_LIMIT)
 */

export type Tool = "letter" | "affirmation" | "inner_critic" | "subscribe";

const LIMITS: Record<Tool, number> = {
  letter: Number(process.env.FREE_LETTER_LIMIT || 2),
  affirmation: Number(process.env.FREE_AFFIRMATION_LIMIT || 2),
  inner_critic: Number(process.env.FREE_INNER_CRITIC_LIMIT || 2),
  // Anti-abuse cap on waitlist signups per IP per day (not a "free tool").
  subscribe: Number(process.env.SUBSCRIBE_IP_LIMIT || 8),
};

export function limitFor(tool: Tool): number {
  return LIMITS[tool];
}

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

export async function peekRateLimit(ip: string, tool: Tool): Promise<RateLimitState> {
  const ipHash = hashIp(ip);
  const rows = await sql<{ count: number }[]>`
    select count from rate_limits
    where ip_hash = ${ipHash} and day = current_date and tool = ${tool}
  `;
  const used = rows[0]?.count ?? 0;
  const limit = LIMITS[tool];
  return {
    used,
    remaining: Math.max(0, limit - used),
    limit,
    blocked: used >= limit,
  };
}

export async function consumeRateLimit(ip: string, tool: Tool): Promise<RateLimitState> {
  const ipHash = hashIp(ip);
  const rows = await sql<{ count: number }[]>`
    insert into rate_limits (ip_hash, day, tool, count)
    values (${ipHash}, current_date, ${tool}, 1)
    on conflict (ip_hash, day, tool)
    do update set count = rate_limits.count + 1
    returning count
  `;
  const used = rows[0].count;
  const limit = LIMITS[tool];
  return {
    used,
    remaining: Math.max(0, limit - used),
    limit,
    blocked: used > limit,
  };
}
