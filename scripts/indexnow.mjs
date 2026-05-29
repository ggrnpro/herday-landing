#!/usr/bin/env node
/**
 * IndexNow ping — notify Bing, Yandex, Seznam, Naver, Yep to recrawl pages.
 * Google ignores IndexNow (keeps using sitemap) — that's expected.
 *
 * Shared key lives at public/<KEY>.txt and is served from the site root:
 *   https://getherday.app/4e2924b8f4ea40cd8d5fe8bfc104c05b.txt
 * The endpoint verifies that file exists before accepting URLs — so only
 * ping AFTER the page (and the key file) are actually live in production.
 *
 * Usage:
 *   node scripts/indexnow.mjs /blog/some-post            # one or more paths
 *   node scripts/indexnow.mjs https://getherday.app/blog  # or full URLs
 *   node scripts/indexnow.mjs --sitemap                  # all URLs from sitemap.xml
 *   node scripts/indexnow.mjs --dry-run /blog/x          # build payload, don't send
 *
 * All inputs are normalized to the configured HOST (pathname kept, host forced),
 * so passing a wrong-host URL can't trigger a 422.
 */

const HOST = "getherday.app";
const KEY = "4e2924b8f4ea40cd8d5fe8bfc104c05b";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_URLS = 10000;

const STATUS = {
  200: "OK — accepted",
  202: "Accepted — URLs received, validation pending",
  400: "Bad request — invalid JSON body",
  403: "Forbidden — key file not reachable at the site root",
  422: "Unprocessable — URL host mismatch or key/keyLocation mismatch",
  429: "Too Many Requests — throttled, retry later",
};

/** Force any input (path or absolute URL) onto HOST, keep path + query. */
function toFullUrl(input) {
  const raw = String(input).trim();
  if (!raw) return null;
  try {
    const u = raw.startsWith("http")
      ? new URL(raw)
      : new URL(raw.startsWith("/") ? raw : `/${raw}`, `https://${HOST}`);
    return `https://${HOST}${u.pathname}${u.search}`;
  } catch {
    console.warn(`  skip (unparseable): ${raw}`);
    return null;
  }
}

async function urlsFromSitemap() {
  const sitemapUrl = `https://${HOST}/sitemap.xml`;
  const res = await fetch(sitemapUrl);
  if (!res.ok) {
    throw new Error(`sitemap fetch failed: ${res.status} ${sitemapUrl}`);
  }
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!locs.length) throw new Error("no <loc> entries found in sitemap.xml");
  return locs;
}

async function ping(urls) {
  const list = [...new Set(urls.map(toFullUrl).filter(Boolean))];
  if (!list.length) {
    console.error("No valid URLs to submit.");
    process.exit(1);
  }

  const dryRun = process.argv.includes("--dry-run");

  for (let i = 0; i < list.length; i += MAX_URLS) {
    const urlList = list.slice(i, i + MAX_URLS);
    const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };

    console.log(
      `\nSubmitting ${urlList.length} URL(s) to ${ENDPOINT}` +
        (list.length > MAX_URLS ? ` [batch ${i / MAX_URLS + 1}]` : "")
    );
    urlList.forEach((u) => console.log(`  • ${u}`));

    if (dryRun) {
      console.log("\n--dry-run: payload built, nothing sent.");
      console.log(JSON.stringify(body, null, 2));
      continue;
    }

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    const meaning = STATUS[res.status] || "unexpected status";
    console.log(`\n→ HTTP ${res.status} — ${meaning}`);
    if (text.trim()) console.log(`  response body: ${text.trim()}`);
    if (![200, 202].includes(res.status)) process.exitCode = 1;
  }
}

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const useSitemap = process.argv.includes("--sitemap");

if (!useSitemap && args.length === 0) {
  console.error(
    "Usage:\n" +
      "  node scripts/indexnow.mjs <url|path> [more...]\n" +
      "  node scripts/indexnow.mjs --sitemap\n" +
      "  node scripts/indexnow.mjs --dry-run <url|path>"
  );
  process.exit(1);
}

const urls = useSitemap ? await urlsFromSitemap() : args;
await ping(urls);
