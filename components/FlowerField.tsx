"use client";

import { Flower } from "./Flower";

type FlowerSpec = {
  top: string;
  left: string;
  size: number;
  variant: "daisy" | "petal" | "small";
  opacity: number;
  spin: "spin" | "spin-rev";
  delay: number;
  duration: number;
};

// Static decorative bed. Lives behind sections, gently floats up-down.
const staticFlowers: FlowerSpec[] = [
  { top: "6%", left: "5%", size: 96, variant: "daisy", opacity: 0.55, spin: "spin", delay: 0, duration: 16 },
  { top: "16%", left: "87%", size: 74, variant: "petal", opacity: 0.5, spin: "spin-rev", delay: 2, duration: 22 },
  { top: "32%", left: "2%", size: 58, variant: "small", opacity: 0.5, spin: "spin", delay: 1, duration: 18 },
  { top: "44%", left: "93%", size: 110, variant: "daisy", opacity: 0.4, spin: "spin-rev", delay: 3, duration: 24 },
  { top: "60%", left: "8%", size: 80, variant: "petal", opacity: 0.55, spin: "spin", delay: 4, duration: 20 },
  { top: "72%", left: "82%", size: 60, variant: "small", opacity: 0.65, spin: "spin-rev", delay: 1.5, duration: 19 },
  { top: "84%", left: "12%", size: 90, variant: "daisy", opacity: 0.5, spin: "spin", delay: 2.5, duration: 21 },
  { top: "92%", left: "75%", size: 70, variant: "petal", opacity: 0.55, spin: "spin-rev", delay: 0.5, duration: 17 },
];

// Drifting cross-screen flowers. Float from one edge to the other in long loops.
// Different durations + offsets so they never feel synced.
type DriftSpec = {
  top: string;
  size: number;
  variant: "daisy" | "petal" | "small";
  opacity: number;
  duration: number;
  delay: number;
  spin: "spin" | "spin-rev";
  reverse?: boolean;
};

const drifters: DriftSpec[] = [
  { top: "12%", size: 36, variant: "small", opacity: 0.6, duration: 80, delay: 0, spin: "spin" },
  { top: "38%", size: 28, variant: "petal", opacity: 0.55, duration: 110, delay: 25, spin: "spin-rev", reverse: true },
  { top: "62%", size: 42, variant: "daisy", opacity: 0.5, duration: 95, delay: 12, spin: "spin" },
  { top: "82%", size: 32, variant: "small", opacity: 0.6, duration: 100, delay: 40, spin: "spin-rev", reverse: true },
];

export function FlowerField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden -z-[5]"
    >
      {/* Static bed */}
      {staticFlowers.map((f, i) => (
        <div
          key={`s-${i}`}
          className="flower"
          style={{
            top: f.top,
            left: f.left,
            animation: `float-y ${f.duration}s var(--ease-soft) infinite`,
            animationDelay: `${f.delay}s`,
          }}
        >
          <Flower
            size={f.size}
            variant={f.variant}
            opacity={f.opacity}
            className={f.spin === "spin" ? "flower-spin" : "flower-spin-rev"}
          />
        </div>
      ))}

      {/* Cross-screen drifters: appear, traverse, disappear. */}
      {drifters.map((d, i) => (
        <div
          key={`d-${i}`}
          className="flower-drifter"
          style={{
            top: d.top,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
            animationDirection: d.reverse ? "reverse" : "normal",
          }}
        >
          <Flower
            size={d.size}
            variant={d.variant}
            opacity={d.opacity}
            className={d.spin === "spin" ? "flower-spin" : "flower-spin-rev"}
          />
        </div>
      ))}
    </div>
  );
}
