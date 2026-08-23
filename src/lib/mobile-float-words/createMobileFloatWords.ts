import type p5js from "p5";
import { wrapIndex } from "@/lib/code-sketches/utils";
import {
  ALPHA_MAX,
  ALPHA_MIN,
  EDGE_PAD,
  FADE_MS,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  SWAP_MS_MAX,
  SWAP_MS_MIN,
  WORD_COUNT,
} from "@/lib/mobile-float-words/constants";
import { FLOAT_PHRASES } from "@/lib/mobile-float-words/phrases";
import { themeColors } from "@/lib/ocean-wave/theme";
import { resolveLatinFont } from "@/lib/sketch-font";

type P5 = InstanceType<typeof p5js>;

type Floater = {
  phrase: string;
  phraseIdx: number;
  zone: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  wobble: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  swapAt: number;
  fadingOut: boolean;
};

const ZONE_COLS = 2;

function zoneGridRows() {
  return Math.ceil(WORD_COUNT / ZONE_COLS);
}

function pickPhraseIndex(p: P5, exclude: ReadonlySet<number>) {
  if (exclude.size >= FLOAT_PHRASES.length) {
    return p.floor(p.random(FLOAT_PHRASES.length));
  }

  let idx = p.floor(p.random(FLOAT_PHRASES.length));
  let guard = 0;
  while (exclude.has(idx) && guard < 24) {
    idx = wrapIndex(idx + 1 + p.floor(p.random(3)), FLOAT_PHRASES.length);
    guard++;
  }
  return idx;
}

function zoneCenter(
  p: P5,
  zone: number,
  width: number,
  height: number,
) {
  const cols = ZONE_COLS;
  const rows = zoneGridRows();
  const col = zone % cols;
  const row = Math.floor(zone / cols);
  const cellW = width / cols;
  const cellH = height / rows;
  const jitterX = cellW * 0.34;
  const jitterY = cellH * 0.34;

  return {
    x: p.constrain(
      (col + 0.5) * cellW + p.random(-jitterX, jitterX),
      EDGE_PAD,
      width - EDGE_PAD,
    ),
    y: p.constrain(
      (row + 0.5) * cellH + p.random(-jitterY, jitterY),
      EDGE_PAD,
      height - EDGE_PAD,
    ),
  };
}

function randomVelocity(p: P5) {
  const angle = p.random(p.TWO_PI);
  const speed = p.random(0.24, 0.48);
  return {
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
  };
}

function placeFloater(
  p: P5,
  floater: Floater,
  zone: number,
  width: number,
  height: number,
) {
  const pos = zoneCenter(p, zone, width, height);
  floater.zone = zone;
  floater.x = pos.x;
  floater.y = pos.y;
  const vel = randomVelocity(p);
  floater.vx = vel.vx;
  floater.vy = vel.vy;
}

function pickNextZone(p: P5, current: number, occupied: ReadonlySet<number>) {
  if (occupied.size >= WORD_COUNT) {
    return p.floor(p.random(WORD_COUNT));
  }

  let zone = p.floor(p.random(WORD_COUNT));
  let guard = 0;
  while ((zone === current || occupied.has(zone)) && guard < 24) {
    zone = wrapIndex(zone + 1 + p.floor(p.random(2)), WORD_COUNT);
    guard++;
  }
  return zone;
}

function spawnFloater(
  p: P5,
  used: ReadonlySet<number>,
  zone: number,
  width: number,
  height: number,
  now: number,
): Floater {
  const phraseIdx = pickPhraseIndex(p, used);
  const floater: Floater = {
    phrase: FLOAT_PHRASES[phraseIdx],
    phraseIdx,
    zone,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    wobble: p.random(p.TWO_PI),
    size: p.random(FONT_SIZE_MIN, FONT_SIZE_MAX),
    alpha: 0,
    targetAlpha: p.random(ALPHA_MIN, ALPHA_MAX),
    swapAt: now + p.random(SWAP_MS_MIN, SWAP_MS_MAX),
    fadingOut: false,
  };

  placeFloater(p, floater, zone, width, height);
  return floater;
}

function usedPhraseIndices(floaters: Floater[]) {
  return new Set(floaters.map((f) => f.phraseIdx));
}

function occupiedZones(floaters: Floater[], except?: Floater) {
  const zones = new Set<number>();
  for (const floater of floaters) {
    if (floater !== except) zones.add(floater.zone);
  }
  return zones;
}

function wrapFloater(p: P5, floater: Floater) {
  const bleed = 24;
  if (floater.x < -bleed) floater.x = p.width + bleed;
  if (floater.x > p.width + bleed) floater.x = -bleed;
  if (floater.y < -bleed) floater.y = p.height + bleed;
  if (floater.y > p.height + bleed) floater.y = -bleed;
}

export function createMobileFloatWords(container: HTMLElement) {
  const floaters: Floater[] = [];
  let reducedMotion = false;

  function resizeToContainer(p: P5) {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    if (w === 0 || h === 0) return false;
    p.resizeCanvas(w, h, false);
    return true;
  }

  function seedFloaters(p: P5) {
    floaters.length = 0;
    const now = p.millis();
    for (let i = 0; i < WORD_COUNT; i++) {
      const floater = spawnFloater(
        p,
        usedPhraseIndices(floaters),
        i,
        p.width,
        p.height,
        now,
      );
      floater.alpha = floater.targetAlpha;
      floaters.push(floater);
    }
  }

  function swapPhrase(p: P5, floater: Floater, now: number) {
    const used = usedPhraseIndices(floaters);
    used.delete(floater.phraseIdx);
    const nextIdx = pickPhraseIndex(p, used);
    const nextZone = pickNextZone(
      p,
      floater.zone,
      occupiedZones(floaters, floater),
    );

    floater.phraseIdx = nextIdx;
    floater.phrase = FLOAT_PHRASES[nextIdx];
    floater.size = p.random(FONT_SIZE_MIN, FONT_SIZE_MAX);
    floater.targetAlpha = p.random(ALPHA_MIN, ALPHA_MAX);
    floater.fadingOut = false;
    floater.swapAt = now + p.random(SWAP_MS_MIN, SWAP_MS_MAX);
    placeFloater(p, floater, nextZone, p.width, p.height);
  }

  return (p: P5) => {
    p.setup = () => {
      const canvas = p.createCanvas(1, 1);
      canvas.parent(container);
      canvas.elt.style.background = "transparent";
      p.frameRate(30);
      p.textFont(resolveLatinFont());
      p.textStyle(p.BOLD);
      reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (resizeToContainer(p)) seedFloaters(p);
    };

    p.draw = () => {
      if (p.width < 2 || p.height < 2) return;

      const { red } = themeColors();
      p.clear();

      const now = p.millis();
      const fadeStep = p.deltaTime / FADE_MS;

      p.textFont(resolveLatinFont());
      p.textStyle(p.BOLD);
      p.textAlign(p.CENTER, p.CENTER);
      p.noStroke();

      for (const floater of floaters) {
        if (!reducedMotion) {
          floater.x += floater.vx;
          floater.y += floater.vy;
          floater.wobble += 0.018;

          floater.x += Math.sin(floater.wobble) * 0.35;
          floater.y += Math.cos(floater.wobble * 0.85) * 0.28;

          wrapFloater(p, floater);
        }

        if (!reducedMotion && now >= floater.swapAt) {
          if (!floater.fadingOut) {
            floater.fadingOut = true;
            floater.targetAlpha = 0;
          } else if (floater.alpha <= 2) {
            swapPhrase(p, floater, now);
          }
        }

        if (floater.fadingOut) {
          floater.alpha = p.lerp(floater.alpha, 0, fadeStep);
        } else {
          floater.alpha = p.lerp(floater.alpha, floater.targetAlpha, fadeStep * 0.85);
        }

        p.textSize(floater.size);
        p.fill(red[0], red[1], red[2], floater.alpha);
        p.text(floater.phrase, floater.x, floater.y);
      }
    };

    p.windowResized = () => {
      if (!resizeToContainer(p)) return;
      if (floaters.length === 0) {
        seedFloaters(p);
        return;
      }

      floaters.forEach((floater, index) => {
        placeFloater(p, floater, index % WORD_COUNT, p.width, p.height);
      });
    };
  };
}
