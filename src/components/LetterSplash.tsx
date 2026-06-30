"use client";

import { useEffect, useRef } from "react";
import { HERO_ASPECT } from "@/lib/letter-splash/constants";
import { mountLetterSplash } from "@/lib/letter-splash/mountSketch";

/** Preserved mesh + letter-splash hero — swap back on the home page when needed. */
export default function LetterSplash() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    return mountLetterSplash(container);
  }, []);

  return (
    <div
      ref={containerRef}
      data-letter-splash
      className="hidden lg:block relative w-full shrink-0 overflow-hidden bg-[var(--bg)] cursor-none"
      style={{ aspectRatio: HERO_ASPECT }}
      aria-label="Letter splash interactive hero"
      role="img"
    />
  );
}
