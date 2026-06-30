"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useRef, useState } from "react";
import AboutSketch from "@/components/AboutSketch";
import { ABOUT_CONTACT_LINKS } from "@/lib/about/contact";

const PORTRAIT = {
  dark: "/about/headshot-dark.jpg",
  light: "/about/headshot-light.jpg",
} as const;

const displayFont =
  "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif";

const headingStyle = {
  fontFamily: displayFont,
  fontWeight: 400,
  letterSpacing: "-0.03em",
} as const;

const BIO = [
  "My story begins with Arabic type. Growing up in Kuwait, it surrounded me, not just as written words, but as symbols of culture and identity. Its rhythm and history captivates me, and I imagine how it will continue to transform in the years ahead.",
  "Design, to me, is not about surface beauty. It is about uncovering meaning, tracing connections, and shaping ideas that resonate. I am guided by curiosity and the pursuit of fascinating design. These are the forces that keep me questioning, learning, and creating with intention.",
];

const LOCATIONS = ["KUWAIT", "LOS ANGELES"] as const;

const FLIP_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const FLIP_MS = 700;
const FLIP_HOLD_MS = 2800;

function FlipLocation({ phrase }: { phrase: string }) {
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
    }, FLIP_MS);
  }, [phrase, active]);

  useEffect(
    () => () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    },
    [],
  );

  return (
    <span
      className="about-location-flip"
      style={{ ["--at-travel" as string]: "22px" }}
    >
      <span
        key={`active-${animKey}`}
        className="about-location-flip-layer"
        style={{
          willChange: exiting !== null ? "transform, opacity" : undefined,
          animation:
            exiting !== null
              ? `at-enter ${FLIP_MS}ms ${FLIP_EASE} both`
              : undefined,
        }}
      >
        {active}
      </span>
      {exiting !== null ? (
        <span
          key={`exit-${animKey}`}
          aria-hidden
          className="about-location-flip-layer"
          style={{
            willChange: "transform, opacity",
            animation: `at-exit ${FLIP_MS}ms ${FLIP_EASE} both`,
          }}
        >
          {exiting}
        </span>
      ) : null}
    </span>
  );
}

function AboutPortrait() {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [canParallax, setCanParallax] = useState(false);
  const imageTransform = {
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${active ? 1.04 : 1})`,
  } as const;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 62rem) and (hover: hover)");
    const sync = () => setCanParallax(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canParallax || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x: x * 14, y: y * 10 });
  };

  const reset = () => {
    setOffset({ x: 0, y: 0 });
    setActive(false);
  };

  return (
    <div
      ref={ref}
      className={`about-visual-inner group ${active ? "about-visual-inner--active" : ""}`}
      role="img"
      aria-label="Mohsen Alattar portrait"
      onMouseMove={handleMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={reset}
    >
      <Image
        src={PORTRAIT.dark}
        alt=""
        width={1840}
        height={2304}
        priority
        unoptimized
        className="about-portrait-image about-portrait-image--dark absolute inset-0 h-full w-full object-contain object-bottom"
        style={imageTransform}
        sizes="(max-width: 992px) 100vw, 420px"
      />
      <Image
        src={PORTRAIT.light}
        alt=""
        width={1840}
        height={2304}
        unoptimized
        aria-hidden
        className="about-portrait-image about-portrait-image--light absolute inset-0 h-full w-full object-contain object-bottom"
        style={imageTransform}
        sizes="(max-width: 992px) 100vw, 420px"
      />
      <div className="about-portrait-frame" aria-hidden="true" />
    </div>
  );
}

export default function AboutContent() {
  const [locationIdx, setLocationIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hoveredContact, setHoveredContact] = useState<string | null>(null);
  const [canHoverContact, setCanHoverContact] = useState(false);
  const hasContactSelection = canHoverContact && hoveredContact !== null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hoverMq = window.matchMedia("(min-width: 62rem) and (hover: hover)");
    const sync = () => {
      setReducedMotion(motionMq.matches);
      setCanHoverContact(hoverMq.matches);
    };
    sync();
    motionMq.addEventListener("change", sync);
    hoverMq.addEventListener("change", sync);
    return () => {
      motionMq.removeEventListener("change", sync);
      hoverMq.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => {
      setLocationIdx((i) => (i + 1) % LOCATIONS.length);
    }, FLIP_HOLD_MS + FLIP_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  return (
    <section className="about-layout">
      <AboutSketch />
      <div className="about-grid">
        <header className="about-intro">
          <h1
            className="about-me-title uppercase leading-[0.9] text-[var(--red)]"
            style={headingStyle}
          >
            ABOUT ME
            <span
              className="about-me-sofar nav-prompt block normal-case text-[var(--red)]"
              style={{ fontFamily: "var(--font-secondary)" }}
            >
              (so far)
            </span>
          </h1>
        </header>

        <div className="about-visual">
          <AboutPortrait />
        </div>

        <div className="about-copy">
          <div className="about-location-block">
            <p
              className="about-heading uppercase leading-[0.9] text-[var(--red)]"
              style={headingStyle}
            >
              BASED IN
            </p>
            <p
              className="about-location-city uppercase leading-[0.9] text-[var(--red)]"
              style={headingStyle}
            >
              {reducedMotion ? (
                "KW + LA"
              ) : (
                <FlipLocation phrase={LOCATIONS[locationIdx]} />
              )}
            </p>
          </div>

          <div
            className="about-bio"
            style={{ fontFamily: "var(--font-secondary)" }}
          >
            {BIO.map((paragraph, index) => (
              <p
                key={paragraph.slice(0, 24)}
                className={`text-[14px] leading-[1.45] text-[var(--fg)] sm:text-[15px] lg:text-[16px] ${
                  mounted && !reducedMotion ? "about-bio-paragraph" : ""
                }`}
                style={
                  mounted && !reducedMotion
                    ? { animationDelay: `${index * 140}ms` }
                    : undefined
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="about-connect-section">
            <h2
              className="about-connect-title uppercase leading-[0.9] text-[var(--red)]"
              style={headingStyle}
            >
              LET<span className="about-t-apos">&apos;</span>S CONNECT
            </h2>

            <nav
              className="about-contact"
              aria-label="Contact"
              onMouseLeave={() => setHoveredContact(null)}
            >
              {ABOUT_CONTACT_LINKS.map(({ label, href, ...rest }) => {
                const external = "external" in rest && rest.external;
                const isExternalHref =
                  href.startsWith("http") ||
                  href.startsWith("mailto:") ||
                  href.startsWith("tel:");
                const isActive = hoveredContact === label;
                const isDimmed = hasContactSelection && !isActive;
                const className = "about-contact-link";

                const linkStyle = {
                  fontFamily: "var(--font-secondary)",
                  filter: isDimmed ? "blur(4px)" : "blur(0px)",
                  transform: isActive ? "scale(1.06)" : "scale(1)",
                  color: isDimmed ? "var(--hover)" : "var(--red)",
                } as const;

                const sharedProps = {
                  className,
                  style: linkStyle,
                  ...(canHoverContact
                    ? { onMouseEnter: () => setHoveredContact(label) }
                    : {}),
                };

                if (external || isExternalHref) {
                  return (
                    <a
                      key={label}
                      href={href}
                      {...sharedProps}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {label}
                    </a>
                  );
                }

                return (
                  <Link key={label} href={href as Route} {...sharedProps}>
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
