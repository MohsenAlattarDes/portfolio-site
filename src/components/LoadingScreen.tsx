"use client";

import { dispatchIntroComplete } from "@/lib/intro";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

type Beat = {
  bg: string;
  boxFill: string;
  boxBorder: string;
  textColor: string;
  rotate: number;
  scale: number;
  skewX: number;
  letterSpacing: string;
  duration: number;
};

const BEATS: Beat[] = [
  {
    bg: "var(--white)",
    boxFill: "var(--black)",
    boxBorder: "var(--black)",
    textColor: "var(--red)",
    rotate: 2,
    scale: 1,
    skewX: 0,
    letterSpacing: "-0.03em",
    duration: 180,
  },
  {
    bg: "var(--red)",
    boxFill: "var(--white)",
    boxBorder: "var(--white)",
    textColor: "var(--red)",
    rotate: -4,
    scale: 0.92,
    skewX: 0,
    letterSpacing: "-0.04em",
    duration: 150,
  },
  {
    bg: "var(--white)",
    boxFill: "var(--red)",
    boxBorder: "var(--red)",
    textColor: "var(--white)",
    rotate: 5,
    scale: 1.06,
    skewX: -3,
    letterSpacing: "-0.02em",
    duration: 170,
  },
  {
    bg: "var(--black)",
    boxFill: "var(--white)",
    boxBorder: "var(--white)",
    textColor: "var(--red)",
    rotate: -2,
    scale: 1.02,
    skewX: 0,
    letterSpacing: "-0.03em",
    duration: 150,
  },
  {
    bg: "var(--red)",
    boxFill: "var(--black)",
    boxBorder: "var(--black)",
    textColor: "var(--white)",
    rotate: 3,
    scale: 1.12,
    skewX: 4,
    letterSpacing: "-0.05em",
    duration: 200,
  },
  {
    bg: "var(--white)",
    boxFill: "var(--red)",
    boxBorder: "var(--red)",
    textColor: "var(--black)",
    rotate: -6,
    scale: 0.96,
    skewX: 0,
    letterSpacing: "-0.03em",
    duration: 160,
  },
  {
    bg: "var(--black)",
    boxFill: "var(--red)",
    boxBorder: "var(--red)",
    textColor: "var(--white)",
    rotate: 0,
    scale: 1,
    skewX: 0,
    letterSpacing: "-0.03em",
    duration: 520,
  },
];

const EXIT_MS = 600;

type Phase = "flash" | "exit" | "done";

function finishIntro() {
  document.body.classList.remove("site-loading");
  dispatchIntroComplete();
}

export default function LoadingScreen() {
  const [phase, setPhase] = useState<Phase>("flash");
  const [beatIndex, setBeatIndex] = useState(0);
  const curtainRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    for (const id of timersRef.current) window.clearTimeout(id);
    timersRef.current = [];
  };

  const schedule = (fn: () => void, ms: number) => {
    timersRef.current.push(window.setTimeout(fn, ms));
  };

  const complete = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    finishIntro();
    setPhase("done");
  }, []);

  const startExit = useCallback(() => {
    setPhase((current) => (current === "flash" ? "exit" : current));
  }, []);

  useEffect(() => {
    document.body.classList.add("site-loading");

    let elapsed = 0;
    BEATS.forEach((beat, i) => {
      if (i === 0) return;
      elapsed += BEATS[i - 1].duration;
      schedule(() => setBeatIndex(i), elapsed);
    });

    const total = BEATS.reduce((sum, b) => sum + b.duration, 0);
    schedule(startExit, total);

    return () => {
      clearTimers();
      document.body.classList.remove("site-loading");
    };
  }, [startExit]);

  useEffect(() => {
    if (phase !== "exit") return;

    const node = curtainRef.current;
    const fallback = window.setTimeout(complete, EXIT_MS + 120);

    const onEnd = (event: TransitionEvent) => {
      if (event.target !== node || event.propertyName !== "transform") return;
      complete();
    };

    node?.addEventListener("transitionend", onEnd);

    return () => {
      window.clearTimeout(fallback);
      node?.removeEventListener("transitionend", onEnd);
    };
  }, [phase, complete]);

  useEffect(() => {
    if (phase !== "flash") return;

    const skip = () => startExit();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);

    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [phase, startExit]);

  if (phase === "done") return null;

  const beat = BEATS[Math.min(beatIndex, BEATS.length - 1)];

  const boxStyle: CSSProperties = {
    backgroundColor: beat.boxFill,
    borderColor: beat.boxBorder,
    transform: `rotate(${beat.rotate}deg) scale(${beat.scale}) skewX(${beat.skewX}deg)`,
  };

  const textStyle: CSSProperties = {
    color: beat.textColor,
    letterSpacing: beat.letterSpacing,
    fontFamily:
      "Impact, 'Haettenschweiler', 'Arial Narrow Bold', sans-serif",
  };

  return (
    <div
      ref={curtainRef}
      className={`flash-curtain fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden ${
        phase === "exit" ? "flash-curtain--exit" : ""
      }`}
      style={{ backgroundColor: beat.bg }}
      aria-live="polite"
      aria-busy={phase !== "exit"}
      role="dialog"
      aria-label="Welcome"
    >
      <div className="flash-curtain__stage" key={beatIndex}>
        <div className="flash-curtain__box" style={boxStyle}>
          <p className="flash-curtain__text" style={textStyle}>
            WELCOME
          </p>
        </div>
      </div>
    </div>
  );
}
