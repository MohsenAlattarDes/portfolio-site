import type { SketchFactory } from "@/lib/code-sketches/mountExperiment";
import { createBaselineGrid } from "@/lib/code-sketches/experiments/baselineGrid";
import { createCounterSpace } from "@/lib/code-sketches/experiments/counterSpace";
import { createKerningField } from "@/lib/code-sketches/experiments/kerningField";
import { createLigaturePull } from "@/lib/code-sketches/experiments/ligaturePull";
import { createMagneticFilings } from "@/lib/code-sketches/experiments/magneticFilings";
import { createMoireGrid } from "@/lib/code-sketches/experiments/moireGrid";
import { createPendulumLetters } from "@/lib/code-sketches/experiments/pendulumLetters";
import { createSpecimenStack } from "@/lib/code-sketches/experiments/specimenStack";
import { createTrackingSlider } from "@/lib/code-sketches/experiments/trackingSlider";
import { createCatchTheName } from "@/lib/code-sketches/experiments/catchTheName";
import { createFlowFill } from "@/lib/code-sketches/experiments/flowFill";
import { createGlyphField } from "@/lib/code-sketches/experiments/glyphField";
import { createLineVolume } from "@/lib/code-sketches/experiments/lineVolume";
import { createOceanWave } from "@/lib/ocean-wave/createOceanWave";
import { createTypeMosaic } from "@/lib/code-sketches/experiments/typeMosaic";
import { createHireMeBreakout } from "@/lib/code-sketches/experiments/hireMeBreakout";
import { createSkillPop } from "@/lib/code-sketches/experiments/skillPop";
import { createTitleSlot } from "@/lib/code-sketches/experiments/titleSlot";
import { createTypePong } from "@/lib/code-sketches/experiments/typePong";
import { createTypographicTrail } from "@/lib/code-sketches/experiments/typographicTrail";

export type ExperimentDef = {
  id: string;
  title: string;
  description: string;
  hint: string;
  framed?: boolean;
  game?: boolean;
  immersive?: boolean;
  section?: "play" | "specimen" | "arcade" | "field";
  createSketch: SketchFactory;
};

export const EXPERIMENTS: ExperimentDef[] = [
  {
    id: "magnetic-filings",
    title: "01 — Magnetic Filings",
    description:
      "Thousands of red ticks orient toward your cursor like iron filings. Move up and down to change field strength and scatter.",
    hint: "mouseY → field strength · mouseX → jitter",
    section: "play",
    createSketch: createMagneticFilings,
  },
  {
    id: "kerning-field",
    title: "02 — Kerning Field",
    description:
      "A headline stretches and swells as you move through it — letters near the cursor grow and drift, like live typesetting.",
    hint: "mouseX → scale · mouseY → tracking spread",
    section: "play",
    createSketch: createKerningField,
  },
  {
    id: "moire-grid",
    title: "03 — Moiré Grid",
    description:
      "Two line grids slide past each other to build interference patterns. Classic optical print energy, driven by position.",
    hint: "mouseX → phase shift · mouseY → line spacing",
    section: "play",
    createSketch: createMoireGrid,
  },
  {
    id: "pendulum-letters",
    title: "04 — Pendulum Letters",
    description:
      "Weighted glyphs hang from the top edge and swing on strings. Push them around with your cursor like a soft physics toy.",
    hint: "mouseY → push force · proximity → repulsion",
    section: "play",
    createSketch: createPendulumLetters,
  },
  {
    id: "typographic-trail",
    title: "05 — Typographic Trail",
    description:
      "Move to leave a fading ribbon of rotating letterforms — Latin and Arabic glyphs cycle as you draw paths through the canvas.",
    hint: "speed → spawn rate · mouseY → glyph size",
    section: "play",
    createSketch: createTypographicTrail,
  },
  {
    id: "baseline-grid",
    title: "06 — Baseline Grid",
    description:
      "A typeset line rides a ruled baseline grid. Skew and size respond to cursor position — editorial rhythm made interactive.",
    hint: "mouseX → italic skew · mouseY → leading",
    framed: true,
    section: "specimen",
    createSketch: createBaselineGrid,
  },
  {
    id: "counter-space",
    title: "07 — Counter Space",
    description:
      "Hollow letter specimens with editable counters. Move closer to collapse or expand the inner shape. Click to cycle glyphs.",
    hint: "proximity → counter scale · click → next glyph",
    framed: true,
    section: "specimen",
    createSketch: createCounterSpace,
  },
  {
    id: "ligature-pull",
    title: "08 — Ligature Pull",
    description:
      "Letter pairs drift apart until your cursor pulls them into a ligature — Latin fi/fl and Arabic pairs included. Click to switch.",
    hint: "cursor → snap distance · mouseY → snap threshold",
    framed: true,
    section: "specimen",
    createSketch: createLigaturePull,
  },
  {
    id: "tracking-slider",
    title: "09 — Tracking Slider",
    description:
      "A single word stretches and compresses like a live tracking control in InDesign. Pure letter-spacing play.",
    hint: "mouseX → tracking · mouseY → point size",
    framed: true,
    section: "specimen",
    createSketch: createTrackingSlider,
  },
  {
    id: "specimen-stack",
    title: "10 — Specimen Stack",
    description:
      "A vertical stack of Aa specimens at increasing optical sizes. Hover a row to highlight weight and slide the glyph.",
    hint: "mouseY → select row · mouseX → slide",
    framed: true,
    section: "specimen",
    createSketch: createSpecimenStack,
  },
  {
    id: "type-pong",
    title: "11 — Type Pong",
    description:
      "Classic pong — your paddle is I, the CPU is O, and the ball is a bullet. Move vertically to defend. First to score wins bragging rights.",
    hint: "mouseY → paddle · click → serve · double-click → reset",
    game: true,
    section: "arcade",
    createSketch: createTypePong,
  },
  {
    id: "title-slot",
    title: "12 — Title Slot Machine",
    description:
      "Spin the role generator — random designer titles from the portfolio shuffle like a casino. Click to spin your next identity.",
    hint: "click → spin the reels",
    game: true,
    section: "arcade",
    createSketch: createTitleSlot,
  },
  {
    id: "hire-me-breakout",
    title: "13 — HIRE ME Breakout",
    description:
      "Smash through the bricks to spell HIRE ME. Move your paddle with the mouse, click to launch. Clear the wall to win.",
    hint: "mouseX → paddle · click → launch",
    game: true,
    section: "arcade",
    createSketch: createHireMeBreakout,
  },
  {
    id: "skill-pop",
    title: "14 — Skill Bubble Pop",
    description:
      "Design skills float up as bubbles — Type, Brand, Figma, Arabic, Code. Hover or click to pop them before they escape.",
    hint: "hover / click → pop bubbles",
    game: true,
    section: "arcade",
    createSketch: createSkillPop,
  },
  {
    id: "catch-the-name",
    title: "15 — Catch the Name",
    description:
      "Letters rain down — catch M-O-H-S-E-N in order with your basket. Build combos, complete the name, feel like a portfolio arcade.",
    hint: "mouseX → basket · catch letters in sequence",
    game: true,
    section: "arcade",
    createSketch: createCatchTheName,
  },
  {
    id: "glyph-field",
    title: "16 — Glyph Field",
    description:
      "The entire canvas is packed with letterforms — Latin and Arabic — all shifting and swelling as your cursor moves through the field.",
    hint: "fills the frame · cursor → warp + glow",
    immersive: true,
    section: "field",
    createSketch: createGlyphField,
  },
  {
    id: "flow-fill",
    title: "17 — Flow Fill",
    description:
      "Thousands of red strokes stream across every inch of the canvas, following a noise field bent toward your mouse.",
    hint: "fills the frame · mouseY → stroke length",
    immersive: true,
    section: "field",
    createSketch: createFlowFill,
  },
  {
    id: "line-volume",
    title: "18 — Line Volume",
    description:
      "Horizontal lines stack from edge to edge, compressing and bending into volumetric waves — the whole surface breathes.",
    hint: "fills the frame · mouseX → bend · mouseY → density",
    immersive: true,
    section: "field",
    createSketch: createLineVolume,
  },
  {
    id: "type-mosaic",
    title: "19 — Type Mosaic",
    description:
      "Portfolio words tile wall-to-wall at different depths. Move to parallax the entire typographic surface.",
    hint: "fills the frame · mouse → parallax drift",
    immersive: true,
    section: "field",
    createSketch: createTypeMosaic,
  },
  {
    id: "ocean-wave",
    title: "20 — Ocean Wave",
    description:
      "Designer one-liners tile every scanline — hire mohsen, kerning matters, final_final_v9.pdf. The whole field ripples in waves under your cursor.",
    hint: "fills the frame · cursor → ripple wave · lines scroll slowly",
    immersive: true,
    section: "field",
    createSketch: createOceanWave,
  },
];

export const EXPERIMENT_SECTIONS = [
  { id: "field", label: "Full bleed" },
  { id: "play", label: "Play" },
  { id: "specimen", label: "Type lab" },
  { id: "arcade", label: "Arcade" },
] as const;
