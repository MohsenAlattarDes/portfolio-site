"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { mountCursorSketch } from "@/lib/cursor/mountCursorSketch";
import { INTRO_COMPLETE_EVENT } from "@/lib/intro";

const DESKTOP_MQ = "(min-width: 62rem)";
const INTRO_SEEN_KEY = "site-intro-seen";

function isEnlargeTarget(target: Element | null): boolean {
  if (!target) return false;
  return target.closest(".work-case-media-enlarge") !== null;
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
  const visibleRef = useRef(false);
  const overLinkRef = useRef(false);
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
    if (!sketch || !ring) return;

    const setHidden = (hidden: boolean) => {
      visibleRef.current = !hidden;
      sketch.dataset.cursorHidden = hidden ? "true" : "false";
      ring.style.opacity = hidden ? "0" : "1";
    };

    const setOverLink = (next: boolean) => {
      if (overLinkRef.current === next) return;
      overLinkRef.current = next;
      sketch.dataset.cursorOverLink = next ? "true" : "false";
      if (squareRef.current) {
        squareRef.current.style.backgroundColor = next
          ? "#888888"
          : "var(--red)";
      }
    };

    const onMove = (e: PointerEvent) => {
      // Ignore touch / pen — custom cursor is desktop-mouse only.
      if (e.pointerType && e.pointerType !== "mouse") return;

      const x = e.clientX;
      const y = e.clientY;

      ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      sketch.dataset.cursorX = String(x);
      sketch.dataset.cursorY = String(y);

      const target =
        e.target instanceof Element
          ? e.target
          : document.elementFromPoint(x, y);
      const overLetterSplash =
        target?.closest("[data-letter-splash]") !== null;
      const overSiteEmbed =
        target?.closest(".work-case-site-embed") !== null;
      const hide = overLetterSplash || overSiteEmbed;

      setHidden(hide);
      setOverLink(
        !hide && isClickableTarget(target) && !isEnlargeTarget(target),
      );
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
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onOut);
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
        className="fixed top-0 left-0 pointer-events-none z-[3]"
        style={{
          opacity: 0,
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
          willChange: "transform, opacity",
        }}
      >
        <div
          className="bg-[var(--cursor-ring)] p-[2px]"
          style={{
            filter:
              "drop-shadow(0 0 3px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 8px rgba(0, 0, 0, 0.4))",
          }}
        >
          <div
            ref={squareRef}
            className="size-3"
            style={{
              backgroundColor: "var(--red)",
              transition: "background-color 150ms ease-out",
            }}
          />
        </div>
      </div>
    </>
  );
}
