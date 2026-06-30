"use client";

import { useEffect, useRef, useState } from "react";
import { mountCursorSketch } from "@/lib/cursor/mountCursorSketch";
import { INTRO_COMPLETE_EVENT } from "@/lib/intro";

const DESKTOP_MQ = "(min-width: 62rem)";

function isClickableTarget(target: Element | null): boolean {
  if (!target) return false;
  return (
    target.closest(
      'a[href], button:not(:disabled), [role="button"]:not([aria-disabled="true"]), [role="link"], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), label[for]',
    ) !== null
  );
}

export default function RedSquareCursor() {
  const sketchRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [visible, setVisible] = useState(false);
  const [overLink, setOverLink] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
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
    const node = sketchRef.current;
    if (!node) return;
    node.dataset.cursorHidden = visible ? "false" : "true";
    node.dataset.cursorOverLink = overLink ? "true" : "false";
    node.dataset.cursorX = String(pos.x);
    node.dataset.cursorY = String(pos.y);
  }, [visible, overLink, pos.x, pos.y]);

  useEffect(() => {
    if (!active || !introComplete) return;

    const onMove = (e: MouseEvent) => {
      const next = { x: e.clientX, y: e.clientY };
      setPos(next);
      const target =
        e.target instanceof Element
          ? e.target
          : document.elementFromPoint(next.x, next.y);
      const overLetterSplash =
        target?.closest("[data-letter-splash]") !== null;
      setVisible(!overLetterSplash);
      setOverLink(!overLetterSplash && isClickableTarget(target));
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
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
        aria-hidden="true"
        className="fixed pointer-events-none z-[3]"
        style={{
          left: pos.x,
          top: pos.y,
          transform: "translate(-50%, -50%)",
          opacity: visible ? 1 : 0,
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
            className="size-3 transition-colors duration-150 ease-out"
            style={{
              backgroundColor: overLink ? "#888888" : "var(--red)",
            }}
          />
        </div>
      </div>
    </>
  );
}
