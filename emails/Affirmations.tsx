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

export type AffirmationsEmailProps = {
  name: string;
  affirmations: string[];
  lensLabels: string[];
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

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function AffirmationsEmail({
  name,
  affirmations,
  lensLabels,
  sentAtIso,
  appUrl = "https://getherday.app/#cta",
}: AffirmationsEmailProps) {
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
      </Head>
      <Preview>Five small true things for {name}, today.</Preview>
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
          <Section
            style={{
              backgroundColor: paper,
              backgroundImage: `linear-gradient(180deg, ${paper} 0%, ${cream} 100%)`,
              borderRadius: 24,
              border: `1px solid ${line}`,
              boxShadow: "0 28px 56px -32px rgba(138, 53, 86, 0.28)",
              padding: "40px 32px 32px",
            }}
          >
            <table
              role="presentation"
              cellPadding={0}
              cellSpacing={0}
              border={0}
              width="100%"
              style={{ width: "100%", marginBottom: 24 }}
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
                    Five for {name}
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

            <Text
              style={{
                margin: "0 0 28px",
                fontFamily: serifStack,
                fontStyle: "italic",
                fontSize: 28,
                lineHeight: 1.2,
                color: ink,
              }}
            >
              Five small true things to carry today.
            </Text>

            {affirmations.map((a, i) => (
              <Section
                key={i}
                style={{
                  marginBottom: 18,
                  padding: "18px 20px",
                  borderRadius: 16,
                  border: `1px solid ${line}`,
                  backgroundColor: "rgba(255,255,255,0.4)",
                }}
              >
                <Text
                  style={{
                    margin: "0 0 8px",
                    fontFamily: monoStack,
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: merlot,
                  }}
                >
                  {lensLabels[i] || `Lens ${i + 1}`}
                </Text>
                <Text
                  style={{
                    margin: 0,
                    fontFamily: serifStack,
                    fontStyle: "italic",
                    fontSize: 18,
                    lineHeight: 1.45,
                    color: inkSoft,
                  }}
                >
                  {a}
                </Text>
              </Section>
            ))}
          </Section>

          <Section
            style={{
              padding: "32px 8px 0",
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
              Want a set like this read in your own voice,
              <br />
              every morning, while the kettle is on?
            </Text>
            <Text style={{ margin: "8px 0 22px" }}>
              <Link
                href={appUrl}
                style={{
                  display: "inline-block",
                  padding: "12px 24px",
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
                margin: "20px auto 16px",
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

export default AffirmationsEmail;
