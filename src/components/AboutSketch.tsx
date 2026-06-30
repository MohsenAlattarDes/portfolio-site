"use client";

import { useEffect, useRef, useState } from "react";
import { mountExperiment } from "@/lib/code-sketches/mountExperiment";
import { createAboutSketch } from "@/lib/about/createAboutSketch";

export default function AboutSketch() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const container = ref.current;
    if (!enabled || !container) return;
    return mountExperiment(container, createAboutSketch);
  }, [enabled]);

  useEffect(() => {
    const sketch = ref.current;
    if (!enabled || !sketch) return;

    const page = sketch.closest(".about-layout");
    if (!page) return;

    const syncPointer = (event: Event) => {
      const e = event as PointerEvent;
      const rect = sketch.getBoundingClientRect();
      sketch.dataset.mx = String(e.clientX - rect.left);
      sketch.dataset.my = String(e.clientY - rect.top);
    };

    const resetPointer = () => {
      sketch.dataset.mx = "-1";
      sketch.dataset.my = "-1";
    };

    page.addEventListener("pointermove", syncPointer);
    page.addEventListener("pointerleave", resetPointer);

    return () => {
      page.removeEventListener("pointermove", syncPointer);
      page.removeEventListener("pointerleave", resetPointer);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      className="about-sketch"
      aria-hidden="true"
      data-mx="-1"
      data-my="-1"
    />
  );
}
