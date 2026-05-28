import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "HerDay. The other voice, yours, but kind.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "linear-gradient(135deg, #FEF7DF 0%, #FFEBF6 35%, #F6D7E8 70%, #E6D9FF 100%)",
          position: "relative",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -200,
            left: -200,
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,181,210,0.55) 0%, rgba(255,181,210,0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -260,
            right: -180,
            width: 760,
            height: 760,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(230,217,255,0.5) 0%, rgba(230,217,255,0) 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 999,
              background: "#8A3556",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 24,
              fontWeight: 500,
            }}
          >
            H
          </div>
          <span style={{ fontSize: 30, color: "#1A0E15", letterSpacing: -0.5 }}>
            HerDay
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#8A3556",
              fontFamily: "monospace",
              display: "flex",
            }}
          >
            Coming soon · for iPhone
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 88,
              lineHeight: 1.02,
              color: "#1A0E15",
              fontWeight: 400,
              letterSpacing: -2,
            }}
          >
            <span style={{ display: "flex" }}>The other voice.</span>
            <span style={{ display: "flex", fontStyle: "italic", color: "#8A3556", fontWeight: 300 }}>
              Yours, but kind.
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "#3A2230",
              maxWidth: 680,
              display: "flex",
              lineHeight: 1.4,
            }}
          >
            Cloned in 30 seconds. Written for the season you&rsquo;re in. Conditional when you need it.
          </div>
          <div
            style={{
              fontSize: 18,
              color: "#6A5360",
              fontFamily: "monospace",
              display: "flex",
            }}
          >
            herday.app
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
