"use client";

import { motion, useInView, type Variants } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  once?: boolean;
};

/**
 * Reveal renders content visible by default (SSR + no-JS + screenshot tools see it),
 * and animates in once when scrolled into view OR after a short mount fallback.
 * This avoids the trap where IntersectionObserver-based reveals leave content
 * invisible during Playwright fullPage captures, Lighthouse audits, etc.
 */
export function Reveal({ children, delay = 0, className = "", y = 24, once = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-40px 0px -40px 0px" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fallback: if observer never fires (e.g. headless screenshot, prerender),
  // animate after a brief mount delay so nothing gets stuck at opacity 0.
  const [forceVisible, setForceVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setForceVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const visible = inView || forceVisible || !mounted;

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : y,
        filter: visible ? "blur(0px)" : "blur(4px)",
      }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const staggerVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function StaggerReveal({
  children,
  className = "",
  stagger = 0.08,
}: {
  children: ReactNode[];
  className?: string;
  stagger?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px 0px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children.map((child, i) => (
        <motion.div key={i} variants={staggerVariants} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
