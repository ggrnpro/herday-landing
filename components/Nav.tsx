"use client";

import { useEffect, useState } from "react";
import { copy } from "@/messages/en";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="container-wide flex items-center justify-between gap-3">
        <a
          href="/"
          className={`flex items-center gap-2.5 transition-all ${
            scrolled ? "glass-strong rounded-full pl-2 pr-4 py-1.5" : ""
          }`}
        >
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-cream font-display text-[15px] font-medium"
            style={{ background: "linear-gradient(135deg, #8A3556, #B04E7A)" }}
          >
            H
          </span>
          <span className="font-display text-[20px] tracking-tight text-ink">
            {copy.brand.name}
          </span>
        </a>

        <nav
          className={`hidden md:flex items-center gap-1 transition-all ${
            scrolled ? "glass-strong rounded-full px-2 py-1" : ""
          }`}
        >
          {[
            { href: "/#voice", label: copy.nav.voice },
            { href: "/#letters", label: copy.nav.letters },
            { href: "/#science", label: copy.nav.science },
            { href: "/#tools", label: copy.nav.tools },
            { href: "/blog", label: "Blog" },
            { href: "/#pricing", label: copy.nav.pricing },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-4 py-2 rounded-full text-[14px] text-ink-soft hover:text-merlot hover:bg-white/50 transition"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="/#cta"
          className="btn-merlot text-[12px] md:text-[14px] py-2 md:py-2.5 px-3.5 md:px-5 shrink-0 whitespace-nowrap"
        >
          <span className="hidden sm:inline">{copy.nav.download}</span>
          <span className="sm:hidden">Waitlist</span>
        </a>
      </div>
    </header>
  );
}
