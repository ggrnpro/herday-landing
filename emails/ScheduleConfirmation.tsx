import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export type ScheduleConfirmationProps = {
  name: string;
  scheduledForLabel: string;
};

const cream = "#FEF7DF";
const paper = "#FFF8E9";
const ink = "#1A0E15";
const inkMute = "#7A6470";
const merlot = "#8A3556";
const line = "rgba(138, 53, 86, 0.12)";

const serifStack =
  '"Fraunces", "Cormorant Garamond", "Iowan Old Style", Georgia, "Times New Roman", serif';
const monoStack = '"JetBrains Mono", ui-monospace, Consolas, monospace';

export function ScheduleConfirmationEmail({
  name,
  scheduledForLabel,
}: ScheduleConfirmationProps) {
  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="light only" />
      </Head>
      <Preview>Your letter is sealed.</Preview>
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
            maxWidth: 520,
            margin: "0 auto",
            padding: "48px 16px 56px",
          }}
        >
          <Section
            style={{
              backgroundColor: paper,
              backgroundImage: `linear-gradient(180deg, ${paper} 0%, ${cream} 100%)`,
              borderRadius: 24,
              border: `1px solid ${line}`,
              boxShadow: "0 28px 56px -32px rgba(138, 53, 86, 0.22)",
              padding: "40px 32px 36px",
              textAlign: "center" as const,
            }}
          >
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
              Sealed
            </Text>

            <Text
              style={{
                margin: "20px 0 0",
                fontFamily: serifStack,
                fontStyle: "italic",
                fontSize: 26,
                lineHeight: 1.25,
                color: ink,
              }}
            >
              Hello, {name}. Your letter is on its way to{" "}
              <span style={{ color: merlot }}>{scheduledForLabel}</span>.
            </Text>

            <Text
              style={{
                margin: "18px 0 0",
                fontFamily: serifStack,
                fontSize: 15,
                lineHeight: 1.6,
                color: inkMute,
              }}
            >
              We&rsquo;ll deliver it to this inbox on the morning of your chosen
              date. Until then, try to forget about it.
            </Text>
          </Section>

          <Section style={{ padding: "32px 8px 0", textAlign: "center" }}>
            <Text style={{ margin: "0 0 18px", fontFamily: serifStack, fontStyle: "italic", fontSize: 16, color: ink }}>
              Want a letter like this in your own voice — every morning?
            </Text>
            <Text style={{ margin: 0 }}>
              <Link
                href="https://getherday.app/#cta"
                style={{
                  display: "inline-block",
                  padding: "12px 24px",
                  backgroundColor: merlot,
                  color: cream,
                  fontFamily: serifStack,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  borderRadius: 999,
                  boxShadow: "0 14px 28px -14px rgba(138,53,86,0.5)",
                }}
              >
                Get HerDay
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default ScheduleConfirmationEmail;
