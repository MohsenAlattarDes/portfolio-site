"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const secondaryFont = "var(--font-secondary)";
/** Zoom only the iframe preview; the window box stays the same size. */
const ZOOM = 1;
/** Wide enough to clear qalam.design desktop breakpoints (1024 / 1280). */
const DESKTOP_WIDTH = 1440;
const DESKTOP_HEIGHT = 900;
const MOVE_MS = 1100;
const NAV_WAIT_MS = 4500;

/**
 * Idle demo timeline. Cursor positions are fractions of the framed viewport;
 * `scroll` is a fraction of the embedded page's scrollable height;
 * `path` navigates the embed to another same-origin route.
 */
type DemoStep = {
  x: number;
  y: number;
  hold?: number;
  click?: boolean;
  scroll?: number;
  path?: string;
};

const DEMO_STEPS: DemoStep[] = [
  // —— Home
  { x: 0.5, y: 0.78, hold: 800, scroll: 0 },
  { x: 0.11, y: 0.46, hold: 480, click: true },
  { x: 0.5, y: 0.62, hold: 650, click: true },
  { x: 0.58, y: 0.5, hold: 850, scroll: 0.18 },
  { x: 0.42, y: 0.48, hold: 850, scroll: 0.38 },
  { x: 0.55, y: 0.52, hold: 900, scroll: 0.58 },
  { x: 0.48, y: 0.5, hold: 900, scroll: 0.78 },
  // Click into an entry
  { x: 0.36, y: 0.42, hold: 700, click: true, path: "/entry/rtl" },

  // —— RTL entry
  { x: 0.5, y: 0.55, hold: 900, scroll: 0 },
  { x: 0.55, y: 0.5, hold: 950, scroll: 0.28 },
  { x: 0.45, y: 0.52, hold: 950, scroll: 0.55 },
  { x: 0.5, y: 0.48, hold: 900, scroll: 0.8 },
  { x: 0.14, y: 0.32, hold: 650, click: true, path: "/entry/naskh" },

  // —— Naskh entry
  { x: 0.5, y: 0.5, hold: 900, scroll: 0 },
  { x: 0.52, y: 0.48, hold: 950, scroll: 0.35 },
  { x: 0.48, y: 0.55, hold: 950, scroll: 0.7 },
  {
    x: 0.42,
    y: 0.48,
    hold: 650,
    click: true,
    path: "/entry/maghrebi/in-use",
  },

  // —— Maghrebi In Use
  { x: 0.5, y: 0.5, hold: 900, scroll: 0 },
  { x: 0.52, y: 0.48, hold: 950, scroll: 0.28 },
  { x: 0.46, y: 0.52, hold: 950, scroll: 0.55 },
  { x: 0.5, y: 0.5, hold: 900, scroll: 0.82 },
  { x: 0.16, y: 0.55, hold: 650, click: true, path: "/play" },

  // —— Play
  { x: 0.5, y: 0.55, hold: 900, scroll: 0 },
  { x: 0.4, y: 0.5, hold: 800, click: true },
  { x: 0.6, y: 0.48, hold: 900, scroll: 0.35 },
  { x: 0.5, y: 0.55, hold: 850, scroll: 0.65 },
  { x: 0.18, y: 0.28, hold: 650, click: true, path: "/about" },

  // —— About, then home again
  { x: 0.5, y: 0.5, hold: 900, scroll: 0 },
  { x: 0.5, y: 0.55, hold: 950, scroll: 0.45 },
  { x: 0.12, y: 0.18, hold: 700, click: true, path: "/" },
];

type Metrics = { scrollHeight: number; innerHeight: number; path?: string };

export default function CaseStudySiteEmbed({
  src,
  displaySrc,
  title,
  caption,
}: {
  src: string;
  /** Canonical URL shown in the chrome, when `src` is a deploy preview. */
  displaySrc?: string;
  title: string;
  caption?: string;
}) {
  const publicSrc = displaySrc ?? src;
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef(0);
  const liveRef = useRef(false);
  const metricsRef = useRef<Metrics | null>(null);
  const waitingNavRef = useRef(false);
  const resumeAfterNavRef = useRef<(() => void) | null>(null);

  const [scale, setScale] = useState(0);
  const [live, setLive] = useState(false);
  const [chromePath, setChromePath] = useState("/");

  const embedOrigin = (() => {
    try {
      return new URL(src).origin;
    } catch {
      return "";
    }
  })();

  const hostname = (() => {
    try {
      return new URL(publicSrc).hostname.replace(/^www\./, "");
    } catch {
      return publicSrc;
    }
  })();

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;

    const update = () => {
      const width = node.clientWidth;
      if (width <= 0) return;
      // Fit scale for the window box; ZOOM is applied only to the iframe.
      setScale(width / DESKTOP_WIDTH + 0.001);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Listen for the embedded site announcing itself / reporting page metrics.
  useEffect(() => {
    if (!embedOrigin) return;

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== embedOrigin) return;
      const data = event.data as
        | {
            source?: string;
            type?: string;
            scrollHeight?: number;
            innerHeight?: number;
            path?: string;
          }
        | null;
      if (!data || data.source !== "qalam") return;

      if (data.type === "ready" || data.type === "metrics") {
        if (data.scrollHeight && data.innerHeight) {
          metricsRef.current = {
            scrollHeight: data.scrollHeight,
            innerHeight: data.innerHeight,
            path: data.path,
          };
        }
        if (data.path) setChromePath(data.path.split("?")[0] || "/");

        if (waitingNavRef.current && data.type === "ready") {
          waitingNavRef.current = false;
          const resume = resumeAfterNavRef.current;
          resumeAfterNavRef.current = null;
          resume?.();
        }
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [embedOrigin]);

  const sendScroll = useCallback(
    (fraction: number) => {
      const frame = frameRef.current?.contentWindow;
      const m = metricsRef.current;
      if (!frame || !embedOrigin) return;

      const max = m
        ? Math.max(0, m.scrollHeight - m.innerHeight)
        : DESKTOP_HEIGHT * 6;
      frame.postMessage(
        {
          source: "qalam-embed",
          type: "scrollTo",
          top: Math.round(max * fraction),
        },
        embedOrigin,
      );
    },
    [embedOrigin],
  );

  const sendNavigate = useCallback(
    (path: string) => {
      const frame = frameRef.current?.contentWindow;
      if (!frame || !embedOrigin) return;
      frame.postMessage(
        { source: "qalam-embed", type: "navigate", path },
        embedOrigin,
      );
    },
    [embedOrigin],
  );

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const runStepRef = useRef<() => void>(() => {});

  // Idle demo: glide the cursor, click, scroll, and hop between pages.
  const runStep = useCallback(() => {
    const node = viewportRef.current;
    const cursor = cursorRef.current;
    if (!node || !cursor) return;

    if (liveRef.current || waitingNavRef.current) {
      timerRef.current = window.setTimeout(() => runStepRef.current(), 400);
      return;
    }

    const step = DEMO_STEPS[stepRef.current % DEMO_STEPS.length]!;
    const rect = node.getBoundingClientRect();
    cursor.style.transform = `translate3d(${step.x * rect.width}px, ${step.y * rect.height}px, 0)`;

    if (step.scroll != null) sendScroll(step.scroll);

    if (step.click) {
      window.setTimeout(() => {
        if (liveRef.current) return;
        cursor.classList.remove("is-clicking");
        void cursor.offsetWidth;
        cursor.classList.add("is-clicking");
      }, MOVE_MS * 0.7);
    }

    const advance = () => {
      stepRef.current += 1;
      runStepRef.current();
    };

    if (step.path) {
      // Click, then navigate; pause until the next page announces ready.
      timerRef.current = window.setTimeout(() => {
        if (liveRef.current) {
          timerRef.current = window.setTimeout(() => runStepRef.current(), 400);
          return;
        }

        waitingNavRef.current = true;
        setChromePath(step.path!);
        sendNavigate(step.path!);

        const timeout = window.setTimeout(() => {
          if (!waitingNavRef.current) return;
          waitingNavRef.current = false;
          resumeAfterNavRef.current = null;
          advance();
        }, NAV_WAIT_MS);

        resumeAfterNavRef.current = () => {
          window.clearTimeout(timeout);
          // Let layout settle before the next scroll beat.
          timerRef.current = window.setTimeout(advance, 700);
        };
      }, MOVE_MS + (step.hold ?? 400));
      return;
    }

    stepRef.current += 1;
    timerRef.current = window.setTimeout(
      () => runStepRef.current(),
      MOVE_MS + (step.hold ?? 400),
    );
  }, [sendNavigate, sendScroll]);

  useEffect(() => {
    runStepRef.current = runStep;
  }, [runStep]);

  useEffect(() => {
    if (scale <= 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    timerRef.current = window.setTimeout(() => runStepRef.current(), 1200);
    return () => {
      clearTimer();
      waitingNavRef.current = false;
      resumeAfterNavRef.current = null;
    };
  }, [scale]);

  const ready = scale > 0;

  const setLiveState = (value: boolean) => {
    liveRef.current = value;
    setLive(value);
  };

  const handleFrameLoad = () => {
    const frame = frameRef.current?.contentWindow;
    if (!frame || !embedOrigin) return;
    frame.postMessage({ source: "qalam-embed", type: "ping" }, embedOrigin);
  };

  const chromeLabel =
    chromePath && chromePath !== "/"
      ? `${hostname}${chromePath}`
      : hostname;

  return (
    <figure className="work-case-figure work-case-site-embed">
      <div className="work-case-site-embed__window">
        <div className="work-case-site-embed__chrome">
          <div className="work-case-site-embed__dots" aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <a
            className="work-case-site-embed__url"
            href={`${publicSrc.replace(/\/$/, "")}${chromePath === "/" ? "/" : chromePath}`}
            target="_blank"
            rel="noreferrer"
            style={{ fontFamily: secondaryFont }}
          >
            {chromeLabel}
          </a>
          <a
            className="work-case-site-embed__open"
            href={publicSrc}
            target="_blank"
            rel="noreferrer"
            style={{ fontFamily: secondaryFont }}
          >
            Open
          </a>
        </div>
        <div
          ref={viewportRef}
          className={`work-case-site-embed__viewport${live ? " is-live" : ""}`}
          style={
            ready
              ? { height: Math.round(DESKTOP_HEIGHT * (scale - 0.001)) }
              : { minHeight: "18rem" }
          }
          onMouseEnter={() => setLiveState(true)}
          onMouseLeave={() => setLiveState(false)}
        >
          {ready ? (
            <iframe
              ref={frameRef}
              src={src}
              title={title}
              className="work-case-site-embed__frame"
              width={DESKTOP_WIDTH}
              height={DESKTOP_HEIGHT}
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
              allow="fullscreen"
              onLoad={handleFrameLoad}
              style={{
                width: DESKTOP_WIDTH,
                height: DESKTOP_HEIGHT,
                minWidth: DESKTOP_WIDTH,
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) scale(${scale * ZOOM})`,
                transformOrigin: "center center",
              }}
            />
          ) : null}

          <div
            ref={cursorRef}
            className="work-case-site-embed__cursor"
            aria-hidden
          >
            <span className="work-case-site-embed__cursor-ring" />
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="work-case-site-embed__cursor-arrow"
            >
              <path
                d="M4 2 L4 20 L9 15 L12.5 22 L15.5 20.5 L12 13.5 L19 13.5 Z"
                fill="#fff"
                stroke="#111"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
          </div>

        </div>
      </div>
      {caption ? (
        <figcaption
          className="work-case-caption"
          style={{ fontFamily: secondaryFont }}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
