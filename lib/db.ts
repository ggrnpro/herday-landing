import postgres from "postgres";

/**
 * Singleton Postgres client.
 *
 * - Uses Neon pooled URL — safe for serverless/Fluid functions.
 * - `prepare: false` because Neon pooler does not support prepared statements
 *   consistently across pooled connections.
 * - We avoid keeping the connection alive across invocations on purpose;
 *   postgres-js handles pooling internally per cold start.
 */
declare global {
  // eslint-disable-next-line no-var
  var __herdayPg: ReturnType<typeof postgres> | undefined;
}

function client() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return postgres(url, {
    prepare: false,
    idle_timeout: 20,
    max: 10,
  });
}

export const sql = globalThis.__herdayPg ?? client();
if (process.env.NODE_ENV !== "production") {
  globalThis.__herdayPg = sql;
}
