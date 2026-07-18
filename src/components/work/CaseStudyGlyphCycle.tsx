import AnoraGlyphCycle from "@/components/work/AnoraGlyphCycle";
import type { ProjectMedia } from "@/lib/work/types";

export default function CaseStudyGlyphCycle({ item }: { item: ProjectMedia }) {
  return (
    <figure className="work-case-figure work-case-figure--glyph-cycle">
      <AnoraGlyphCycle
        glyphs={item.glyphs}
        excludeGlyphs={item.glyphExclude}
        intervalMs={item.glyphIntervalMs}
      />
      {item.caption ? (
        <figcaption className="work-case-caption">{item.caption}</figcaption>
      ) : null}
    </figure>
  );
}
