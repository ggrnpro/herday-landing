"use client";

import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0.5, y: 0.5 });
  const currentRef = useRef({ x: 0.5, y: 0.5 });
  const scrollRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleMove = (e: PointerEvent) => {
      targetRef.current.x = e.clientX / window.innerWidth;
      targetRef.current.y = e.clientY / window.innerHeight;
    };

    const handleScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollRef.current = Math.min(1, window.scrollY / max);
    };

    const tick = () => {
      const t = targetRef.current;
      const c = currentRef.current;
      c.x += (t.x - c.x) * 0.05;
      c.y += (t.y - c.y) * 0.05;
      const root = rootRef.current;
      if (root) {
        root.style.setProperty("--mx", `${(c.x * 100).toFixed(2)}%`);
        root.style.setProperty("--my", `${(c.y * 100).toFixed(2)}%`);
        root.style.setProperty("--mxf", c.x.toFixed(3));
        root.style.setProperty("--myf", c.y.toFixed(3));
        root.style.setProperty("--scroll", scrollRef.current.toFixed(3));
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    if (!reduced) {
      window.addEventListener("pointermove", handleMove, { passive: true });
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={rootRef} className="fog-layer" aria-hidden="true">
      <div className="fog-blob fog-1" />
      <div className="fog-blob fog-2" />
      <div className="fog-blob fog-3" />
      <div className="fog-blob fog-4" />
      <div className="fog-blob fog-5" />
      <div className="fog-blob fog-6" />
      <div className="fog-blob fog-7" />
      <div className="fog-mouse" />
    </div>
  );
}
