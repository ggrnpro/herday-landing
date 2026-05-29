import {
  Body,
  Container,
  Font,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

/**
 * Email rendition of the Future Self Letter.
 * Designed to feel like an actual letter on paper, not a marketing email.
 *
 * Constraints:
 * - Inline-style only (handled by @react-email/components).
 * - Max width 560px so it reads naturally on phones.
 * - Fraunces is loaded as a Google web font; falls back to Georgia in clients
 *   that strip @font-face (most notably classic Outlook).
 * - No images. No tracking pixels by default. Resend adds open-tracking
 *   transparently; turn it off per-send if we want absolute silence.
 */

export type FutureSelfLetterEmailProps = {
  name: string;
  body: string;
  signOff: string;
  futureAge: number;
  sentAtIso: string;
  appUrl?: string;
};

const cream = "#FEF7DF";
const paper = "#FFF8E9";
const ink = "#1A0E15";
const inkSoft = "#3E2530";
const inkMute = "#7A6470";
const merlot = "#8A3556";
const merlotDeep = "#6B1923";
const line = "rgba(138, 53, 86, 0.12)";

const serifStack =
  '"Fraunces", "Cormorant Garamond", "Iowan Old Style", "Apple Garamond", Georgia, "Times New Roman", serif';
const monoStack = '"JetBrains Mono", ui-monospace, Consolas, monospace';

function paragraphsFromBody(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function FutureSelfLetterEmail({
  name,
  body,
  signOff,
  futureAge,
  sentAtIso,
  appUrl = "https://getherday.app/#cta",
}: FutureSelfLetterEmailProps) {
  const paragraphs = paragraphsFromBody(body);
  const dateLabel = formatDate(sentAtIso);

  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light only" />
        <Font
          fontFamily="Fraunces"
          fallbackFontFamily="Georgia"
          webFont={{
            url: "https://fonts.gstatic.com/s/fraunces/v37/6NUh8FyLNQOQZAnv9bYOvc7YPDw.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="italic"
        />
        <Font
          fontFamily="Fraunces"
          fallbackFontFamily="Georgia"
          webFont={{
            url: "https://fonts.gstatic.com/s/fraunces/v37/6NUh8FyLNQOQZAnv9bYOvc7YPDw.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>A letter you wrote yourself, ready to be opened.</Preview>
      <Body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: cream,
          fontFamily: serifStack,
        }}
      >
        <Container
          style={{
            maxWidth: 560,
            margin: "0 auto",
            padding: "32px 16px 56px",
          }}
        >
          {/* Paper card */}
          <Section
            style={{
              backgroundColor: paper,
              backgroundImage: `linear-gradient(180deg, ${paper} 0%, ${cream} 100%)`,
              borderRadius: 24,
              border: `1px solid ${line}`,
              boxShadow: "0 28px 56px -32px rgba(138, 53, 86, 0.28)",
              padding: "44px 36px 40px",
            }}
          >
            {/* Eyebrow + date */}
            <table
              role="presentation"
              cellPadding={0}
              cellSpacing={0}
              border={0}
              width="100%"
              style={{ width: "100%", marginBottom: 28 }}
            >
              <tr>
                <td align="left" style={{ verticalAlign: "middle" }}>
                  <Text
                    style={{
                      margin: 0,
                      fontFamily: monoStack,
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: merlot,
                    }}
                  >
                    A letter from your future self
                  </Text>
                </td>
                <td align="right" style={{ verticalAlign: "middle" }}>
                  <Text
                    style={{
                      margin: 0,
                      fontFamily: monoStack,
                      fontSize: 11,
                      color: inkMute,
                    }}
                  >
                    {dateLabel}
                  </Text>
                </td>
              </tr>
            </table>

            {/* Greeting */}
            <Text
              style={{
                margin: "0 0 28px",
                fontFamily: serifStack,
                fontStyle: "italic",
                fontSize: 32,
                lineHeight: 1.2,
                color: merlot,
              }}
            >
              Dear {name},
            </Text>

            {/* Body paragraphs */}
            {paragraphs.map((p, i) => (
              <Text
                key={i}
                style={{
                  margin: "0 0 20px",
                  fontFamily: serifStack,
                  fontSize: 17,
                  lineHeight: 1.7,
                  color: inkSoft,
                  whiteSpace: "pre-wrap",
                }}
              >
                {p}
              </Text>
            ))}

            {/* Sign-off */}
            <Text
              style={{
                margin: "36px 0 6px",
                fontFamily: serifStack,
                fontStyle: "italic",
                fontSize: 19,
                lineHeight: 1.4,
                color: merlot,
              }}
            >
              {signOff}
            </Text>
            <Text
              style={{
                margin: 0,
                fontFamily: monoStack,
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: inkMute,
              }}
            >
              — you, {futureAge}
            </Text>
          </Section>

          {/* Soft conversion section — quiet, not a sales page */}
          <Section
            style={{
              padding: "40px 8px 0",
              textAlign: "center" as const,
            }}
          >
            <Text
              style={{
                margin: "0 0 14px",
                fontFamily: serifStack,
                fontStyle: "italic",
                fontSize: 18,
                lineHeight: 1.45,
                color: ink,
              }}
            >
              Want to hear a letter like this read in your own voice,{" "}
              <br />
              every morning, while the kettle is on?
            </Text>
            <Text style={{ margin: "8px 0 24px" }}>
              <Link
                href={appUrl}
                style={{
                  display: "inline-block",
                  padding: "13px 26px",
                  backgroundColor: merlot,
                  color: cream,
                  fontFamily: serifStack,
                  fontSize: 15,
                  fontWeight: 500,
                  textDecoration: "none",
                  borderRadius: 999,
                  boxShadow: "0 14px 28px -14px rgba(138,53,86,0.5)",
                }}
              >
                Get HerDay
              </Link>
            </Text>

            <Hr
              style={{
                margin: "24px auto 18px",
                width: 48,
                border: "none",
                borderTop: `1px solid ${line}`,
              }}
            />

            <Text
              style={{
                margin: 0,
                fontFamily: monoStack,
                fontSize: 10,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: inkMute,
              }}
            >
              Sent with care from{" "}
              <Link
                href="https://getherday.app"
                style={{ color: merlotDeep, textDecoration: "none" }}
              >
                HerDay
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default FutureSelfLetterEmail;
