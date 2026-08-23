"use client";

import { useId, useState } from "react";

const displayFont =
  "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif";
const secondaryFont = "var(--font-secondary)";

export type CaseStudyShowMoreBlock = {
  heading: string;
  paragraphs: string[];
};

export default function CaseStudyShowMore({
  heading,
  blocks,
  closedLabel = "show me more +",
  openLabel = "show less −",
}: {
  heading?: string;
  blocks: CaseStudyShowMoreBlock[];
  closedLabel?: string;
  openLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  if (blocks.length === 0) return null;

  return (
    <div className={`work-case-show-more${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="work-case-show-more__toggle"
        style={{ fontFamily: secondaryFont }}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? openLabel : closedLabel}
      </button>
      <div
        id={panelId}
        className="work-case-show-more__panel"
        hidden={!open}
      >
        {heading ? (
          <h3
            className="work-case-show-more__heading"
            style={{ fontFamily: displayFont }}
          >
            {heading}
          </h3>
        ) : null}
        <div className="work-case-show-more__blocks">
          {blocks.map((block) => (
            <div key={block.heading} className="work-case-show-more__block">
              <h4
                className="work-case-show-more__block-title"
                style={{ fontFamily: displayFont }}
              >
                {block.heading}
              </h4>
              <div
                className="work-case-show-more__block-body"
                style={{ fontFamily: secondaryFont }}
              >
                {block.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
