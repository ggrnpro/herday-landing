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

export type InnerCriticEmailProps = {
  name: string;
  criticType: string;
  criticIntent: string;
  translations: string[];
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

export function InnerCriticEmail({
  name,
  criticType,
  criticIntent,
  translations,
  lensLabels,
  sentAtIso,
  appUrl = "https://getherday.app/#cta",
}: InnerCriticEmailProps) {
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
      <Preview>Four kinder translations for {name}.</Preview>
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
                    A translation for {name}
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

            {/* IFS type pill */}
            <Section
              style={{
                marginBottom: 24,
                padding: "20px 22px",
                borderRadius: 16,
                background:
                  "linear-gradient(135deg, #FFEBF6 0%, #F6D7E8 55%, #E6D9FF 100%)",
                border: `1px solid ${line}`,
              }}
            >
              <Text
                style={{
                  margin: 0,
                  fontFamily: monoStack,
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: merlot,
                }}
              >
                That voice sounds like
              </Text>
              <Text
                style={{
                  margin: "6px 0 6px",
                  fontFamily: serifStack,
                  fontSize: 26,
                  fontStyle: "italic",
                  color: ink,
                  lineHeight: 1.15,
                }}
              >
                The {criticType}
              </Text>
              <Text
                style={{
                  margin: 0,
                  fontFamily: serifStack,
                  fontStyle: "italic",
                  fontSize: 15,
                  lineHeight: 1.45,
                  color: inkSoft,
                }}
              >
                It is {criticIntent}.
              </Text>
            </Section>

            <Text
              style={{
                margin: "0 0 18px",
                fontFamily: serifStack,
                fontStyle: "italic",
                fontSize: 22,
                lineHeight: 1.25,
                color: ink,
              }}
            >
              Four kinder translations.
            </Text>

            {translations.map((t, i) => (
              <Section
                key={i}
                style={{
                  marginBottom: 14,
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
                    fontSize: 17,
                    lineHeight: 1.5,
                    color: inkSoft,
                  }}
                >
                  {t}
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
              Want translations like these read in your own voice,
              <br />
              the next time that voice gets loud?
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
            <Text
              style={{
                margin: "8px 0 0",
                fontFamily: serifStack,
                fontSize: 11,
                color: inkMute,
                fontStyle: "italic",
              }}
            >
              HerDay is not therapy. If you are in crisis: 988 (US), 116 123
              (UK), findahelpline.com.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default InnerCriticEmail;
