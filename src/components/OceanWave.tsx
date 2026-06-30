"use client";

import { useEffect, useRef } from "react";
import { HERO_ASPECT } from "@/lib/ocean-wave/constants";
import { mountOceanWave } from "@/lib/ocean-wave/mountOceanWave";

export default function OceanWave() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    return mountOceanWave(container);
  }, []);

  return (
    <div
      ref={containerRef}
      data-ocean-wave
      className="hidden lg:block relative w-full shrink-0 overflow-hidden"
      style={{ aspectRatio: HERO_ASPECT }}
      aria-label="Ocean wave typographic hero"
      role="img"
    />
  );
}
