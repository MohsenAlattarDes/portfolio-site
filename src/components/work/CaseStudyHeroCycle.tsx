"use client";

import { useEffect, useRef, useState } from "react";
import type { PublicationSpread } from "@/lib/work/types";

const HOLD_MS = 3200;
const FADE_MS = 900;
const STICKER_FRAME_MS = 520;
const STICKER_WOBBLE_DEG = 8;
/** left → center → right → center (so the middle pose is never skipped) */
const STICKER_FRAME_CYCLE = [0, 1, 2, 1] as const;
const COMPACT_BREAKPOINT = 760;

const STICKER_BASE_TILTS = [-7, 4, -3] as const;

type SyncListener = (tick: number) => void;

type SyncGroup = {
  intervalMs: number;
  timer: number | null;
  tick: number;
  listeners: Set<SyncListener>;
};

const heroCycleSyncGroups = new Map<string, SyncGroup>();

function subscribeHeroCycleSync(
  id: string,
  intervalMs: number,
  listener: SyncListener,
) {
  let group = heroCycleSyncGroups.get(id);
  if (!group) {
    group = {
      intervalMs,
      timer: null,
      tick: 0,
      listeners: new Set(),
    };
    heroCycleSyncGroups.set(id, group);
  }

  group.listeners.add(listener);
  listener(group.tick);

  if (group.timer == null && group.listeners.size > 0) {
    group.intervalMs = intervalMs;
    group.timer = window.setInterval(() => {
      const active = heroCycleSyncGroups.get(id);
      if (!active) return;
      active.tick += 1;
      active.listeners.forEach((fn) => fn(active.tick));
    }, intervalMs);
  }

  return () => {
    const active = heroCycleSyncGroups.get(id);
    if (!active) return;
    active.listeners.delete(listener);
    if (active.listeners.size === 0) {
      if (active.timer != null) window.clearInterval(active.timer);
      heroCycleSyncGroups.delete(id);
    }
  };
}

function stickerShift(
  kind: "salem" | "hala" | "simsim" | "other",
  compact: boolean,
) {
  if (compact) {
    if (kind === "salem") return "translate(-68px, -18px)";
    if (kind === "hala") return "translate(18px, -18px)";
    if (kind === "simsim") return "translate(-22px, 10px)";
    return "";
  }
  if (kind === "salem") return "translate(-120px, -80px)";
  if (kind === "hala") return "translate(20px, -80px)";
  if (kind === "simsim") return "translate(-90px, 30px)";
  return "";
}

function stickerScale(
  kind: "salem" | "hala" | "simsim" | "other",
  compact: boolean,
) {
  if (compact) {
    if (kind === "simsim") return 1.65;
    if (kind === "salem" || kind === "hala") return 1.85;
    return 1.25;
  }
  if (kind === "simsim") return 1.35;
  if (kind === "salem" || kind === "hala") return 1.87;
  return 1;
}

export default function CaseStudyHeroCycle({
  slides,
  stickers = [],
  overlay,
  backdropShape = "rect",
  intervalMs = HOLD_MS,
  fadeMs = FADE_MS,
  slideFit = "contain",
  syncId,
  variant = "hero",
}: {
  slides: PublicationSpread[];
  stickers?: PublicationSpread[];
  overlay?: PublicationSpread;
  backdropShape?: "rect" | "circle";
  intervalMs?: number;
  fadeMs?: number;
  slideFit?: "contain" | "cover";
  syncId?: string;
  /** `media` = inline figure (contain, no dim overlay). `hero` = Qalam-style cover. */
  variant?: "hero" | "media";
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const scaleRef = useRef<HTMLDivElement | null>(null);
  const layoutScaleRef = useRef(1);
  const [index, setIndex] = useState(0);
  const [stickerStep, setStickerStep] = useState(0);
  const [compact, setCompact] = useState(false);
  const [layoutScale, setLayoutScale] = useState(1);

  useEffect(() => {
    layoutScaleRef.current = layoutScale;
  }, [layoutScale]);

  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (syncId) {
      return subscribeHeroCycleSync(syncId, intervalMs, (tick) => {
        setIndex(tick % slides.length);
      });
    }

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [intervalMs, slides.length, syncId]);

  useEffect(() => {
    if (stickers.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setStickerStep((step) => (step + 1) % STICKER_FRAME_CYCLE.length);
    }, STICKER_FRAME_MS);

    return () => window.clearInterval(id);
  }, [stickers.length]);

  useEffect(() => {
    const root = rootRef.current;
    const stage = scaleRef.current;
    if (!root || !stage || stickers.length === 0) return;

    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const width = root.clientWidth;
        if (width <= 0) return;

        const nextCompact = width < COMPACT_BREAKPOINT;
        setCompact((current) => (current === nextCompact ? current : nextCompact));

        const rootRect = root.getBoundingClientRect();
        const nodes = stage.querySelectorAll<HTMLElement>(
          ".work-case-hero-cycle__sticker",
        );
        if (nodes.length === 0) return;

        let minX = Number.POSITIVE_INFINITY;
        let minY = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;
        nodes.forEach((node) => {
          const rect = node.getBoundingClientRect();
          minX = Math.min(minX, rect.left);
          minY = Math.min(minY, rect.top);
          maxX = Math.max(maxX, rect.right);
          maxY = Math.max(maxY, rect.bottom);
        });

        const currentScale = Math.max(0.01, layoutScaleRef.current);
        const contentW = Math.max(1, (maxX - minX) / currentScale);
        const contentH = Math.max(1, (maxY - minY) / currentScale);
        const pad = nextCompact ? 0.9 : 0.94;
        const fit = Math.min(
          1,
          (rootRect.width * pad) / contentW,
          (rootRect.height * pad) / contentH,
        );
        const nextScale = Math.min(1, fit);

        if (Math.abs(nextScale - layoutScaleRef.current) > 0.01) {
          layoutScaleRef.current = nextScale;
          setLayoutScale(nextScale);
        }
      });
    };

    // Wait a frame so compact class / transforms are applied before measuring.
    const boot = window.setTimeout(update, 40);
    const observer = new ResizeObserver(update);
    observer.observe(root);
    return () => {
      window.clearTimeout(boot);
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [stickers, compact]);

  if (slides.length === 0) return null;

  return (
    <div
      ref={rootRef}
      className={`work-case-hero-cycle${variant === "media" ? " work-case-hero-cycle--media" : ""}${slideFit === "cover" ? " work-case-hero-cycle--cover" : ""}${overlay ? " work-case-hero-cycle--overlay" : ""}${backdropShape === "circle" ? " work-case-hero-cycle--circle-backdrop" : ""}`}
      aria-live="polite"
    >
      <div className="work-case-hero-cycle__media">
        {slides.map((slide, slideIndex) => {
          const active = slideIndex === index;
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={slide.src}
              src={slide.src}
              alt={overlay ? "" : active ? slide.alt : ""}
              aria-hidden={overlay ? true : !active}
              className={`work-case-hero-cycle__slide${active ? " is-active" : ""}`}
              decoding="async"
              loading={slideIndex === 0 ? "eager" : "lazy"}
              draggable={false}
              style={
                fadeMs > 0
                  ? { transitionDuration: `${fadeMs}ms` }
                  : { transition: "none" }
              }
            />
          );
        })}
      </div>

      {overlay ? (
        <div className="work-case-hero-cycle__overlay">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={overlay.src}
            alt={overlay.alt}
            className="work-case-hero-cycle__overlay-image"
            decoding="async"
            draggable={false}
          />
        </div>
      ) : null}

      {stickers.length > 0 ? (
        <div
          ref={scaleRef}
          className={`work-case-hero-cycle__stickers-scale${compact ? " is-compact" : ""}`}
          style={{ transform: `scale(${layoutScale})` }}
        >
          <ul
            className="work-case-hero-cycle__stickers"
            aria-label="Qalam characters"
          >
            {stickers.map((sticker, stickerIndex) => {
              const isSimsim =
                /simsim/i.test(sticker.src) || /simsim/i.test(sticker.alt);
              const isSalem =
                /salem/i.test(sticker.src) || /salem/i.test(sticker.alt);
              const isHala =
                /hala/i.test(sticker.src) || /hala/i.test(sticker.alt);
              const kind = isSalem
                ? "salem"
                : isHala
                  ? "hala"
                  : isSimsim
                    ? "simsim"
                    : "other";
              const baseTilt =
                STICKER_BASE_TILTS[stickerIndex % STICKER_BASE_TILTS.length]!;
              const stickerFrame = STICKER_FRAME_CYCLE[stickerStep]!;
              const direction = stickerIndex % 2 === 0 ? 1 : -1;
              const frameOffset =
                (stickerFrame === 0 ? -1 : stickerFrame === 1 ? 0 : 1) *
                STICKER_WOBBLE_DEG *
                direction;
              const tilt = baseTilt + frameOffset;
              const shift = stickerShift(kind, compact);
              const scale = stickerScale(kind, compact);
              return (
                <li
                  key={sticker.src}
                  className={`work-case-hero-cycle__sticker${isSimsim ? " is-simsim" : ""}${isSalem ? " is-salem" : ""}${isHala ? " is-hala" : ""}`}
                  style={{
                    transform:
                      `${shift} rotate(${tilt}deg) scale(${scale})`.trim(),
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sticker.src}
                    alt={sticker.alt}
                    className="work-case-hero-cycle__sticker-image"
                    decoding="async"
                    draggable={false}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
