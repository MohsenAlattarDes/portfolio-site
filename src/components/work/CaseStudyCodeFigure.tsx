"use client";

import { useEffect, useRef, useState } from "react";
import {
  CaseStudyCodeCanvas,
  CaseStudyCodeControls,
} from "@/components/work/CaseStudyCodeEmbed";
import type { ProjectMedia } from "@/lib/work/types";
import type { AnoraStackSpeed } from "@/lib/work/anora/processStackConfig";
import { useInView } from "@/lib/useInView";

const secondaryFont = "var(--font-secondary)";

type RegenerableHost = HTMLElement & {
  __caseStudyRegenerate?: () => void;
};

function CodeCaption({
  caption,
  onRegenerate,
}: {
  caption: string;
  onRegenerate?: () => void;
}) {
  if (!onRegenerate || !caption.includes("hit R")) {
    return caption;
  }

  const [before, after] = caption.split("hit R");
  return (
    <>
      {before}hit{" "}
      <button
        type="button"
        className="work-case-caption-key"
        aria-label="Regenerate ornament"
        onClick={onRegenerate}
      >
        R
      </button>
      {after}
    </>
  );
}

export default function CaseStudyCodeFigure({ item }: { item: ProjectMedia }) {
  const [speed, setSpeed] = useState<AnoraStackSpeed>("medium");
  const { ref, inView } = useInView<HTMLDivElement>();
  const figureRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const ratio = item.aspectRatio ?? "4 / 3";
  const copies = item.codeSketchCopies ?? 1;
  const showSpeedControls =
    item.codeSketch !== "cake-picnic-ornament" &&
    item.codeSketch !== "cake-workshop-sadu";
  const canRegenerate = item.codeSketch === "cake-picnic-ornament";

  useEffect(() => {
    setMounted(true);
  }, []);

  const regenerate = () => {
    const hosts = figureRef.current?.querySelectorAll<RegenerableHost>(
      ".work-case-code-embed",
    );
    hosts?.forEach((host) => host.__caseStudyRegenerate?.());
  };

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
      ref={figureRef}
      className="work-case-figure work-case-figure--code"
      style={Object.keys(figureStyle).length > 0 ? figureStyle : undefined}
    >
      <div
        ref={ref}
        className="work-case-media-frame work-case-media-frame--code relative flex w-full overflow-hidden"
        style={{ aspectRatio: ratio }}
      >
        {inView && mounted
          ? Array.from({ length: copies }, (_, index) => (
              <div className="relative h-full min-w-0 flex-1" key={index}>
                <CaseStudyCodeCanvas
                  sketchId={item.codeSketch!}
                  alt={`${item.alt} ${index + 1}`}
                  speed={speed}
                />
              </div>
            ))
          : null}
      </div>
      {showSpeedControls ? (
        <CaseStudyCodeControls speed={speed} onSpeedChange={setSpeed} />
      ) : null}
      {item.caption ? (
        <figcaption
          className="work-case-caption work-case-caption--code"
          style={{
            fontFamily: secondaryFont,
            ...(item.captionSpacing ? { marginTop: item.captionSpacing } : {}),
          }}
        >
          <CodeCaption
            caption={item.caption}
            onRegenerate={canRegenerate ? regenerate : undefined}
          />
        </figcaption>
      ) : null}
    </figure>
  );
}
