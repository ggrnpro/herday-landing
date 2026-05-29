/**
 * One-shot migration runner. Applies db/migrations/*.sql in order.
 * Tracks applied filenames in a `_migrations` table.
 *
 * Run with: npx tsx scripts/migrate.ts
 */

import { readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import postgres from "postgres";

const envFile = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
const env = Object.fromEntries(
  envFile
    .split("\n")
    .filter((l) => l && !l.trim().startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
) as Record<string, string>;

const url = env.DATABASE_URL_UNPOOLED || env.DATABASE_URL;
if (!url) throw new Error("No DATABASE_URL in .env.local");

const sql = postgres(url, { prepare: false, max: 1 });

async function run() {
  await sql`
    create table if not exists _migrations (
      filename text primary key,
      applied_at timestamptz not null default now()
    )
  `;

  const dir = resolve(process.cwd(), "db/migrations");
  const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
  console.log(`Found ${files.length} migration file(s).`);

  for (const filename of files) {
    const already = await sql`select 1 from _migrations where filename = ${filename}`;
    if (already.length > 0) {
      console.log(`  ↻ skip ${filename} (already applied)`);
      continue;
    }
    const sqlText = readFileSync(join(dir, filename), "utf8");
    console.log(`  ▸ applying ${filename}...`);
    await sql.unsafe(sqlText);
    await sql`insert into _migrations (filename) values (${filename})`;
    console.log(`    ✓ applied`);
  }

  console.log("\nAll migrations done.");
  await sql.end();
}

run().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
