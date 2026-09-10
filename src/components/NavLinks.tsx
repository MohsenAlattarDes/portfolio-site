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
import ScrambleText from "@/components/ScrambleText";

const LINKS = [
  { href: "/", label: "HOME" },
  { href: "/work", label: "WORK" },
  { href: "/about", label: "ABOUT" },
] as const;

const PROMPT_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

function isLinkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
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
    ? {
        ...textStyle,
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%) rotate(180deg)",
      }
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
            className={`group/nav relative block shrink-0 select-none${
              isVertical ? " justify-self-center" : ""
            }`}
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
              <ScrambleText text={label} active={isActive} />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
