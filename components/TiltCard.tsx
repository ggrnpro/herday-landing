"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  href?: string;
  ariaDisabled?: boolean;
};

/**
 * 3D tilt card primitive — adapted from 21st.dev "Interactive Card".
 * Renders <motion.a> when href provided, else <motion.div>.
 * Pointer position drives rotateX / rotateY via spring-smoothed motion values.
 * Children may use `transform: translateZ(...)` for parallax depth.
 */
export function TiltCard({
  children,
  className,
  style,
  href,
  ariaDisabled,
}: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  const rotateX = useTransform(sy, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(sx, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const motionStyle = {
    ...style,
    rotateX,
    rotateY,
    transformStyle: "preserve-3d" as const,
    transformPerspective: 1000,
  };

  if (href) {
    return (
      <motion.a
        href={href}
        className={className}
        style={motionStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{
          y: -8,
          scale: 1.02,
          boxShadow: "0 36px 70px -28px rgba(138, 53, 86, 0.45)",
        }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.div
      aria-disabled={ariaDisabled}
      className={className}
      style={motionStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
