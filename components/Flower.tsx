import { CSSProperties } from "react";

type Props = {
  size?: number;
  className?: string;
  style?: CSSProperties;
  variant?: "daisy" | "petal" | "small";
  opacity?: number;
};

export function Flower({ size = 80, className = "", style, variant = "daisy", opacity = 0.6 }: Props) {
  if (variant === "petal") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        className={className}
        style={{ opacity, ...style }}
        aria-hidden="true"
      >
        <g>
          {Array.from({ length: 6 }).map((_, i) => (
            <ellipse
              key={i}
              cx="50"
              cy="22"
              rx="9"
              ry="22"
              fill="white"
              transform={`rotate(${i * 60} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="6" fill="#FFB5D2" />
        </g>
      </svg>
    );
  }

  if (variant === "small") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        className={className}
        style={{ opacity, ...style }}
        aria-hidden="true"
      >
        <g>
          {Array.from({ length: 5 }).map((_, i) => (
            <circle
              key={i}
              cx="50"
              cy="25"
              r="14"
              fill="white"
              transform={`rotate(${i * 72} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="9" fill="#FFEBF6" />
        </g>
      </svg>
    );
  }

  // daisy (default)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      style={{ opacity, ...style }}
      aria-hidden="true"
    >
      <g>
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={i}
            cx="50"
            cy="20"
            rx="8"
            ry="18"
            fill="white"
            transform={`rotate(${i * 45} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="8" fill="#FFD580" opacity="0.9" />
      </g>
    </svg>
  );
}
