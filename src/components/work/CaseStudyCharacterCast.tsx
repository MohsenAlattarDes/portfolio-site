"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useTheme } from "@/components/ThemeProvider";
import type { PublicationSpread } from "@/lib/work/types";

const secondaryFont = "var(--font-secondary)";
const CYCLE_MS = 3800;
const PEEL_MS = 420;

const SLAP_FROM = [
  { rot: -12, x: "-0.7rem" },
  { rot: 11, x: "0.75rem" },
  { rot: -9, x: "-0.55rem" },
] as const;

const NAME_COLORS = {
  salem: { light: "#1a586d", dark: "#7eb8cb" },
  hala: { light: "#4b005e", dark: "#c99ad8" },
  simsim: { light: "#2b3905", dark: "#a8b86a" },
} as const;

function nameColor(label: string, theme: "light" | "dark") {
  const key = label.trim().toLowerCase() as keyof typeof NAME_COLORS;
  const pair = NAME_COLORS[key];
  if (!pair) return "var(--fg)";
  return pair[theme];
}

function castName(item: PublicationSpread) {
  return item.alt.replace(/ character illustration$/i, "");
}

export default function CaseStudyCharacterCast({
  items,
  caption,
}: {
  items: PublicationSpread[];
  caption?: string;
}) {
  const { theme } = useTheme();
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (items.length < 2 || reducedMotion) return;

    const id = window.setInterval(() => {
      const current = indexRef.current;
      setPrevIndex(current);
      setIndex((current + 1) % items.length);
    }, CYCLE_MS);

    return () => window.clearInterval(id);
  }, [items.length, reducedMotion]);

  useEffect(() => {
    if (prevIndex == null) return;
    const id = window.setTimeout(() => setPrevIndex(null), PEEL_MS);
    return () => window.clearTimeout(id);
  }, [prevIndex, index]);

  if (items.length === 0) return null;

  const active = items[index]!;
  const leaving = prevIndex != null ? items[prevIndex] : null;
  const slap = SLAP_FROM[index % SLAP_FROM.length]!;
  const leaveSlap = SLAP_FROM[(prevIndex ?? 0) % SLAP_FROM.length]!;
  const name = castName(active);

  return (
    <figure className="work-case-figure work-case-cast">
      <div className="work-case-cast-stage" aria-live="polite">
        {leaving && !reducedMotion ? (
          <div
            key={`leave-${prevIndex}-${index}`}
            className="work-case-cast-slide is-leaving"
            style={
              {
                "--cast-leave-rot": `${leaveSlap.rot * 0.55}deg`,
                "--cast-leave-x": leaveSlap.x,
              } as CSSProperties
            }
            aria-hidden
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={leaving.src}
              alt=""
              className="work-case-cast-image"
              decoding="async"
            />
          </div>
        ) : null}
        <div
          key={`enter-${active.src}-${index}`}
          className={`work-case-cast-slide${reducedMotion ? " is-static" : " is-slapping"}`}
          style={
            {
              "--cast-from-rot": `${slap.rot}deg`,
              "--cast-from-x": slap.x,
            } as CSSProperties
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={active.src}
            alt={active.alt}
            className="work-case-cast-image"
            decoding="async"
            loading="eager"
          />
        </div>
      </div>
      {/* Preload the rest so swaps stay hitch-free */}
      <div className="work-case-cast-preload" aria-hidden>
        {items.map((item) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={`preload-${item.src}`} src={item.src} alt="" />
        ))}
      </div>
      <p
        key={`name-${index}`}
        className={`work-case-cast-name${reducedMotion ? "" : " is-slapping"}`}
        style={{ fontFamily: secondaryFont, color: nameColor(name, theme) }}
      >
        {name}
      </p>
      {caption ? (
        <figcaption
          className="work-case-caption work-case-cast-caption"
          style={{ fontFamily: secondaryFont }}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
