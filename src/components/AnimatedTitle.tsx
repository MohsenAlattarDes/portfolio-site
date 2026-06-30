"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const TITLES = [
  "Brand Designer",
  "Type Designer",
  "Motion Designer",
  "Packaging Designer",
  "UX/UI Designer",
  "Creative Coder",
  "Design Strategist",
  "Superman",
  "Brand Strategist",
  "Pizza Chef",
  "Design Researcher",
  "Movie Buff",
] as const;

const EASING = "cubic-bezier(0.4, 0, 0.2, 1)";
const DURATION_MS = 700;
const HOLD_MS = 2200;
const TRAVEL_PX = 16;
const DESCENDER_PAD_EM = 0.14;

function FlipPhrase({
  phrase,
  maxWidth,
  clipHeight,
}: {
  phrase: string;
  maxWidth: number;
  clipHeight: number;
}) {
  const [active, setActive] = useState(phrase);
  const [exiting, setExiting] = useState<string | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (phrase === active) return;
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    setExiting(active);
    setActive(phrase);
    setAnimKey((k) => k + 1);
    exitTimerRef.current = setTimeout(() => {
      setExiting(null);
      exitTimerRef.current = null;
    }, DURATION_MS);
  }, [phrase, active]);

  useEffect(
    () => () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    },
    [],
  );

  return (
    <span
      className="max-lg:mx-auto lg:mx-0 select-text"
      style={{
        position: "relative",
        display: "block",
        width: `${maxWidth}px`,
        maxWidth: "100%",
        height: `${clipHeight}px`,
        overflow: "clip",
        whiteSpace: "nowrap",
        userSelect: "text",
      }}
    >
      <span
        key={`active-${animKey}`}
        className="max-lg:block max-lg:w-full max-lg:text-center"
        style={{
          position: exiting !== null ? "absolute" : "relative",
          top: exiting !== null ? 0 : undefined,
          left: exiting !== null ? 0 : undefined,
          width: exiting !== null ? "100%" : undefined,
          whiteSpace: "nowrap",
          userSelect: "text",
          willChange: exiting !== null ? "transform, opacity" : undefined,
          animation:
            exiting !== null
              ? `at-enter ${DURATION_MS}ms ${EASING} both`
              : undefined,
        }}
      >
        {active}
      </span>
      {exiting !== null && (
        <span
          key={`exit-${animKey}`}
          aria-hidden="true"
          className="max-lg:block max-lg:w-full max-lg:text-center"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            userSelect: "none",
            willChange: "transform, opacity",
            animation: `at-exit ${DURATION_MS}ms ${EASING} both`,
          }}
        >
          {exiting}
        </span>
      )}
    </span>
  );
}

export default function AnimatedTitle() {
  const [idx, setIdx] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [maxWidth, setMaxWidth] = useState<number | null>(null);
  const [clipHeight, setClipHeight] = useState<number | null>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const measure = () => {
    const root = measureRef.current;
    if (!root) return;

    const samples = root.querySelectorAll<HTMLElement>("[data-at-measure]");
    let widest = 0;
    let tallest = 0;
    let fontSize = 16;

    samples.forEach((sample) => {
      widest = Math.max(widest, sample.offsetWidth);
      tallest = Math.max(tallest, sample.offsetHeight);
      fontSize = parseFloat(getComputedStyle(sample).fontSize) || fontSize;
    });

    setMaxWidth(widest);
    setClipHeight(tallest + fontSize * DESCENDER_PAD_EM);
  };

  useIsoLayoutEffect(() => {
    measure();
  }, []);

  useEffect(() => {
    const root = measureRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % TITLES.length);
    }, HOLD_MS + DURATION_MS);
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <>
      <div
        ref={measureRef}
        aria-hidden="true"
        className="text-[14px] sm:text-[20px] md:text-[30px] lg:text-[37px] xl:text-[45px] 2xl:text-[45px]"
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          visibility: "hidden",
          pointerEvents: "none",
          fontFamily: "var(--font-secondary)",
          fontWeight: 700,
          letterSpacing: "0.01em",
          lineHeight: 1.15,
          whiteSpace: "nowrap",
        }}
      >
        {TITLES.map((title) => (
          <span key={title} data-at-measure style={{ display: "inline-block" }}>
            {title}
          </span>
        ))}
      </div>

      <p
        className="flex w-full select-text justify-center lg:justify-start text-[14px] sm:text-[20px] md:text-[30px] lg:text-[37px] xl:text-[45px] 2xl:text-[45px]"
        style={
          {
            fontFamily: "var(--font-secondary)",
            fontWeight: 700,
            color: "var(--red)",
            letterSpacing: "0.01em",
            lineHeight: 1.15,
            marginBottom: "4px",
            "--at-travel": `${TRAVEL_PX}px`,
          } as React.CSSProperties
        }
      >
        {maxWidth !== null && clipHeight !== null ? (
          <FlipPhrase
            phrase={TITLES[idx]}
            maxWidth={maxWidth}
            clipHeight={clipHeight}
          />
        ) : (
          TITLES[idx]
        )}
      </p>
    </>
  );
}
