"use client";

import Image from "next/image";
import type { PublicationSpread } from "@/lib/work/types";

const secondaryFont = "var(--font-secondary)";

/** Compact desk pile: wider than tall, overlapping left/right with slight vertical drift. */
const SCATTER_LAYOUT = [
  { left: "2%", top: "22%", rotate: -8, z: 1 },
  { left: "24%", top: "8%", rotate: 5, z: 3 },
  { left: "46%", top: "18%", rotate: -4, z: 2 },
  { left: "66%", top: "10%", rotate: 7, z: 4 },
  { left: "8%", top: "48%", rotate: 6, z: 5 },
  { left: "34%", top: "42%", rotate: -6, z: 7 },
  { left: "56%", top: "50%", rotate: 3, z: 6 },
  { left: "72%", top: "38%", rotate: -9, z: 8 },
] as const;

export default function CaseStudyScatteredStack({
  items,
  caption,
}: {
  items: PublicationSpread[];
  caption?: string;
}) {
  if (items.length === 0) return null;

  return (
    <figure className="work-case-figure work-case-scattered">
      <div className="work-case-scattered-stage" aria-hidden={false}>
        {items.map((item, index) => {
          const layout = SCATTER_LAYOUT[index % SCATTER_LAYOUT.length]!;
          return (
            <div
              key={`${item.src}-${index}`}
              className="work-case-scattered-item"
              style={{
                left: layout.left,
                top: layout.top,
                zIndex: layout.z,
                transform: `rotate(${layout.rotate}deg)`,
              }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.intrinsicSize?.width ?? 900}
                height={item.intrinsicSize?.height ?? 700}
                unoptimized
                className="work-case-scattered-image"
                sizes="(max-width: 900px) 42vw, 220px"
              />
            </div>
          );
        })}
      </div>
      {caption ? (
        <figcaption
          className="work-case-caption"
          style={{ fontFamily: secondaryFont }}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
