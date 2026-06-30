"use client";

import { useEffect, useRef } from "react";
import {
  mountExperiment,
  type SketchFactory,
} from "@/lib/code-sketches/mountExperiment";

type Props = {
  id: string;
  title: string;
  description: string;
  hint: string;
  framed?: boolean;
  game?: boolean;
  immersive?: boolean;
  createSketch: SketchFactory;
};

export default function CodeExperiment({
  id,
  title,
  description,
  hint,
  framed = false,
  game = false,
  immersive = false,
  createSketch,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    return mountExperiment(container, createSketch);
  }, [createSketch]);

  return (
    <article
      id={id}
      className="border border-[var(--border)] bg-[var(--surface)]"
    >
      <div className="px-5 py-4 md:px-6 md:py-5 border-b border-[var(--border)]">
        <h2
          className="text-[var(--red)] text-lg md:text-xl uppercase tracking-tight mb-2"
          style={{
            fontFamily: "var(--font-secondary)",
            fontWeight: 900,
          }}
        >
          {title}
        </h2>
        <p className="text-[var(--fg-subtle)] text-sm md:text-base leading-relaxed max-w-3xl">
          {description}
        </p>
        <p
          className="text-[var(--fg-muted)] text-xs md:text-sm mt-2 uppercase tracking-widest"
          style={{ fontFamily: "var(--font-secondary)" }}
        >
          {hint}
        </p>
      </div>
      <div
        className={framed ? "relative pl-5 pb-5" : "relative"}
        style={
          immersive
            ? { aspectRatio: "5 / 3", minHeight: "min(72vh, 680px)" }
            : { aspectRatio: "2 / 1", minHeight: "220px" }
        }
      >
        {framed ? (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 bottom-5 w-px bg-[var(--red)]/30"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-[var(--red)]/30"
            />
          </>
        ) : null}
        <div
          ref={containerRef}
          data-code-experiment
          className={`relative w-full h-full overflow-hidden bg-[var(--bg)] ${
            game ? "cursor-default" : "cursor-crosshair"
          }`}
          aria-label={`${title} interactive sketch`}
          role="img"
        />
      </div>
    </article>
  );
}
