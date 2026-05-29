import { ImageResponse } from "next/og";

export const runtime = "edge";

/**
 * Generates a 1080x1080 PNG of a single pull quote, ready for IG/social.
 *
 * Loads Fraunces (italic 400) + JetBrains Mono (500) from Google Fonts
 * so the rendered PNG matches the brand serif/mono, not a default sans
 * fallback. Font fetches are memoized at module scope so each warm
 * Edge worker pays the cost once.
 *
 * Query params:
 *   q  — the quote (required, max 240 chars)
 *   n  — the author display name (default "you")
 *   a  — the future age signature (optional)
 *
 * Designed to download in browsers via <a href download>. Cacheable.
 */

async function loadGoogleFont(
  family: string,
  italic: boolean,
  weight: number,
): Promise<ArrayBuffer> {
  const familyParam = family.replace(/ /g, "+");
  const axes = italic
    ? `ital,wght@1,${weight}`
    : `wght@${weight}`;
  const cssUrl = `https://fonts.googleapis.com/css2?family=${familyParam}:${axes}&display=swap`;

  const cssRes = await fetch(cssUrl, {
    headers: {
      // Force woff (NOT woff2) — next/og's font parser rejects woff2.
      // IE 9-11 UA triggers Google Fonts to serve woff format.
      "User-Agent":
        "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
    },
  });
  if (!cssRes.ok) {
    throw new Error(`Google Fonts CSS ${cssRes.status} for ${family}`);
  }
  const css = await cssRes.text();
  const match = css.match(
    /src:\s*url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)\s*format\(['"]?(woff2?|truetype)['"]?\)/,
  );
  if (!match) {
    throw new Error(`Could not parse font URL from CSS for ${family}`);
  }
  const fontRes = await fetch(match[1]);
  if (!fontRes.ok) {
    throw new Error(`Font binary ${fontRes.status} for ${family}`);
  }
  return await fontRes.arrayBuffer();
}

let frauncesItalicPromise: Promise<ArrayBuffer> | null = null;
let monoPromise: Promise<ArrayBuffer> | null = null;

function getFrauncesItalic() {
  return (frauncesItalicPromise ??= loadGoogleFont("Fraunces", true, 400));
}
function getMono() {
  return (monoPromise ??= loadGoogleFont("JetBrains Mono", false, 500));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const rawQuote = (url.searchParams.get("q") || "").slice(0, 240);
  const name = (url.searchParams.get("n") || "you").slice(0, 60);
  const age = (url.searchParams.get("a") || "").slice(0, 6);
  const quote = rawQuote.replace(/^[“”"']+|[“”"']+$/g, "").trim();

  if (!quote) {
    return new Response("missing q", { status: 400 });
  }

  let fraunces: ArrayBuffer;
  let mono: ArrayBuffer;
  try {
    [fraunces, mono] = await Promise.all([getFrauncesItalic(), getMono()]);
  } catch (e) {
    console.error("font load failed", e);
    return new Response("font load failed", { status: 500 });
  }

  // Size the quote text relative to its length so long quotes still fit.
  const quoteFontSize = quote.length > 160 ? 50 : quote.length > 100 ? 60 : 70;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "linear-gradient(135deg, #FFEBF6 0%, #F6D7E8 45%, #E6D9FF 100%)",
          position: "relative",
          fontFamily: "Fraunces",
        }}
      >
        {/* drifting blob, top-right */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -140,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,181,210,0.75) 0%, rgba(255,181,210,0) 70%)",
            display: "flex",
          }}
        />
        {/* second blob, bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -180,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(230,217,255,0.55) 0%, rgba(230,217,255,0) 70%)",
            display: "flex",
          }}
        />

        {/* eyebrow */}
        <div
          style={{
            display: "flex",
            fontFamily: "JetBrainsMono",
            fontSize: 22,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: "#8A3556",
          }}
        >
          A letter from my future self
        </div>

        {/* quote */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            maxWidth: 900,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -110,
              left: -10,
              fontSize: 240,
              lineHeight: 1,
              color: "rgba(138,53,86,0.22)",
              fontFamily: "Fraunces",
              fontStyle: "italic",
              display: "flex",
            }}
          >
            &ldquo;
          </div>
          <div
            style={{
              fontSize: quoteFontSize,
              lineHeight: 1.25,
              color: "#1A0E15",
              fontFamily: "Fraunces",
              fontStyle: "italic",
              fontWeight: 400,
              letterSpacing: -0.5,
              display: "flex",
            }}
          >
            {quote}
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 32,
              color: "#1A0E15",
              fontFamily: "Fraunces",
              fontStyle: "italic",
            }}
          >
            — {name}
            {age ? `, ${age}` : ""}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#8A3556",
              fontFamily: "JetBrainsMono",
            }}
          >
            getherday.app
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
      fonts: [
        {
          name: "Fraunces",
          data: fraunces,
          style: "italic",
          weight: 400,
        },
        {
          name: "JetBrainsMono",
          data: mono,
          style: "normal",
          weight: 500,
        },
      ],
    },
  );
}
