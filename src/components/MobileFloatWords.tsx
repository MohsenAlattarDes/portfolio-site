"use client";

import { useEffect, useRef } from "react";
import { mountMobileFloatWords } from "@/lib/mobile-float-words/mountMobileFloatWords";

export default function MobileFloatWords() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    return mountMobileFloatWords(container);
  }, []);

  return (
    <div
      ref={containerRef}
      data-mobile-float-words
      className="lg:hidden fixed inset-0 z-[1] pointer-events-none"
      aria-hidden="true"
    />
  );
}
