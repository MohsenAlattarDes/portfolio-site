"use client";

import { useEffect, useRef } from "react";
import {
  createAnoraProcessStack,
  createLagProcessStack,
} from "@/lib/code-sketches/experiments/anoraProcessStack";
import { createCakePicnicOrnament } from "@/lib/code-sketches/experiments/cakePicnicOrnament";
import { createCakeWorkshopSadu } from "@/lib/code-sketches/experiments/cakeWorkshopSadu";
import { mountExperiment } from "@/lib/code-sketches/mountExperiment";
import {
  ANORA_STACK_SPEEDS,
  ANORA_STACK_SPEED_PRESETS,
  type AnoraStackSpeed,
} from "@/lib/work/anora/processStackConfig";
import type { CaseStudyCodeSketchId } from "@/lib/work/types";

const SKETCHES = {
  "anora-process-stack": createAnoraProcessStack,
  "lag-process-stack": createLagProcessStack,
  "cake-picnic-ornament": createCakePicnicOrnament,
  "cake-workshop-sadu": createCakeWorkshopSadu,
} as const;

export function CaseStudyCodeControls({
  speed,
  onSpeedChange,
}: {
  speed: AnoraStackSpeed;
  onSpeedChange: (speed: AnoraStackSpeed) => void;
}) {
  return (
    <div
      className="work-case-code-controls"
      role="group"
      aria-label="Stack animation speed"
    >
      {ANORA_STACK_SPEEDS.map((option) => (
        <button
          key={option}
          type="button"
          className={`work-case-code-control${speed === option ? " work-case-code-control--active" : ""}`}
          aria-pressed={speed === option}
          onClick={() => onSpeedChange(option)}
        >
          {ANORA_STACK_SPEED_PRESETS[option].label}
        </button>
      ))}
    </div>
  );
}

export function CaseStudyCodeCanvas({
  sketchId,
  alt,
  speed,
}: {
  sketchId: CaseStudyCodeSketchId;
  alt: string;
  speed: AnoraStackSpeed;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const createSketch = SKETCHES[sketchId];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    return mountExperiment(container, createSketch);
  }, [createSketch]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.dataset.speed = speed;
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className="work-case-code-embed absolute inset-0 h-full w-full"
      data-speed={speed}
      aria-label={alt}
      role="img"
    />
  );
}
