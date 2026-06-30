"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const LINKS = [
  { href: "/", label: "HOME" },
  { href: "/work", label: "WORK" },
  { href: "/about", label: "ABOUT" },
] as const;

const SCRAMBLE_CHARS = "01<>{}[]_/|\\ABCDEF#$%&*+=";
const SCRAMBLE_FRAMES = 9;
const SCRAMBLE_MS = 32;
const PROMPT_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

function isLinkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function ScrambleLabel({
  label,
  isActive,
  className,
  style,
}: {
  label: string;
  isActive: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const [text, setText] = useState(label);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!isActive || reducedMotion) {
      setText(label);
      return;
    }

    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      if (frame >= SCRAMBLE_FRAMES) {
        setText(label);
        window.clearInterval(id);
        return;
      }

      const reveal = Math.floor((frame / SCRAMBLE_FRAMES) * label.length);
      setText(
        label
          .split("")
          .map((char, index) =>
            index < reveal
              ? char
              : SCRAMBLE_CHARS[
                  Math.floor(Math.random() * SCRAMBLE_CHARS.length)
                ],
          )
          .join(""),
      );
    }, SCRAMBLE_MS);

    return () => window.clearInterval(id);
  }, [isActive, label, reducedMotion]);

  return (
    <span className={className} style={style}>
      {text}
    </span>
  );
}

type NavLinksProps = {
  orientation: "vertical" | "horizontal";
  linkClassName: string;
  linkStyle?: CSSProperties;
  gapClassName: string;
};

export default function NavLinks({
  orientation,
  linkClassName,
  linkStyle,
  gapClassName,
}: NavLinksProps) {
  const pathname = usePathname();
  const isVertical = orientation === "vertical";
  const containerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [promptPos, setPromptPos] = useState<{ x: number; y: number } | null>(
    null,
  );

  const activeIndex = LINKS.findIndex(({ href }) =>
    isLinkActive(pathname, href),
  );

  const textStyle: CSSProperties = {
    ...linkStyle,
    letterSpacing: "-0.2px",
    display: "block",
  };

  const updatePrompt = useCallback(() => {
    const container = containerRef.current;
    const activeLink = linkRefs.current[activeIndex];
    if (!container || !activeLink || activeIndex < 0) {
      setPromptPos(null);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    setPromptPos({
      x: isVertical
        ? linkRect.left - containerRect.left - 11
        : linkRect.left - containerRect.left - 13,
      y: isVertical
        ? linkRect.top - containerRect.top + linkRect.height * 0.5 - 5
        : linkRect.top - containerRect.top + linkRect.height * 0.5 - 6,
    });
  }, [activeIndex, isVertical]);

  useEffect(() => {
    updatePrompt();
  }, [updatePrompt, pathname]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(updatePrompt);
    observer.observe(container);
    linkRefs.current.forEach((link) => {
      if (link) observer.observe(link);
    });

    return () => observer.disconnect();
  }, [updatePrompt, pathname]);

  const overlayStyle: CSSProperties = isVertical
    ? { ...textStyle, position: "absolute", top: 0, left: 0 }
    : {
        ...textStyle,
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      };

  return (
    <div
      ref={containerRef}
      className={`relative grid shrink-0 justify-items-center ${
        isVertical ? `grid-flow-row ${gapClassName}` : `grid-flow-col ${gapClassName}`
      }`}
    >
      {promptPos ? (
        <span
          aria-hidden
          className="nav-prompt pointer-events-none absolute left-0 top-0 text-[var(--red)]"
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
            fontSize: isVertical ? "0.72em" : "0.78em",
            fontWeight: 700,
            lineHeight: 1,
            transform: `translate3d(${promptPos.x}px, ${promptPos.y}px, 0)`,
            transition: `transform 480ms ${PROMPT_EASE}`,
          }}
        >
          {isVertical ? "▸" : ">"}
        </span>
      ) : null}

      {LINKS.map(({ href, label }, index) => {
        const isActive = isLinkActive(pathname, href);

        return (
          <Link
            key={href}
            ref={(node) => {
              linkRefs.current[index] = node;
            }}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className="group/nav relative block shrink-0 select-none"
          >
            <span
              aria-hidden
              className={`opacity-0 pointer-events-none ${linkClassName}`}
              style={{
                ...textStyle,
                fontWeight: 900,
              }}
            >
              {label}
            </span>

            <span
              className={`${linkClassName} ${isVertical ? "" : "text-center"} ${
                isActive
                  ? "text-[var(--red)]"
                  : "text-[var(--fg)] group-hover/nav:text-[var(--hover)]"
              }`}
              style={{
                ...overlayStyle,
                fontWeight: isActive ? 900 : 400,
              }}
            >
              <ScrambleLabel label={label} isActive={isActive} />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
