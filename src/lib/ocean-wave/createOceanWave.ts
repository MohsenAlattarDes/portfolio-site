import type p5js from "p5";
import { wrapIndex } from "@/lib/code-sketches/utils";
import { themeColors } from "@/lib/ocean-wave/theme";
import { resolveLatinFont } from "@/lib/sketch-font";

type P5 = InstanceType<typeof p5js>;

const PHRASES = [
  "hire mohsen",
  "open to work",
  "need a logo?",
  "kerning matters",
  "free internship? no.",
  "will design for coffee",
  "not for exposure",
  "type is life",
  "designer not magician",
  "send a brief not vibes",
  "branding emergency",
  "ctrl+z my soul",
  "final_final_v9.pdf",
  "pixel perfect-ish",
  "comic sans is not that bad",
  "i do not like adobe",
  "brief was unclear",
  "i love glyphs",
  "arabic type too",
  "mouse for drama",
  "portfolio go brr",
  "leading trailing crying",
  "trust the process",
  "lowercase screaming",
] as const;

const READABILITY = {
  baseAlpha: 126,
  sinAmp: 14,
  boost: 20,
  minAlpha: 108,
};

const ROW_STEP = 13;
const WAVE_FREQ = 0.038;
const WAVE_AMP = 8;
const ROW_PHASE = 0.55;
const SCROLL_SPEED = 0.022;

const CURSOR_HALF_W = 10;
const CURSOR_HALF_H = 10;
const REPEL_RANGE = 110;
const MAX_REPEL = 34;

function cellHash(row: number, globalIdx: number) {
  return (
    (row * 97_931 +
      globalIdx * 54_367 +
      (row ^ globalIdx) * 17_389) >>>
    0
  );
}

function cellPhraseIndex(row: number, globalIdx: number) {
  return wrapIndex(row * 5 + globalIdx * 17, PHRASES.length);
}

function cellWidth(row: number, globalIdx: number) {
  return 50 + (cellHash(row, globalIdx) % 30);
}

function cellJitterX(row: number, globalIdx: number) {
  return (cellHash(row, globalIdx) % 23) - 11;
}

function cellJitterY(row: number, globalIdx: number) {
  return ((cellHash(row, globalIdx) >> 3) % 11) - 5;
}

function cellSize(row: number, globalIdx: number) {
  return 10 + (cellHash(row, globalIdx) % 3) * 0.5;
}

function cursorRepulsion(
  x: number,
  y: number,
  mx: number,
  my: number,
  inside: boolean,
) {
  if (!inside) {
    return { phase: 0, lift: 0, boost: 0, repelX: 0, repelY: 0, amp: 1 };
  }

  const dx = x - mx;
  const dy = y - my;

  const outsideX = Math.abs(dx) - CURSOR_HALF_W;
  const outsideY = Math.abs(dy) - CURSOR_HALF_H;
  const outsideDist = Math.hypot(
    Math.max(outsideX, 0),
    Math.max(outsideY, 0),
  );
  const insideDist = Math.min(Math.max(outsideX, outsideY), 0);
  const sdf = outsideDist + insideDist;

  if (sdf > REPEL_RANGE) {
    return { phase: 0, lift: 0, boost: 0, repelX: 0, repelY: 0, amp: 1 };
  }

  let dirX: number;
  let dirY: number;

  if (sdf <= 0) {
    const toEdgeX = CURSOR_HALF_W - Math.abs(dx);
    const toEdgeY = CURSOR_HALF_H - Math.abs(dy);
    if (toEdgeX < toEdgeY) {
      dirX = dx >= 0 ? 1 : -1;
      dirY = 0;
    } else {
      dirX = 0;
      dirY = dy >= 0 ? 1 : -1;
    }
  } else {
    const closestX = mx + Math.max(-CURSOR_HALF_W, Math.min(CURSOR_HALF_W, dx));
    const closestY = my + Math.max(-CURSOR_HALF_H, Math.min(CURSOR_HALF_H, dy));
    const nx = x - closestX;
    const ny = y - closestY;
    const len = Math.hypot(nx, ny) || 1;
    dirX = nx / len;
    dirY = ny / len;
  }

  const strength = sdf <= 0 ? 1 : Math.pow(1 - sdf / REPEL_RANGE, 2);
  const eased = strength * strength;

  return {
    phase: eased * 0.35,
    lift: eased * 2,
    boost: eased * 48,
    repelX: dirX * eased * MAX_REPEL,
    repelY: dirY * eased * MAX_REPEL,
    amp: 1 + eased * 0.35,
  };
}

export function createOceanWave(container: HTMLElement) {
  function resizeToContainer(p: P5) {
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    if (w === 0 || h === 0) return false;
    p.resizeCanvas(w, h);
    return true;
  }

  return (p: P5) => {
    p.setup = () => {
      const canvas = p.createCanvas(1, 1);
      canvas.parent(container);
      p.frameRate(60);
      p.textFont(resolveLatinFont());
      p.textStyle(p.BOLD);
      resizeToContainer(p);
    };

    p.draw = () => {
      if (p.width < 2 || p.height < 2) return;

      const { bg, red } = themeColors();
      p.background(bg[0], bg[1], bg[2]);

      const inside =
        p.mouseX >= 0 &&
        p.mouseX <= p.width &&
        p.mouseY >= 0 &&
        p.mouseY <= p.height;
      const mx = inside ? p.mouseX : p.width * 0.5;
      const my = inside ? p.mouseY : p.height * 0.5;

      const t = p.millis() * 0.001;
      const scrollPx = p.millis() * SCROLL_SPEED;
      const phaseShift = inside ? (mx / p.width - 0.5) * 0.85 : 0;
      const mouseWaveScale = inside
        ? p.map(my, 0, p.height, 0.9, 1.25)
        : 1;
      const rows = Math.ceil(p.height / ROW_STEP) + 2;

      p.textFont(resolveLatinFont());
      p.textStyle(p.BOLD);
      p.textAlign(p.CENTER, p.CENTER);
      p.noStroke();

      for (let row = 0; row < rows; row++) {
        const rowScroll = scrollPx + row * 53.7;
        const rowYOffset = ((row * 19) % 9) - 4;
        const baseY = row * ROW_STEP + rowYOffset;
        const rowT = row * ROW_PHASE + t * 1.25 + phaseShift;

        let x = -(rowScroll % 78) - 22;
        let g = Math.floor(rowScroll / 66) - 3;

        while (x < p.width + 90) {
          const gw = cellWidth(row, g);
          const cx = x + gw * 0.5 + cellJitterX(row, g);

          const influence = cursorRepulsion(cx, baseY, mx, my, inside);
          const localT = rowT + influence.phase;

          const amp = WAVE_AMP * influence.amp * mouseWaveScale;
          const waveY =
            Math.sin(cx * WAVE_FREQ + localT) * amp +
            Math.sin(cx * WAVE_FREQ * 2.05 + localT * 0.65) * (amp * 0.24);

          const y =
            baseY +
            waveY +
            cellJitterY(row, g) -
            influence.lift +
            influence.repelY;
          const drawX = cx + influence.repelX;

          const phrase = PHRASES[cellPhraseIndex(row, g)];
          const alpha = p.constrain(
            READABILITY.baseAlpha +
              Math.sin(row * 0.45 + t + cx * 0.008) * READABILITY.sinAmp +
              influence.boost +
              READABILITY.boost,
            READABILITY.minAlpha,
            240,
          );

          p.textSize(cellSize(row, g));
          p.fill(red[0], red[1], red[2], alpha);
          p.text(phrase, drawX, y);

          x += gw;
          g++;
        }
      }
    };

    p.windowResized = () => resizeToContainer(p);
  };
}
