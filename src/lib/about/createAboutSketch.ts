import type p5js from "p5";
import { themeColors } from "@/lib/letter-splash/theme";

type P5 = InstanceType<typeof p5js>;

type Walker = { x: number; y: number };

type AttractorState = {
  a: number;
  b: number;
  c: number;
  d: number;
  cx: number;
  cy: number;
};

function readPointer(container: HTMLElement) {
  const x = Number(container.dataset.mx);
  const y = Number(container.dataset.my);
  if (!Number.isFinite(x) || x < 0) return null;
  return { x, y };
}

function walkerCount(p: P5) {
  return p.width < 768 ? 4 : 6;
}

function stepCount(p: P5) {
  return p.width < 768 ? 36 : 55;
}

export function createAboutSketch(container: HTMLElement) {
  let walkers: Walker[] = [];
  let attractor: AttractorState | null = null;
  let fadeBg = { r: 0, g: 0, b: 0 };
  let pausedForTheme = false;

  function seed(p: P5) {
    walkers = Array.from({ length: walkerCount(p) }, () => ({
      x: p.random(-2.2, 2.2),
      y: p.random(-2.2, 2.2),
    }));
    attractor = {
      a: 2,
      b: 1.8,
      c: 1,
      d: 1.6,
      cx: p.width * 0.5,
      cy: p.height * 0.48,
    };
  }

  return (p: P5) => {
    p.setup = () => {
      const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
      canvas.parent(container);
      canvas.elt.style.background = "transparent";
      p.frameRate(30);
      p.strokeCap(p.ROUND);
      const { bg } = themeColors();
      fadeBg = { r: bg[0], g: bg[1], b: bg[2] };
      seed(p);
    };

    p.draw = () => {
      const themeSwitching = document.documentElement.classList.contains(
        "theme-fallback-transition",
      );

      if (themeSwitching) {
        pausedForTheme = true;
        return;
      }

      const { bg, red } = themeColors();

      if (pausedForTheme) {
        fadeBg = { r: bg[0], g: bg[1], b: bg[2] };
        pausedForTheme = false;
      } else {
        fadeBg.r = p.lerp(fadeBg.r, bg[0], 0.12);
        fadeBg.g = p.lerp(fadeBg.g, bg[1], 0.12);
        fadeBg.b = p.lerp(fadeBg.b, bg[2], 0.12);
      }

      const ptr = readPointer(container);
      const mx = ptr?.x ?? p.width * 0.5;
      const my = ptr?.y ?? p.height * 0.5;
      const t = p.frameCount * 0.009;
      const pointerIn = ptr !== null;
      const drift = pointerIn ? 0.03 : 0.11;
      const follow = pointerIn ? 0.26 : 0.1;

      if (!attractor) seed(p);
      const state = attractor!;

      p.fill(fadeBg.r, fadeBg.g, fadeBg.b, pointerIn ? 48 : 40);
      p.noStroke();
      p.rect(0, 0, p.width, p.height);

      const nx = p.constrain(mx / p.width, 0, 1);
      const ny = p.constrain(my / p.height, 0, 1);
      const targetA = p.map(nx, 0, 1, 0.5, 3.6) + Math.sin(t) * drift;
      const targetB = p.map(ny, 0, 1, 0.4, 3.2) + Math.cos(t * 1.15) * drift;
      const targetC = p.map(nx, 0, 1, -0.2, 2.2) + Math.sin(t * 0.65) * drift;
      const targetD = p.map(ny, 0, 1, 0.2, 2.8) + Math.cos(t * 0.85) * drift;
      const pull = pointerIn ? 0.42 : 0;
      const targetCx = p.lerp(p.width * 0.5, mx, pull);
      const targetCy = p.lerp(p.height * 0.48, my, pull);

      state.a = p.lerp(state.a, targetA, follow);
      state.b = p.lerp(state.b, targetB, follow);
      state.c = p.lerp(state.c, targetC, follow);
      state.d = p.lerp(state.d, targetD, follow);
      state.cx = p.lerp(state.cx, targetCx, follow * 1.1);
      state.cy = p.lerp(state.cy, targetCy, follow * 1.1);

      const steps = stepCount(p);
      const scale = Math.min(p.width, p.height) * (pointerIn ? 0.22 : 0.2);

      p.noFill();

      for (let i = 0; i < walkers.length; i++) {
        let { x, y } = walkers[i];
        const phase = i * 0.7;

        for (let s = 0; s < steps; s++) {
          const nextX = Math.sin(state.a * y + phase) - Math.cos(state.b * x);
          const nextY = Math.sin(state.c * x + phase) - Math.cos(state.d * y);
          const px = state.cx + x * scale;
          const py = state.cy + y * scale;
          const npx = state.cx + nextX * scale;
          const npy = state.cy + nextY * scale;
          const alpha = p.map(s, 0, steps - 1, 14, pointerIn ? 78 : 58);

          p.stroke(red[0], red[1], red[2], alpha);
          p.strokeWeight(s === steps - 1 ? 1.1 : 0.75);
          p.line(px, py, npx, npy);

          x = nextX;
          y = nextY;
        }

        walkers[i] = { x, y };

        if (pointerIn) {
          p.fill(red[0], red[1], red[2], 90);
          p.noStroke();
          p.circle(state.cx + x * scale, state.cy + y * scale, 2);
        }
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(container.offsetWidth, container.offsetHeight);
      seed(p);
    };
  };
}
