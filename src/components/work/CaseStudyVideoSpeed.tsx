"use client";

import { useState } from "react";
import CaseStudyLoopVideo from "@/components/work/CaseStudyLoopVideo";
import type { ProjectMedia } from "@/lib/work/types";

const secondaryFont = "var(--font-secondary)";

type VideoSpeed = "slow" | "medium" | "fast";

const SPEEDS: { id: VideoSpeed; label: string; rate: number }[] = [
  { id: "slow", label: "Slow", rate: 0.35 },
  { id: "medium", label: "Medium", rate: 0.6 },
  { id: "fast", label: "Fast", rate: 1 },
];

export default function CaseStudyVideoSpeed({ item }: { item: ProjectMedia }) {
  const [speed, setSpeed] = useState<VideoSpeed>("medium");
  const rate = SPEEDS.find((option) => option.id === speed)!.rate;

  const figureStyle = {
    ...(item.maxWidth ? { maxWidth: item.maxWidth, width: "100%" } : {}),
    ...(item.spacingTop ? { marginTop: item.spacingTop } : {}),
    ...(item.align === "center"
      ? { alignSelf: "center" }
      : item.align === "start"
        ? { alignSelf: "flex-start" }
        : item.align === "end"
          ? { alignSelf: "flex-end" }
          : {}),
  };

  return (
    <figure
      className="work-case-figure"
      style={Object.keys(figureStyle).length > 0 ? figureStyle : undefined}
    >
      <div
        className={`work-case-media-frame relative w-full${item.transparent ? " work-case-media-frame--transparent" : ""}${item.paperShadow ? " work-case-media-frame--paper-scan" : ""}${item.bare ? "" : " work-grey-box"}`}
        style={{ aspectRatio: item.aspectRatio ?? "4 / 3" }}
      >
        <CaseStudyLoopVideo
          item={item}
          className="absolute inset-0 h-full w-full object-contain object-center"
          playbackRate={rate}
        />
      </div>
      <div
        className="work-case-video-controls"
        role="group"
        aria-label="Playback speed"
      >
        {SPEEDS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`work-case-code-control${speed === option.id ? " work-case-code-control--active" : ""}`}
            aria-pressed={speed === option.id}
            onClick={() => setSpeed(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {item.caption ? (
        <figcaption
          className="work-case-caption"
          style={{
            fontFamily: secondaryFont,
            ...(item.captionSpacing ? { marginTop: item.captionSpacing } : {}),
          }}
        >
          {item.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
