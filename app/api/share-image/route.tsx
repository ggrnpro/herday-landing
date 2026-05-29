import { ImageResponse } from "next/og";

export const runtime = "edge";

/**
 * Generates a 1080x1080 PNG of a single pull quote, ready for IG/social.
 * Query params:
 *   q  — the quote (required, max 240 chars)
 *   n  — the author display name (default "you")
 *   a  — the future age signature (default omitted)
 *
 * Example: /api/share-image?q=Soft%20on%20a%20Tuesday&n=Anna&a=27
 *
 * Designed to download in browsers via <a href download>. Cacheable.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const rawQuote = (url.searchParams.get("q") || "").slice(0, 240);
  const name = (url.searchParams.get("n") || "you").slice(0, 60);
  const age = (url.searchParams.get("a") || "").slice(0, 6);

  // Strip surrounding quotes if present; we add our own opening glyph.
  const quote = rawQuote.replace(/^[“”"']+|[“”"']+$/g, "").trim();

  if (!quote) {
    return new Response("missing q", { status: 400 });
  }

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
          fontFamily: "serif",
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
            fontFamily: "monospace",
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
          }}
        >
          <span
            style={{
              position: "absolute",
              top: -60,
              left: -20,
              fontSize: 200,
              lineHeight: 1,
              color: "rgba(138,53,86,0.25)",
              fontStyle: "italic",
              display: "flex",
            }}
          >
            &ldquo;
          </span>
          <div
            style={{
              fontSize: quote.length > 160 ? 50 : quote.length > 100 ? 60 : 70,
              lineHeight: 1.25,
              color: "#1A0E15",
              fontStyle: "italic",
              fontWeight: 400,
              letterSpacing: -0.5,
              maxWidth: 880,
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
              fontStyle: "italic",
              fontFamily: "serif",
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
              fontFamily: "monospace",
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
    },
  );
}
