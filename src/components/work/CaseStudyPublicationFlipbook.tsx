"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PublicationSpread } from "@/lib/work/types";

const secondaryFont = "var(--font-secondary)";
const FLIP_MS = 620;

type View = {
  left: PublicationSpread | null;
  right: PublicationSpread | null;
};

type Flip = {
  dir: "next" | "prev";
  frontSrc: string;
  frontAlt: string;
  backSrc: string;
  backAlt: string;
  baseLeft: PublicationSpread | null;
  baseRight: PublicationSpread | null;
};

function PageImage({
  page,
  priority = false,
}: {
  page: PublicationSpread;
  priority?: boolean;
}) {
  return (
    <Image
      src={page.src}
      alt={page.alt}
      width={page.intrinsicSize?.width ?? 1639}
      height={page.intrinsicSize?.height ?? 2155}
      unoptimized
      priority={priority}
      className="work-case-flipbook__image"
      sizes="(max-width: 768px) 50vw, 30vw"
    />
  );
}

export default function CaseStudyPublicationFlipbook({
  spreads,
  caption,
}: {
  spreads: PublicationSpread[];
  caption?: string;
}) {
  const views = useMemo<View[]>(() => {
    if (spreads.length === 0) return [];

    const built: View[] = [{ left: null, right: spreads[0]! }];
    for (let i = 1; i < spreads.length - 1; i += 2) {
      built.push({ left: spreads[i] ?? null, right: spreads[i + 1] ?? null });
    }
    if (spreads.length > 1) {
      built.push({ left: spreads[spreads.length - 1]!, right: null });
    }
    return built;
  }, [spreads]);

  const [index, setIndex] = useState(4);
  const [flip, setFlip] = useState<Flip | null>(null);
  const touchStartX = useRef<number | null>(null);
  const total = views.length;
  const view = views[index]!;

  const goNext = useCallback(() => {
    if (flip || index >= total - 1) return;
    const nextView = views[index + 1]!;
    setFlip({
      dir: "next",
      frontSrc: view.right?.src ?? "",
      frontAlt: view.right?.alt ?? "",
      backSrc: nextView.left?.src ?? "",
      backAlt: nextView.left?.alt ?? "",
      baseLeft: view.left,
      baseRight: nextView.right,
    });
  }, [flip, index, total, view, views]);

  const goPrev = useCallback(() => {
    if (flip || index <= 0) return;
    const prevView = views[index - 1]!;
    setFlip({
      dir: "prev",
      frontSrc: view.left?.src ?? "",
      frontAlt: view.left?.alt ?? "",
      backSrc: prevView.right?.src ?? "",
      backAlt: prevView.right?.alt ?? "",
      baseLeft: prevView.left,
      baseRight: view.right,
    });
  }, [flip, index, view, views]);

  useEffect(() => {
    if (!flip) return;
    const timer = window.setTimeout(() => {
      setIndex((current) => (flip.dir === "next" ? current + 1 : current - 1));
      setFlip(null);
    }, FLIP_MS);
    return () => window.clearTimeout(timer);
  }, [flip]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev]);

  const counter =
    index === 0
      ? "Cover"
      : index === total - 1
        ? "Back cover"
        : `${spreads.indexOf(view.left!) + 1}–${spreads.indexOf(view.right!) + 1} / ${spreads.length}`;

  const baseLeft = flip ? flip.baseLeft : view.left;
  const baseRight = flip ? flip.baseRight : view.right;

  const neighborPreload = useMemo(() => {
    const items: PublicationSpread[] = [];
    [index - 1, index + 1].forEach((i) => {
      const neighbor = views[i];
      if (!neighbor) return;
      if (neighbor.left) items.push(neighbor.left);
      if (neighbor.right) items.push(neighbor.right);
    });
    return items;
  }, [index, views]);

  return (
    <figure className="work-case-figure work-case-figure--flipbook">
      <div
        className="work-case-flipbook"
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const startX = touchStartX.current;
          const endX = event.changedTouches[0]?.clientX;
          touchStartX.current = null;
          if (startX == null || endX == null) return;
          const delta = endX - startX;
          if (Math.abs(delta) < 40) return;
          if (delta < 0) goNext();
          else goPrev();
        }}
      >
        <div className="work-case-flipbook__book" aria-live="polite">
          <div className="work-case-flipbook__side work-case-flipbook__side--left">
            {baseLeft ? <PageImage page={baseLeft} priority={index < 2} /> : null}
          </div>
          <div className="work-case-flipbook__side work-case-flipbook__side--right">
            {baseRight ? (
              <PageImage page={baseRight} priority={index < 2} />
            ) : null}
          </div>

          {flip ? (
            <div
              className={`work-case-flipbook__leaf work-case-flipbook__leaf--${flip.dir}`}
            >
              <div className="work-case-flipbook__leaf-face work-case-flipbook__leaf-face--front">
                {flip.frontSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={flip.frontSrc}
                    alt={flip.frontAlt}
                    className="work-case-flipbook__image"
                  />
                ) : null}
              </div>
              <div className="work-case-flipbook__leaf-face work-case-flipbook__leaf-face--back">
                {flip.backSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={flip.backSrc}
                    alt={flip.backAlt}
                    className="work-case-flipbook__image"
                  />
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div className="work-case-flipbook__preload" aria-hidden="true">
          {neighborPreload.map((page) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={page.src}
              src={page.src}
              alt=""
              decoding="async"
              loading="eager"
            />
          ))}
        </div>

        <div className="work-case-flipbook__controls">
          <button
            type="button"
            className="work-case-flipbook__button"
            onClick={goPrev}
            disabled={index === 0 || Boolean(flip)}
            aria-label="Previous page"
          >
            ←
          </button>
          <p
            className="work-case-flipbook__counter"
            style={{ fontFamily: secondaryFont }}
          >
            {counter}
          </p>
          <button
            type="button"
            className="work-case-flipbook__button"
            onClick={goNext}
            disabled={index === total - 1 || Boolean(flip)}
            aria-label="Next page"
          >
            →
          </button>
        </div>
      </div>

      {caption ? (
        <figcaption
          className="work-case-caption work-case-caption--flipbook"
          style={{ fontFamily: secondaryFont }}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
