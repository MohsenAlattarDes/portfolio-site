"use client";

import { useState } from "react";

const secondaryFont = "var(--font-secondary)";

export type InterfaceColor = {
  name: string;
  hex: string;
};

export type InterfaceCategory = {
  label: string;
  color: string;
};

export type InterfaceTypeface = {
  name: string;
  role: string;
  sample: string;
  stack?: string;
  weight?: number;
  sampleSrc?: string;
  dir?: "ltr" | "rtl";
  lang?: string;
};

const DEFAULT_TYPEFACES: InterfaceTypeface[] = [
  {
    name: "ABC Otto",
    role: "Body & UI",
    sample: "Aa",
    stack: '"Qalam ABC Otto", Georgia, serif',
    weight: 500,
  },
  {
    name: "Forma DJR Text",
    role: "Accent",
    sample: "Aa",
    stack: '"Qalam Forma DJR Text", system-ui, sans-serif',
    weight: 800,
  },
  {
    name: "29LT Idris Sharp",
    role: "Arabic display",
    sample: "قلم",
    sampleSrc: "/work/qalam/fonts/specimen-idris.png",
    dir: "rtl",
    lang: "ar",
  },
  {
    name: "29LT Ada Flat",
    role: "Arabic alt",
    sample: "قلم",
    sampleSrc: "/work/qalam/fonts/specimen-ada.png",
    dir: "rtl",
    lang: "ar",
  },
];

export type InterfaceCard = {
  title: string;
  arabicSrc: string;
  subtitle: string;
  illustration: string;
  color: string;
};

const DEFAULT_CARDS: InterfaceCard[] = [
  {
    title: "RTL",
    arabicSrc: "/work/qalam/fonts/title-rtl.png",
    subtitle: "I keep reading the other way.",
    illustration: "/work/qalam/interface/rtl.svg",
    color: "#14ADE5",
  },
  {
    title: "Naskh",
    arabicSrc: "/work/qalam/fonts/title-naskh.png",
    subtitle: "I'm the script you've been reading.",
    illustration: "/work/qalam/interface/naskh-sheep.svg",
    color: "#848B3C",
  },
];

const TOOLBAR_SWATCHES = ["#191923", "#2A6878", "#9D72C5", "#848B3C"];

function PenIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden>
      <path
        d="M8 28L4 28L4 24L22 6L26 10Z"
        fill="#2A6878"
        fillOpacity="0.7"
        stroke="#191923"
        strokeWidth="0.8"
      />
      <path d="M22 6L26 10L28 8L24 4Z" fill="#191923" fillOpacity="0.4" />
      <circle cx="4" cy="28" r="1.2" fill="#191923" />
    </svg>
  );
}

function EraserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden>
      <rect
        x="6"
        y="14"
        width="20"
        height="10"
        rx="2"
        fill="#FFF8F2"
        stroke="#191923"
        strokeWidth="1"
        transform="rotate(-30 16 19)"
      />
      <rect
        x="6"
        y="14"
        width="10"
        height="10"
        rx="1"
        fill="#2A6878"
        fillOpacity="0.3"
        stroke="#191923"
        strokeWidth="1"
        transform="rotate(-30 16 19)"
      />
      <line
        x1="4"
        y1="28"
        x2="28"
        y2="28"
        stroke="#191923"
        strokeWidth="1"
        strokeOpacity="0.3"
      />
    </svg>
  );
}

export default function CaseStudyInterfaceKit({
  colors,
  categories,
  typefaces = DEFAULT_TYPEFACES,
  cards = DEFAULT_CARDS,
  caption,
}: {
  colors: InterfaceColor[];
  categories: InterfaceCategory[];
  typefaces?: InterfaceTypeface[];
  cards?: InterfaceCard[];
  elements?: unknown[];
  caption?: string;
}) {
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [inkColor, setInkColor] = useState<string>(TOOLBAR_SWATCHES[0]!);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSwatch, setActiveSwatch] = useState<string | null>(null);

  return (
    <figure className="work-case-interface">
      <div className="work-case-interface__stage">
        <div className="work-case-interface__hero">
          <div className="work-case-interface__toolbar" role="group" aria-label="Drawing tools">
            <span className="work-case-interface__toolbar-handle" aria-hidden>
              <span />
              <span />
              <span />
            </span>
            <button
              type="button"
              className={`work-case-interface__tool${tool === "pen" ? " is-active" : ""}`}
              aria-pressed={tool === "pen"}
              aria-label="Pen"
              title="Pen"
              onClick={() => setTool("pen")}
            >
              <PenIcon />
            </button>
            <button
              type="button"
              className={`work-case-interface__tool${tool === "eraser" ? " is-active" : ""}`}
              aria-pressed={tool === "eraser"}
              aria-label="Eraser"
              title="Eraser"
              onClick={() => setTool("eraser")}
            >
              <EraserIcon />
            </button>
            <span className="work-case-interface__toolbar-divider" aria-hidden />
            {TOOLBAR_SWATCHES.map((hex) => (
              <button
                type="button"
                key={hex}
                className={`work-case-interface__toolbar-swatch${
                  tool === "pen" && inkColor === hex ? " is-active" : ""
                }`}
                style={{ background: hex }}
                aria-label={`Ink ${hex}`}
                aria-pressed={tool === "pen" && inkColor === hex}
                onClick={() => {
                  setTool("pen");
                  setInkColor(hex);
                }}
              />
            ))}
            <span className="work-case-interface__toolbar-divider" aria-hidden />
            <button
              type="button"
              className="work-case-interface__tool work-case-interface__tool--clear"
              aria-label="Clear canvas"
              title="Clear canvas"
              onClick={() => {
                setTool("pen");
                setInkColor(TOOLBAR_SWATCHES[0]!);
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M4 4l16 16M20 4L4 20"
                  stroke="#2A6878"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="work-case-interface__side">
          <div className="work-case-interface__marks" aria-hidden>
            <span className="work-case-interface__glyph">
              <span className="work-case-interface__hamburger">
                <span />
                <span />
                <span />
              </span>
            </span>
            <span className="work-case-interface__glyph">
              <span className="work-case-interface__close">
                <span />
                <span />
              </span>
            </span>
            <span className="work-case-interface__glyph">
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 5L7 9L11 5"
                  stroke="#2A6878"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="work-case-interface__glyph">
              <span className="work-case-interface__nuqta">
                <span className="work-case-interface__nuqta-ring" />
                <span className="work-case-interface__nuqta-dot" />
              </span>
            </span>
          </div>

          {categories.length > 0 ? (
            <ul className="work-case-interface__dots" aria-label="Category marks">
              {categories.map((category) => {
                const isActive = activeCategory === category.label;
                return (
                  <li key={category.label}>
                    <button
                      type="button"
                      className={`work-case-interface__dot${isActive ? " is-active" : ""}`}
                      style={{
                        backgroundColor: category.color,
                        boxShadow: isActive
                          ? `0 0 0 5px ${category.color}22`
                          : undefined,
                      }}
                      aria-pressed={isActive}
                      onClick={() =>
                        setActiveCategory(isActive ? null : category.label)
                      }
                    >
                      <span
                        className="work-case-interface__dot-tip"
                        style={{ color: category.color, fontFamily: secondaryFont }}
                      >
                        {category.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}

          {typefaces.length > 0 ? (
            <ul className="work-case-interface__typefaces" aria-label="Typefaces">
              {typefaces.map((face) => (
                <li key={face.name} className="work-case-interface__type">
                  <div className="work-case-interface__type-preview">
                    {face.sampleSrc ? (
                      <img
                        src={face.sampleSrc}
                        alt=""
                        className="work-case-interface__type-image"
                        draggable={false}
                      />
                    ) : (
                      <span
                        className="work-case-interface__type-sample"
                        style={{
                          fontFamily: face.stack,
                          fontWeight: face.weight ?? 400,
                        }}
                        dir={face.dir}
                        lang={face.lang}
                      >
                        {face.sample}
                      </span>
                    )}
                  </div>
                  <div
                    className="work-case-interface__type-meta"
                    style={{ fontFamily: secondaryFont }}
                  >
                    <span className="work-case-interface__type-name">{face.name}</span>
                    <span className="work-case-interface__type-role">{face.role}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}

          {colors.length > 0 ? (
            <ul className="work-case-interface__palette" aria-label="Color palette">
              {colors.map((color) => {
                const isActive = activeSwatch === color.hex;
                return (
                  <li key={color.hex} className="work-case-interface__swatch">
                    <button
                      type="button"
                      className={`work-case-interface__chip${isActive ? " is-active" : ""}`}
                      style={{ backgroundColor: color.hex }}
                      aria-pressed={isActive}
                      aria-label={`${color.name} ${color.hex}`}
                      onClick={() =>
                        setActiveSwatch(isActive ? null : color.hex)
                      }
                    />
                    <span
                      className="work-case-interface__swatch-meta"
                      style={{ fontFamily: secondaryFont }}
                    >
                      <span className="work-case-interface__swatch-name">
                        {color.name}
                      </span>
                      <span className="work-case-interface__swatch-hex">
                        {color.hex}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : null}

          {cards.length > 0 ? (
            <ul className="work-case-interface__cards" aria-label="Entry cards">
              {cards.map((card) => (
                <li key={card.title} className="work-case-interface__card-item">
                  <button
                    type="button"
                    className="work-case-interface__card"
                    style={{ borderColor: card.color }}
                  >
                    <span className="work-case-interface__card-head">
                      <span
                        className="work-case-interface__card-title"
                        style={{
                          color: card.color,
                          fontFamily: '"Qalam ABC Otto", Georgia, serif',
                        }}
                      >
                        {card.title}
                      </span>
                      <img
                        src={card.arabicSrc}
                        alt=""
                        className="work-case-interface__card-arabic"
                        draggable={false}
                      />
                    </span>
                    <span className="work-case-interface__card-media">
                      <img src={card.illustration} alt="" draggable={false} />
                    </span>
                    <span
                      className="work-case-interface__card-rule"
                      style={{ borderColor: card.color }}
                    />
                    <span
                      className="work-case-interface__card-subtitle"
                      style={{
                        color: card.color,
                        fontFamily: '"Qalam ABC Otto", Georgia, serif',
                      }}
                    >
                      {card.subtitle}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      {caption ? (
        <figcaption
          className="work-case-caption work-case-interface__caption"
          style={{ fontFamily: secondaryFont }}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
