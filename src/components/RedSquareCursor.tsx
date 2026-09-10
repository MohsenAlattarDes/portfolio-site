"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { mountCursorSketch } from "@/lib/cursor/mountCursorSketch";
import { INTRO_COMPLETE_EVENT } from "@/lib/intro";
import { onSmoothScroll } from "@/lib/smooth-scroll";

const DESKTOP_MQ = "(min-width: 62rem)";
const INTRO_SEEN_KEY = "site-intro-seen";

function isEnlargeTarget(target: Element | null): boolean {
  if (!target) return false;
  return target.closest(".work-case-media-enlarge") !== null;
}

function captionFromTarget(target: Element | null): string {
  if (!target) return "";
  const host = target.closest("[data-cursor-caption]");
  if (!host || !host.closest(".work-case")) return "";
  if (document.documentElement.classList.contains("lightbox-open")) return "";
  return host.getAttribute("data-cursor-caption")?.trim() ?? "";
}

function isClickableTarget(target: Element | null): boolean {
  if (!target) return false;
  return (
    target.closest(
      'a[href], button:not(:disabled), [role="button"]:not([aria-disabled="true"]), [role="link"], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), label[for]',
    ) !== null
  );
}

function hasSeenIntro() {
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export default function RedSquareCursor() {
  const sketchRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const visibleRef = useRef(false);
  const overLinkRef = useRef(false);
  const captionTextRef = useRef("");
  const closeTimerRef = useRef(0);
  const pointerXRef = useRef<number | null>(null);
  const pointerYRef = useRef<number | null>(null);
  const [active, setActive] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  // Sync with intro immediately — LoadingScreen may already have finished
  // (and dispatched) in an earlier layout effect on return visits.
  useLayoutEffect(() => {
    if (hasSeenIntro()) {
      setIntroComplete(true);
      return;
    }

    const onIntroComplete = () => setIntroComplete(true);
    window.addEventListener(INTRO_COMPLETE_EVENT, onIntroComplete);
    const fallback = window.setTimeout(() => setIntroComplete(true), 5000);

    return () => {
      window.removeEventListener(INTRO_COMPLETE_EVENT, onIntroComplete);
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ);
    const sync = () => setActive(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!active || !introComplete || !sketchRef.current) return;
    return mountCursorSketch(sketchRef.current);
  }, [active, introComplete]);

  useEffect(() => {
    if (!active || !introComplete) return;

    const sketch = sketchRef.current;
    const ring = ringRef.current;
    const caption = captionRef.current;
    const measure = measureRef.current;
    const chip = squareRef.current;
    if (!sketch || !ring || !caption || !measure || !chip) return;

    const setHidden = (hidden: boolean) => {
      visibleRef.current = !hidden;
      sketch.dataset.cursorHidden = hidden ? "true" : "false";
      ring.style.opacity = hidden ? "0" : "1";
    };

    const setOverLink = (next: boolean) => {
      if (overLinkRef.current === next) return;
      overLinkRef.current = next;
      sketch.dataset.cursorOverLink = next ? "true" : "false";
      chip.style.backgroundColor = next ? "#888888" : "var(--red)";
    };

    const sizeChipToCaption = () => {
      const width = Math.max(12, Math.ceil(measure.offsetWidth));
      const height = Math.max(12, Math.ceil(measure.offsetHeight));
      chip.style.setProperty("--cursor-caption-width", `${width}px`);
      chip.style.setProperty("--cursor-caption-height", `${height}px`);
    };

    const setCaption = (next: string) => {
      if (captionTextRef.current === next) return;

      window.clearTimeout(closeTimerRef.current);
      captionTextRef.current = next;

      if (!next) {
        ring.dataset.expanded = "false";
        closeTimerRef.current = window.setTimeout(() => {
          caption.textContent = "";
          measure.textContent = "";
        }, 420);
        return;
      }

      caption.textContent = next;
      measure.textContent = next;
      sizeChipToCaption();
      void chip.offsetWidth;
      ring.dataset.expanded = "true";
    };

    const syncFromPoint = (x: number, y: number) => {
      const target = document.elementFromPoint(x, y);
      const overLetterSplash =
        target?.closest("[data-letter-splash]") !== null;
      const overSiteEmbed =
        target?.closest(".work-case-site-embed__viewport") !== null;
      const hide = overLetterSplash || overSiteEmbed;

      setHidden(hide);
      setOverLink(
        !hide && isClickableTarget(target) && !isEnlargeTarget(target),
      );
      setCaption(hide ? "" : captionFromTarget(target));
    };

    const onMove = (e: PointerEvent) => {
      // Ignore touch / pen — custom cursor is desktop-mouse only.
      if (e.pointerType && e.pointerType !== "mouse") return;

      const x = e.clientX;
      const y = e.clientY;
      pointerXRef.current = x;
      pointerYRef.current = y;

      ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      sketch.dataset.cursorX = String(x);
      sketch.dataset.cursorY = String(y);

      syncFromPoint(x, y);
    };

    const onScroll = () => {
      const x = pointerXRef.current;
      const y = pointerYRef.current;
      if (x == null || y == null) return;
      syncFromPoint(x, y);
    };

    // Only hide when the pointer really leaves the window — Safari fires
    // documentElement mouseleave spuriously (iframes, scroll, media controls).
    const onOut = (e: MouseEvent) => {
      const next = e.relatedTarget;
      if (next instanceof Node && document.documentElement.contains(next)) {
        return;
      }
      setHidden(true);
      setOverLink(false);
      setCaption("");
    };

    const siteMain = document.querySelector(".site-main");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseout", onOut);
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    siteMain?.addEventListener("scroll", onScroll, { passive: true });
    const stopSmoothScrollListen = onSmoothScroll(onScroll);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("scroll", onScroll, { capture: true });
      siteMain?.removeEventListener("scroll", onScroll);
      stopSmoothScrollListen();
      window.clearTimeout(closeTimerRef.current);
    };
  }, [active, introComplete]);

  if (!active || !introComplete) return null;

  return (
    <>
      <div
        ref={sketchRef}
        inert
        aria-hidden="true"
        className="cursor-sketch fixed inset-0 z-[1] pointer-events-none"
        data-cursor-hidden="true"
        data-cursor-over-link="false"
      />

      <div
        ref={ringRef}
        aria-hidden="true"
        className="cursor-ring fixed top-0 left-0 pointer-events-none z-[3]"
        data-expanded="false"
        style={{
          opacity: 0,
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
          willChange: "transform, opacity",
        }}
      >
        <div className="cursor-ring-frame">
          <div
            ref={squareRef}
            className="cursor-chip"
            style={{ backgroundColor: "var(--red)" }}
          >
            <span ref={captionRef} className="cursor-chip__text" />
          </div>
        </div>
        <span ref={measureRef} className="cursor-chip__measure" />
      </div>
    </>
  );
}
