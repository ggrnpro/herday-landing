import {
  Body,
  Container,
  Font,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import type { SequenceStep } from "@/lib/email-sequence";
import { avatarUrl, imageUrl, url } from "@/lib/email-sequence";

export type SequenceEmailProps = {
  step: SequenceStep;
  /** First name for the greeting. Optional. */
  name?: string;
  /** Absolute unsubscribe URL (one-click). */
  unsubUrl: string;
};

const cream = "#FEF7DF";
const paper = "#FFF8E9";
const ink = "#1A0E15";
const inkSoft = "#3A2230";
const inkMute = "#6A5360";
const merlot = "#8A3556";
const merlotDeep = "#6B1923";
const line = "rgba(138, 53, 86, 0.12)";

const serif =
  '"Fraunces", "Cormorant Garamond", "Iowan Old Style", Georgia, "Times New Roman", serif';
const sans =
  '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';
const mono = '"JetBrains Mono", ui-monospace, Consolas, monospace';

export function SequenceEmail({ step, name, unsubUrl }: SequenceEmailProps) {
  const greeting = name ? `Hi ${name},` : "Hi,";

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
          fontFamily="Inter"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{step.preview}</Preview>
      <Body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: cream,
          fontFamily: sans,
        }}
      >
        <Container
          style={{ maxWidth: 564, margin: "0 auto", padding: "28px 14px 44px" }}
        >
          {/* Brand wordmark header */}
          <Section style={{ textAlign: "center" as const, padding: "4px 0 22px" }}>
            <Text
              style={{
                margin: 0,
                fontFamily: serif,
                fontStyle: "italic",
                fontSize: 23,
                letterSpacing: "0.01em",
                color: merlot,
              }}
            >
              HerDay
            </Text>
          </Section>

          {/* Card */}
          <Section
            style={{
              backgroundColor: paper,
              backgroundImage: `linear-gradient(180deg, ${paper} 0%, ${cream} 100%)`,
              borderRadius: 22,
              border: `1px solid ${line}`,
              boxShadow: "0 30px 60px -34px rgba(138, 53, 86, 0.30)",
              overflow: "hidden",
            }}
          >
            {/* Hero illustration */}
            <Img
              src={imageUrl(step.image)}
              alt={step.imageAlt}
              width={562}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />

            <Section style={{ padding: "30px 30px 34px" }}>
              <Text
                style={{
                  margin: "0 0 14px",
                  fontFamily: mono,
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: merlot,
                }}
              >
                {step.eyebrow}
              </Text>

              <Text
                style={{
                  margin: "0 0 22px",
                  fontFamily: serif,
                  fontStyle: "italic",
                  fontSize: 30,
                  lineHeight: 1.18,
                  color: ink,
                }}
              >
                {step.headline}
              </Text>

              <Text
                style={{
                  margin: "0 0 16px",
                  fontFamily: sans,
                  fontSize: 16,
                  lineHeight: 1.65,
                  color: inkSoft,
                }}
              >
                {greeting}
              </Text>

              {step.paragraphs.map((p, i) => (
                <Text
                  key={i}
                  style={{
                    margin: "0 0 16px",
                    fontFamily: sans,
                    fontSize: 16,
                    lineHeight: 1.68,
                    color: inkSoft,
                  }}
                >
                  {p}
                </Text>
              ))}

              {step.cta ? (
                <Section style={{ padding: "12px 0 2px" }}>
                  <table role="presentation" cellPadding={0} cellSpacing={0} border={0}>
                    <tr>
                      <td
                        style={{
                          borderRadius: 999,
                          backgroundImage: `linear-gradient(135deg, ${merlot} 0%, ${merlotDeep} 100%)`,
                          boxShadow: "0 14px 28px -14px rgba(138,53,86,0.55)",
                        }}
                      >
                        <Link
                          href={url(step.cta.href)}
                          style={{
                            display: "inline-block",
                            padding: "13px 26px",
                            color: cream,
                            fontFamily: sans,
                            fontSize: 15,
                            fontWeight: 600,
                            textDecoration: "none",
                            borderRadius: 999,
                          }}
                        >
                          {step.cta.label} &nbsp;&rarr;
                        </Link>
                      </td>
                    </tr>
                  </table>
                  {step.cta.note ? (
                    <Text
                      style={{
                        margin: "12px 0 0",
                        fontFamily: serif,
                        fontSize: 13.5,
                        fontStyle: "italic",
                        lineHeight: 1.5,
                        color: inkMute,
                      }}
                    >
                      {step.cta.note}
                    </Text>
                  ) : null}
                </Section>
              ) : null}

              <Hr
                style={{
                  margin: "28px 0 20px",
                  border: "none",
                  borderTop: `1px solid ${line}`,
                }}
              />

              {/* Signature with Lena's photo */}
              <Text
                style={{
                  margin: "0 0 14px",
                  fontFamily: serif,
                  fontStyle: "italic",
                  fontSize: 16,
                  lineHeight: 1.5,
                  color: ink,
                  whiteSpace: "pre-line",
                }}
              >
                {step.signoff}
              </Text>
              <table role="presentation" cellPadding={0} cellSpacing={0} border={0}>
                <tr>
                  <td style={{ verticalAlign: "middle", paddingRight: 12 }}>
                    <Img
                      src={avatarUrl()}
                      alt="Lena Hartwell"
                      width={44}
                      height={44}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 999,
                        display: "block",
                        border: `1px solid ${line}`,
                      }}
                    />
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <Text
                      style={{
                        margin: 0,
                        fontFamily: serif,
                        fontStyle: "italic",
                        fontSize: 16,
                        color: ink,
                      }}
                    >
                      Lena Hartwell
                    </Text>
                    <Text
                      style={{
                        margin: "2px 0 0",
                        fontFamily: mono,
                        fontSize: 10,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: inkMute,
                      }}
                    >
                      Editorial lead, HerDay
                    </Text>
                  </td>
                </tr>
              </table>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={{ padding: "26px 18px 0", textAlign: "center" as const }}>
            <Text
              style={{
                margin: "0 0 10px",
                fontFamily: serif,
                fontStyle: "italic",
                fontSize: 15,
                color: merlot,
              }}
            >
              <span style={{ color: "rgba(138,53,86,0.5)" }}>&#10047;</span>
              &nbsp;&nbsp;The other voice. Yours, but kind.&nbsp;&nbsp;
              <span style={{ color: "rgba(138,53,86,0.5)" }}>&#10047;</span>
            </Text>
            <Text
              style={{
                margin: "0 0 6px",
                fontFamily: sans,
                fontSize: 12.5,
                lineHeight: 1.5,
                color: inkMute,
              }}
            >
              You are getting this because you joined the HerDay waitlist.
            </Text>
            <Text style={{ margin: 0, fontFamily: sans, fontSize: 12.5 }}>
              <Link href={unsubUrl} style={{ color: merlot, textDecoration: "underline" }}>
                Unsubscribe in one click
              </Link>
              <span style={{ color: inkMute }}> &nbsp;·&nbsp; Lisbon, made with care</span>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default SequenceEmail;
