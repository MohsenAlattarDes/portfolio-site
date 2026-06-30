import type p5js from "p5";
import { themeColors } from "@/lib/letter-splash/theme";
import { GLYPHS } from "@/lib/letter-splash/constants";

type P5 = InstanceType<typeof p5js>;

type TrailGlyph = {
  x: number;
  y: number;
  life: number;
  size: number;
  char: string;
  rot: number;
};

export function createCursorSketch(container: HTMLElement) {
  const state = {
    trail: [] as TrailGlyph[],
    prevMx: 0,
    prevMy: 0,
    glyph: GLYPHS[0] as string,
  };

  return (p: P5) => {
    p.setup = () => {
      const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
      canvas.parent(container);
      canvas.elt.style.background = "transparent";
      canvas.elt.style.pointerEvents = "none";
      p.frameRate(60);
      p.textFont("Tahoma");
      p.textStyle(p.BOLD);
    };

    p.draw = () => {
      if (container.dataset.cursorHidden === "true") {
        state.trail.length = 0;
        p.clear();
        return;
      }

      const overLink = container.dataset.cursorOverLink === "true";
      const { red } = themeColors();
      const accent = overLink ? ([136, 136, 136] as const) : red;

      p.clear();

      const mx = Number(container.dataset.cursorX) || 0;
      const my = Number(container.dataset.cursorY) || 0;
      const speed = Math.hypot(mx - state.prevMx, my - state.prevMy);

      if (
        mx >= 0 &&
        my >= 0 &&
        mx <= p.width &&
        my <= p.height &&
        speed > 1.5 &&
        p.frameCount % 2 === 0
      ) {
        if (p.frameCount % 8 === 0) {
          state.glyph = GLYPHS[p.floor(p.random(GLYPHS.length))];
        }

        state.trail.push({
          x: mx + p.random(-4, 4),
          y: my + p.random(-4, 4),
          life: 1,
          size: p.random(12, 22),
          char: state.glyph,
          rot: p.random(-0.4, 0.4),
        });

        if (state.trail.length > 48) {
          state.trail.splice(0, state.trail.length - 48);
        }
      }

      state.prevMx = mx;
      state.prevMy = my;

      for (let i = state.trail.length - 1; i >= 0; i--) {
        const bit = state.trail[i];
        bit.life -= 0.03;
        if (bit.life <= 0) {
          state.trail.splice(i, 1);
          continue;
        }

        p.push();
        p.translate(bit.x, bit.y);
        p.rotate(bit.rot);
        p.noStroke();
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(bit.size * bit.life);
        p.fill(accent[0], accent[1], accent[2], 220 * bit.life);
        p.text(bit.char, 0, 0);
        p.pop();
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(window.innerWidth, window.innerHeight);
      const canvasEl = (p as unknown as { canvas?: { elt?: HTMLCanvasElement } })
        .canvas?.elt;
      if (canvasEl) canvasEl.style.pointerEvents = "none";
    };
  };
}
