import type p5js from "p5";
import { applyGlyphFont, loadArabicP5Font } from "@/lib/letter-splash/fonts";
import {
  BURST_AMOUNT,
  BURST_EVERY_N_FRAMES,
  FRAME_RATE,
  GLYPHS,
  GRID_SEGMENTS_X,
  GRID_SEGMENTS_Y,
  MAX_BURSTS,
  MAX_RIPPLES,
  MIN_BURST_SPEED,
  CURSOR_HALO_SIZE,
} from "@/lib/letter-splash/constants";
import { themeColors } from "@/lib/letter-splash/theme";
import type { SketchState } from "@/lib/letter-splash/types";

type P5 = InstanceType<typeof p5js>;

function pointerIsInside(p: P5) {
  return (
    p.mouseX >= 0 &&
    p.mouseX <= p.width &&
    p.mouseY >= 0 &&
    p.mouseY <= p.height
  );
}

function buildGrid(p: P5, state: SketchState) {
  const stepX = p.width / GRID_SEGMENTS_X;
  const stepY = p.height / GRID_SEGMENTS_Y;
  state.cols = Math.floor(p.width / stepX) + 1;
  state.rows = Math.floor(p.height / stepY) + 1;
  state.grid = [];

  for (let y = 0; y < state.rows; y++) {
    for (let x = 0; x < state.cols; x++) {
      const hx = x * stepX;
      const hy = y * stepY;
      state.grid.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0 });
    }
  }
}

function resizeToContainer(p: P5, container: HTMLElement, state: SketchState) {
  const w = container.offsetWidth;
  const h = container.offsetHeight;
  if (w === 0 || h === 0) return;

  p.resizeCanvas(w, h);
  buildGrid(p, state);
  state.mx = w * 0.5;
  state.my = h * 0.5;
}

function addRipple(state: SketchState, x: number, y: number) {
  if (state.ripples.length >= MAX_RIPPLES) state.ripples.shift();
  state.ripples.push({ x, y, r: 8, alpha: 110 });
}

function spawnBursts(
  p: P5,
  state: SketchState,
  x: number,
  y: number,
  speed: number,
  force = false,
) {
  if (state.reducedMotion || speed < MIN_BURST_SPEED) return;
  if (!force && p.frameCount % BURST_EVERY_N_FRAMES !== 0) return;

  const count = Math.max(1, p.floor(p.map(speed, 8, 40, 1, 4) * BURST_AMOUNT));
  const moveDx = x - state.prevMx;
  const moveDy = y - state.prevMy;
  const baseAngle =
    speed > 0.5 ? p.atan2(moveDy, moveDx) : p.random(p.TWO_PI);

  for (let i = 0; i < count; i++) {
    if (state.bursts.length >= MAX_BURSTS) state.bursts.shift();
    const angle = baseAngle + p.random(-0.5, 0.5);
    const mag = p.random(1.5, speed * 0.07);
    state.bursts.push({
      x,
      y,
      vx: Math.cos(angle) * mag,
      vy: Math.sin(angle) * mag,
      char: GLYPHS[p.floor(p.random(GLYPHS.length))],
      size: p.random(14, 28 + speed * 0.35),
      life: 1,
    });
  }
}

function fadeBackground(
  p: P5,
  reducedMotion: boolean,
  bg: readonly [number, number, number],
) {
  p.fill(bg[0], bg[1], bg[2], reducedMotion ? 255 : 42);
  p.noStroke();
  p.rect(0, 0, p.width, p.height);
}

function updateMouse(p: P5, state: SketchState) {
  const inside = pointerIsInside(p);
  if (inside && !state.wasPointerInside) {
    state.prevMx = p.mouseX;
    state.prevMy = p.mouseY;
  }
  state.pointerInside = inside;
  state.wasPointerInside = inside;

  const targetX = state.pointerInside ? p.mouseX : p.width * 0.5;
  const targetY = state.pointerInside ? p.mouseY : p.height * 0.5;
  const ease = state.pointerInside ? 0.12 : 0.05;

  state.mx = p.lerp(state.mx, targetX, ease);
  state.my = p.lerp(state.my, targetY, ease);
  state.mxNorm = p.constrain(state.mx / p.width, 0, 1);
  state.myNorm = p.constrain(state.my / p.height, 0, 1);

  state.mouseSpeed = Math.hypot(
    p.mouseX - state.prevMx,
    p.mouseY - state.prevMy,
  );

  if (state.pointerInside && !state.reducedMotion) {
    spawnBursts(p, state, p.mouseX, p.mouseY, state.mouseSpeed);
  }

  state.prevMx = p.mouseX;
  state.prevMy = p.mouseY;
}

function updateGrid(p: P5, state: SketchState) {
  const pullStrength = p.map(state.myNorm, 0, 1, 0.05, 0.12);
  const spring = p.map(state.mxNorm, 0, 1, 0.025, 0.04);
  const swirl = (state.mxNorm - 0.5) * 0.08;

  for (const pt of state.grid) {
    const dx = state.mx - pt.x;
    const dy = state.my - pt.y;
    const dist = Math.hypot(dx, dy) || 1;
    const nx = dx / dist;
    const ny = dy / dist;
    const falloff = p.map(dist, 0, p.width * 0.32, pullStrength, 0, true);

    pt.vx += nx * falloff + -ny * swirl + (pt.hx - pt.x) * spring;
    pt.vy += ny * falloff + nx * swirl + (pt.hy - pt.y) * spring;
    pt.vx *= 0.86;
    pt.vy *= 0.86;
    pt.x += pt.vx;
    pt.y += pt.vy;
  }
}

function drawGrid(
  p: P5,
  state: SketchState,
  red: readonly [number, number, number],
) {
  p.stroke(red[0], red[1], red[2], 55);
  p.strokeWeight(1);

  for (let y = 0; y < state.rows; y++) {
    for (let x = 0; x < state.cols; x++) {
      const i = x + y * state.cols;
      const a = state.grid[i];

      if (x < state.cols - 1) {
        const b = state.grid[i + 1];
        p.line(a.x, a.y, b.x, b.y);
      }
      if (y < state.rows - 1) {
        const b = state.grid[i + state.cols];
        p.line(a.x, a.y, b.x, b.y);
      }
    }
  }
}

function drawRipples(
  p: P5,
  state: SketchState,
  red: readonly [number, number, number],
) {

  for (let i = state.ripples.length - 1; i >= 0; i--) {
    const ripple = state.ripples[i];
    ripple.r += 2.4 + state.mxNorm * 2;
    ripple.alpha *= 0.94;

    p.noFill();
    p.stroke(red[0], red[1], red[2], ripple.alpha);
    p.strokeWeight(1.2);
    p.ellipse(ripple.x, ripple.y, ripple.r * 2, ripple.r * 2);

    if (ripple.alpha < 2) state.ripples.splice(i, 1);
  }
}

function drawBursts(
  p: P5,
  state: SketchState,
  red: readonly [number, number, number],
) {

  for (let i = state.bursts.length - 1; i >= 0; i--) {
    const burst = state.bursts[i];
    burst.x += burst.vx;
    burst.y += burst.vy;
    burst.vx *= 0.96;
    burst.vy *= 0.96;
    burst.life -= 0.018;

    p.push();
    p.translate(burst.x, burst.y);
    p.rotate(Math.atan2(burst.vy, burst.vx));
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(burst.size * burst.life);
    applyGlyphFont(p, burst.char);
    p.fill(red[0], red[1], red[2], 200 * burst.life);
    p.noStroke();
    p.text(burst.char, 0, 0);
    p.pop();

    if (burst.life <= 0) state.bursts.splice(i, 1);
  }
}

function drawCrosshairs(
  p: P5,
  state: SketchState,
  red: readonly [number, number, number],
) {
  if (!state.pointerInside) return;
  p.stroke(red[0], red[1], red[2], 28);
  p.strokeWeight(1);
  p.line(state.mx, 0, state.mx, p.height);
  p.line(0, state.my, p.width, state.my);
}

function drawCursor(
  p: P5,
  state: SketchState,
  red: readonly [number, number, number],
) {
  p.noFill();
  p.stroke(red[0], red[1], red[2], 90);
  p.strokeWeight(1.5);
  p.ellipse(state.mx, state.my, CURSOR_HALO_SIZE, CURSOR_HALO_SIZE);

  p.push();
  p.translate(state.mx, state.my);
  p.rotate((state.mxNorm - 0.5) * p.PI + p.frameCount * 0.012);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(p.map(state.myNorm, 0, 1, 28, 64));
  applyGlyphFont(p, state.cursorChar);
  p.fill(red[0], red[1], red[2], 220);
  p.noStroke();
  p.text(state.cursorChar, 0, 0);
  p.pop();
}

function syncPointer(p: P5, state: SketchState) {
  state.pointerInside = pointerIsInside(p);
  if (state.pointerInside && p.frameCount % 5 === 0) {
    state.cursorChar = GLYPHS[p.floor(p.random(GLYPHS.length))];
  }
}

export function createSketch(container: HTMLElement) {
  const state: SketchState = {
    grid: [],
    cols: 0,
    rows: 0,
    bursts: [],
    ripples: [],
    mx: 0,
    my: 0,
    mxNorm: 0.5,
    myNorm: 0.5,
    mouseSpeed: 0,
    cursorChar: "A",
    reducedMotion: false,
    pointerInside: false,
    wasPointerInside: false,
    prevMx: 0,
    prevMy: 0,
  };

  return (p: P5) => {
    p.setup = () => {
      state.reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      p.frameRate(FRAME_RATE);
      p.createCanvas(container.offsetWidth, container.offsetHeight).parent(
        container,
      );
      resizeToContainer(p, container, state);

      const { bg } = themeColors();
      p.background(bg[0], bg[1], bg[2]);
      loadArabicP5Font(p, () => undefined);
    };

    p.draw = () => {
      const colors = themeColors();

      fadeBackground(p, state.reducedMotion, colors.bg);
      updateMouse(p, state);
      updateGrid(p, state);
      drawGrid(p, state, colors.red);
      drawRipples(p, state, colors.red);
      drawBursts(p, state, colors.red);
      drawCrosshairs(p, state, colors.red);
      drawCursor(p, state, colors.red);
    };

    p.mouseMoved = () => syncPointer(p, state);
    p.mouseDragged = p.mouseMoved;

    p.mousePressed = () => {
      syncPointer(p, state);
      if (!state.pointerInside) return;
      addRipple(state, p.mouseX, p.mouseY);
      spawnBursts(p, state, p.mouseX, p.mouseY, 12, true);
    };

    p.windowResized = () => resizeToContainer(p, container, state);
  };
}
