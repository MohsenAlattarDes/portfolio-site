"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import WorkProjectThumbnail from "@/components/work/WorkProjectThumbnail";
import WorkTitleText from "@/components/WorkTitleText";
import {
  hasProjectThumbnail,
  WORK_PROJECTS,
} from "@/lib/work/projects";

const displayFont =
  "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif";

const DEFAULT_SLUG = WORK_PROJECTS[0].slug;
const AUTO_PREVIEW_PROJECTS = WORK_PROJECTS.filter((project) =>
  hasProjectThumbnail(project.thumbnail),
);
const AUTO_PREVIEW_INTERVAL = 3200;

const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const DURATION = "750ms";
const PREVIEW_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const PREVIEW_DURATION = "1400ms";
const NAME_SCALE_EASE = "cubic-bezier(0.33, 1, 0.68, 1)";
const NAME_SCALE_DURATION = "1000ms";
const BLUR_BLEED = 12;
const STACK_MARGIN = 27;

function syncFooterOffset() {
  const line = document.querySelector<HTMLElement>("[data-footer-line]");
  const content = document.querySelector<HTMLElement>("[data-footer-content]");
  if (!line || !content) return;

  const belowLine = content.offsetHeight + line.offsetHeight;
  document.documentElement.style.setProperty(
    "--work-footer-below-line",
    `${belowLine}px`,
  );
}

function GreyBox({ className = "" }: { className?: string }) {
  return (
    <div
      className={`work-grey-box ${className}`}
      aria-hidden="true"
    />
  );
}

const MOBILE_MQ = "(max-width: 61.999rem)";
const MOBILE_FOCUS_ANCHOR = 0.42;

function MobilePreview({
  project,
  playing,
}: {
  project: (typeof WORK_PROJECTS)[number];
  playing: boolean;
}) {
  return (
    <div className="work-mobile-visual" aria-hidden="true">
      <GreyBox className="absolute inset-0" />
      {hasProjectThumbnail(project.thumbnail) ? (
        <WorkProjectThumbnail
          project={project}
          alt=""
          sizes="(max-width: 480px) 380px, (max-width: 768px) 460px, 540px"
          playing={playing}
        />
      ) : null}
    </div>
  );
}

function SplitPreview({ active }: { active: string }) {
  return (
    <div className="work-split-visual-inner relative h-full w-full">
      <GreyBox className="absolute inset-0" />
      {WORK_PROJECTS.map((project) => {
        if (!hasProjectThumbnail(project.thumbnail)) return null;

        const isVisible = active === project.slug;
        const title = project.lines.join(" ");

        return (
          <div
            key={project.slug}
            className="absolute inset-0"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "scale(1)" : "scale(1.018)",
              transitionProperty: "opacity, transform",
              transitionDuration: PREVIEW_DURATION,
              transitionTimingFunction: PREVIEW_EASE,
              willChange: "opacity, transform",
              zIndex: isVisible ? 2 : 1,
              pointerEvents: "none",
            }}
          >
            <WorkProjectThumbnail
              project={project}
              alt={title}
              sizes="560px"
              priority={project.slug === AUTO_PREVIEW_PROJECTS[0]?.slug}
              playing={isVisible}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function WorkStack() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [autoPreviewIndex, setAutoPreviewIndex] = useState(0);
  const [mobileActiveSlug, setMobileActiveSlug] = useState(DEFAULT_SLUG);
  const mobileItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const hoveredProject = hovered
    ? WORK_PROJECTS.find((project) => project.slug === hovered)
    : undefined;
  const hoveredHasThumbnail = Boolean(
    hoveredProject && hasProjectThumbnail(hoveredProject.thumbnail),
  );
  const autoPreviewSlug =
    AUTO_PREVIEW_PROJECTS[autoPreviewIndex]?.slug ?? DEFAULT_SLUG;
  const previewSlug = hoveredHasThumbnail ? hovered! : autoPreviewSlug;

  const syncLayout = useCallback(() => {
    syncFooterOffset();
  }, []);

  useEffect(() => {
    syncLayout();

    window.addEventListener("resize", syncLayout);

    const scrollRoot = document.querySelector<HTMLElement>(".overflow-y-auto");
    scrollRoot?.addEventListener("scroll", syncLayout, { passive: true });

    const footer = document.querySelector("footer");
    const footerObserver =
      footer && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(syncLayout)
        : null;
    if (footer && footerObserver) footerObserver.observe(footer);

    return () => {
      window.removeEventListener("resize", syncLayout);
      scrollRoot?.removeEventListener("scroll", syncLayout);
      footerObserver?.disconnect();
    };
  }, [syncLayout]);

  useEffect(() => {
    if (hoveredHasThumbnail || AUTO_PREVIEW_PROJECTS.length < 2) return;

    const interval = window.setInterval(() => {
      if (document.hidden) return;
      setAutoPreviewIndex(
        (current) => (current + 1) % AUTO_PREVIEW_PROJECTS.length,
      );
    }, AUTO_PREVIEW_INTERVAL);

    return () => window.clearInterval(interval);
  }, [hoveredHasThumbnail]);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    if (!mq.matches) return;

    const scrollRoot = document.querySelector<HTMLElement>(".overflow-y-auto");
    let frame = 0;

    const measureFocus = () => {
      frame = 0;

      const viewport =
        scrollRoot?.getBoundingClientRect() ?? {
          top: 0,
          height: window.innerHeight,
        };
      const focusY = viewport.top + viewport.height * MOBILE_FOCUS_ANCHOR;

      let nextSlug = WORK_PROJECTS[0].slug;
      let nearest = Number.POSITIVE_INFINITY;

      mobileItemRefs.current.forEach((node, index) => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const centerY = rect.top + rect.height * 0.5;
        const distance = Math.abs(centerY - focusY);
        if (distance < nearest) {
          nearest = distance;
          nextSlug = WORK_PROJECTS[index].slug;
        }
      });

      setMobileActiveSlug((current) =>
        current === nextSlug ? current : nextSlug,
      );
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measureFocus);
    };

    measureFocus();
    scrollRoot?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      scrollRoot?.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const hasSelection = hovered !== null;

  const handleItemLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const next = e.relatedTarget;
    if (next instanceof Element && next.closest("[data-work-item]")) return;
    setHovered(null);
  };

  return (
    <>
      <div
        className="work-split hidden lg:grid"
        onMouseLeave={() => setHovered(null)}
      >
        <aside className="work-split-visual" aria-label="Project preview">
          <SplitPreview active={previewSlug} />
        </aside>

        <div
          className="work-split-list flex flex-col gap-6 overflow-visible px-6 pb-10 pt-10 sm:gap-7 sm:px-10 sm:pt-16 md:px-12 md:pt-20 lg:gap-8 lg:pl-8 lg:pr-16 lg:pt-24 lg:pb-16 xl:pl-10 xl:pr-20"
          data-work-stack
          style={{ marginTop: STACK_MARGIN, marginBottom: STACK_MARGIN }}
          onMouseLeave={() => setHovered(null)}
        >
          {WORK_PROJECTS.map((project) => {
            const isActive = hovered === project.slug;
            const isDimmed = hasSelection && !isActive;
            const title = project.lines.join(" ");

            return (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                data-work-item
                className="group block w-full min-w-0 max-w-full touch-manipulation overflow-visible"
                aria-label={`${title} — ${project.category}`}
                onMouseEnter={() => setHovered(project.slug)}
                onMouseLeave={handleItemLeave}
              >
                <div
                  className="flex w-full min-w-0 max-w-full flex-col gap-[3px] overflow-visible lg:gap-[5px]"
                  style={{
                    padding: BLUR_BLEED,
                    marginTop: -BLUR_BLEED,
                    marginBottom: -BLUR_BLEED,
                    filter: isDimmed ? "blur(5px)" : "blur(0px)",
                    transitionProperty: "filter",
                    transitionDuration: DURATION,
                    transitionTimingFunction: EASE,
                  }}
                >
                  <div
                    className="relative w-full min-w-0 max-w-full"
                    style={{
                      transform: isActive ? "scale(1.08)" : "scale(1)",
                      transformOrigin: "left bottom",
                      transitionProperty: "transform",
                      transitionDuration: NAME_SCALE_DURATION,
                      transitionTimingFunction: NAME_SCALE_EASE,
                    }}
                  >
                    <h2
                      className={`work-split-title max-w-full uppercase text-[28px] leading-[0.88] sm:text-[34px] md:text-[40px] lg:text-[72px] xl:text-[88px] 2xl:text-[96px] transition-colors ${
                        isDimmed ? "text-[var(--hover)]" : "text-[var(--red)]"
                      }`}
                      style={{
                        fontFamily: displayFont,
                        fontWeight: 400,
                        letterSpacing: "-0.03em",
                        transitionDuration: DURATION,
                        transitionTimingFunction: EASE,
                      }}
                    >
                      <WorkTitleText text={title} />
                    </h2>
                  </div>

                <p
                  className={`tracking-[0.08em] uppercase text-[11px] leading-snug sm:text-[12px] lg:text-[14px] transition-colors ${
                    isDimmed ? "text-[var(--hover)]" : "text-[var(--fg)]"
                  }`}
                    style={{
                      fontFamily: "var(--font-secondary)",
                      transitionDuration: DURATION,
                      transitionTimingFunction: EASE,
                    }}
                  >
                    {project.category}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div
        className="work-mobile-stack overflow-visible pb-10 pt-10 sm:pt-16 md:pt-20"
        data-work-stack
        style={{ marginTop: STACK_MARGIN, marginBottom: STACK_MARGIN }}
      >
        {WORK_PROJECTS.map((project, index) => {
          const title = project.lines.join(" ");
          const isActive = mobileActiveSlug === project.slug;

          return (
            <Link
              key={project.slug}
              ref={(node) => {
                mobileItemRefs.current[index] = node;
              }}
              href={`/work/${project.slug}`}
              data-work-item
              data-work-mobile-active={isActive ? "true" : "false"}
              className="work-mobile-item"
              aria-label={`${title} — ${project.category}`}
            >
              <div
                className="work-mobile-item__focus"
                style={{
                  filter: isActive ? "blur(0px)" : "blur(5px)",
                  opacity: isActive ? 1 : 0.58,
                  transform: isActive ? "scale(1)" : "scale(0.9)",
                  transition: `filter ${DURATION} ${EASE}, opacity ${DURATION} ${EASE}, transform ${NAME_SCALE_DURATION} ${NAME_SCALE_EASE}`,
                }}
              >
                <MobilePreview project={project} playing={isActive} />
                <div className="work-mobile-copy">
                  <h2
                    className={`work-mobile-title uppercase text-[44px] leading-[0.88] sm:text-[52px] md:text-[64px] transition-colors ${
                      isActive ? "text-[var(--red)]" : "text-[var(--hover)]"
                    }`}
                    style={{
                      fontFamily: displayFont,
                      fontWeight: 400,
                      letterSpacing: "-0.03em",
                      transitionDuration: DURATION,
                      transitionTimingFunction: EASE,
                    }}
                  >
                    <WorkTitleText text={title} />
                  </h2>
                  <p
                    className={`tracking-[0.08em] uppercase text-[11px] leading-snug sm:text-[12px] transition-colors ${
                      isActive ? "text-[var(--fg)]" : "text-[var(--hover)]"
                    }`}
                    style={{
                      fontFamily: "var(--font-secondary)",
                      transitionDuration: DURATION,
                      transitionTimingFunction: EASE,
                    }}
                  >
                    {project.category}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
