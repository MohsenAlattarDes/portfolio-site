"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

const SCRAMBLE_CHARS = "01<>{}[]_/\\ABCDEF#$*+=";
export const SCRAMBLE_FRAMES = 14;
export const SCRAMBLE_MS = 42;

function frameText(label: string, frame: number) {
  const reveal =
    frame <= 0 ? 0 : Math.floor((frame / SCRAMBLE_FRAMES) * label.length);
  return label
    .split("")
    .map((char, index) => {
      if (char === " " || char === "'") return char;
      if (index < reveal) return char;
      return SCRAMBLE_CHARS[
        Math.floor(Math.random() * SCRAMBLE_CHARS.length)
      ]!;
    })
    .join("");
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Run the nav-style scramble, calling `onFrame` each tick. */
export function runScramble(
  label: string,
  onFrame: (value: string) => void,
  onDone?: () => void,
) {
  if (prefersReducedMotion()) {
    onFrame(label);
    onDone?.();
    return () => {};
  }

  let frame = 0;
  onFrame(frameText(label, 0));
  const id = window.setInterval(() => {
    frame += 1;
    if (frame >= SCRAMBLE_FRAMES) {
      window.clearInterval(id);
      onFrame(label);
      onDone?.();
      return;
    }
    onFrame(frameText(label, frame));
  }, SCRAMBLE_MS);

  return () => window.clearInterval(id);
}

/** Scramble each line on its own so multi-line titles keep stable breaks. */
export function runScrambleLines(
  lines: string[],
  onFrame: (lines: string[]) => void,
  onDone?: () => void,
) {
  if (prefersReducedMotion()) {
    onFrame(lines);
    onDone?.();
    return () => {};
  }

  let frame = 0;
  onFrame(lines.map((line) => frameText(line, 0)));
  const id = window.setInterval(() => {
    frame += 1;
    if (frame >= SCRAMBLE_FRAMES) {
      window.clearInterval(id);
      onFrame(lines);
      onDone?.();
      return;
    }
    onFrame(lines.map((line) => frameText(line, frame)));
  }, SCRAMBLE_MS);

  return () => window.clearInterval(id);
}

/**
 * Declarative wrapper (nav): scramble when `active` is true.
 */
export default function ScrambleText({
  text,
  active,
  onComplete,
  className,
  style,
  renderSettled,
}: {
  text: string;
  active: boolean;
  onComplete?: () => void;
  className?: string;
  style?: CSSProperties;
  renderSettled?: (text: string) => ReactNode;
}) {
  const [display, setDisplay] = useState(text);
  const [animating, setAnimating] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    stopRef.current?.();
    stopRef.current = null;

    if (!active) {
      setDisplay(text);
      setAnimating(false);
      return;
    }

    setAnimating(true);
    stopRef.current = runScramble(
      text,
      setDisplay,
      () => {
        setAnimating(false);
        onCompleteRef.current?.();
      },
    );

    return () => {
      stopRef.current?.();
      stopRef.current = null;
    };
  }, [active, text]);

  const settled = !animating && display === text;

  return (
    <span className={className} style={style}>
      {settled && renderSettled ? renderSettled(text) : display}
    </span>
  );
}
