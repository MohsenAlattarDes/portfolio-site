"use client";

import { Fragment, useEffect, useMemo, useRef } from "react";
import { useInView } from "@/lib/useInView";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

type TokenKind =
  | "plain"
  | "comment"
  | "string"
  | "keyword"
  | "function"
  | "variable"
  | "constant"
  | "number";

type Token = { text: string; kind: TokenKind };

/** VS Code Dark+ / Cursor dark theme */
const TOKEN_COLORS: Record<TokenKind, string> = {
  plain: "var(--code-plain)",
  comment: "var(--code-comment)",
  string: "var(--code-string)",
  keyword: "var(--code-keyword)",
  function: "var(--code-function)",
  variable: "var(--code-variable)",
  constant: "var(--code-constant)",
  number: "var(--code-number)",
};

const KEYWORDS = new Set([
  "function",
  "let",
  "const",
  "var",
  "if",
  "else",
  "for",
  "while",
  "return",
  "new",
  "true",
  "false",
  "null",
  "undefined",
  "typeof",
  "this",
]);

const CONSTANTS = new Set([
  "TWO_PI",
  "PI",
  "HALF_PI",
  "ROUND",
  "CENTER",
  "Math",
  "width",
  "height",
]);

const SCROLL_SPEED = 28;

function classifyWord(word: string, nextChar: string): TokenKind {
  if (KEYWORDS.has(word)) return "keyword";
  if (CONSTANTS.has(word)) return "constant";
  if (nextChar === "(") return "function";
  if (/^\d+(?:\.\d+)?$/.test(word)) return "number";
  return "variable";
}

function highlightLine(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < line.length) {
    if (line[i] === "/" && line[i + 1] === "/") {
      tokens.push({ text: line.slice(i), kind: "comment" });
      break;
    }

    const char = line[i]!;

    if (char === '"' || char === "'") {
      let j = i + 1;
      while (j < line.length) {
        if (line[j] === "\\") {
          j += 2;
          continue;
        }
        if (line[j] === char) {
          j += 1;
          break;
        }
        j += 1;
      }
      tokens.push({ text: line.slice(i, j), kind: "string" });
      i = j;
      continue;
    }

    if (/[A-Za-z_$]/.test(char)) {
      let j = i + 1;
      while (j < line.length && /[A-Za-z0-9_$]/.test(line[j]!)) j += 1;
      const word = line.slice(i, j);
      let k = j;
      while (k < line.length && /\s/.test(line[k]!)) k += 1;
      const nextChar = line[k] ?? "";
      tokens.push({ text: word, kind: classifyWord(word, nextChar) });
      i = j;
      continue;
    }

    if (/[0-9]/.test(char)) {
      let j = i + 1;
      while (j < line.length && /[0-9.]/.test(line[j]!)) j += 1;
      tokens.push({ text: line.slice(i, j), kind: "number" });
      i = j;
      continue;
    }

    tokens.push({ text: char, kind: "plain" });
    i += 1;
  }

  if (tokens.length === 0) tokens.push({ text: " ", kind: "plain" });
  return tokens;
}

export default function CaseStudyCodeWindow({
  title = "sketch.js",
  source,
}: {
  title?: string;
  source: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>("80px 0px", 0.2);
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const lines = useMemo(
    () => source.replace(/\n$/, "").split("\n").map(highlightLine),
    [source],
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content || !inView || reducedMotion) {
      if (content) content.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    let frame = 0;
    let offset = 0;
    let direction = 1;
    let paused = false;
    let pauseTimer = 0;
    let last = performance.now();

    const measureMax = () =>
      Math.max(0, content.scrollHeight - viewport.clientHeight);

    const tick = (now: number) => {
      const elapsed = Math.min(now - last, 48);
      last = now;

      const maxScroll = measureMax();
      if (maxScroll <= 0) {
        offset = 0;
        content.style.transform = "translate3d(0, 0, 0)";
        frame = window.requestAnimationFrame(tick);
        return;
      }

      if (!paused) {
        offset += direction * ((SCROLL_SPEED * elapsed) / 1000);

        if (offset >= maxScroll) {
          offset = maxScroll;
          direction = -1;
          paused = true;
          pauseTimer = window.setTimeout(() => {
            paused = false;
          }, 1100);
        } else if (offset <= 0) {
          offset = 0;
          direction = 1;
          paused = true;
          pauseTimer = window.setTimeout(() => {
            paused = false;
          }, 800);
        }
      }

      content.style.transform = `translate3d(0, ${-offset}px, 0)`;
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(pauseTimer);
      content.style.transform = "translate3d(0, 0, 0)";
    };
  }, [inView, reducedMotion, source, lines.length]);

  return (
    <div
      ref={ref}
      className="work-case-code-window"
      aria-label={`${title} source preview`}
    >
      <div className="work-case-code-window__tabs">
        <span className="work-case-code-window__tab">{title}</span>
      </div>
      <div ref={viewportRef} className="work-case-code-window__body">
        <div ref={contentRef} className="work-case-code-window__lines">
          {lines.map((line, lineIndex) => (
            <div className="work-case-code-window__line" key={lineIndex}>
              <span className="work-case-code-window__line-number">
                {lineIndex + 1}
              </span>
              <code className="work-case-code-window__line-code">
                {line.map((token, tokenIndex) => (
                  <Fragment key={tokenIndex}>
                    <span style={{ color: TOKEN_COLORS[token.kind] }}>
                      {token.text}
                    </span>
                  </Fragment>
                ))}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
